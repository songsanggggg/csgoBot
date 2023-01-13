const { bot } = require("../index.js")
const { redisClient } = require("../index.js")
const { segment } = require("oicq")

const token = ''
const device = ''
const mySteamId = ``
const sign = ""

bot.on("message", async e => {
    if (e.raw_message == '#官匹数据') {
        console.log(await userData(e));
    }
})

//官匹调用api时，有一个sign参数未解决暂时不可用

async function userData(e) {
    if (e.message_type == "group") {
        if (e.group.mute_left != 0) {
            console.log("已被禁言");
            return true;
        }
    }
    let qq = e.sender.user_id
    let msg
    let userId
    redisClient.get(`qq_${qq}`, (err, val) => {
        if (err) {
            console.err(err)
            return true
        }
        if (val == null) {
            e.reply(`尚未绑定，请使用#绑定 + steam64位id绑定`, true)
        }
        else {
            userId = val
            let postData = {
                "mySteamId": `${mySteamId}`,
                "gameTypeStr": "2",
                "steamId": `${userId}`,
                "accessToken": `${token}`,
                "dataSource": 0,
                "pageSize": 20
            }
            fetch(`https://api.wmpvp.com/api/v2/home/validUser?sign=${sign}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accessToken': `${token}`,
                    'device': `${device}`,
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 9; INE-AL00 Build/HUAWEIINE-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/89.0.4389.72 MQQBrowser/6.2 TBS/046141 Mobile Safari/537.36 EsportsApp Version=2.3.28.105',
                    'platform': 'h5_android',
                },
                body: JSON.stringify(postData),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                })
                .catch((error) => {
                    console.error('Error:', error);
                    e.reply(`接口请求错误,请联系${master}`, true)
                })
        }
    })
    return true
}