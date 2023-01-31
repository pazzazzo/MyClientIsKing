const { app, BrowserWindow, ipcMain, Tray, Menu, remote, Notification, session, ipcRenderer, nativeImage } = require('electron');
const path = require('path');
const url = require('url');
const os = require('os');
const fs = require("fs")
const net = require('net')
const hash = require("object-hash")
const ds = require("dualshock")
const RPC = require('discord-rpc');
const package = require("./package.json")
const colors = require("colors");
let inDev = (process.argv.indexOf("--dev") > -1)
let clientPath = path.join(process.env.HOME, "AppData", "Local", "LifeInPixelClient", "LifeInPixelClient.exe")

let mainWindow;
const GameObjects = {}

console.log('-- Applications Developed by pazzazzo\n'.green);
if (inDev) {
    console.log("-- This application is started with --dev argument!".yellow);
}

// const RPC = require('discord-rpc');
const browser = typeof window !== 'undefined';



function createWindow() {
    mainWindow = new BrowserWindow({
        title: "start...",
        width: 800,
        height: 600,
        center: true,
        icon: "./assets/icons/icon.png",
        show: false,
        webPreferences: {
            preload: __dirname + "/src/preload.js"
        }
    })
    mainWindow.menuBarVisible = false;
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "src", 'index.html'),
        protocol: 'file:',
        slashes: true
    }), { userAgent: `Electron ${package.name}/${package.version}` });


    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    mainWindow.webContents.on('new-window', function (e, url) {
        // make sure local urls stay in electron perimeter
        if ('file://' === url.substr(0, 'file://'.length)) {
            return;
        }

        // and open every other protocols on the browser
        e.preventDefault();
        require("electron").shell.openExternal(url);
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
        if (mainWindow && !mainWindow.isMinimized()) {
            mainWindow.maximize(true)
        }
    })
}

// app.setBadgeCount(8)
app.setAppUserModelId("MyClientIsKingServer")
app.on('ready', () => {
    createWindow()
    mainWindow.on('show', () => {
        mainWindow.focus();
        // mainWindow.webContents.executeJavaScript("drawBadge(2)").then(image => {
        //     mainWindow.setOverlayIcon(nativeImage.createFromDataURL(image), "notify")
        // })
    });
})

app.on("quit", () => {
})

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

process.on("uncaughtException", (e) => {
    console.log(e);
})