# CustomLive2d

一个简易的网页 live2D 运行插件。

## 主要功能

- 可以切换模型并支持动态交互（模型目前只支持 Cubism 3）。
- 可以配置默认启用和禁用。

## 依赖

- pixijs
- [pixi-live2d-display](https://github.com/guansss/pixi-live2d-display)
- webpack

## 使用要点

- 下载自己想要想要运行的 Live2D 模型。
- 如果需要支持动态交互，需要修改模型 model3.json 的 motion 命名为 Action 。（Main.js - 43行）
- 修改 Resources.js 中相关的配置，主要是关于模型的显示配置和路径。
- 如果有需要可以自行修改 Main.js 中的画布大小。（Main.js - 84行）

## 使用方法

``` bash
$ npm install
$ npm run build
```

生成的文件为 `./dist/CustomLive2D.js` ，将下面的 HTML 代码添加到对应的 HTML 文件中即可生效。

```
<script src="https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js"></script>
<script type="text/javascript" src="CustomLive2D.js"></script>
```

live2dcubismcore.min.js 是运行时的核心文件，不可缺少。