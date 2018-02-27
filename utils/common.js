var config = require("../config.js")
var util = require("util.js")
const operation = {
    getStorage: function (key) {
        return new Promise((reslove, reject) => {
            wx.getStorage({
                key: key,
                success: function (res) { reslove(res) },
                fail: function (err) { reject(err) }
            })
        })
    },
    initMusic: function (ctx) {
        var interval = undefined
        var bam = wx.getBackgroundAudioManager()

        bam.onPlay(function () {
            clearInterval(interval)
            interval = setInterval(function () {
                ctx.setData({
                    duration: bam.currentTime,
                    durationStr: util.sec2Min(bam.currentTime)
                })
            }, 1000)
        })
        bam.onTimeUpdate(function () {
            let duration = Math.floor(bam.duration)
            // 设置时长
            ctx.setData({
                sumDuration: duration,
                sumDurationStr: util.sec2Min(duration)
            })
        })

        bam.onPause(function () {
            clearInterval(interval)
        })

        bam.onEnded(e => {
            clearInterval(interval)
            ctx.setData({
                duration: 0,
                durationStr: util.sec2Min(0),
                isplaying: false
            })
        })

        bam.onError(err => {
            clearInterval(interval)
            console.log(err)
        })
    },
    getMusicData: function () {
        return wx.getBackgroundAudioManager()
    },
    getlyric: function (id) {
        return new Promise((resolve, reject) => {
            console.log('id:', id)
            let url = config.platform.wangyi.server + config.platform.wangyi.api.lyric
            wx.request({
                url: url,
                data: {
                    id: id
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                // header: {}, // 设置请求的 header
                success: function (res) {
                    // success
                    if (!res.data.lrc.lyric) return false;
                    let lyric = res.data.lrc.lyric.replace(/\n/g, '')
                    let timearr = lyric.split('[')
                    let lyricArr = []
                    // seek 为键  歌词为value
                    timearr.forEach((item) => {
                        let val = item.split(']')[1]
                        if (val) {
                            let key = parseInt(item.split(']')[0].split(':')[0]) * 60 + parseFloat(item.split(']')[0].split(':')[1])
                            lyricArr.push({ key: key, value: val })
                        }
                    })
                    // cb && cb(obj, lyricArr)
                    resolve(lyricArr)
                },
                fail: function (err) {
                    reject(err)
                },
                complete: function (res) {
                    // complete
                }
            })
        })
    }
}
module.exports = operation