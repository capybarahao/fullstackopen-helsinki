const { test, describe, after, beforeEach, before } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = require('../app')
const pool = require('../config/db')
const { SECRET } = require('../config/config')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'test initial React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'test initial Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
  },
]

let token
let userId

// --------------------------------------------------
// before runs ONCE before all tests.
// Ensures the test database has the required tables
// and columns so tests don't fail on schema issues.
// --------------------------------------------------
before(async () => {
  // Create users table if it doesn't exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      name VARCHAR(200),
      passwordhash VARCHAR(255) NOT NULL
    )
  `)

  // Add user_id column to blogs if it doesn't exist
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'blogs' AND column_name = 'user_id'
      ) THEN
        ALTER TABLE blogs ADD COLUMN user_id INTEGER REFERENCES users(id);
      END IF;
    END $$;
  `)
})

// --------------------------------------------------
// beforeEach runs BEFORE EVERY test in this file.
// We clean both tables and insert the seed data so
// each test starts with a known, predictable state.
// --------------------------------------------------
beforeEach(async () => {
  await pool.query('DELETE FROM blogs')
  await pool.query('DELETE FROM users')

  // Create a test user
  const passwordHash = await bcrypt.hash('password', 10)
  const userResult = await pool.query(
    'INSERT INTO users (username, name, passwordhash) VALUES ($1, $2, $3) RETURNING *',
    ['testuser', 'Test User', passwordHash]
  )
  userId = userResult.rows[0].id

  // Generate a JWT for the test user
  token = jwt.sign({ id: userId, username: 'testuser' }, SECRET)

  // Insert blogs with the user's id
  for (const blog of initialBlogs) {
    await pool.query(
      'INSERT INTO blogs (title, author, url, likes, user_id) VALUES ($1, $2, $3, $4, $5)',
      [blog.title, blog.author, blog.url, blog.likes, userId]
    )
  }
})

// --------------------------------------------------
// Tests for GET /api/blogs
// --------------------------------------------------
describe('GET /api/blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns the correct number of blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const firstBlog = response.body[0]
    assert.ok(firstBlog.id)
  })
})

// --------------------------------------------------
// Tests for POST /api/blogs
// Requires a valid auth token.
// --------------------------------------------------
describe('POST /api/blogs', () => {
  test('creates a new blog successfully', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'https://blog.codinghorror.com/type-wars/',
      likes: 2,
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.title, newBlog.title)
    assert.strictEqual(response.body.likes, newBlog.likes)
    assert.ok(response.body.id)

    const getResponse = await api.get('/api/blogs')
    assert.strictEqual(getResponse.body.length, initialBlogs.length + 1)
  })

  test('defaults likes to 0 when not provided', async () => {
    const newBlog = {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })

  test('responds with 400 when title is missing', async () => {
    const newBlog = {
      author: 'Robert C. Martin',
      url: 'https://example.com',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('responds with 400 when url is missing', async () => {
    const newBlog = {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('responds with 401 when no token provided', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'https://blog.codinghorror.com/type-wars/',
      likes: 2,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })
})

// --------------------------------------------------
// Tests for PUT /api/blogs/:id
// No auth required — anyone can update likes.
// --------------------------------------------------
describe('PUT /api/blogs/:id', () => {
  test('updates only likes of a blog', async () => {
    const blogs = await api.get('/api/blogs')
    const blog = blogs.body[0]

    const response = await api.put(`/api/blogs/${blog.id}`).send({ likes: 99 }).expect(200)

    assert.strictEqual(response.body.likes, 99)
    assert.strictEqual(response.body.title, blog.title)
    assert.strictEqual(response.body.author, blog.author)
    assert.strictEqual(response.body.url, blog.url)
  })
})

// --------------------------------------------------
// Tests for DELETE /api/blogs/:id
// Requires a valid auth token + ownership.
// --------------------------------------------------
describe('DELETE /api/blogs/:id', () => {
  test('deletes a blog successfully', async () => {
    const blogs = await api.get('/api/blogs')
    const blog = blogs.body[0]

    await api
      .delete(`/api/blogs/${blog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAfter = await api.get('/api/blogs')
    assert.strictEqual(blogsAfter.body.length, initialBlogs.length - 1)

    const ids = blogsAfter.body.map((b) => b.id)
    assert.ok(!ids.includes(blog.id))
  })

  test('returns 404 when blog does not exist', async () => {
    await api
      .delete('/api/blogs/99999')
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })

  test('returns 401 when no token provided', async () => {
    const blogs = await api.get('/api/blogs')
    const blog = blogs.body[0]

    await api
      .delete(`/api/blogs/${blog.id}`)
      .expect(401)
  })
})

// --------------------------------------------------
// after runs ONCE after all tests finish.
// We close the database connection pool so Node exits
// cleanly instead of hanging indefinitely.
// --------------------------------------------------
after(async () => {
  await pool.end()
})
