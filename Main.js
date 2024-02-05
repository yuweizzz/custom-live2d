import * as PIXI from 'pixi.js';
import { Ticker } from '@pixi/ticker';
import { Live2DModel } from 'pixi-live2d-display/lib/cubism4';

Live2DModel.registerTicker(Ticker);

import { Configs, SwitchIconContext, ExitIconContext } from './Resources.js';

function CreateCanvas () {
    var CanvasNode = document.createElement("canvas");
    CanvasNode.id = "canvas";
    CanvasNode.style.left = "0";
    CanvasNode.style.bottom = "0";
    CanvasNode.style.position = "fixed";
    // for custom application
    CanvasNode.style.zIndex = "5";
    document.body.appendChild(CanvasNode);
    console.log('Init Canvas ...');
}

async function LoadModel (m) {
    const url = document.location.protocol + "//" + document.location.host + m.uri
    const model = await Live2DModel.from(url);
    model.scale.set(m.scale * window.devicePixelRatio);
    model.x = m.x * window.devicePixelRatio;
    model.y = m.y * window.devicePixelRatio;
    model.interactive = true;
    model.buttonMode = true;
    model.on('mousedown', () => {
        model.motion(m.motion);
    });
    return model;
}

function LoadIcon (context, i) {
    const texture = new PIXI.Texture.from(context);
    const sprite = new PIXI.Sprite(texture);
    sprite.interactive = true;
    sprite.buttonMode = true;
    sprite.x = i.x * window.devicePixelRatio;
    sprite.y = i.y * window.devicePixelRatio;
    sprite.scale.set(i.scale * window.devicePixelRatio);
    return sprite;
}

function GetNextModel (map, key) {
    const list = Object.keys(map);
    var value = list.indexOf(key);
    value += 1;
    var index = value > list.length - 1 ? 0 : value;
    return list[index];
}

function Handler () {
    var ModelName = "";
    var Show = "";
    // use to bind PIXI.Application
    var Application = {};
    Object.defineProperty(this, 'Show', {
        get: function () {
            return Show;
        },
        set: async function (value) {
            Show = value
            localStorage.setItem('show-live2d', value);
            if (value === "true"){
                // load
                const SwitchIcon = LoadIcon(SwitchIconContext, Configs.Canvas.Actived.SwitchIcon);
                const ExitIcon = LoadIcon(ExitIconContext, Configs.Canvas.Actived.ExitIcon);
                const currentModel = await LoadModel(Configs.Models[this.ModelName]);
                // canvas init
                this.Application.renderer.resize(Configs.Canvas.Actived.width * window.devicePixelRatio, Configs.Canvas.Actived.height * window.devicePixelRatio);
                this.Application.stage.interactive = true;
                // model
                this.Application.stage.addChild(currentModel);
                // SwitchIcon
                this.Application.stage.addChild(SwitchIcon);
                SwitchIcon.alpha = 0;
                SwitchIcon.on('mousedown', async () => {
                    this.ModelName = GetNextModel(Configs.Models, this.ModelName)
                    this.Application.stage.removeChildAt(0);
                    const nextModel = await LoadModel(Configs.Models[this.ModelName]);
                    this.Application.stage.addChildAt(nextModel, 0);
                })
                // ExitIcon
                this.Application.stage.addChild(ExitIcon);
                ExitIcon.alpha = 0;
                ExitIcon.on('mousedown', () => {
                    this.Application.stage.removeChildAt(0);
                    this.Application.stage.removeChild(SwitchIcon);
                    this.Application.stage.removeChild(ExitIcon);
                    this.Show = "false";
                })
                // canvas event
                this.Application.stage.on("mouseover",() => {
                    SwitchIcon.alpha = 1;
                    ExitIcon.alpha = 1;
                })
                this.Application.stage.on("mouseout",() => {
                    SwitchIcon.alpha = 0;
                    ExitIcon.alpha = 0;
                })
            }
            else {
                const SwitchIcon = LoadIcon(SwitchIconContext, Configs.Canvas.Closed.SwitchIcon);
                this.Application.renderer.resize(Configs.Canvas.Closed.width * window.devicePixelRatio, Configs.Canvas.Closed.height * window.devicePixelRatio);
                this.Application.stage.addChild(SwitchIcon);
                SwitchIcon.on('mousedown', () => {
                    this.Application.stage.removeChild(SwitchIcon);
                    this.Show = "true";
                })
            }
        }
    });
    Object.defineProperty(this, 'ModelName', {
        get: function () {
            return ModelName;
        },
        set: function (value) {
            ModelName = value;
            localStorage.setItem('current-live2d-model', value);
        }
    });
}

(async () => {
    console.log('Main Function Run ...');
    CreateCanvas();
    const app = new PIXI.Application({
        view: document.getElementById("canvas"),
        autoStart: true,
        transparent: true,
    });
    const CurrentHandler = new Handler();
    CurrentHandler.Application = app;
    if(!localStorage.getItem('current-live2d-model')){
        CurrentHandler.ModelName = Configs.DefaultModel;
    }
    else {
        CurrentHandler.ModelName = localStorage.getItem('current-live2d-model');
    }
    // disable live2d in mobile
    if (window.innerWidth < 768){
        CurrentHandler.Show = "false";
        localStorage.setItem('show-live2d', "false");
    }
    if(!localStorage.getItem('show-live2d')){
        CurrentHandler.Show = Configs.Show;
    }
    else {
        CurrentHandler.Show = localStorage.getItem('show-live2d');
    }
})();
