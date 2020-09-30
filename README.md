# Wechat-file-schedule-box (Wechaty based)

[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-green.svg)](https://github.com/chatie/wechaty)
[![Wechaty开源激励计划](https://img.shields.io/badge/Wechaty-开源激励计划-green.svg)](https://github.com/juzibot/Welcome/wiki/Everything-about-Wechaty)

# Features

1. It functioned as a wechat robot account (Powered by Wechaty)

2. When you send a file/image/video to this account, it will save that file/image/video to a webdav location

3. When you send a schedule text to this account, it will parse it and save to the MySQL database (Powered by Time-NLP)

4. Contains a simple web page that displays all your schedules and classtable

# How-to-use

1. Clone this repo and install dependancies using `npm i`

2. Configurate your db connection at `Node/databasesConfig.js`

3. Configurate your wechaty-pad-plus token at `Node/main.js`

4. `sh RunRobot.sh`
