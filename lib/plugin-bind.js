const { bot } = require("../index.js")
const { redisClient } = require("../index.js")
const redis = require('redis')

bot.on("message", async e => {
    if (e.raw_message.slice(0, 3) == "#换绑") {
        console.log(await changeBind(e));
    }
    if (e.raw_message.slice(0, 3) == "#绑定") {
        console.log(await userBind(e))
    }
})

async function userBind(e) {
    if (e.message_type == "group") {
        if (e.group.mute_left != 0) {
            console.log("已被禁言");
            return true;
        }
    }
    let userId = e.raw_message.replace("#绑定", "");
    userId = userId.replace(/\s*/g, "");
    let qq = e.sender.user_id
    let msg
    redisClient.get(`qq_${qq}`, (err, val) => {
        if (err) {
            console.err(err)
            return true
        }
        if (val == null) {
            redisClient.set(`qq_${qq}`, `${userId}`, redis.print)
            msg = [
                "绑定成功",
                `绑定id为${userId}`,
            ]
            e.reply(msg, true)
        }
        else {
            msg = [
                `当前账号已绑定${val}`,
                "\n换绑请输入#换绑 + steam64位ID",
            ]
            e.reply(msg, true)
        }
    })
    return true
}

async function changeBind(e){
    if (e.message_type == "group") {
        if (e.group.mute_left != 0) {
            console.log("已被禁言");
            return true;
        }
    }
    let userId = e.raw_message.replace("#换绑", "");
    userId = userId.replace(/\s*/g, "");
    let qq = e.sender.user_id
    let msg
    redisClient.set(`qq_${qq}`, `${userId}`, redis.print)
    msg = [
        "绑定成功",
        `绑定id为${userId}`,
    ]
    e.reply(msg, true)
    return true
}

