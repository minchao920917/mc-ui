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

  /*
  构建多页面模式的应用程序.每个“页面”都应该有一个相应的JavaScript条目文件。该值应该是一
  个对象，其中键是条目的名称，而该值要么是指定其条目、模板和文件名的对象，要么是指定其条目
  的字符串，
  注意：请保证pages里配置的路径和文件名 在你的文档目录都存在 否则启动服务会报错的
  */
  pages: {
    index: {
      entry: 'examples/main.js', // 入口
      template: 'public/index.html', // 模板
      filename: 'index.html' // 输出文件
    }
  },  // 修改 pages 入口
  
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
  }         // 扩展 webpack 配置
}

```

` 这边我觉得有必要解释一下vue-cli3.0与vue-cli2.0的区别，3.0生成的项目远远比2.0精简了很多，比如项目的配置信息不再暴露在项目中，而是在你create vue xx-xx 后直接给你选项，你根据选项将配置信息写入到package.json中，然后npm i 之后，配置信息都保存在@vue目录下，这样vue3.0就实现了将配置文件完全的封装，但是，but，人是善变的，所以出于人性的考虑，你还可以像vue2.0那样通过在根目录下添加vue.config.js来DIY你要善变配置选项，包括baseUrl、pages、productionSourceMap等一系列参数`

vue.config.js中的pages是因为修改了文件夹的目录，需要重新制定出入口文件。chainWebpack经过链式的方式修改webpack的配置，常用于扩展webpack配置。

这里就跑个题，稍微讲一下webpack的配置属性吧。

```
1、配置一个新的loader

    config.module
        .rule(name)
            .use(name)
            .loader(loader)
            .options(options)

        // 一个例子
        config.module
            .rule('graphql')
            .test(/\.graphql$/)
            .use('graphql-tag/loader')
                .loader('graphql-tag/loader')
                .end()
        // 若是是非webpack-chain的话
        module:{
        rules:[
            {
            test:/\.graphql$/,
            use::[
                {
                loader:"graphql-tag/loader"
                }
            ]
            }
        ]
    }

  2、设置别名

  const path = require('path');
    function resolve (dir) {
        return path.join(__dirname, dir)
    }
    module.exports = {
        lintOnSave: true,
        chainWebpack: (config)=>{
            config.resolve.alias
                .set('@$', resolve('src'))
                .set('assets',resolve('src/assets'))
                .set('components',resolve('src/components'))
                .set('layout',resolve('src/layout'))
                .set('base',resolve('src/base'))
                .set('static',resolve('src/static'))
                .delete('base') // 删掉指定的别名
                // .clear()  会把全部别名都删掉
        }
    }

    3、修改入口和出口

    chainWebpack: config => {
        config.entryPoints.clear() // 会把默认的入口清空
        config.entry('main').add('./src/main.js')//新增入口
        config.entry('routes').add('./src/app-routes.js')//新增入口


        config.output
                .path("dist")
                .filename("[name].[chunkhash].js")
                .chunkFilename("chunks/[name].[chunkhash].js")
                .libraryTarget("umd")
                .library();
        }

        // 其他的output配置
        config.output
        .auxiliaryComment(auxiliaryComment)
        .chunkFilename(chunkFilename)
        .chunkLoadTimeout(chunkLoadTimeout)
        .crossOriginLoading(crossOriginLoading)
        .devtoolFallbackModuleFilenameTemplate(devtoolFallbackModuleFilenameTemplate)
        .devtoolLineToLine(devtoolLineToLine)
        .devtoolModuleFilenameTemplate(devtoolModuleFilenameTemplate)
        .filename(filename)
        .hashFunction(hashFunction)
        .hashDigest(hashDigest)
        .hashDigestLength(hashDigestLength)
        .hashSalt(hashSalt)
        .hotUpdateChunkFilename(hotUpdateChunkFilename)
        .hotUpdateFunction(hotUpdateFunction)
        .hotUpdateMainFilename(hotUpdateMainFilename)
        .jsonpFunction(jsonpFunction)
        .library(library)
        .libraryExport(libraryExport)
        .libraryTarget(libraryTarget)
        .path(path)
        .pathinfo(pathinfo)
        .publicPath(publicPath)
        .sourceMapFilename(sourceMapFilename)
        .sourcePrefix(sourcePrefix)
        .strictModuleExceptionHandling(strictModuleExceptionHandling)
        .umdNamedDefine(umdNamedDefine)

    4、设置代理

    chainWebpack: config => {
        config.devServer.port(8888)
        .open(true)
        .proxy({'/dev': {
                    target: 'http://123.57.153.106:8080/',
                    changeOrigin: true,
                    pathRewrite: {
                    '^/dev': ''
                    }
                }
            })
    }
    // chain其余队proxy的配置
    config.devServer
    .bonjour(bonjour)
    .clientLogLevel(clientLogLevel)
    .color(color)
    .compress(compress)
    .contentBase(contentBase)
    .disableHostCheck(disableHostCheck)
    .filename(filename)
    .headers(headers)
    .historyApiFallback(historyApiFallback)
    .host(host)
    .hot(hot)
    .hotOnly(hotOnly)
    .https(https)
    .inline(inline)
    .info(info)
    .lazy(lazy)
    .noInfo(noInfo)
    .open(open)
    .openPage(openPage)
    .overlay(overlay)
    .pfx(pfx)
    .pfxPassphrase(pfxPassphrase)
    .port(port)
    .progress(progress)
    .proxy(proxy)
    .public(public)
    .publicPath(publicPath)
    .quiet(quiet)
    .setup(setup)
    .socket(socket)
    .staticOptions(staticOptions)
    .stats(stats)
    .stdin(stdin)
    .useLocalIp(useLocalIp)
    .watchContentBase(watchContentBase)
    .watchOptions(watchOptions)

    等等
