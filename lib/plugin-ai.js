const { bot } = require("../index.js")
const { segment } = require("icqq")

bot.on("message", async e => {
    ai(e)
})

async function ai(e) {
    if (e.message_type == "group") {
        if (e.group.mute_left != 0) {
            console.log("已被禁言");
            return true;
        }
    }
    if (e.message_type == "group") if (!e.raw_message.includes(bot.nickname)) return false;
    let message = e.raw_message.trim().replace(eval(`/${bot.nickname}/g`), "菲菲").replace(/[\n|\r]/g, "，");
    let postUrl = `http://api.qingyunke.com/api.php?key=free&appid=0&msg=${message}`;
    let response = await fetch(postUrl);
    let replyData = await response.json();
    let tempReplyMsg = [];
    let replyMsg = replyData.content.replace(/菲菲/g, bot.nickname)
        .replace(/\{br\}/g, "\n")
        .replace(/&nbsp;/g, " ")
        .replace(/(\{face:[\d]+\})/g, "$1\\n")
    if (replyMsg.includes("\\n") && replyMsg.includes("face")) {
        for (let item of replyMsg.split("\\n")) {
            if (/\{face:[\d]+\}/.test(item)) item = segment.face(item.replace(/\{face:([\d]+)\}/g, "$1"));
            tempReplyMsg.push(item);
        }
    }
    if (tempReplyMsg && tempReplyMsg.length > 0) replyMsg = tempReplyMsg;
    if (replyMsg && replyMsg.length > 0) {
        e.reply(replyMsg, true);
        return true;
    }
    return true;
}