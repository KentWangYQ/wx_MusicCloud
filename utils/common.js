var config = require("../config.js")
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
  playMusic: function (url, title, pic) {
      wx.getBackgroundAudioManager({
        src: url,
        title: title,
        coverImgUrl: pic}).play();
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
          let lyric = res.data.lrc.lyric
          let timearr = lyric.split('[')
          let obj = {}
          let lyricArr = []
          // seek 为键  歌词为value
          timearr.forEach((item) => {
            let key = parseInt(item.split(']')[0].split(':')[0]) * 60 + parseInt(item.split(']')[0].split(':')[1])
            let val = item.split(']')[1]
            obj[key] = val
          })
          for (let key in obj) {
            // obj[key] = obj[key].split('\n')[0]
            lyricArr.push(obj[key])
          }
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