const app = require('../server')
const request = require('supertest')
const { User } = require('../api/user/user.model')

describe('GET /', function () {
  test('respond with mock data', async () => {
    expect.assertions(1)
    let { body } = await request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(body).toMatchObject({
      author: 'Mir Ayman Ali',
    })
    return
  })
})

// describe('GET /api/v1', function() {
//   test('respond with json', async () => {
//     expect.assertions(1)
//     let { body } = await request(app)
//       .get('/api/v1')
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(200)
//     expect(body).toMatchObject({
//       author: 'Mir Ayman Ali'
//     })
//   })
// })

// describe('api/v1/users', () => {
//   // test('remove users', async () => {
//   //   expect.assertions(1)
//   //   let user = await User.remove().exec()
//   //   expect(user).toBeTruthy()
//   // })
//   describe('GET /api/v1/users', function() {
//     test('respond with json', async () => {
//       expect.assertions(1)
//       let { body } = await request(app)
//         .get('/api/v1/users')
//         .set('Accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(500)

//       // console.log(body)
//       expect(body.msg).toBe('JsonWebTokenError: jwt must be provided')
//     })
//   })

//   // describe('POST /api/v1/users', function() {
//   //   test('respond with json', async () => {
//   //     expect.assertions(1)
//   //     const user = {
//   //       uuid: '1'
//   //     }
//   //     let { body } = await request(app)
//   //       .post('/api/v1/users')
//   //       .send(user)
//   //       .set('Accept', 'application/json')
//   //       .expect('Content-Type', /json/)
//   //       .expect(201)

//   //     // console.log(body)
//   //     expect(body).toMatchObject(user)
//   //   })
//   // })
// })
