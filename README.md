# Interest-Picture
趣味图小程序
## 前言
```
主要功能点
1.选择图片，添加模板并保存

## 源码说明
### 项目目录说明
```
## 源码说明
### 项目目录说明
```
.
|-- images                           // 图片资源
|-- pages                            // 页面目录
|   |-- canvas                       // 画布页面
|   |-- index                        // 首页，选择图片后跳转画布页面
|-- app.js                           // 全局js
|-- app.json                         // 全局json
|-- app.wxss                         // 全局样式
|-- project.config.json              // 开发者工具个性化配置
|-- README.md                        // 项目说明 
|-- sitemap.json                     // sitemap 配置命令创建
.
```
### 技术难点与总结
```
1、canvas组件                                           
2、选择的图片按比例展示在画布上
3、添加的模板按比例添加在画布上
4、模板的移动与双指放大缩小
```
### 原理简介
```
    首页选择图片后保存路径，并在画布页展示。每个跟模板有关的操作（如：添加模板、放大缩小）都是重新渲染画布，同时渲染两张图片（背景图与改变后的模板）
```
### 立即体验
![](images/code.jpg)
