const { bot } = require("../index.js")
const schedule = require('node-schedule')
const { segment } = require("icqq")
const { redisClient } = require("../index.js")
const bilibiliConfig = require("../config/bilibili/config.js")

init()

schedule.schedule.scheduleJob('30 * * * * *', () => {
    let upArr = bilibiliConfig.config.up
    let arrNum = 0
    for (arrNum in (upArr.length - 1)) {
        let url = `https://api.bilibili.com/x/space/acc/info?mid=${upArr[arrNum].uid}`
        fetch(url, {
            method: 'GET',
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36"
            }
        })
            .then(response => response.json())
            .then(async data => {
                if (data.code != 0) {
                    console.log(data.message)
                    return true
                }
                else {
                    let msg = [
                        segment.image(data.data.live_room.cover),
                        `${data.data.name}的直播`,
                        `\n直播间标题:${data.data.live_room.title}`,
                        `\n直播间地址: ${data.data.live_room.url}`
                    ]
                    let status = await redisClient.synGet(`liveStatus_upUid_${upArr[arrNum].uid}`)
                    if (data.data.live_room.liveStatus == "0") {
                        redisClient.set(`liveStatus_upUid_${upArr[arrNum].uid}`, `0`)
                        return true
                    }
                    else {
                        if (data.data.live_room.liveStatus == 1 && status == "0") {
                            bot.pickGroup(upArr[arrNum].group).sendMsg(msg)
                            redisClient.set(`liveStatus_upUid_${upArr[arrNum].uid}`, `1`)
                        }
                    }
                }
            })
            .catch((error) => {
                console.log('Error:', error);
            })
        arrNum++
    }
});

function init() {
    let upArr = bilibiliConfig.config.up
    let arrNum = 0
    for (arrNum in (upArr.length - 1)) {
        redisClient.set(`liveStatus_upUid_${upArr[arrNum].uid}`, 0)
    }
}