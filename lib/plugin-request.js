const { bot } = require("../index.js")
const { segment } = require("icqq")

// 同意好友申请
bot.on("request.friend", e => e.approve())

// 同意群邀请
bot.on("request.group.invite", e => e.approve())

// 同意加群申请，拒绝`e.approve(false)`
bot.on("request.group.add", e => e.approve())

//监听群聊退出事件
bot.on("notice.group.decrease", async (e) => {
    decrease(e);
});

//监听加入群聊
bot.on("notice.group.increase", (e) => {
    increase(e);
});

async function decrease(e) {
    if (e.message_type == "group") {
        if (e.group.mute_left != 0) {
            console.log("已被禁言");
            return true;
        }
    }
    if (e.sub_type == "decrease") {
        console.log(e)
        let msg = [
            segment.image(`http://q2.qlogo.cn/headimg_dl?dst_uin=${e.user_id}&spec=100`),
            `(${e.user_id})离开了我们。。。`
        ];
        e.group.sendMsg(msg)
    }
    return true;
}

async function increase(e) {
    if (e.message_type == "group") {
        if (e.group.mute_left != 0) {
            console.log("已被禁言");
            return true;
        }
    }
    if (e.sub_type == "increase") {
        console.log(e)
        let msg = [
            segment.image(`http://q2.qlogo.cn/headimg_dl?dst_uin=${e.user_id}&spec=100`),
            `${e.nickname}(${e.user_id})欢迎加入群聊!`
        ];
        e.group.sendMsg(msg)
    }
    return true;
}