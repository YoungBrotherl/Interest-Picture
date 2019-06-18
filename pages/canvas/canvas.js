// pages/canvas/canvas.js
var app = getApp();
var cfg = {
  rect: {}, // 容器
  photo: {}, // 图片
  canvas: {}, // 画布
  template: { // 模板
    x: 0,
    y: 0,
    width: 100,
  },
  offSet: {}, // 距离左上角位置距离
  index: 0, // 模板序号
  key: false, // 移动开关
  isIphoneX: false, // 是否X
  initialDistance: 0, // 缩放初始距离
  curDistance: 0, // 缩放现在距离
  scale: 1, // 缩放比例
  endTime: 0, // 移动结束时间
};
var SCALE = {
  MIN: 0.1, // 最小比例
  MAX: 2, // 最大比例
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: '',
    template: [
      {
        img: './../../images/addImg.png',
        add: true,
      },
      {
        img: './../../images/3.png',
      },
      {
        img: './../../images/1.png',
      },
      {
        img: './../../images/2.png',
      },  
      {
        img: './../../images/4.png',
      },
      {
        img: './../../images/5.png',
      },
      {
        img: './../../images/6.png',
      },
    ],
    checkIndex: 0, // 选中模板
    canvasWeight: 0, // 画布宽度
    canvasHeight: 0, // 画布高度
  },

  // 添加模板图片
  addTemplateImg: function () {
    let _this = this,
        template = _this.data.template
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        let a = {
          img: tempFilePaths[0]
        }
        template.splice(1, 0, a)
        _this.setData({
          template
        })
        _this.makeTemplate(1)
      }
    })
  },

  // 开始移动
  startMove: function (e) {
    let startPoint = e.touches[0],
      startX = startPoint.clientX,
      startY = startPoint.clientY,
      width = cfg.template.x + cfg.template.width,
      height = cfg.template.y + cfg.template.height
    if (cfg.isIphoneX) {
      startY -= 100
    }

    cfg.offSet.x = startX - cfg.template.x
    cfg.offSet.y = startY - cfg.template.y
  },

  // 移动中
  moveIng: function (e) {
    // if (cfg.key) {
      let _this = this,
        template = _this.data.template, 
        movePoint = e.touches[0],
        x = movePoint.clientX - cfg.offSet.x,
        y = movePoint.clientY - cfg.offSet.y,
        img = app.globalData.img,
        ctx = wx.createCanvasContext('scene'),
        newWidth = cfg.scale * cfg.template.width,
        newHeight = cfg.template.height / cfg.template.width * newWidth
      if (cfg.isIphoneX) {
        y -= 100
      }
      cfg.template.x = x
      cfg.template.y = y

      ctx.drawImage(img, 0, 0, cfg.canvas.width, cfg.canvas.height)
      ctx.drawImage(template[cfg.index].img, x, y, newWidth, newHeight)
      ctx.draw()
    // }
  },

  // 开始缩放
  startZoom: function (e) {
    let startPoint = e.touches,
        startX = startPoint[1].clientX - startPoint[0].clientX,
        startY = startPoint[1].clientY - startPoint[0].clientY

    cfg.initialDistance = Math.sqrt(startX * startX + startY * startY)
  },

  // 缩放中
  zoomIng: function (e) {
    let zoomPoint = e.touches,
        zoomX = zoomPoint[1].clientX - zoomPoint[0].clientX,
        zoomY = zoomPoint[1].clientY - zoomPoint[0].clientY

    cfg.curDistance = Math.sqrt(zoomX * zoomX + zoomY * zoomY)
    cfg.scale = Math.min(cfg.scale + 0.0001 * (cfg.curDistance -cfg.initialDistance), SCALE.MAX)
    cfg.scale = Math.max(cfg.scale, SCALE.MIN)

    let _this = this,
      template = _this.data.template,
      img = app.globalData.img,
      ctx = wx.createCanvasContext('scene'),
      newWidth = cfg.scale * cfg.template.width,
      newHeight = cfg.template.height / cfg.template.width * newWidth  

    ctx.drawImage(img, 0, 0, cfg.canvas.width, cfg.canvas.height)
    ctx.drawImage(template[cfg.index].img, cfg.template.x, cfg.template.y, newWidth, newHeight)
    ctx.draw()
  },
  
  onTouchStart: function (e) {
    if(e.touches.length > 1) {
      // 开始缩放
      this.startZoom(e)
    } else {
      // 开始移动
      this.startMove(e)
    }
  },

  
  onTouchMove: function (e) {
    if (e.touches.length > 1) {
      // 缩放中
      this.zoomIng(e)
    } else {
      // 距离上次结束时间小于300ms 不处理
      if(new Date().getTime() - cfg.endTime < 300) {
        return
      }
      // 移动中
      this.moveIng(e)
    }
  },

  onTouchEnd: function() {
    let date = new Date()
    cfg.endTime = date.getTime()
  },

  // 选择模板
  onCheckTemplate: function (e) {
    let index = e.currentTarget.dataset.index;
    cfg.index = index
    cfg.template.x = 0
    cfg.template.y = 0
    cfg.scale = 1
    this.makeTemplate(index)
  },

  // 创建模板图片
  makeTemplate: function(index) {
    let _this = this,
        template = _this.data.template,
        img = app.globalData.img,
        ctx = wx.createCanvasContext('scene')
    
    _this.setData({
      checkIndex: index
    })
    cfg.index = index
    wx.getImageInfo({
      src: template[index].img,
      success(res) {
        let height = res.height / res.width * 100

        cfg.template.height = height

        ctx.drawImage(img, 0, 0, cfg.canvas.width, cfg.canvas.height)
        ctx.drawImage(template[index].img, 0, 0, cfg.template.width, cfg.template.height)
        ctx.draw()
      }
    })
    
  },

  // 获取图片/容器宽高
  getSize: function () {
    let _this = this
    wx.createSelectorQuery().select('#canvas-box').boundingClientRect(function (rect) {
      cfg.rect.width = rect.width
      cfg.rect.height = rect.height

      let img = app.globalData.img
      wx.getImageInfo({
        src: img,
        success(res) {
          cfg.photo.width = res.width
          cfg.photo.height = res.height

          _this.setCanvasSize()
        }
      })
    }).exec()
    
    
  },

  // 设置画布大小
  setCanvasSize: function () {
    let _this = this,
      rectWidth = cfg.rect.width,
      rectHeight = cfg.rect.height,
      photoHeight = cfg.photo.height,
      photoWidth = cfg.photo.width,
      canvasWeight,
      canvasHeight

    if (photoHeight / photoWidth > rectHeight / rectWidth) {
      canvasHeight = rectHeight
      canvasWeight = photoWidth / photoHeight * canvasHeight
    } else {
      canvasWeight = rectWidth
      canvasHeight = photoHeight / photoWidth * canvasWeight
    }
    _this.setData({
      canvasWeight,
      canvasHeight
    })
    cfg.canvas.width = canvasWeight
    cfg.canvas.height = canvasHeight

    _this.makeTemplate(1)
  },

  // 保存图片
  goSaveTap: function() {
    let canvasWeight = cfg.canvas.width,
        canvasHeight = cfg.canvas.height
    wx.canvasToTempFilePath({
      width: canvasWeight,
      height: canvasHeight,
      destWidth: canvasWeight * 2,
      destHeight: canvasHeight * 2,
      canvasId: 'scene',
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success(res) {
        let model = res.model
        if (model.indexOf('X') != -1 && model.indexOf('iPhone') != -1) {
          cfg.isIphoneX = true
        } else {
          cfg.isIphoneX = false
        }
      }
    })
    this.getSize()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  }
})