const { logErr } = require('../Node/functions')
const { Courses } = require('../Node/databases')


async function getCoursByUid(uid) {
  let cData = { today: [], tomorrow: [] }
  let lessons = await Courses.findAll({ where: { uid } }).catch(logErr)
  let cmp = (rec1, rec2) => {
    return rec1.time[0] - rec2.time[0]
  }
  lessons.sort(cmp)
  let currentWeek = parseInt((new Date() - new Date('2019/9/2')) / (1000 * 60 * 60 * 24) / 7 + 1)
  let currentWeekday = new Date().getDay()
  let tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  let tomorrowWeek = parseInt((tomorrow - new Date('2019/9/2')) / (1000 * 60 * 60 * 24) / 7 + 1)
  let tomorrowWeekday = tomorrow.getDay()
  if (currentWeekday == 0) currentWeekday = 7
  if (tomorrowWeekday == 0) tomorrowWeekday = 7
  for (let i = 0; i < lessons.length; ++i) {
    let lsn = lessons[i]
    if (lsn.week.includes(currentWeek) && currentWeekday == lsn.weekday) {
      let str = lsn.time.join(',')
      cData.today.push(`[第${str}节] ${lsn.name}@${lsn.classroom}`)
    }
    if (lsn.week.includes(tomorrowWeek) && tomorrowWeekday == lsn.weekday) {
      let str = lsn.time.join(',')
      cData.tomorrow.push(`[第${str}节] ${lsn.name}@${lsn.classroom}`)
    }
  }
  return cData
}


async function uploadCoursByUid(uid, jsonStr) {
  // data=[{},{},...]
  let data = JSON.parse(jsonStr)
  await Courses.destroy({ where: { uid } }).catch(logErr)
  for (let i = 0; i < data.length; ++i) {
    let one = data[i]
    one.uid = uid
    await Courses.create(one).catch(logErr)
  }
  return data.length
}


module.exports = {
  getCoursByUid,
  uploadCoursByUid
}