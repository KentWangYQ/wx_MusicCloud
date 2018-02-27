const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const sec2Min = s => {
    var min = Math.floor(s / 60),
        sec = Math.floor(s % 60)
    return `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`
}

module.exports = {
    formatTime: formatTime,
    sec2Min: sec2Min
}
