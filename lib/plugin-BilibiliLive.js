const { bot } = require("../index.js")
const { redisClient } = require("../index.js")
const redis = require('redis')
const schedule = require('node-schedule')
const { segment } = require("oicq")

const master = 

schedule.scheduleJob('30 * * * * *', () => {
    redisClient.get("groupList", (err, val) => {
        if (err) {
            console.err(err)
            return true
        }
        else {
            let groupArr = val.split(",")
            let arrNum = 0
            for (arrNum = 0; arrNum + 1 <= (groupArr.length - 1); arrNum++) {
                redisClient.get(`groupId_${groupArr[arrNum]}`, async (err, val) => {
                    if (err) {
                        console.log(err)
                        return true
                    }
                    else {
                        let dataArr = val.split(",")
                        let url = `https://api.bilibili.com/x/space/acc/info?mid=${dataArr[1]}`
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
                                        data.data.live_room.url
                                    ]
                                    let status = await redisClient.synGet(`liveStatus_groupId_${dataArr[0]}`)
                                    if (data.data.live_room.liveStatus == "0") {
                                        redisClient.set(`liveStatus_groupId_${dataArr[0]}`, `0`)
                                        return true
                                    }
                                    else {
                                        if (data.data.live_room.liveStatus == 1 && status == "0") {
                                            bot.pickGroup(dataArr[0]).sendMsg(msg)
                                            redisClient.set(`liveStatus_groupId_${dataArr[0]}`, `1`)
                                        }
                                    }
                                }
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                            })
                    }
                })
            }
        }
    })
});

bot.on("message", async e => {
    if (e.raw_message.slice(0, 6) == "#更换up主") {
        console.log(await changeBind(e));
    }
    if (e.raw_message.slice(0, 6) == "#设置up主") {
        console.log(await userBind(e))
    }
})

async function userBind(e) {
    if (e.message_type == 'private') return true
    if (e.user_id != master) {
        return true
    }
    if (e.message_type == "group") {
        if (e.group.mute_left != 0) {
            console.log("已被禁言");
            return true;
        }
    }
    let upUid = e.raw_message.replace("#设置up主", "");
    upUid = upUid.replace(/\s*/g, "");
    let groupId = e.group_id
    let msg
    redisClient.get(`groupId_${groupId}`, (err, val) => {
        if (err) {
            console.err(err)
            return true
        }
        if (val == null) {
            redisClient.set(`groupId_${groupId}`, `${groupId},${upUid}`, redis.print)
            redisClient.set(`liveStatus_groupId_${groupId}`, `0`, redis.print)
            redisClient.get("groupList", (err, val) => {
                if (err) {
                    console.err(err)
                    return true
                }
                else {
                    val = val + groupId + ","
                }
                redisClient.set("groupList", val, redis.print)
            })
            msg = [
                "设置成功",
                `绑定up主为${upUid}`,
            ]
            e.reply(msg, true)
        }
        else {
            msg = [
                `当前群已绑定${(val.split(","))[1]}`,
                "\n更换请输入#更换up主 + up主uid",
            ]
            e.reply(msg, true)
        }
    })
    return true
}

async function changeBind(e) {
    if (e.message_type == 'private') return true
    if (e.user_id != master) return true
    if (e.message_type == "group") {
        if (e.group.mute_left != 0) {
            console.log("已被禁言");
            return true;
        }
    }
    let upUid = e.raw_message.replace("#更换up主", "");
    upUid = upUid.replace(/\s*/g, "");
    let groupId = e.group_id
    let msg
    redisClient.get(`groupId_${groupId}`, (err, val) => {
        if (err) {
            console.err(err)
            return true
        }
        if (val == null) {
            redisClient.set(`groupId_${groupId}`, `${groupId},${upUid}`, redis.print)
            redisClient.set(`liveStatus_groupId_${groupId}`, `0`, redis.print)
            redisClient.get("groupList", (err, val) => {
                if (err) {
                    console.err(err)
                    return true
                }
                else {
                    val = val + groupId + ","
                }
                redisClient.set("groupList", val, redis.print)
            })
            msg = [
                "设置成功",
                `绑定up主为${upUid}`,
            ]
            e.reply(msg, true)
        }
        else {
            redisClient.set(`groupId_${groupId}`, `${groupId},${upUid}`, redis.print)
            redisClient.set(`liveStatus_groupId_${groupId}`, `0`, redis.print)
            msg = [
                "更换成功",
                `当前up为${upUid}`,
            ]
            e.reply(msg, true)
        }
    })
    return true
}
