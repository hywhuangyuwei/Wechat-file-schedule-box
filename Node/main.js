const { PuppetPadplus } = require('wechaty-puppet-padplus')
const { Wechaty, Message } = require('wechaty')
const node_schedule = require('node-schedule')
const xml2js = require('xml2js')


const { logErr } = require('../Node/functions')
const { fileHandler } = require('../Node/fileHandler')
const { scheduleHandler } = require('../Node/scheduleHandler')
const { is_menu, menuHandler } = require('../Node/menuHandler')
const { Account } = require('../Node/databases')
const { getUidByWxid } = require('../Node/webdav')


const token = "Your-Token"
const puppet = new PuppetPadplus({
  token,
})


// init
const xmlParser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true })
const mainLoopRule = new node_schedule.RecurrenceRule()
var everyMinute = [0, 10, 20, 30, 40, 50]
mainLoopRule.minute = everyMinute


// bot init
const welcome = `
=============== buaaWxHelper ===============

`
console.log(welcome)
const bot = Wechaty.instance({ name: 'buaaWxHelper', puppet })
bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)
bot.on('error', onError)
bot.start().catch(err => { console.error(err) })


// events
async function mainLoop() {
  console.log(new Date().toLocaleString() + ' hey there')
}


async function onScan(qrcode, status) {
  console.log(['https://api.qrserver.com/v1/create-qr-code/?data=', encodeURIComponent(qrcode), '&size=220x220&margin=20',].join(''))
}


async function onLogin(user) {
  console.log(`${user} login`)
  node_schedule.scheduleJob(mainLoopRule, mainLoop)
}


async function onLogout(user) {
  console.log(`${user} logout`)
  process.exit()
}


async function onError(e) {
  console.error(e)
}


async function onMessage(msg) {
  if (msg.self()) return

  console.log(`${new Date().toLocaleString()} FROM: ${msg.from().id} TYPE: ${msg.type()}`)
  const cnt = await Account.count({ where: { wxid: msg.from().id } }).catch(logErr)
  if (cnt == 0) {
    if (is_menu(msg.text()) != 5)
      await msg.say('抱歉，您还没有绑定 WebDav 网盘账户！请输入“绑定 网盘账号 网盘密码”进行绑定。例如：绑定 example@example.com myPassword')
    else
      await menuHandler(msg)
    return
  } else
    msg.uid = await getUidByWxid(msg.from().id)

  if (Message.Type.Attachment == msg.type()) {
    // processing a share url or file
    var xml = msg.text().replace(/<br\/>/g, '').replace(/&apos;/g, `'`).replace(/&quot;/g, `"`).replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&')
    xmlParser.parseString(xml, async function (err, result) {
      if (err) logErr(err)
      if (result.msg.appmsg.type == '6') {
        // a file
        console.log(new Date().toLocaleString() + ' RECEIVING A FILE')
        await fileHandler(msg)
      }
      else
        msg.say('程序猿小哥正快马加鞭地开发支持此类型的消息呢')
    })
  }

  else if ([Message.Type.Audio, Message.Type.Image, Message.Type.Video].includes(msg.type())) {
    // processing media
    console.log(new Date().toLocaleString() + ' RECEIVING MEDIA')
    const file = await msg.toFileBox().catch(logErr)
    await fileHandler(msg)
  }

  else if ([Message.Type.Text, Message.Type.Url].includes(msg.type())) {
    // processing text
    console.log(new Date().toLocaleString() + ` TEXT: ${msg.text()}`)

    if (msg.text() == 'q') {
      // status query
      await msg.say('在呢')
    }
    else if (is_menu(msg.text())) {
      // menu
      await menuHandler(msg)
    }
    else {
      // schedule
      await scheduleHandler(msg)
    }
  }

  else
    msg.say('程序猿小哥正快马加鞭地开发支持此类型的消息呢')
}
