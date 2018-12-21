#!/usr/bin/env node
(async () => {
    const { prompt } = require('enquirer');
    const question = [
      { 
        type: 'input', 
        name: 'url', 
        message: 'Enter LoopBack url:',
        default: 'http://127.0.0.1:3000',
      },
      {
        type: 'select',
        name: 'minify',
        message: 'Generate minify version too?',
        initial: 0,
        choices: [
          { name: 'Yes',   message: 'Yes'},
          { name: "No", message: "No, I don't need It" }
        ]
      },
      { 
        type: 'input', 
        name: 'filename', 
        message: 'Api class file name?',
        default: 'api',
      },
      { 
        type: 'input', 
        name: 'path', 
        message: 'Enter output path to save generated file?',
        default: './',
        hint: 'genererate here :)'
      },
    ];
     
    let {url, minify, filename, path} = await prompt(question);
    const V1Generator = require('./lib/gen-v1')
    let generator = new V1Generator(url, minify, filename, path)
})()
