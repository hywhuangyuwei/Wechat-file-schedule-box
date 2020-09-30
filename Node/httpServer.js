const Koa = require('koa')
const router = require('koa-router')()
const multiparty = require('koa2-multiparty')
const cors = require('koa2-cors')
const http = require('http')
const template = require('art-template')
const path = require('path')
const staticFiles = require('koa-static')
const bodyparser = require('koa-bodyparser')


const { logErr } = require('../Node/functions')
const { getCoursByUid, uploadCoursByUid } = require('../Node/coursHandler')
const { scheduleHandlerByUid, scheduleQuery, scheduleSetToDone } = require('../Node/scheduleHandler')


router.get('/schedule/:uid', multiparty(), async (ctx) => {
  let uid = ctx.params.uid
  if (uid == undefined)
    uid = 0
  let result = await scheduleQuery(uid).catch(logErr)
  result.todayCours = (await getCoursByUid(uid)).today
  result.tomoCours = (await getCoursByUid(uid)).tomorrow
  let html = template('/root/ROBOT/template/template.html', result)
  ctx.response.body = html
})


router.post('/schedule/add', multiparty(), async (ctx) => {
  let postParam = ctx.request.body
  let [uid, schedule] = [postParam.uid, postParam.data]
  try {
    let timeStr = await scheduleHandlerByUid(schedule, uid)
    let resp = { info: `已添加日程： ${timeStr}` }
    ctx.response.body = resp
  } catch (error) {
    logErr(error)
    ctx.response.body = `fail`
  }
})


router.post('/schedule/done', multiparty(), async (ctx) => {
  let postParam = ctx.request.body
  let id = postParam.data
  try {
    await scheduleSetToDone(id)
    ctx.response.body = `success: ${id}`
  } catch (error) {
    logErr(error)
    ctx.response.body = `fail: ${id}`
  }
})


router.post('/cours/upload', multiparty(), async (ctx) => {
  let postParam = ctx.request.body
  let [uid, json] = [postParam.uid, postParam.data]
  try {
    let res = await uploadCoursByUid(uid, json)
    ctx.response.body = res
  } catch (error) {
    logErr(error)
    ctx.response.body = `fail`
  }
})


const app = new Koa()
app.use(cors({
  origin: function (ctx) {
    return '*'
  },
  allowMethods: ['POST', 'GET'],
}))
app.use(staticFiles(path.join(__dirname + '../public/')))
app.use(bodyparser())
app.use(router.routes())
http.createServer(app.callback()).listen(80)
console.log('koa started at port 80...')
