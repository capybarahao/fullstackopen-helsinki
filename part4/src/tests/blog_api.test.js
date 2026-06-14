const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const pool = require('../config/db')

// to test only part of integration test:
// npm run test -- --test-name-pattern="blogs"
// npm test -- tests/blogs_api.test.js

// supertest wraps our Express app so we can make HTTP requests without
// actually starting a server (no app.listen needed)
const api = supertest(app)

// Seed data: these blogs are inserted into the test DB before each test
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

// --------------------------------------------------
// beforeEach runs BEFORE EVERY test in this file.
// We clean the table and insert the seed data so each
// test starts with a known, predictable state.
// --------------------------------------------------
beforeEach(async () => {
  await pool.query('DELETE FROM blogs')

  for (const blog of initialBlogs) {
    await pool.query('INSERT INTO blogs (title, author, url, likes) VALUES ($1, $2, $3, $4)', [
      blog.title,
      blog.author,
      blog.url,
      blog.likes,
    ])
  }
})

// --------------------------------------------------
// Tests for GET /api/blogs
// --------------------------------------------------
describe('GET /api/blogs', () => {
  test('blogs are returned as json', async () => {
    // The .expect() calls are supertest assertions that
    // check the response status code and Content-Type header
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns the correct number of blogs', async () => {
    const response = await api.get('/api/blogs')

    // response.body is the parsed JSON array from the server
    assert.strictEqual(response.body.length, initialBlogs.length)
  })
})

// --------------------------------------------------
// Tests for POST /api/blogs
// --------------------------------------------------
describe('POST /api/blogs', () => {
  test('creates a new blog successfully', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'https://blog.codinghorror.com/type-wars/',
      likes: 2,
    }

    // .send() attaches a JSON body to the POST request
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201) // 201 = Created
      .expect('Content-Type', /application\/json/)

    // The response should contain the created blog with an id
    assert.strictEqual(response.body.title, newBlog.title)
    assert.strictEqual(response.body.likes, newBlog.likes)
    // id should be auto-assigned by Postgres
    assert.ok(response.body.id)

    // Verify the total count went up by 1
    const getResponse = await api.get('/api/blogs')
    assert.strictEqual(getResponse.body.length, initialBlogs.length + 1)
  })

  test('defaults likes to 0 when not provided', async () => {
    const newBlog = {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    }

    const response = await api.post('/api/blogs').send(newBlog).expect(201)

    assert.strictEqual(response.body.likes, 0)
  })

  // NOTE: For these validation tests to pass, your controller needs to
  // check that title and url exist before calling Blog.create().
  // If they're missing, respond with 400 and an error message.
  test('responds with 400 when title is missing', async () => {
    const newBlog = {
      author: 'Robert C. Martin',
      url: 'https://example.com',
      likes: 5,
    }

    await api.post('/api/blogs').send(newBlog).expect(400)
  })

  test('responds with 400 when url is missing', async () => {
    const newBlog = {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      likes: 5,
    }

    await api.post('/api/blogs').send(newBlog).expect(400)
  })
})

// --------------------------------------------------
// Tests for DELETE /api/blogs
// --------------------------------------------------

// --------------------------------------------------
// verifies that the unique identifier property of the blog posts is named id
// --------------------------------------------------
describe('GET /api/blogs', () => {
  test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const firstBlog = response.body[0]
    console.log(firstBlog.id)
    assert.ok(firstBlog.id)
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
