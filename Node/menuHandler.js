const { logErr } = require('../Node/functions')
const { Account } = require('../Node/databases')
const { fileClassify } = require('../Node/fileHandler')
const { scheduleQuery } = require('../Node/scheduleHandler')
const { getCoursByUid } = require('../Node/coursHandler')


function is_menu(text) {
  // 返回值情况：分类=1 今日日程=2 七天日程=3 全部日程=4 绑定账户=5 课表=6 日程=0
  let rule = new RegExp('[\\\\/:*?\"<>|]')
  if (text.substr(0, 3) == '分类 ' && text.split(' ')[1].length > 0 && !rule.test(text.split(' ')[1]))
    return 1
  else if (text == '今日日程' || text == '今天日程')
    return 2
  else if (text == '七日日程' || text == '七天日程')
    return 3
  else if (text == '全部日程' || text == '所有日程')
    return 4
  else if (text.substr(0, 2) == '绑定' && text.split(' ')[1].length > 0 && text.split(' ')[2].length > 0)
    return 5
  else if (text == '课表')
    return 6
  else if (text == '网页版')
    return 7
  else
    return 0
}


async function menuHandler(msg) {
  const uid = msg.uid
  const text = msg.text()

  switch (is_menu(text)) {
    case 1:
      await fileClassify(msg)
      break
    case 5:
      let textWithoutHtml = msg.text().replace(/<.*?>/, '').replace(/<.*?>/, '')
      let wdid = textWithoutHtml.split(' ')[1]
      let wdpwd = textWithoutHtml.split(' ')[2]
      let min = 10000, max = 99999
      let rand = Math.floor(Math.random() * (max - min + 1) + min)
      Account.create({ uid: rand, wxid: msg.from().id, wdid, wdpwd }).catch(logErr).then(() => {
        msg.say('您已经绑定成功！')
      })
      break
    case 6:
      let cData = await getCoursByUid(uid)
      let str1 = cData.today.join('\n')
      let str2 = cData.tomorrow.join('\n')
      await msg.say(`今日课程：\n\n${str1}\n\n明日课程：\n\n${str2}`)
      break
    case 7:
      await msg.say(`网页版链接戳这里：http://example.com/schedule/${uid}`)
      break
    default:
      //  sData = { todays, nexts, alls }
      let sData = await scheduleQuery(uid)
      let res = ''
      let comb = ([time, detail]) => {
        res += `${time} | ${detail.substr(0, 15)}\n\n`
      }
      if (is_menu(text) == 2) {
        sData.todays.forEach(comb)
        await msg.say(`您的今日日程如下：\n${res}`)
      }
      if (is_menu(text) == 3) {
        sData.nexts.forEach(comb)
        await msg.say(`您的七天日程如下：\n${res}`)
      }
      if (is_menu(text) == 4) {
        sData.alls.forEach(comb)
        await msg.say(`您的全部日程如下：\n${res}`)
      }
      break
  }
}


module.exports = {
  is_menu,
  menuHandler
}
