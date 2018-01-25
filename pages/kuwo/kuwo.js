// pages/kuwo/kuwo.js
var inputContext = {}
var songList = {},
  favoSongList = {}

const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    audio: {
      image: "http://pic.58pic.com/58pic/15/23/66/74758PICAjD_1024.jpg"
    }
  },

  ipt_search_blur: function (e) {
    inputContext["keyword"] = e.detail.value
  },
  ico_searh_tap: function (e) {
    wx.request({
      url: "https://search.kuwo.cn/r.s?ft=music&itemset=web_2013&client=kt&pn=0&rn=50&rformat=json&encoding=utf8&all=" + inputContext["keyword"],
      success: res => {
        var result = JSON.parse(res.data.replace(/'/g, '"'))
        var temp_songList = {}
        for (var i = 0; i < result.abslist.length; i++) {
          temp_songList[result.abslist[i].MUSICRID] = {
            musicRid: result.abslist[i].MUSICRID,
            songName: result.abslist[i].SONGNAME,
            album: result.abslist[i].ALBUM,
            author: result.abslist[i].ARTIST
          }

        }
        this.setData({
          searchResult: temp_songList
        })

        songList = Object.assign(songList, temp_songList)
      }
    })
  },
  ico_play_tap: function (e) {
    this.playMusic(e.currentTarget.dataset.musicrid)
  },
  ico_favo_tap: function (e) {
    if (!favoSongList[e.currentTarget.dataset.musicrid]) {
      favoSongList[e.currentTarget.dataset.musicrid] = songList[e.currentTarget.dataset.musicrid]
      wx.setStorage({ key: 'favoSongList', data: favoSongList })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onReady: function (option) {
    backgroundAudioManager.onEnded(this.backgroundAudioManagerOnEnded)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getStorage({
      key: "favoSongList",
      success: res => {
        if (typeof res.data == "object") {
          favoSongList = res.data
          songList = Object.assign(songList, favoSongList)
        } else {
          favoSongList = {}
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  playMusic: function (musicRid) {
    var song = songList[musicRid]
    wx.request({
      url: "https://antiserver.kuwo.cn/anti.s?type=convert_url&format=aac|mp3&response=url&rid=" + musicRid,
      success: res1 => {
        wx.request({
          url: "https://player.kuwo.cn/webmusic/st/getNewMuiseByRid?rid=" + musicRid,
          success: res2 => {

            this.setData({
              audio: {
                songName: song.songName,
                album: song.album,
                author: song.author,
                image: res2.data.split("<artist_pic240>")[1].split("</artist_pic240>")[0]
              }
            })

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

  backgroundAudioManagerOnEnded: function (e) {
    this.playMusic(Object.getOwnPropertyNames(favoSongList)[Math.floor(Object.getOwnPropertyNames(favoSongList).length * Math.random())])
  }
})



