// pages/search/search.js
var apiConfig = require("../../config.js"),
    searchBl = require("bl/searchBl.js"),
    audioMgt = require("../../bll/audioMgt.js")
var config = {
    search: {
        keyword: undefined,
        limit: 15,
        offset: 0
    }
}
Page({
    data: {
        loading: false,
        inputShowed: false,
        inputVal: "",
        indicatorDots: true,
        autoplay: true,
        interval: 2000,
        duration: 1000,
        circular: true,
        //   歌曲搜索的结果
        searchSuggest: [],
        searchResult: []
    },
    showInput: function () {
        this.setData({
            inputShowed: true,
            searchSuggest: []
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
        if (!e.detail.value) return;
        this.setData({
            inputVal: e.detail.value
        });
        // let url = `http://localhost:3000/search?keywords=${e.detail.value}`
        wx.request({
            url: apiConfig.platform.wangyi.server + apiConfig.platform.wangyi.api.searchSuggest,
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
                temp.push({
                    name: e.detail.value
                })
                res.data.result.songs.forEach((song, index) => {
                    temp.push({
                        id: song.id,
                        name: song.name,
                        src: song.mp3Url,
                        poster: song.album.picUrl,
                        singer: song.artists[0].name
                    })
                    that.setData({
                        searchSuggest: temp
                    })
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
        this.showLoading()
        this.setData({
            searchResult: []
        })
        let that = this
        console.log(e.currentTarget.dataset)

        // 充值keyword和offset
        config.search.keyword = e.currentTarget.dataset.name
        config.search.offset = 0

        searchBl.search(e.currentTarget.dataset.name, config.search.limit, config.search.offset)
            .then(data => {
                that.hideLoading()
                that.setData({
                    searchResult: data
                })
            })

        that.hideInput()
    },
    play: function (event) {
        let song = {
            id: event.currentTarget.dataset.id,
            name: event.currentTarget.dataset.name,
            src: event.currentTarget.dataset.songurl,
            poster: event.currentTarget.dataset.picurl,
            singer: event.currentTarget.dataset.singer
        }
        
        audioMgt.play(song)
    },
    onReachBottom: function () {
        if (this.data.loading)
            return;
        console.log("not loading")
        let that = this
        that.showLoading()
        searchBl.search(config.search.keyword, config.search.limit, config.search.offset)
            .then(data => {
                that.hideLoading()
                that.setData({
                    searchResult: that.data.searchResult.concat(data)
                })
            })

        config.search.offset += config.search.limit
    },
    showLoading: function () {
        this.setData({
            loading: true
        })
    },
    hideLoading: function () {
        this.setData({
            loading: false
        })
    }
});