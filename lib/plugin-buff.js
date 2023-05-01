const { bot } = require("../index.js")
const { redisClient } = require("../index.js")
const redis = require('redis')

bot.on("message", async e => {
    if (e.raw_message.slice(0, 3) == "#换绑buff") {
        console.log(await changeBind(e));
    }
    if (e.raw_message.slice(0, 3) == "#绑定buff") {
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
    let userCookie = e.raw_message.replace("#绑定buff", "");
    userCookie = userCookie.replace(/\s*/g, "");
    let qq = e.sender.user_id
    let msg
    redisClient.get(`qq_${qq}`, (err, val) => {
        if (err) {
            console.err(err)
            return true
        }
        if (val == null) {
            redisClient.set(`qq_buff_${qq}`, `${userCookie}`, redis.print)
            msg = [
                "绑定成功",
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
    let userCookie = e.raw_message.replace("#换绑buff", "");
    userCookie = userCookie.replace(/\s*/g, "");
    let qq = e.sender.user_id
    let msg
    redisClient.set(`qq_buff_${qq}`, `${userCookie}`, redis.print)
    msg = [
        "绑定成功",
    ]
    e.reply(msg, true)
    return true
}

