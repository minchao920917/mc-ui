#   mc-ui

一直想搞一套ui，自从来了上海这个大城市之后，整天忙着公司写业务，尤其疫情，公司裁员，工作便更忙了，一个人做多个人的活，终于年底招了两个前端，压力终于小了不少，得空腾出手来，研究研究开发一套UI库

##      准备工作

需要安装vue-cli3.0脚手架工具，因为偷懒的关系，我就直接没有从    `npm init` 一步一步描述怎么搭建一个webpack配置的vue项目，此处就直接使用vue-cli3.0一键构建一个项目。没什么技术难度，唯一需要的估计就是你要理解，vue-cli3.0不是vue3.0。

如果你还想知道怎么构建一个DIY的脚手架工具，可以移步我的教程，[传送门](https://juejin.cn/post/6844903959618912269)或者直接看[源码](https://github.com/minchao920917/mcf-cli)

##      开始搭建

第一步，使用 `vue create mc-ui` 然后回车键到底，再在vscode中打开文件夹。你会发现目录是这样的。
![WechatIMG20.jpeg](https://i.loli.net/2020/11/30/hMYHgP96EWGJKnN.jpg)

这就是一个最基本的vue2.0的项目目录，此时，你可以直接    `npm i `紧接着  `npm run serve  `你就可以直接打开浏览器访问项目

第二步：修改项目目录，很显然，这不是我们想要的项目目录，因此需要我们

1、把 src 目录名字改成 examples，用于展示组件示例

2、在根目录下新建一个 packages 文件夹，用来放组件的

此时由于我们人为修改了项目文件夹名，原来的项目就不能再正常运行了，别急，接着往下看。

第三步：添加配置文件

毕竟 src 都不见了，路径啥的肯定得报错。所以现在我们来解决这个问题。 在根目录下新建一个 vue.config.js 文件（新项目是没有这个文件的），并写入以下内容：

``` 
const path = require('path')
module.exports = {
  // 修改 pages 入口
  pages: {
    index: {
      entry: 'examples/main.js', // 入口
      template: 'public/index.html', // 模板
      filename: 'index.html' // 输出文件
    }
  },
  // 扩展 webpack 配置
  chainWebpack: config => {
    // @ 默认指向 src 目录，这里要改成 examples
    // 另外也可以新增一个 ~ 指向 packages
    config.resolve.alias
      .set('@', path.resolve('examples'))
      .set('~', path.resolve('packages'))

    // 把 packages 和 examples 加入编译，因为新增的文件默认是不被 webpack 处理的
    config.module
      .rule('js')
      .include.add(/packages/).end()
      .include.add(/examples/).end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        // 修改它的选项...
        return options
      })
  }
}

```
`  这边我觉得有必要解释一下vue-cli3.0与vue-cli2.0的区别，3.0生成的项目远远比2.0精简了很多，比如项目的配置信息不再暴露在项目中，而是在你create vue xx-xx 后直接给你选项，你根据选项将配置信息写入到package.json中，然后npm i 之后，配置信息都保存在@vue目录下，这样vue3.0就实现了将配置文件完全的封装，但是，but，人是善变的，所以出于人性的考虑，你还可以像vue2.0那样通过在根目录下添加vue.config.js来DIY你要善变配置选项，包括baseUrl、pages、productionSourceMap等一系列参数`


到这里，你可能会问了，vue-cli3.0

