// pages/qqmusic/qqmusic.js
const backgroundAudioManager = wx.getBackgroundAudioManager()
var intervalObj = undefined,
  animation = undefined,
  i = 0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    favoSongList: {},
    animationData: {},
    audio: {
      image: '../../image/cd.jpg',
      songName: '精彩音乐，精彩生活',
      album: '音乐魔盒',
      status: 'init',
      ico: {
        play: '../../image/play.png',
        next: '../../image/next.png'
      }
    }
  },

  txt_name_tap: function (e) {
    this.data.audio.status = 'play'
    this.data.audio.ico.play = '../../image/pause.png'
    this.setData({ audio: this.data.audio })
    this.playMusic(e.currentTarget.dataset.musicrid)
    this.startRotate()
  },
  img_del_tap: function (e) {
    var temp_fsl = Object.assign({}, this.data.favoSongList)
    delete temp_fsl[e.currentTarget.dataset.musicrid]
    this.setData({ favoSongList: temp_fsl })
    wx.setStorage({
      key: 'favoSongList',
      data: this.data.favoSongList,
    })
  },
  play_tap: function (e) {
    switch (this.data.audio.status) {
      case 'play':
        this.stopRotate()
        this.data.audio.status = 'pause'
        this.data.audio.ico.play = '../../image/play.png'
        this.setData({ audio: this.data.audio })
        backgroundAudioManager.pause()
        break
      case 'pause':
        this.startRotate()
        this.data.audio.status = 'play'
        this.data.audio.ico.play = '../../image/pause.png'
        this.setData({ audio: this.data.audio })
        backgroundAudioManager.play()
        break
      default:
        break
    }
  },
  next_tap: function (e) {
    this.playMusic(Object.getOwnPropertyNames(this.data.favoSongList)[Math.floor(Object.getOwnPropertyNames(this.data.favoSongList).length * Math.random())])
    this.startRotate()
  },
  onReady: function () {
    backgroundAudioManager.onEnded(this.backgroundAudioManagerOnEnded)
    backgroundAudioManager.onPlay(this.backgroundAudioManagerOnPlay)
    backgroundAudioManager.onPause(this.backgroundAudioManagerOnEnded)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow: function () {
    wx.getStorage({
      key: 'favoSongList',
      success: res => {
        var favoSongList = {}
        if (typeof res.data == "object") {
          favoSongList = res.data
        }
        this.setData({ favoSongList: favoSongList })
      },
    })
  },
  playMusic: function (musicRid) {
    var song = this.data.favoSongList[musicRid]
    wx.request({
      url: "https://antiserver.kuwo.cn/anti.s?type=convert_url&format=aac|mp3&response=url&rid=" + musicRid,
      success: res1 => {
        wx.request({
          url: "https://player.kuwo.cn/webmusic/st/getNewMuiseByRid?rid=" + musicRid,
          success: res2 => {
            this.data.audio.songName = song.songName
            this.data.audio.album = song.album
            this.data.audio.author = song.author
            this.data.audio.image = res2.data.split("<artist_pic240>")[1].split("</artist_pic240>")[0]
            this.setData({ audio: this.data.audio })

            backgroundAudioManager.title = song.songName
            backgroundAudioManager.epname = song.album
            backgroundAudioManager.singer = song.author
            backgroundAudioManager.coverImgUrl = res2.data.split("<artist_pic240>")[1].split("</artist_pic240>")[0]
            backgroundAudioManager.src = res1.data
          }
        })
      }
    })
  },
  startRotate: function (speed) {
    this.stopRotate()
    animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
    })
    speed = speed | 36
    this.setData({
      animationData: animation.rotate((++i) * speed).step().export()
    })
    intervalObj = setInterval(function () {
      this.setData({
        animationData: animation.rotate((++i) * speed).step().export()
      })
    }.bind(this), 1000)
  },
  stopRotate: function () {
    clearInterval(intervalObj)
  },
  backgroundAudioManagerOnEnded: function (e) {
    // this.playMusic(Object.getOwnPropertyNames(this.data.favoSongList)[Math.floor(Object.getOwnPropertyNames(this.data.favoSongList).length * Math.random())])
    this.stopRotate()
  },
  backgroundAudioManagerOnPlay: function (e) {
    // this.playMusic(Object.getOwnPropertyNames(this.data.favoSongList)[Math.floor(Object.getOwnPropertyNames(this.data.favoSongList).length * Math.random())])
    this.startRotate()
  }
})