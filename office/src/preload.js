const { contextBridge, ipcRenderer } = require('electron')
const { readFileSync, writeFileSync, existsSync } = require("fs")
const sharp = require("sharp")
const ping = require('ping');
const ttsapi = require("google-tts-api")
const {marked} = require("marked")

console.log("preload ready");
contextBridge.exposeInMainWorld('ipc', {
    send: (channel, ...args) => ipcRenderer.send(channel, ...args),
    on: (channel, listener) => ipcRenderer.on(channel, listener)
})
contextBridge.exposeInMainWorld("fs", {
    readFileSync: (path, ...args) => readFileSync(__dirname + "/" + path, ...args).toString(),
    writeFileSync: (path, ...args) => writeFileSync(__dirname + "/" + path, ...args),
    existsSync: (path, ...args) => existsSync(__dirname + "/" + path, ...args)
})
contextBridge.exposeInMainWorld("sharp", {
    crop: (dirname, parameter) => {
        return sharp(__dirname + "/" + dirname).extract(parameter).toBuffer()
    }
})
contextBridge.exposeInMainWorld("ping", {
    probe: (ip, f = () => {}) => ping.promise.probe(ip).then(v => f(v))
})
contextBridge.exposeInMainWorld("ttsapi", {
    getAudioUrl: (text) => ttsapi.getAudioUrl(text, {
        lang: 'fr',
        slow: false,
        host: 'https://translate.google.com',
    })
})
contextBridge.exposeInMainWorld("md", {
    tohtml: (text) => marked.parse(text),
    toHTML: (text) => marked.parse(text),
    parse: (text) => marked.parse(text)
})