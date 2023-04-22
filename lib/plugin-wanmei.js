const { bot } = require("../index.js")
const { redisClient } = require("../index.js")
const { segment } = require("icqq")
const dayjs = require('dayjs')
const csgoConfig = require("../config/csgo/config.js")
const qqConfig = require("../config/bot/config.js")

const token = csgoConfig.config.wanmei.token
const device = csgoConfig.config.wanmei.device
const master = qqConfig.config.master.qq

bot.on("message", async e => {
    if (e.raw_message == '#完美地图胜率') {
        console.log(await winRate(e));
    }
    if (e.raw_message == '#完美ban') {
        console.log(await ban(e));
    }
    if (e.raw_message == '#完美数据') {
        console.log(await userData(e));
    }
    if (e.raw_message == '#完美武器数据') {
        console.log(await weaponData(e));
    }
    if (e.raw_message == '#今日赛程') {
        console.log(await competeData(e));
    }
    if (e.raw_message == '#明日赛程') {
        console.log(await competeData_f(e));
    }
})

async function winRate(e) {
    if (e.message_type == "group") {
        if (e.group.mute_left != 0) {
            console.log("已被禁言");
            return true;
        }
    }
    let qq = e.sender.user_id
    let msg
    redisClient.get(`qq_${qq}`, async (err, val) => {
        if (err) {
            console.err(err)
            return true
        }
        if (val == null) {
            e.reply(`尚未绑定，请使用#绑定 + steam64位id绑定`, true)
        }
        else {
            let userId = val
            let url = `https://api.wmpvp.com/api/v2/csgo/pvpMapStats?steamId64=${userId}&csgoSeasonId=S10`
            const response = await fetch(url)
            let res = await response.json()
            if (res.statusCode != 0) {
                e.reply(res.errorMessage + `请联系${master}\n当前绑定id为:${userId}`, true)
                return true
            }
            if (res.data.length == 0) {
                e.reply(`玩家不存在\n当前绑定id为:${userId}`, true)
                return true
            }
            else {
                let winData_bak = ``
                let winData = ``
                let arrNum = 0
                for (arrNum = 0; arrNum + 1 <= res.data.length; arrNum++) {
                    winData_bak = `\n\n地图名称:` + res.data[arrNum].mapNameZh + `\n比赛场数/胜场:` + res.data[arrNum].matchCnt + `/` + res.data[arrNum].winCnt + `\nt/ct胜率:` + res.data[arrNum].tWinRate + `/` + res.data[arrNum].tWinRate
                    winData += winData_bak
                }
                msg = [
                    `steamid:`,
                    userId,
                    `\n本赛季比赛地图数:`,
                    res.data.length + ``,
                    winData
                ]
                e.reply(msg, true)
                return true
            }
        }
    })
    return true
}

