const { bot } = require("../index.js")
const { segment } = require("oicq")

bot.on("message", async e => {
    if (e.raw_message.slice(0, 5) == "#饰品搜索") {
        console.log(await searchBuff(e))
    }
    if (e.raw_message.slice(0, 5) == "#饰品信息") {
        console.log(await goodsBuff(e))
    }
})

const master = 
const cookie = ""

async function searchBuff(e) {
    if (e.message_type == "group") {
        if (e.group.mute_left != 0) {
            console.log("已被禁言");
            return true;
        }
    }
    let buffName = e.raw_message.replace("#饰品搜索", "");
    buffName = buffName.replace(/\s*/g, "");
    fetch(`https://buff.163.com/api/market/search/suggest?text=${encodeURI(buffName)}&game=csgo`, {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "Cookie": `${cookie}`
        },
        "referrer": "https://buff.163.com/market/csgo",
        "method": "GET",
        "mode": "cors"
    })
        .then(response => response.json())
        .then(data => {
            if (data.code != "OK") {
                e.reply(`接口请求错误,请联系${master}`, true)
                return true
            }
            let searchData_bak = ``
            let searchData = ``
            let msg
            let arrNum = 0
            if (data.data.suggestions.length == 0) {
                searchData = "暂无相关饰品信息"
            }
            else {
                for (arrNum = 0; arrNum + 1 <= data.data.suggestions.length; arrNum++) {
                    searchData_bak = `\n\n饰品名称:` + data.data.suggestions[arrNum].option + `\n饰品id:` + data.data.suggestions[arrNum].goods_ids
                    searchData = searchData + searchData_bak
                }
            }
            msg = [
                "buff平台csgo饰品搜索结果:",
                searchData
            ]
            e.reply(msg, true)
        })
        .catch((error) => {
            console.error('Error:', error);
            e.reply(`接口请求错误,请联系${master}`, true)
        })
    return true
}

async function goodsBuff(e) {
    if (e.message_type == "group") {
        if (e.group.mute_left != 0) {
            console.log("已被禁言");
            return true;
        }
    }
    let goodId = e.raw_message.replace("#饰品信息", "");
    goodId = goodId.replace(/\s*/g, "");
    fetch(`https://buff.163.com/api/market/goods/sell_order?game=csgo&goods_id=${goodId}`, {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
            "X-Requested-With": "XMLHttpRequest",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "Cookie": `${cookie}`
        },
        "referrer": "https://buff.163.com/goods/781598?from=market",
        "method": "GET",
        "mode": "cors"
    })
        .then(response => response.json())
        .then(data => {
            if (data.code != "OK") {
                e.reply(`接口请求错误,请联系${master}`, true)
                return true
            }
            let msg
            let buffMinPrice
            let buffMinBargainPrice
            if(data.data.items.length == 0){
                buffMinPrice = "未知"
                buffMinBargainPrice = "未知"
            }
            else{
                buffMinPrice = data.data.items[0].price + ""
                buffMinBargainPrice = data.data.items[0].lowest_bargain_price
            }
            msg = [
                segment.image(data.data.goods_infos[`${goodId}`].original_icon_url),
                `商品名称:${data.data.goods_infos[`${goodId}`].name}`,
                `\nsteam价格:${data.data.goods_infos[`${goodId}`].steam_price_cny}`,
                `\nbuff底价:${buffMinPrice}`,
                `\nbuff最高求购价:${buffMinBargainPrice}`
            ]
            e.reply(msg, true)
        })
        .catch((error) => {
            console.error('Error:', error);
        })
        return true
}
