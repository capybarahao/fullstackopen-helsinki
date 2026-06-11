const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    // so that it does not print to the console in test mode
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}

module.exports = { info, error }
