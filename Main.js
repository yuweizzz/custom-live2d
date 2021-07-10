import * as PIXI from 'pixi.js';
import {
	Ticker
}
from '@pixi/ticker';
import {
	Live2DModel
}
from 'pixi-live2d-display/lib/cubism4';

Live2DModel.registerTicker(Ticker);

import {
	ModelSwitchIcon,
	ShowSwitchIcon,
	ModelList,
	DefaultModel,
	DefaultShow
}
from './Resources.js';

function CreateCanvas () {
	var DivNode = document.createElement("div");
	var CanvasNode = document.createElement("canvas");
	CanvasNode.id = "canvas";
	CanvasNode.style.left = "0";
	CanvasNode.style.bottom = "0";
	CanvasNode.style.position = "fixed";
	document.body.appendChild(CanvasNode);
	console.log('Init Canvas ...');
}

async function LoadModel (Name) {
    const fullpath = 
        document.location.protocol + "//" + document.location.host + Name.path
    const model = await Live2DModel.from(fullpath);
    model.scale.set(Name.scale);
    model.x = Name.x;
    model.y = Name.y;
    model.interactive = true;
    model.buttonMode = true;
    model.on('mousedown', () => {
        model.motion('Action');
    });
    return model;
}

function LoadIcon (conf) {
    const texture = new PIXI.Texture.from(conf.code);
    const result = new PIXI.Sprite(texture);
    result.interactive = true;
    result.buttonMode = true;
    result.x = conf.x;
    result.y = conf.y;
    result.scale.set(conf.scale);
    return result;
}

function GetNextModel (modelname) {
    var value = Object.keys(ModelList)
        .indexOf(modelname);
    value += 1;
    var index =
        value > Object.keys(ModelList)
        .length - 1 ? 0 : value;
    return Object.keys(ModelList)[index];
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
            if (value=="true"){
                const ModelSwitch = LoadIcon(ModelSwitchIcon);
                const ShowSwitch = LoadIcon(ShowSwitchIcon);
                this.Application.renderer.resize(330, 550);
                this.Application.stage.interactive = true;
                const defaultmodel = await LoadModel(ModelList[this.ModelName]);
                this.Application.stage.addChild(defaultmodel);
                this.Application.stage.addChild(ModelSwitch);
                ModelSwitch.on('mousedown', async () => {
                    this.ModelName = GetNextModel(this.ModelName)
                    this.Application.stage.removeChildAt(0);
                    const newmodel = await LoadModel(ModelList[this.ModelName]);
                    this.Application.stage.addChildAt(newmodel, 0);
                })
                this.Application.stage.addChild(ShowSwitch);
                ShowSwitch.on('mousedown', () => {
                    this.Application.stage.removeChildAt(0);
                    this.Application.stage.removeChild(ModelSwitch);
                    this.Application.stage.removeChild(ShowSwitch);
                    this.Show = "false";
                })
                this.Application.stage.on("mouseover",() => {
                    ModelSwitch.alpha = 1;
                    ShowSwitch.alpha = 1;
                })
                this.Application.stage.on("mouseout",() => {
                    ModelSwitch.alpha = 0;
                    ShowSwitch.alpha = 0;
                })
            }
            else {
                const ModelSwitch = LoadIcon(ModelSwitchIcon);
                this.Application.renderer.resize(45, 40);
                ModelSwitch.y = 0;
                ModelSwitch.x = 5;
                this.Application.stage.addChild(ModelSwitch);
                ModelSwitch.on('mousedown', () => {
                    this.Application.stage.removeChild(ModelSwitch);
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
        view:document.getElementById("canvas"),
        autoStart: true,
        transparent: true,
    });
    const CurrentHandler = new Handler();
    CurrentHandler.Application = app;
    if(!localStorage.getItem('current-live2d-model')){
        CurrentHandler.ModelName = DefaultModel;
    }
    else {
        CurrentHandler.ModelName = localStorage.getItem('current-live2d-model');
    }
    if(!localStorage.getItem('show-live2d')){
        CurrentHandler.Show = DefaultShow;
    }
    else {
        CurrentHandler.Show = localStorage.getItem('show-live2d');
    }
})();
