# csgoBot
基于nodejs于oicq库的csgo完美平台数据查询机器人

目前有一些乱七八糟的功能，比如数据查询（武器,胜率,等等）已经完美平台封禁情况
还可以查看热门比赛赛程
当然还有随机二次元图片点歌功能
还有ai对话等等
token
主要开始使用时候要修改的有redisUrl
index.js中的account填入机器人qq
           redisPort填入redis端口
           redisUrl填入redis地址
plugin-other.js中master填入自己qq
plugin-wanmei.js中token和device填入自己抓包的结果

plugin-BilibiliLive.js与plugin-offical.js本为bilibili直播提醒和csgo官匹数据查询但是还未完成
bilibili直播提醒还未开始写qwq（理解万岁
官匹数据查询主要问题在于请求url中有一个sign参数不知来源无法继续完成
5e方面数据查询因为本人不玩5e就没有写qwq（理解万岁