async function ban(e) {
    if (e.message_type == "group") {
        if (e.group.mute_left != 0) {
            console.log("已被禁言");
            return true;
        }
    }
    let url = `https://pvp.wanmei.com/user-info/forbid-stats?game_abbr_list=PVP,CSGO`
    const response = await fetch(url)
    let res = await response.json()
    if (res.code != 0) {
        e.reply(`接口错误,请联系${master}`, true)
        return true;
    }
    let msg = "完美平台\n" + "累计封禁数:" + res.data.all + "\n日新增封禁数:" + res.data.today + "\n日期:" + res.data.date_time
    e.reply(msg, true)
    return true
}

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
                "csgoSeasonId": ""
            }
            fetch('https://api.wmpvp.com/api/v2/csgo/pvpDetailDataStats', {
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
                        msg = [
                            "玩家名:",
                            data.data.name,
                            segment.image(data.data.avatar),
                            "steamId:",
                            data.data.steamId + "",
                            "\n分数:",
                            data.data.pvpScore + "",
                            "\n赛季场次:",
                            data.data.cnt + "",
                            "\n胜率:",
                            data.data.winRate + "",
                            "\nK/D/KD:",
                            data.data.kills + "/" + data.data.deaths + "/" + data.data.kd,
                            "\nRating:",
                            data.data.pwRating + "",
                            "\nADR:",
                            data.data.adr + "",
                            "\nRWS:",
                            data.data.rws + "",
                        ];
                        e.reply(msg, true)
                        return true;
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
                "csgoSeasonId": ""
            }
            fetch('https://api.wmpvp.com/api/v2/csgo/pvpDetailDataStats', {
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
                        let weaponData= ``;
                        let weaponData_bak = ``;
                        let arrNum = 0;
                        for (arrNum = 0; arrNum + 1 <= data.data.hotWeapons.length; arrNum++) {
                            weaponData_bak = `\n\n武器名称:` + data.data.hotWeapons[arrNum].weaponName + `\n击杀人数:` + data.data.hotWeapons[arrNum].weaponKill + `\n爆头数:` + data.data.hotWeapons[arrNum].weaponHeadShot + `\n爆头率:` + (data.data.hotWeapons[arrNum].weaponHeadShot / data.data.hotWeapons[arrNum].weaponKill).toFixed(3);
                            weaponData += weaponData_bak;
                        }
                        msg = [
                            "玩家名:",
                            data.data.name,
                            segment.image(data.data.avatar),
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

async function competeData(e) {
    if (e.message_type == "group") {
        if (e.group.mute_left != 0) {
            console.log("已被禁言")
            return true
        }
    }
    let timeGeter = new Date()
    let matchTime = timeGeter.getFullYear() + "-" + (timeGeter.getMonth() + 1) + "-" + timeGeter.getDate()
    let apiUrl = `https://gwapi.pwesports.cn/eventcenter/app/csgo/event/getMatchList?matchTime=${matchTime}+00:00:00`
    const response = await fetch(apiUrl)
    let res = await response.json()
    let Data_bak = ``
    let Data = ``
    let arrNum = 0
    let team1Name
    let team2Name
    if (res.code != 0 || res.message != "success") {
        e.reply(`接口错误,请联系${master}`)
        return true
    }
    else {
        for (arrNum = 0; arrNum + 1 <= res.result.matchResponse.dtoList.length; arrNum++) {
            if (res.result.matchResponse.dtoList[arrNum].csgoEventDTO.hot != true) {
                Data_bak = ""
                break
            }
            else {
                team1Name = res.result.matchResponse.dtoList[arrNum].team1DTO.name
                team2Name = res.result.matchResponse.dtoList[arrNum].team2DTO.name
                if (team1Name == "TBD") {
                    team1Name = "暂定"
                }
                if (team2Name == "TBD") {
                    team2Name = "暂定"
                }
                Data_bak = "\n\n赛事名称:" + res.result.matchResponse.dtoList[arrNum].csgoEventDTO.nameZh + "\n比赛队伍:" + team1Name + "/" + team2Name + "\n赛制:" + res.result.matchResponse.dtoList[arrNum].bo + "\n比赛时间:" + dayjs(res.result.matchResponse.dtoList[arrNum].startTime).$d;
            }
            Data += Data_bak
        }
    }
    if (Data == "") {
        Data = "\n暂无热门比赛";
    }
    let msg = [
        "今日赛程(为避免刷屏只展示火热赛事)",
        "\n查询日期:",
        matchTime,
        Data
    ];
    e.reply(msg, true);
    return true;
}

async function competeData_f(e) {
    if (e.message_type == "group") {
        if (e.group.mute_left != 0) {
            console.log("已被禁言");
            return true;
        }
    }
    let timeGeter = new Date();
    let matchTime = timeGeter.getFullYear() + "-" + (timeGeter.getMonth() + 1) + "-" + (timeGeter.getDate() + 1);
    let apiUrl = `https://gwapi.pwesports.cn/eventcenter/app/csgo/event/getMatchList?matchTime=${matchTime}+00:00:00`;
    const response = await fetch(apiUrl);
    let res = await response.json();
    let Data_bak = ``;
    let Data = ``;
    let arrNum = 0;
    let team1Name;
    let team2Name;
    if (res.code != 0 || res.message != "success") {
        e.reply(`接口错误,请联系${master}`);
        return true;
    }
    else {
        for (arrNum = 0; arrNum + 1 <= res.result.matchResponse.dtoList.length; arrNum++) {
            if (res.result.matchResponse.dtoList[arrNum].csgoEventDTO.hot != true) {
                Data_bak = "";
                break;
            }
            else {
                team1Name = res.result.matchResponse.dtoList[arrNum].team1DTO.name;
                team2Name = res.result.matchResponse.dtoList[arrNum].team2DTO.name;
                if (team1Name == "TBD") {
                    team1Name = "暂定";
                }
                if (team2Name == "TBD") {
                    team2Name = "暂定";
                }
                Data_bak = "\n\n赛事名称:" + res.result.matchResponse.dtoList[arrNum].csgoEventDTO.nameZh + "\n比赛队伍:" + team1Name + "/" + team2Name + "\n赛制:" + res.result.matchResponse.dtoList[arrNum].bo + "\n比赛时间:" + dayjs(res.result.matchResponse.dtoList[arrNum].startTime).$d;
            }
            Data += Data_bak;
        }
    }
    if (Data == "") {
        Data = "\n暂无热门比赛";
    }
    let msg = [
        "明日赛程(为避免刷屏只展示火热赛事)",
        "\n查询日期:",
        matchTime,
        Data
    ];
    e.reply(msg, true);
    return true;
}
