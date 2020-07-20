const app = require('../../server')
const request = require('supertest')
const { UserForgetPass } = require('../../api/user/user.model')

let user = {
  email: 'ayman@test.com',
  password: 'testtest',
}

describe('POST /auth/login', function () {
  describe('login with wrong credientials', function () {
    test('(Error) login with wrong email', async () => {
      const wrongUser = {
        email: 'google@test.com',
        password: '2',
      }
      expect.assertions(2)
      let { body } = await request(app)
        .post('/v1/auth/login')
        .set('Accept', 'application/json')
        .send(wrongUser)
        .expect('Content-Type', /json/)
        .expect(500)
      expect(body.status).toBeFalsy()
      expect(body.msg).toEqual('No user with the given email address')
      return
    })
    test('(Error) login with wrong password', async () => {
      expect.assertions(2)
      const wrongUser = {
        email: 'ayman@test.com',
        password: '2',
      }
      let { body } = await request(app)
        .post('/v1/auth/login')
        .set('Accept', 'application/json')
        .send(wrongUser)
        .expect('Content-Type', /json/)
        .expect(500)
      expect(body.status).toBeFalsy()
      expect(body.msg).toEqual('Wrong password')
      return
    })
  })
  describe('login with right credientials', () => {
    test('successful login', async () => {
      expect.assertions(8)
      let { body } = await request(app)
        .post('/v1/auth/login')
        .set('Accept', 'application/json')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(body).toMatchObject({
        email: user.email,
      })
      expect(body).toHaveProperty('partners')
      expect(body.partners).toEqual(expect.any(Array))
      expect(body.partners.length).toBeGreaterThanOrEqual(1)
      expect(body).toHaveProperty('policies')
      expect(body.policies).toEqual(expect.any(Array))
      expect(body).toHaveProperty('token')
      expect(body).not.toHaveProperty('password')

      user = body
      return
    })
  })
})
describe(`POST /auth/selectPartner`, () => {
  test('(Error) Select partner that the user is not associated with', async () => {
    expect.assertions(2)
    const partner = {
      partnerID: 9999,
    }
    let { body } = await request(app)
      .post('/v1/auth/selectPartner')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${user.token}`)
      .send(partner)
      .expect('Content-Type', /json/)
      .expect(500)
    expect(body.status).toBeFalsy()
    expect(body.msg).toEqual('Wrong Partner Selected')
    return
  })
  test('Select partner that the user is associated with', async () => {
    expect.assertions(4)
    const partner = {
      partnerID: user.partners[0]._id,
    }
    let { body } = await request(app)
      .post('/v1/auth/selectPartner')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${user.token}`)
      .send(partner)
      .expect('Content-Type', /json/)
      .expect(200)
    expect(body).toMatchObject({
      email: user.email,
      name: user.name,
    })
    expect(body.partners.length).toBe(1)
    expect(body.policies.length).toBeGreaterThanOrEqual(0)
    expect(body.policies.length).toBeLessThanOrEqual(1)

    user = body
    return
  })
})
describe(`POST /auth/forgetPass`, () => {
  const forgetPass = {
    urlKey: '',
    code: '',
    password: 'testtest2',
  }
  describe(`Request Forget Password`, () => {
    test('(Error) With wrong email', async () => {
      const wrongUser = {
        email: 'google@test.com',
      }
      expect.assertions(2)
      let { body } = await request(app)
        .post('/v1/auth/forgetPass')
        .set('Accept', 'application/json')
        .send(wrongUser)
        .expect('Content-Type', /json/)
        .expect(500)
      expect(body.status).toBeFalsy()
      expect(body.msg).toEqual('No user with the given email address')
      return
    })
    test('With correct email', async () => {
      expect.assertions(2)
      let { body } = await request(app)
        .post('/v1/auth/forgetPass')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          email: user.email,
        })
        .expect('Content-Type', /json/)
        .expect(200)
      const { code } = await UserForgetPass.findOne({
        where: { userID: user._id },
      })
      expect(body.status).toBeTruthy()
      expect(body).toHaveProperty('urlKey')

      forgetPass.urlKey = body.urlKey
      forgetPass.code = code
      return
    })
  })
  describe(`Update Password`, () => {
    test('(Error) With wrong urlKey', async () => {
      const wrongUrlKey =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImF5bWFuQHRlc3QuY29tIiwiaWF0IjoxNTg5OTgyNDc5LCJleHAiOjE1ODAwMDAwMDB9.IO0Ayzm70sKAXbOG83rlePye-jilCqT5l5Hyoapxnx4'
      expect.assertions(2)
      let { body } = await request(app)
        .post(`/v1/auth/forgetPass/${wrongUrlKey}`)
        .set('Accept', 'application/json')
        .send(forgetPass)
        .expect('Content-Type', /json/)
        .expect(500)
      expect(body.status).toBeFalsy()
      expect(body.msg).toEqual(
        'Code Expired, try requesting forget password again'
      )
      return
    })
    test('(Error) With wrong code', async () => {
      const wrongCode = '1234'
      expect.assertions(2)
      let { body } = await request(app)
        .post(`/v1/auth/forgetPass/${forgetPass.urlKey}`)
        .set('Accept', 'application/json')
        .send({ ...forgetPass, code: wrongCode })
        .expect('Content-Type', /json/)
        .expect(500)
      expect(body.status).toBeFalsy()
      expect(body.msg).toEqual('Wrong Code')
      return
    })
    test('Successfully Update New Passowrd', async () => {
      expect.assertions(1)
      let { body } = await request(app)
        .post(`/v1/auth/forgetPass/${forgetPass.urlKey}`)
        .set('Accept', 'application/json')
        .send(forgetPass)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(body.status).toBeTruthy()
      return
    })
    test('(Error) Try to update password again', async () => {
      expect.assertions(2)
      let { body } = await request(app)
        .post(`/v1/auth/forgetPass/${forgetPass.urlKey}`)
        .set('Accept', 'application/json')
        .send(forgetPass)
        .expect('Content-Type', /json/)
        .expect(500)
      expect(body.status).toBeFalsy()
      expect(body.msg).toEqual(
        'Code Expired, try requesting forget password again'
      )
      return
    })
  })
  describe('Updated password Check', () => {
    test('(Error) login with previous password', async () => {
      expect.assertions(2)
      const wrongUser = {
        email: user.email,
        password: 'testtest',
      }
      let { body } = await request(app)
        .post('/v1/auth/login')
        .set('Accept', 'application/json')
        .send(wrongUser)
        .expect('Content-Type', /json/)
        .expect(500)
      expect(body.status).toBeFalsy()
      expect(body.msg).toEqual('Wrong password')
      return
    })
    test('login with new password', async () => {
      expect.assertions(8)
      let { body } = await request(app)
        .post('/v1/auth/login')
        .set('Accept', 'application/json')
        .send({
          email: user.email,
          password: forgetPass.password,
        })
        .expect('Content-Type', /json/)
        .expect(200)
      expect(body).toMatchObject({
        email: user.email,
      })
      expect(body).toHaveProperty('partners')
      expect(body.partners).toEqual(expect.any(Array))
      expect(body.partners.length).toBeGreaterThanOrEqual(1)
      expect(body).toHaveProperty('policies')
      expect(body.policies).toEqual(expect.any(Array))
      expect(body).toHaveProperty('token')
      expect(body).not.toHaveProperty('password')

      user = body
      return
    })
  })
})
