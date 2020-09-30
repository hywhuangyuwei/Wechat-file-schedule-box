//const java = require('java')
const moment = require('moment')


const { Schedule, rawQuery } = require('../Node/databases')
const { logErr } = require('../Node/functions')


//java.classpath.push('../Time-NLP/target/classes')


async function scheduleHandlerByUid(schedule, uid) {
  let result = ''
  return
  try {
    //result = java.callStaticMethodSync('com.time.nlp.TimeAnalyseTest', 'exec', schedule)
  } catch (error) {
    logErr(error)
  }

  let [is_duration, time, is_allday, time2, is_allday2] = result.split(',')
  let timex = ''
  let time2x = ''
  if (is_allday == '1')
    timex = `${moment(time).format('MM-DD')} 全天`
  else
    timex = `${moment(time).format('MM-DD HH:mm')}`
  if (is_allday2 == '1')
    time2x = `${moment(time2).format('MM-DD')} 全天`
  else
    time2x = `${moment(time2).format('MM-DD HH:mm')}`

  let timeStr = ''
  if (is_duration == '1')
    timeStr = `${timex} 至 ${time2x}`
  else
    timeStr = `${timex}`

  await Schedule.create({ uid, detail: schedule, is_duration, time: new Date(time), is_allday, time2: new Date(time2), is_allday2, is_repeat: 0, enable: 1 }).catch(logErr)

  return timeStr
}


async function scheduleHandler(msg) {
  const uid = msg.uid
  const schedule = msg.text()
  let res = await scheduleHandlerByUid(schedule, uid)
  await msg.say(`已添加日程：${res}`)
}


async function scheduleQuery(uid) {
  //  data = { todays, nexts, alls }
  let data = {}

  await rawQuery.query(`select * from Schedule where uid = ${uid} and enable = 1 and (time >= CURDATE()) order by time`, { model: Schedule }).then((result) => {
    let [todays, nexts, alls] = [[], [], []]
    for (let i = 0; i < result.length; ++i) {
      let rec = result[i]
      let id = rec.id

      let time = ''
      let time2 = ''
      if (rec.is_allday)
        time = `${rec.time.format('MM-DD')} 全天`
      else
        time = `${rec.time.format('MM-DD HH:mm')}`
      if (rec.is_allday2)
        time2 = `${rec.time2.format('MM-DD')} 全天`
      else
        time2 = `${rec.time2.format('MM-DD HH:mm')}`

      let timeStr = ''
      if (rec.is_duration)
        timeStr = `${time} 至 ${time2}`
      else
        timeStr = `${time}`
      let detailStr = rec.detail

      alls.push([timeStr, detailStr, id])
      if (rec.time.isSame(moment(), 'day'))
        todays.push([timeStr, detailStr, id])
      if (rec.time.isBetween(moment(), moment().add(7, 'd')))
        nexts.push([timeStr, detailStr, id])
    }
    data = { todays, nexts, alls }
  })
  return data
}


async function scheduleSetToDone(id) {
  let res = await Schedule.update({ enable: 0 }, { where: { id } }).catch(logErr)
  return res
}


module.exports = {
  scheduleHandler,
  scheduleHandlerByUid,
  scheduleQuery,
  scheduleSetToDone
}
