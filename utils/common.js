const operation = {
  getStorage: function (key) {
    return new Promise((reslove, reject) => {
      wx.getStorage({
        key: key,
        success: function (res) { reslove(res) },
        fail: function (err) { reject(err) }
      })
    })
  }
}
module.exports = operation