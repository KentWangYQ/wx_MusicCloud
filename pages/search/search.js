// pages/search/search.js
var config = require("../../config.js")
var app = getApp()
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    circular: true,
    //   歌曲搜索的结果
    searchSuggest: [],
    searchReault: []
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    let that = this
    console.log(e.detail)
    this.setData({
      inputVal: e.detail.value
    });
    // let url = `http://localhost:3000/search?keywords=${e.detail.value}`
    wx.request({
      url: config.platform.wangyi.server + config.platform.wangyi.api.searchSuggest,
      data: {
        keywords: e.detail.value,
        limit: 10,
        type: 1
      },
      method: 'GET',
      success: function (res) {
        let temp = []
        if (!res.data.result.songs) {
          return;
        }
        res.data.result.songs.forEach((song, index) => {
          temp.push({
            id: song.id,
            name: song.name,
            mp3Url: song.mp3Url,
            picUrl: song.album.picUrl,
            singer: song.artists[0].name
          })
          that.setData({
            searchSuggest: temp
          })
        })
        // 存入搜索的结果进缓存
        wx.setStorage({
          key: "searchSuggest",
          data: temp
        })
      },
      fail: function (res) {
        // fail
        console.log(`error: ${res}`)
      },
      complete: function (res) {
        // complete
      }
    })
  },
  search: function (e) {
    let that = this
    console.log(e.detail)
    wx.request({
      url: config.platform.wangyi.server + config.platform.wangyi.api.search,
      data: {
        keywords: e.currentTarget.dataset.name,
        limit: 10
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)

        let temp = []
        if (!res.data.result.songs) {
          return;
        }
        res.data.result.songs.forEach((song, index) => {
          temp.push({
            id: song.id,
            name: song.name,
            mp3Url: song.mp3Url,
            picUrl: song.album.picUrl,
            singer: song.artists[0].name
          })
          that.setData({
            searchReault: temp
          })
        })
        that.hideInput()
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  play: function (event) {
    let songData = {
      id: event.currentTarget.dataset.id,
      name: event.currentTarget.dataset.name,
      mp3Url: event.currentTarget.dataset.songurl,
      picUrl: event.currentTarget.dataset.picurl,
      singer: event.currentTarget.dataset.singer
    }
    // 将当前点击的歌曲保存在缓存中
    wx.setStorageSync('clickdata', songData)
    // wx.switchTab({
    //   url: '../play/play'
    // })
  },
  onShow: function () {
    wx.hideLoading()
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        // that.setData({
        //   sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        // });
      }
    });
  }
});