```
配置参考[webpack中文官网](https://www.webpackjs.com/configuration/plugins/#plugins)

到这里，你就会发现，   `npm run serve`后便又能浏览器访问了。

其实我对webpack也只是略懂皮毛而已，毕竟学到老，活到老，正常操作都是用的时候搜一下看一眼，不用就又忘了。

既然如此，那我们是不是就可以来写我们的组件库了。

##      编写和测试自己第一个组件

上一章，我们提到了如何创建一个组件库项目。讲了vue-cli3.0构建项目，并修改目录文件夹。添加新的vue.config.js来跑起来整个项目。准备工作也做的差不多了，那我们就来上手写我们的第一个组件吧。

###  mc-btn 按钮组件

写过代码的人都知道按钮组件是最常用的，也是最好实现的一个组件。

1、第一步 在packages目录下创建一个文件夹命名为btn

2、第二步再在btn文件夹下创建一个文件夹命名为src

3、第三步，在src文件夹中创建一个同名的btn.vue单文件组件.内容

```
    <!--bnt.vue-->
    <template>
    <span class="mc-btn" @click="handleClick">
        <slot></slot>  
    </span>
    </template>

    <script>
    export default {
    name: 'McBtn', // 这个名字很重要
    data () {
        return {
        }
    },
    methods: {
        handleClick () {
        this.$emit('handleClick')
        }
    }
    }
    </script>

    <style lang="scss" scoped>
        .mc-btn {
            display: inline-block;
            width: 100px;
            height: 50px;
            line-height: 50px;
            border-radius: 4px;
            font-size: 4px;
            text-align: center;
            background: #09aeaf;
            color: white;
        }
    </style>

```
4、第四步 在"./package/btn"下创建index.js

```
    import McBtn from './src/btn'
    // 为组件提供 install 方法，供组件对外按需引入
    // 所有组件，必须具有 install，才能使用 Vue.use()
    McBtn.install = Vue => {
    Vue.component(McBtn.name, McBtn)
    }
    export default McBtn

```
此一步意义是暴露该组件，注意组件必须要有install，才能被Vue.use(xx)使用.

5、第五步，在 "/packages"下创建index.js

```
import McBtn from './btn';
// 定义一个组件列表，将McBtn组件放入其中
const components = [
    McBtn
    //... 未来其他的组件需要在开头引入
]
// 定义 调用vue的加载器方法，将 Vue 作为参数传入
const install = function (Vue) {
  // 判断是否安装
  if (install.installed) return
  install.installed = true
  // 遍历组件列表，将组件注入进vue组件中
  components.map(component => Vue.component(component.name, component))
}

// 判断调用vue加载器，实现全局加载
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  ...components
}

```

此一步含义是装载所有组件，组件必须先声明，然后加载在组件列表中，再在加载器中循环调用加载。

主要作用就是统一导出所有组件及暴露 install 方法。之前组件内的 index.js 只是安装单个组件，而现在这个 index.js 是循环安装所有组件，这样用户可以选择按需加载，也可以选择一次性加载。

好了，到此，一个Btn组件就算是编写完成了。
当前的目录结构为 ![WechatIMG21.jpeg](https://i.loli.net/2020/12/01/lCu7oHjPWQObkKd.jpg)

##      测试编写的mc-btn组件

组件已经写好了，那我们就来尝试使用一下吧。
在当前项目中
1、第一步，全局引入首先在 examples 下的 main.js 中引入刚刚写好的包，就像下面这样：
```
    import App from './App.vue'
    //...

    import McUI from "./../packages";
    Vue.use(McUI);

    //...
    Vue.config.productionTip = false
