let commonFunc = {
    /**
     * ajax传送
     */
    debug: true,
    /**
     * 检测用户是否登陆
     */
    checkLogin: function () {
        let token = wx.getStorageSync('token'),
            info = wx.getStorageSync('info');
        if (token != '' && info != '') {
            return true;
        } else {
            return false;
        }
    },
    url: function () {
        let str = '';
        if (this.debug) {
            str = 'https://apit.xbpig.cn'
        } else {
            str = 'https://api.xbpig.cn'
        }
        return str;
    },
    imgDefault: 'http://cdn.xbpig.cn/common/colorful-bubble-with-reflection-of-prague-buildings-picjumbo-com.jpg',
    imgUrl: function () {
        let str;
        if (!this.debug) {
            str = 'http://cdn.xbpig.cn/'
        } else {
            str = 'http://ohhuk1c8m.bkt.clouddn.com/'
        }
        return str;
    },
    formatTimeLine: function (timestamps, type) {
        let str = '', nowTime = new Date().getTime(), interval, year, day, dateStr, timeStr;
        timestamps *= 1000;
        interval = Math.round(Math.abs((timestamps - nowTime) / 86400000));
        year = parseInt(interval / 365);
        day = parseInt(interval % 365);
        let timS = timestamps;
        let date = new Date(timS),
            date_year = date.getFullYear(),
            date_month = date.getMonth() + 1;
        dateStr = '距离' + date_year + '年' + date_month + '月' + date.getDate() + '日';
        if (year > 0) {
            timeStr = year + '年' + day + '天';
        } else {
            timeStr = day + '天';
        }
        if (type === 'date') {
            str = dateStr;
        } else if (type === 'time') {
            str = timeStr;
        }
        return str;
    },
    formatCreate: function (timestamp, type) {
        let time = new Date(timestamp * 1000), str;
        if (type === 'time') {
            str = time.getHours() + ':' + time.getMinutes();
        } else if (type === 'date') {
            str = time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDay();
            // str = time.getDate();
        } else if (type === 'all') {
            str = time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDay() + ' ' + time.getHours() + ':' + time.getMinutes();

        }
        return str;
    },

    ajaxFunc: function (url, data, callback, type) {
        let self = this;
        data.token = wx.getStorageSync('token');
        data.info = wx.getStorageSync('info');
        let urlStr = self.url() + url;
        console.info("url:", urlStr)
        wx.request({
            url: urlStr, //仅为示例，并非真实的接口地址
            data: data,
            method: type || 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                let response = res.data;
                console.log("返回", response);
                if (response.code == 0) {
                    if (!callback) return;
                    let callbackFunc = callback.func,
                        callbackContext = callback.context;
                    callbackFunc && typeof(callbackFunc) == 'function' && callbackFunc.call(callbackContext, response.data);
                } else if (response.code == 10001) {
                    wx.clearStorage();
                    wx.showToast({
                        title: response.msg || '',
                        duration: 2000
                    });

                } else {
                    wx.showToast({
                        title: response.msg || '',
                        duration: 2000
                    });
                    if (response.code == 1111) {
                        wx.removeStorageSync('token');
                        wx.removeStorageSync('info');

                    }
                }

            },
            fail: function (e) {
                console.error(e)
                wx.showToast({
                    title: "网络连接异常",
                    duration: 2000
                });
            }
        })
    },
    wxUserLogin: function (data, callback) {
        this.ajaxFunc('/api2/wx/login', data, callback)
    },
    getWxUser: function (data, callback) {
        this.ajaxFunc('/api2/user/detail', data, callback)
    },
    wxUserCode: function (data, callback) {
        this.ajaxFunc('/api2/wx/addCode', data, callback)
    },
    getOwnBox: function (data, callback) {
        this.ajaxFunc('/api2/box/own', data, callback)
    },
    getBoxDetailByOwn: function (data, callback) {
        this.ajaxFunc('/api2/box/one', data, callback)
    },
    addPic: function (data, callback) {
        let self = this;
        let urlStr = self.url() + '/pic/add';
        wx.uploadFile({
            url: urlStr, //仅为示例，非真实的接口地址
            filePath: data[0],
            name: 'img',
            formData: {
                token: wx.getStorageSync('token'),
                info: wx.getStorageSync('info')
            },
            success: function (res) {
                let response = JSON.parse(res.data);
                if (response.code == 0) {
                    if (!callback) return;
                    let callbackFunc = callback.func,
                        callbackContext = callback.context;
                    callbackFunc && typeof(callbackFunc) == 'function' && callbackFunc.call(callbackContext, response.data);
                } else {
                    wx.showToast({
                        title: response.msg || 'fail',
                        duration: 2000
                    });
                    if (response.code == 1111) {
                        wx.removeStorageSync('token');
                        wx.removeStorageSync('info');

                    }
                }
            },
            fail: function (e) {
                console.log(e)
            }
        })
    },
    addBoxDetail: function (data, callback) {
        this.ajaxFunc('/box/addWxBox', data, callback)
    },
    createUser: function (data, callback) {
        this.ajaxFunc('/api2/wx/loginNone', data, callback)
    }
};

module.exports = commonFunc;
