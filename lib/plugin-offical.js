const { bot } = require("../index.js")
const { redisClient } = require("../index.js")

const token = ""
const device = ""
const master = 

bot.on("message", async e => {
    if (e.raw_message == '#官匹数据') {
        console.log(await userData(e));
    }
    if (e.raw_message == '#官匹武器数据') {
        console.log(await weaponData(e));
    }
    if (e.raw_message == '#官匹地图胜率') {
        console.log(await winRate(e));
    }
})

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
                "steamId64": `${userId}`,
            }
            fetch(`https://api.wmpvp.com/api/v2/csgo/detailStats`, {
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
                    let rank
                    switch (data.data.historyRanks[0]) {
                        case 0:
                            rank = "白银一";
                            break;
                        case 1:
                            rank = "白银二";
                            break;
                        case 2:
                            rank = "白银三";
                            break;
                        case 3:
                            rank = "白银四";
                            break;
                        case 4:
                            rank = "白银五";
                            break;
                        case 5:
                            rank = "白银六";
                            break;
                        case 6:
                            rank = "黄金一";
                            break;
                        case 7:
                            rank = "黄金二";
                            break;
                        case 8:
                            rank = "黄金三";
                            break;
                        case 9:
                            rank = "黄金四";
                            break;
                        case 10:
                            rank = "AK/单AK";
                            break;
                        case 11:
                            rank = "麦穗AK";
                            break;
                        case 12:
                            rank = "双AK";
                            break;
                        case 13:
                            rank = "菊花";
                            break;
                        case 14:
                            rank = "小老鹰";
                            break;
                        case 15:
                            rank = "大老鹰";
                            break;
                        case 16:
                            rank = "小地球";
                            break;
                        case 17:
                            rank = "大地球";
                            break;
                        default:
                            rank = "未知"
                    }
                    if (data.statusCode != 0) {
                        msg = [
                            `返回数据错误，请联系${master}`,
                        ]
                    }
                    else {
                        msg = [
                            "steamId:",
                            data.data.steamId + "",
                            "\n段位:",
                            rank,
                            "\n赛季场次:",
                            data.data.cnt + "",
                            "\n胜率:",
                            data.data.winRate + "",
                            "\nK/D/KD:",
                            data.data.kills + "/" + data.data.deaths + "/" + data.data.kd,
                            "\nRating:",
                            data.data.rating + "",
                            "\nADR:",
                            data.data.adr + "",
                            "\nRWS:",
                            data.data.rws + "",
                        ]
                    }
                    e.reply(msg, true)
                })
                .catch((error) => {
                    console.error('Error:', error);
                    e.reply(`接口请求错误,请联系${master}`, true)
                })
        }
    })
    return true
}

async function weaponData(e) {
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
                "steamId64": `${userId}`,
            }
            fetch(`https://api.wmpvp.com/api/v2/csgo/detailStats`, {
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
                    if (data.statusCode != 0) {
                        e.reply(`接口错误,请联系${master},当前绑定id为${userId}`)
                        return true;
                    }
                    else {
                        let weaponData = ``;
                        let weaponData_bak = ``;
                        let arrNum = 0;
                        for (arrNum = 0; arrNum + 1 <= data.data.hotWeapons.length; arrNum++) {
                            weaponData_bak = `\n\n武器名称:` + data.data.hotWeapons[arrNum].weaponName + `\n击杀人数:` + data.data.hotWeapons[arrNum].weaponKill + `\n爆头数:` + data.data.hotWeapons[arrNum].weaponHeadShot + `\n爆头率:` + (data.data.hotWeapons[arrNum].weaponHeadShot / data.data.hotWeapons[arrNum].weaponKill).toFixed(3);
                            weaponData += weaponData_bak;
                        }
                        msg = [
                            "steamId:",
                            data.data.steamId + "",
                            weaponData,
                        ];
                        e.reply(msg, true)
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    e.reply(`接口请求错误,请联系${master}`, true)
                })
        }
    })
    return true
}

async function winRate(e) {
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
                "steamId64": `${userId}`,
            }
            fetch(`https://api.wmpvp.com/api/v2/csgo/detailStats`, {
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
                    if (data.statusCode != 0) {
                        e.reply(`接口错误,请联系${master},当前绑定id为${userId}`)
                        return true;
                    }
                    else {
                        let winData_bak = ``
                        let winData = ``
                        let arrNum = 0
                        for (arrNum = 0; arrNum + 1 <= data.data.hotMaps.length; arrNum++) {
                            winData_bak = `\n\n地图名称:` + data.data.hotMaps[arrNum].mapName + `\n比赛场数/胜场:` + data.data.hotMaps[arrNum].totalMatch + `/` + data.data.hotMaps[arrNum].winCount;
                            winData += winData_bak;
                        }
                        msg = [
                            `steamid:`,
                            userId,
                            `\n本赛季比赛地图数:`,
                            data.data.hotMaps.length + ``,
                            winData
                        ]
                        e.reply(msg, true)
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    e.reply(`接口请求错误,请联系${master}`, true)
                })
        }
    })
    return true
}