```

此步是在本地编写文件时全局引入

注意，当全局引入了这个McUI之后，发现会报错，可能是你这个项目的css-loader没对，因为我这默认的单文件组件中使用的是`<style lang="scss" scoped>`,意思是我编写的样式加载器应该是sass-loader，如果你引入的 `<style lang="lcss" scoped>`说明你需要引入less-loader

  ```
    npm install sass-loader node-sass

    npm run serve //重启就又可以了
  ```
这一块特殊报错特殊处理吧！

2、第二步，删除helloword.vue，在app.vue中修改为

```
    <template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png">
        <mc-test></mc-test>
    </div>
    </template>

    <script>


    export default {
    name: 'App',

    }
    </script>

    <style>
    #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    }
    </style>

```

刷新页面，可以看见页面变了

![WechatIMG23.jpeg](https://i.loli.net/2020/12/01/UFpsfuQ57o6LP2M.jpg)

到此，我们的mc-btn组件从，开发到测试就初步完成了。

##      打包

vue-cli3为我们提供了一个构建目标库的命令行：

`vue-cli-service build --target lib --name xxx --dest lib [entry]`

–target: 构建目标，默认为应用模式。这里修改为 lib 启用库模式。

–dest : 输出目录，默认 dist。这里我们改成 lib

[entry]: 入口文件，默认为 src/App.vue。

这里我们指定编译 packages/ 组件库目录。

在当前的    `package.json` 

```
    //...
    "scripts": {
        "serve": "vue-cli-service serve",
        "build": "vue-cli-service build",
        "lint": "vue-cli-service lint",
        "lib": "vue-cli-service build --target lib --name  mc-ui --dest lib packages/index.js"
    },
    "dependencies": {
    //...
"lib": "vue-cli-service build --target lib --name  mc-ui --dest lib packages/index.js"

```
到此，新的打包命令就配置好了，执行    `npm run lib`
等待打包结束，你会发现目录文件夹下多了个`lib`文件夹.
![WechatIMG24.jpeg](https://i.loli.net/2020/12/01/ujCdW31Ey9Xlk7f.jpg)

那么这个lib文件夹就是我们要发布的到 `npm`的包了。


##      发布

一切准备就绪，就差发布了！

直接从  `https://www.npmjs.com/` 上注册，登陆，准备发布。

npm账号包含三个部分：username、password、email
分别是用户名、密码和邮箱，注册好之后要登陆你的邮箱去进行验证，验证通过才能`npm publish` ,如果是没验证的邮箱，当你在publish的时候会给你报403错。

发包注意要点：

1、首先命名不能重复 mc-ui本来就没有，但是一直给我报了一个相似名太多一直需要我重新更换名字，那我只能将   `mc-ui` 改成 `mch-ui`,不仅改了文件名，还修改了配置信息

2、账号用户名密码不能写错

3、其他的发包问题，还请自行百度，google也行！


终于，历经千辛万苦，终于发了个mch-ui的包。那么问就当场来验证一下效果。


##     验证mch-ui(万般无奈改了名字 ╭(╯^╰)╮)

1、 cd到一个空文件夹下，使用`vue create test` 创建一个新的vue项目

2、 `npm i mch-ui -S ` 引入mch-ui的组件库，当这一步执行完成之后，你会发现，node_modules下面多出了一个mch-ui的文件夹，里面是这样的。
![WechatIMG25.jpeg](https://i.loli.net/2020/12/01/nGth3LpqYF7BPHy.jpg)
能见到lib就说明咱们的组件库生效了可以引用了。

3、在test项目下的src文件夹下的`main.js`

```
        import MCUI from "mch-ui";
        import 'mch-ui/lib/mch-ui.css'
        Vue.use(MCUI)

```
这里就是全局引入组件库

4、在src下的`components/HelloWold.vue` 中输入

```
    //...
    <template>
        <div class="hello">
            <h1>{{ msg }}</h1>
            <mc-btn>这是一个按钮</mc-btn>
        </div>
    </template>
    //...

```

5、 执行

```
    npm i
    npm run serve
```

打开浏览器发现：

![WechatIMG26.jpeg](https://i.loli.net/2020/12/01/8TnVrXOQSimqfxp.jpg)


##      结尾

万里长征第一步总算是踏出去了，后续就自由发挥吧，DIY各种自己的组件库吧。

如果觉得可以，可以收藏此网页，也可以直接给
