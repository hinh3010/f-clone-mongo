const {createSettingConnection} = require('@pf126/setting-container-v2')

const setting = createSettingConnection({
    uri: process.env.PRIVATE_SELLER_SETTING_URI || 'http://localhost:8181',
})

module.exports = setting

