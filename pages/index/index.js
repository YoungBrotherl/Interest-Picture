//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    
  },
  
  goCanvasTap: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        app.globalData.img = tempFilePaths[0]
        console.log(app.globalData.img)
        wx.navigateTo({
          url: '/pages/canvas/canvas',
        })
      }
    })
  },

})
