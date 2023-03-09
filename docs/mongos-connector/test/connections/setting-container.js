const settingConn = require('./setting')
const {SettingContainer} = require('../../dist')

const settingContainer = new SettingContainer(settingConn)

module.exports = settingContainer

