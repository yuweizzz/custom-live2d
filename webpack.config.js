const webpack = require('webpack');
const path = require('path');

const config = {
    entry: ['./Main.js','./Resources.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'CustomLive2D.js'
    }
};

module.exports = config;
