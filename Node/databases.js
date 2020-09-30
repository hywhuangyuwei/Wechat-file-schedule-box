const Sequelize = require('sequelize')
const moment = require('moment')


const mysqlURL = require('../Node/databasesConfig').mysqlURL


const sequelize = new Sequelize(mysqlURL, { logging: false, timezone: '+08:00' })
class Account extends Sequelize.Model { }
class Courses extends Sequelize.Model { }
class Schedule extends Sequelize.Model { }
class Unclassified extends Sequelize.Model { }
Account.init({
  id: { type: Sequelize.INTEGER, primaryKey: true },
  uid: Sequelize.INTEGER,
  wxid: Sequelize.CHAR,
  wdid: Sequelize.CHAR,
  wdpwd: Sequelize.CHAR
}, { sequelize, freezeTableName: true, timestamps: false })
Courses.init({
  id: { type: Sequelize.INTEGER, primaryKey: true },
  uid: Sequelize.INTEGER,
  name: Sequelize.CHAR,
  week: Sequelize.JSON,
  weekday: Sequelize.INTEGER,
  time: Sequelize.JSON,
  classroom: Sequelize.CHAR
}, { sequelize, freezeTableName: true, timestamps: false })
Schedule.init({
  id: { type: Sequelize.INTEGER, primaryKey: true },
  uid: Sequelize.INTEGER,
  detail: Sequelize.TEXT,
  is_duration: Sequelize.INTEGER,
  time: { type: Sequelize.DATE, get() { return moment(this.getDataValue('time')) } },
  time2: { type: Sequelize.DATE, get() { return moment(this.getDataValue('time2')) } },
  is_allday: Sequelize.INTEGER,
  is_allday2: Sequelize.INTEGER,
  is_repeat: Sequelize.INTEGER,
  enable: Sequelize.INTEGER
}, { sequelize, freezeTableName: true, timestamps: false })
Unclassified.init({
  id: { type: Sequelize.INTEGER, primaryKey: true },
  uid: Sequelize.INTEGER,
  filename: Sequelize.TEXT,
  enable: Sequelize.INTEGER
}, { sequelize, freezeTableName: true, timestamps: false })


sequelize.sync().then(() => { console.log("Inited tables."); }).catch(() => { console.log("Init failed."); })


module.exports = {
  Account,
  Courses,
  Schedule,
  Unclassified,
  rawQuery: sequelize
}
