var app = getApp(),
    common = require("../utils/common.js")
const operation = {
    play: function (song) {
        let that = this

        app.globalData.playing = song
        var bam = wx.getBackgroundAudioManager()
        bam.singer = song.singer
        bam.coverImgUrl = song.poster
        common.getlyric(song.id)
            .then((lyric) => {
                // 开始播放
                bam.src = `http://music.163.com/song/media/outer/url?id=${song.id}.mp3`

                console.log('lyric', lyric)
                // 设置歌词
                song.lyric = lyric
                // 添加到播放列表
                this.add2SongList(song)
            })

    },
    getSongList: function () {
        return common.getStorage("songList")
            .then(res => {
                app.globalData.songList = res.data
            }, err => {
                console.log("Get songList from storage failed", err)
            })
    },
    saveSongList: function () {
        wx.setStorage({
            key: "songList",
            data: app.globalData.songList
        })
    },
    add2SongList: function (song) {
        app.globalData.songList.push(song)
        this.saveSongList()
    },
    removeFromSongList: function (id) {
        var songList = app.globalData.songList
        for (var i = 0; i < songList.length; i++) {
            if (songList[i].id == id)
                songList.splice(i, 1)
        }
        this.saveSongList()
    }
}

module.exports = operation