# MODERN ART DRIVE IMAGE CREATOR

## 使用

### 1. 编译

```shell
$ npm install
$ npm run build
```

### 2. 使用

见`main.js`。

首先必须注册字体，否则后面字体显示不出来。

```javascript
registerFont(FONT_PATH, {
  family: 'unifont',
  weight: 'normal',
  style: 'normal',
})
```

`createType1MADImage`: 创建第一类型的图片

```javascript
// 第一个参数是3个文字插槽，
// 可以分别指定，如果某个插槽不想插，就填 undefined
// {
//   text: '文字',
//   color: '#颜色',
//   fontSize?: 30, // 字体大小，pt
//   x?: 0, // 左上角的点x，微调
//   y?: 0, // 左上角的点y，微调
//   maxWidth?: 0, // 最大宽度，超过则换行
//   padding?: [上, 右, 下, 左]
// }
//
// 第二个参数是设计器参数
// {
//   debug?: false, // 是否绘制debug信息
// }
createType1MADImage(
  [
    {
      text: '测试文字',
      color: '#f00',
    },
    {
      text: '测试文字',
      color: '#f00',
      fontSize: 15,
    },
    {
      text: '测试文字',
      color: '#f00',
    },
  ],
  {
    debug: true,
  }
).then((imageBuffer) => {
  fs.writeFileSync(OUTPUT_IMAGE, imageBuffer)
  console.log('done')
})
```

`createType2MADImage`: 创建第二类型的图片

参数同`createType1MADImage`。

`createType3MADImage`: 创建第三类型的图片

参数同`createType1MADImage`。
