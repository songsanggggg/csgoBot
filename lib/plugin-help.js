const { bot } = require("../index.js")

bot.on("message", async e => {
    if (e.raw_message.includes('help')) {
        console.log(await help(e));
    }
})

async function help(e){
    if (e.message_type == "group") {
        if (e.group.mute_left != 0) {
            console.log("已被禁言");
            return true;
        }
    }
    let msg = `csgo查询机器人\n\nhelp 查询使用帮助\n#绑定+steam64位id 绑定游戏角色\n#完美地图胜率 查询各个地图胜率\n#完美数据 查询游戏角色数据\n#完美武器数据 查询游戏武器数据\n#完美ban 查看当前csgo完美平台封禁情况\n#今日(或明日)赛程 查看比赛日程\n#来点图 获取随机图片\n#点歌+歌名 搜索歌曲\n\n其他功能待完善,欢迎提出意见`
    e.reply(msg, true)
    return true
}