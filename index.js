const { createClient } = require("oicq")
const redis = require('redis')

const account = ""
let redisPort = ""
let redisUrl = ""

const redisClient = redis.createClient(redisPort, redisUrl)
const bot = createClient(account)

bot.on("system.login.qrcode", function (e) {
	this.logger.mark("扫码后按Enter完成登录")
	process.stdin.once("data", () => {
		this.login()
	})
}).login()

exports.bot = bot
exports.redisClient = redisClient

//redis数据库状态
redisClient.on('ready', () => {
	console.log('redis数据库状态ok')
})
redisClient.on('error', err => {
	console.err(err)
})

//加载功能
import("./lib/plugin-request.js")
import("./lib/plugin-bind.js")
import("./lib/plugin-wanmei.js")
import("./lib/plugin-help.js")
import("./lib/plugin-other.js")
import("./lib/plugin-offical.js")
import("./lib/plugin-ai.js")

process.on("unhandledRejection", (reason, promise) => {
	console.log('Unhandled Rejection at:', promise, 'reason:', reason)
})
