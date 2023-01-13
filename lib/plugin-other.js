const { bot } = require("../index.js")
const { segment } = require("oicq")
const os = require('os')
const { buildMusic } = require("oicq/lib/message/music.js")

const master = ""

bot.on("message", async e => {
    if (e.raw_message == '#来点图') {
        console.log(await picture(e));
    }
    if (e.raw_message == '#系统占用') {
        console.log(await systemInformation(e));
    }
    if (e.raw_message == '.drop') {
        console.log(await drop(e));
    }
    if (e.raw_message.slice(0, 3) == "#点歌") {
        console.log(await music(e))
    }
})

async function picture(e) {
    let imageGetTime = 0
    if (e.message_type == "group") {
        if (e.group.mute_left != 0) {
            console.log("已被禁言");
            return true;
        }
    }
    let timeGeter = new Date();
    if (e.user_id == master) {
        e.reply(segment.image("https://api.anosu.top/img/"), true);
        return true
    }
    else {
        if (timeGeter.getTime() - imageGetTime < 200000) {
            e.reply("全局获取时间限制为200s,请到一会重试", true);
            return true;
        }
        else {
            e.reply(segment.image("https://api.anosu.top/img/"), true);
            imageGetTime = timeGeter.getTime();
        }
    }
    return true
}

async function systemInformation(e) {
    if (e.message_type == "group") {
        if (e.group.mute_left != 0) {
            console.log("已被禁言");
            return true;
        }
    }
    if (e.user_id == master) {
        //内存
        let freeMemory = (os.freemem() / 1024 ** 3).toFixed(2) + "G";
        let totalMemory = (os.totalmem() / 1024 ** 3).toFixed(2) + "G";

        let msg;
        msg = [
            "内存大小：" + totalMemory + '\n空闲内存：' + freeMemory,
        ];
        e.reply(msg, true);
    }
    else {
        e.reply("你没有权限", true);
    }
    return true;
}

async function drop(e) {
    if (e.group.mute_left != 0) {
        console.log("已被禁言");
        return true;
    }
    let msg = [
        segment.image("https://img1.imgtp.com/2022/12/27/2wasAjhQ.jpg"),
        segment.image("https://img1.imgtp.com/2022/12/27/2wasAjhQ.jpg"),
        segment.image("https://img1.imgtp.com/2022/12/27/2wasAjhQ.jpg"),
        segment.image("https://img1.imgtp.com/2022/12/27/2wasAjhQ.jpg"),
        segment.image("https://img1.imgtp.com/2022/12/27/2wasAjhQ.jpg"),
    ];
    e.reply(msg, true);
    return true;
}

async function music(e) {
    if (e.message_type == "group") {
        if (e.group.mute_left != 0) {
            console.log("已被禁言");
            return true;
        }
    }
    let musicName = e.raw_message.replace("#点歌", "");
    musicName = musicName.replace(/\s*/g, "");
    let url = `http://cloud-music.pl-fe.cn/search?keywords=${musicName}`
    let response = await fetch(url);
    let res = await response.json();
    let msg
    if (res.code != 200) {
        msg = [
            "接口错误"
        ]
    }
    else {
        if (res.songCount == 0) {
            msg = [
                "暂无匹配结果"
            ]
        }
        else {
            msg = [
                segment.record(`http://music.163.com/song/media/outer/url?id=${res.result.songs[0].id}.mp3`)
            ]
            let makerData_bak = ``
            let makerData = ``
            let arrNum = 0
            for (arrNum = 0; arrNum + 1 <= res.result.songs[0].artists.length; ++arrNum) {
                makerData_bak = res.result.songs[0].artists[arrNum].name + ","
                makerData += makerData_bak
            }
            console.log(makerData)
            e.reply(`在下载并发送歌曲,请稍等\n歌曲id:${res.result.songs[0].id}\n歌曲名称:${res.result.songs[0].name}\n歌手:${makerData}`, true)
        }
    }
    e.reply(msg, true)
    return true
}