const { createClient } = require('webdav')


const { Account } = require('../Node/databases')
const { logErr } = require('../Node/functions')


const prefix = '我的坚果云/Webdav/'
const getClient = async (uid) => {
  let rec = await Account.findOne({ where: { uid } }).catch(logErr)
  let [wdid, wdpwd] = [rec.wdid, rec.wdpwd]
  let client = createClient('https://dav.jianguoyun.com/dav/', { username: wdid, password: wdpwd })
  return client
}
const getUidByWxid = async (wxid) => {
  let rec = await Account.findOne({ where: { wxid: wxid } }).catch(logErr)
  return rec.uid
}


module.exports = {
  prefix,
  getClient,
  getUidByWxid
}
