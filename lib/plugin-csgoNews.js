const { bot } = require("../index.js")
const schedule = require('node-schedule')
const { segment } = require("icqq")
const { redisClient } = require("../index.js")
const csgoConfig = require("../config/csgo/config.js")

init()

schedule.schedule.scheduleJob('30 * * * * *', () => {
    fetch("https://appengine.wmpvp.com/steamcn/community/homepage/getHomeInformation?gameTypeStr=2&pageNum=1&pageSize=20")
        .then(response => response.json())
        .then(async data => {
            if (data.code != 1) return true
            if (typeof (data.result[3].news.summary) != "string" || data.result[3].news.isVideo != false) {
                return true
            }
            else {
                if ((await redisClient.synGet("lastNews")) == data.result[3].news.summary) {
                    return true
                }
                else {
                    let arrNum = 0
                    let msg = [
                        "csgo资讯推送\n\n",
                        data.result[3].news.title,
                        segment.image(data.result[3].news.thumbnail),
                        data.result[3].news.summary,
                    ];
                    for (arrNum in (csgoConfig.config.postGroup.length - 1)) {
                        bot.pickGroup(csgoConfig.config.postGroup[arrNum]).sendMsg(msg)
                        redisClient.set(`lastNews`, `${data.result[3].news.summary}`)
                    }
                }
            }
        })
});

function init() {
    fetch("https://appengine.wmpvp.com/steamcn/community/homepage/getHomeInformation?gameTypeStr=2&pageNum=1&pageSize=20")
        .then(response => response.json())
        .then(data => {
            if (data.code != 1) return true
            if (typeof (data.result[3].news.summary) != "string" || data.result[3].news.isVideo != false) {
                redisClient.set(`lastNews`, ``)
            }
            else {
                redisClient.set(`lastNews`, `${data.result[3].news.summary}`)
            }
        })
}