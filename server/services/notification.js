const { http } = require('../util/axios')

const EXPO_PUSH_NOTIFICATION = 'https://exp.host/--/api/v2/push/send'

const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Accept-encoding': 'gzip, deflate',
  'Content-Type': 'application/json',
}
const sendNotification = async function (payload) {
  const { data } = await http.post(EXPO_PUSH_NOTIFICATION, payload, {
    headers: {
      ...DEFAULT_HEADERS,
    },
  })
  return data
}
// sendNotification({
//   to: 'ExponentPushToken[A0RVwWKNzcuYbSUTUs_5sQ]',
//   // sound: 'default',
//   title: 'Original Title',
//   body: 'And here is the body!',
//   data: { data: 'Send from VS Code' },
//   ttl: 5,
// })
module.exports = {
  sendNotification,
}
