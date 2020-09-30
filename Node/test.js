const { menuHandler } = require('../Node/menuHandler')


let msg = new Object()
msg.uid = 0
msg.text = function () {
  return '课表'
}
msg.say = async function (res) {
  console.log(res)
}


menuHandler(msg)