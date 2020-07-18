const { http } = require('../util/axios')
const config = require('../config/config')

const MANAGE_MISSION_API = 'https://app.managedmissions.com/API'
const TRIP = MANAGE_MISSION_API + '/MissionTripAPI/Get'
const ACTIVE_TRIP_LIST = MANAGE_MISSION_API + '/MissionTripAPI/ActiveTrips'
const USER_LIST = MANAGE_MISSION_API + '/PersonAPI/List'
const USER = MANAGE_MISSION_API + '/PersonAPI/Get'
const TRIP_USER_LIST = MANAGE_MISSION_API + '/MemberAPI/GetMembersOfTrip'

const DEFAULT_HEADERS = {
  Authorization: `Bearer ${config.secrets.manageMission}`,
}
const getActiveTrips = async function () {
  const { data } = await http.post(
    ACTIVE_TRIP_LIST,
    {},
    {
      headers: {
        ...DEFAULT_HEADERS,
      },
    }
  )
  if (data.status == 0) return data.data
  return []
}
const getTrip = async function (GetById) {
  const { data } = await http.post(
    TRIP,
    {
      GetById,
    },
    {
      headers: {
        ...DEFAULT_HEADERS,
      },
    }
  )
  if (data.status == 0) return data.data
  return []
}
const getUsers = async function (PageNumber = 1, PageSize = 10) {
  const { data } = await http.post(
    USER_LIST,
    {
      PageNumber,
      PageSize,
    },
    {
      headers: {
        ...DEFAULT_HEADERS,
      },
    }
  )
  if (data.status == 0) return data.data
  return []
}
const getUser = async function (GetById) {
  const { data } = await http.post(
    USER,
    {
      GetById,
    },
    {
      headers: {
        ...DEFAULT_HEADERS,
      },
    }
  )
  if (data.status == 0) return data.data
  return {}
}

const getTripUsers = async function (
  MissionTripId = 0,
  PageNumber = 1,
  PageSize = 10
) {
  const { data } = await http.get(
    TRIP_USER_LIST,

    {
      headers: {
        ...DEFAULT_HEADERS,
      },
      params: {
        MissionTripId,
        PageNumber,
        PageSize,
      },
    }
  )
  if (data.status == 0) return data.data
  return []
}

// TEST

// getTripUsers(47346)

module.exports = {
  getActiveTrips,
  getUsers,
  getUser,
  getTripUsers,
  getTrip,
}
