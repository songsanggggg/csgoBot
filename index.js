const { createClient } = require("icqq")
const redis = require('redis')
const qqConfig = require("./config/bot/config.js")

const account =  qqConfig.config.account.qq
const password = qqConfig.config.account.password
const platform = qqConfig.config.account.platform
let redisPort = qqConfig.config.redis.port
let redisUrl = qqConfig.config.redis.url


const redisClient = redis.createClient(redisPort, redisUrl)
const bot = createClient({platform:platform})

bot.on('system.login.slider', (e) => {
    console.log('输入滑块地址获取的ticket后继续。\n滑块地址:    ' + e.url)
    process.stdin.once('data', (data) => {
        client.submitSlider(data.toString().trim())
    })
})
bot.on('system.login.qrcode', (e) => {
    console.log('扫码完成后回车继续:    ')
    process.stdin.once('data', () => {
        client.login()
    })
})
bot.on('system.login.device', (e) => {
    console.log('请选择验证方式:(1：短信验证   其他：扫码验证)')
    process.stdin.once('data', (data) => {
        if (data.toString().trim() === '1') {
            client.sendSmsCode()
            console.log('请输入手机收到的短信验证码:')
            process.stdin.once('data', (res) => {
                client.submitSmsCode(res.toString().trim())
            })
        } else {
            console.log('扫码完成后回车继续：' + e.url)
            process.stdin.once('data', () => {
                client.login()
            })
        }
    })
})
bot.login(account,password)

exports.bot = bot
exports.redisClient = redisClient

//redis数据库状态
redisClient.on('ready', () => {
	console.log('redis数据库状态ok')
})
redisClient.on('error', err => {
	console.log(err)
})
redisClient.synGet = async(key) => {
    const newGet = async(key) => {
        let val = await new Promise((resolve => {
            redisClient.get(key, function (err, res) {
                return resolve(res);
            });
        }));
        return JSON.parse(val);
    };
    return await newGet(key);
}

//加载功能
import("./lib/plugin-request.js")
import("./lib/plugin-bind.js")
import("./lib/plugin-wanmei.js")
import("./lib/plugin-help.js")
import("./lib/plugin-other.js")
import("./lib/plugin-offical.js")
import("./lib/plugin-ai.js")
import("./lib/plugin-buffSearch.js")
//import("./lib/plugin-BilibiliLive.js") //bilibili开播提醒默认关闭插件
//import("./lib/plugin-csgoNews.js") //csgo资讯


process.on("unhandledRejection", (reason, promise) => {
	console.log('Unhandled Rejection at:', promise, 'reason:', reason)
})
