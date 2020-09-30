const fs = require('fs')


const { getClient, prefix } = require('../Node/webdav')
const { logErr } = require('../Node/functions')
const { Unclassified } = require('../Node/databases')


async function fileHandler(msg) {
  const file = await msg.toFileBox().catch(logErr)
  const uid = msg.uid
  const name = file.name
  const client = await getClient(uid)

  await file.toFile(name, true).then(() => { console.log(new Date().toLocaleString() + ' SAVED LOCALLY: ' + name) }).catch(logErr)
  fs.createReadStream('./' + name)
    .pipe(client.createWriteStream(prefix + '未分类/' + name, { maxContentLength: 52428800 })).on('finish', async () => {
      console.log(new Date().toLocaleString() + ' SAVED ON WEBDAV: ' + name)
      await Unclassified.create({ uid, filename: name, enable: 1 }).then(async () => { await msg.say(`已同步 ${name} (尚未分类)`) }).catch(logErr)
    })
}


async function fileClassify(msg) {
  const uid = msg.uid
  const text = msg.text()
  const client = await getClient(uid)
  let className = text.split(' ')[1]

  Unclassified.findAll({ where: { uid, enable: 1 } }).catch(logErr).then(async function (result) {
    let cnt = 0
    for await (const record of result) {
      let fileName = record.filename
      await client.createDirectory(prefix + `${className}/`).catch(logErr)
      await client.moveFile(prefix + '未分类/' + fileName, prefix + `${className}/` + fileName).catch(logErr)
      await Unclassified.update({ enable: 0 }, { where: { id: record.id } }).catch(logErr)
      cnt++
    }
    await msg.say(`已将 ${cnt} 个文件分类至： ${className}`)
  })
}


module.exports = {
  fileHandler,
  fileClassify
}
