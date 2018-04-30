var common = require('../../utils/util.js');
Page({
  name: "addBox",
  data: {
    detail: {
      time: '',
      title: '',
      content: '',
      address: '',
      imgUrl: [],
    },
    timeStr:'',
    imgList: [],
  },
  onLoad(options) {
    console.info("url data", options)
    var time = this.getCurrentTime();
    this.setData({
      'detail.time': new Date().getTime(),
      'timeStr': time
    });
    this.getPosition();
  },
  getPosition() {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        console.log(res)
        common.getAddress({
          lat: res.latitude,
          lng: res.longitude
        }, function (res) {
          that.setData({
            'detail.address': res.address.formatted_address
          })
        });
      }
    })
  },
  titleChange: function (e) {
    var that = this;
    that.setData({
      'detail.title': e.detail.value
    });
  },
  contentFunc: function (e) {
    this.setData({
      'detail.content': e.detail.value
    })
  },
  formSaveData(e) {
    console.log(e)
    var that = this;
    var detail = {
      title: that.data.detail.title,
      time: that.data.detail.time,
      content: that.data.detail.content,
      address: that.data.detail.address,
      img: that.data.detail.imgUrl.join("-")
    };

    if (detail.title == '') {
      wx.showToast({
        title: '标题不能为空',
      })
    } else {
      wx.showLoading({ title: '保存中' })
      common.addBoxDetail({
        eventName: detail.title,
        eventTime: detail.time / 1000,
        eventContent: detail.content,
        eventImg: detail.img,
        eventAddress: detail.address,
      }, function (response) {
        wx.showToast({
          title: '保存成功',
          duration: 2000
        });
        wx.hideToast();
        that.setData({
          detail: {
            time: '',
            title: '',
            content: ' ',
            address: '',
            imgUrl: [],
          },
          imgList: [],
        })
        wx.switchTab({
          url: '/pages/box/box'
        })
      })
    }

  },
  choosePic() {
    var that = this;
    if (this.data.detail.imgUrl.length < 9) {
      wx.showLoading({
        'title': '图片上传中'
      })
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          var tempFilePaths = res.tempFilePaths;
          common.addPic(tempFilePaths, function (response) {
            wx.hideLoading();
            let realUrl = that.data.imgList;
            realUrl.push(common.getImgUrl(response));
            let pathUrl = that.data.detail.imgUrl;
            pathUrl.push(response)
            that.setData({
              imgList: realUrl,
              'detail.imgUrl': pathUrl
            });
          })
        },
        fail: function () {
          wx.hideLoading();
          wx.showToast({
            title: '您取消了上传图片',
            duration: 2000
          });
        }
      })
    } else {
      wx.showToast({
        title: '最多9张'
      });
    }
  },
  seePic: function (e) {
    var that = this;
    let urlImg = that.data.imgList;
    let current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current,
      urls: urlImg, 
      complete: function (e) {
        console.log(e);
      }
    })
  },
  deletePic: function(e){
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let imgUrl = this.data.detail.imgUrl;
    let imgList = this.data.imgList;
    imgUrl.splice(index, 1);
    imgList.splice(index, 1);
    this.setData({
      'detail.imgUrl': imgUrl,
      imgList: imgList
    })
  },
  eventTimeChange(e) {
    let that =this;
    let eventTime = e.detail.value;
    this.setData({
      'detail.time': new Date(eventTime).getTime()
    });
    this.setData({
      'timeStr': that.getCurrentTime(eventTime)
    })
  },
  getCurrentTime(timeStamps) {
    let time;
    if (timeStamps) {
      time = new Date(timeStamps);
    } else {
      time = new Date();
    }
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var day = time.getDate();
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    var str = year + '-' + month + '-' + day;
    return str;
  }
})

