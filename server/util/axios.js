const axios = require('axios')

const http = axios.create({})

http.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    error = error.response.data
    return Promise.reject(error)
  }
)

module.exports = {
  http,
}
