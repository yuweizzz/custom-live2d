# custom-live2d

一个在 Web 页面上运行 live2D 模型的简易插件。

## 主要功能

- 可以切换模型并支持动态交互（模型目前只支持 Cubism 3）。
- 可以配置默认启用和禁用。

## 依赖

- pixijs
- [pixi-live2d-display](https://github.com/guansss/pixi-live2d-display)
- webpack

## 使用方法

下载自己想要想要运行的 Live2D 模型，修改 Resources.js 中相关的配置，配置项可以影响显示的内容：

- `Configs.Canvas.Actived` 定义显示模型时的画布大小和图标的位置信息。
- `Configs.DefaultModel` 和 `Configs.Show` 定义页面载入后是否显示模型和需要显示的模型， `Configs.DefaultModel` 应该是 `Configs.Models` 中的 key ，而 `Configs.Show` 只能是 `'true'` 和 `'false'` 两个字符值中的一个。
- `Configs.Models` 可以定义多个模型，具体定义模型在画布中的偏移坐标和缩放比例， `Configs.Models.uri` 指定模型所在的资源路径，通过所在站点来拼接完整的 url 。交互动作在 `Configs.Models.motion` 指定，这个值应该来自 model3.json 中 `FileReferences.Motions` 中的 key 。

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

具体效果可以参考我的[个人站点](https://yuweizzz.github.io/)。
