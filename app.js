//app.js
App({
    globalData: {
        /* playing: {
                id: 436514312,
                name: "成都",
                src: "http://m2.music.126.net/7o5D4dA6271VktgawcbZFA==/18665309393829604.mp3",
                poster: "http://p1.music.126.net/34YW1QtKxJ_3YnX9ZzKhzw==/2946691234868155.jpg",
                singer: "赵雷",
                lyric: []
            }, */
        playing: {},
        songList: []
    },
    onLaunch: function (options) {
        try {
            var v = wx.getStorageSync("playing")
            if (v) {
                this.globalData.playing = v
                console.log("Global data", this.globalData)
            } else {
                console.log("Get storage 'playing' error!")
            }
        } catch (e) {
            console.log("Get storage 'playing' error!", e)
        }
    }
})