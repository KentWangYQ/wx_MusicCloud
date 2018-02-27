// pages/play/play.js
var common = require('../../utils/common')
var util = require('../../utils/util.js')
var app = getApp()
Page({
    data: {
        duration: 1,
        durationStr: "00:00",
        sumDuration: 0,
        sumDurationStr: "00:00",
        currentLyricIndex: 0,
        isPlaying: false,
        songList: [],
        showSongList: '100%'
    },

    onLoad: function () {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        this.initAudio()

        let that = this;

        // 从storage获取播放列表
        this.getSongList()

        if (!app.globalData.playing) {
            app.globalData.playing = this.data.songList[0]
        }
    },

    onShow: function () {
        if (!this.data.isPlaying) {
            if (app.globalData.playing)
                // 清除globalData.playing
                app.globalData.playing = undefined

            var song = app.globalData
            // 添加到播放列表
            that.add2SongList(song)
            // 播放歌曲
            that.play(song)

            wx.hideLoading()
        }
    },

    // song manage
    initAudio: function () {
        let that = this
        var durationInterval = undefined,
            lyricInterval = undefined
        var bam = wx.getBackgroundAudioManager()

        // 进入可播放状态
        // 目前无法触发，貌似bug
        bam.onCanplay(() => {
        })

        // 播放事件
        bam.onPlay(() => {
            this.setData({ isPlaying: true })
            wx.setNavigationBarTitle({
                title: '正在播放'
            })
            that.showDuration(durationInterval)
            that.startLyricRoll(lyricInterval)
        })

        bam.onPause(() => {
            this.setData({ isPlaying: false })
            wx.setNavigationBarTitle({
                title: '暂停播放'
            })
            that.stopDuration(durationInterval)
            that.stopLyricRoll(lyricInterval)
        })

        bam.onStop(() => {
            this.setData({ isPlaying: false })
            wx.setNavigationBarTitle({
                title: '停止播放'
            })
            that.stopDuration(durationInterval)
            that.resetDuration()

            that.stopLyricRoll(lyricInterval)
            that.resetLyricRoll()
        })

        bam.onEnded(e => {
            this.setData({ isPlaying: false })
            wx.setNavigationBarTitle({
                title: '播放结束'
            })
            that.stopDuration(durationInterval)
            that.resetDuration()

            that.stopLyricRoll(lyricInterval)
            that.resetLyricRoll()

            // 自动播放下一曲（默认随机）
            that.next()
        })

        // 播放进度更新事件
        bam.onTimeUpdate(() => {
            // 设置总时长
            // TODO: 设置一次后，不重复设置
            that.showSumDuration()
        })

        bam.onPrev(() => {
            this.randomPlay()
        })

        bam.onNext(() => {
            this.randomPlay()
        })

        bam.onError(err => {
            this.setData({ isPlaying: false })
            console.log(err)

            that.stopDuration(durationInterval)
            that.resetDuration()

            that.stopLyricRoll(lyricInterval)
            that.resetLyricRoll()
        })

        bam.onWaiting(function () {

        })
    },

    showDuration: function (durationInterval) {
        let that = this
        var bam = wx.getBackgroundAudioManager()
        durationInterval = setInterval(function () {
            that.setData({
                duration: bam.currentTime,
                durationStr: util.sec2Min(bam.currentTime)
            })
        }, 1000)
    },
    stopDuration: function (durationInterval) {
        clearInterval(durationInterval)
    },
    resetDuration: function () {
        this.setData({
            duration: 0,
            durationStr: "00:00"
        })
    },
    showSumDuration: function () {
        var bam = wx.getBackgroundAudioManager()
        this.setData({
            sumDuration: bam.duration,
            sumDurationStr: util.sec2Min(bam.duration)
        })
    },
    resetSumDuration: function () {
        var bam = wx.getBackgroundAudioManager()
        this.setData({
            sumDuration: 0,
            sumDurationStr: "00:00"
        })
    },

    startLyricRoll: function (lyricInterval) {
        let that = this

        var bmp = wx.getBackgroundAudioManager()

        let l = 0, r = 0
        lyricInterval = setInterval(function () {
            let curr = bmp.currentTime
            if (!(curr >= l && curr < r)) {
                let idx = that.data.song.lyric.findIndex(l => l.key > curr)
                if (idx >= that.data.song.lyric.length - 1 || idx < 0) {
                    idx = that.data.song.lyric.length
                    clearInterval(lyricInterval)
                } else {
                    l = idx <= 0 ? 0 : that.data.song.lyric[idx - 1].key
                    r = that.data.song.lyric[idx].key
                }
                that.setData({ currentLyricIndex: idx - 1 })
            }
        }, 500);
    },
    stopLyricRoll: function (lyricInterval) {
        clearInterval(lyricInterval)
    },
    resetLyricRoll: function () {
        this.setData({ currentLyricIndex: 0 })
    },
    prev: function () {
        this.randomPlay();
    },
    next: function () {
        this.randomPlay();
    },
    randomPlay: function () {
        wx.getBackgroundAudioManager().stop()
        var index = 0
        if (!this.data.songList || this.data.songList.length <= 0) {
            wx.showToast({
                title: '您的播放列表中没有歌曲！',
            })
            return;
        }
        while (true) {
            index = parseInt(Math.random() * (this.data.songList.length))
            if (this.data.songList[index].id != this.data.song.id)
                break
        }
        this.play(this.data.songList[index])
    },

    // audio control
    audioPlay: function () {
        if (!wx.getBackgroundAudioManager().src) {
            // 播放结束时点击，则播放下一首
            this.next()
        } else {
            //暂停时点击，则恢复播放
            wx.getBackgroundAudioManager().play()
            this.setData({
                isPlaying: true
            })
        }
    },
    audioPause: function () {
        wx.getBackgroundAudioManager().pause()
        this.setData({
            isPlaying: false
        })
    },
    sliderChange: function (e) {
        wx.getBackgroundAudioManager().seek(e.detail.value)
        this.setData({
            duration: e.detail.value,
            durationStr: util.sec2Min(this.data.duration)
        })
    },

    // song list
    showSongList: function () {
        this.setData({
            showSongList: '0'
        })
    },
    hideSongList: function () {
        this.setData({
            showSongList: '100%'
        })
    },
    listPlay: function (e) {
        this.play(this.data.songList[e.currentTarget.dataset.index])
        this.hideSongList()
    },
    removeSong: function (e) {
        this.removeFromSongList(e.currentTarget.dataset.index)
    },
    
})