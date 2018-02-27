var apiConfig = require("../../../config.js")
const operation = {
    search: function (keyword, limit, offset) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: apiConfig.platform.wangyi.server + apiConfig.platform.wangyi.api.search,
                data: {
                    keywords: keyword,
                    limit: limit,
                    offset: offset
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
                    })
                    resolve(temp)
                },
                fail: function (err) {
                    reject(err)
                }
            })
        })
    }
}

module.exports = operation