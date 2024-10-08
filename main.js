// WebToDesk v2.0.0
// Idriss Boukmouche
// boukemoucheidriss@gamil.com

const {
  app,
  BrowserWindow,
  nativeTheme,
  ipcMain,
  Menu,
  dialog,
} = require("electron");
const path = require("path");
const MainMenuapp = require("./menu-config");
const RightMenuapp = require("./right-menu-config");
const PrintOptions = require("./right-menu-config");
const appConfig = require("./config");

let mainWindow;

// Menu
let mainMenu = Menu.buildFromTemplate(MainMenuapp);

let rightMenu = Menu.buildFromTemplate(RightMenuapp);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: appConfig["width"],
    height: appConfig["height"],
    minWidth: appConfig["minWidth"],
    minHeight: appConfig["minHeight"],
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  //Load Appliaction Main Menu
  Menu.setApplicationMenu(mainMenu);

  //Load Right click menu
  mainWindow.webContents.on("context-menu", (e) => {
    rightMenu.popup(mainWindow);
  });

  //CreatWindow execute loding remote content
  loadWebContent();
}

function loadWebContent() {
  //Loading spalsh screen
  mainWindow.loadFile(path.join(__dirname, "public/loading.html"));

  //create webContants
  let wc = mainWindow.webContents;

  //suessfull loding page afer dom created
  wc.once("did-finish-load", () => {
    mainWindow.loadURL(appConfig["websiteUrl"]);
  });

  // if not loading page redirect error page
  wc.on("did-fail-provisional-load", (error, code) => {
    mainWindow.loadFile(path.join(__dirname, "public/offline.html"));
  });
}

// Check website loading error (offline, page not found or etc.)
ipcMain.on("online-status-changed", (event, status) => {
  if (status == true) {
    loadWebContent();
  }
});

// Print page option
ipcMain.on("printPage", () => {
  var options = PrintOptions;

  let win = BrowserWindow.getFocusedWindow();

  win.webContents.print(options, (success, failureReason) => {
    if (!success)
      dialog.showMessageBox(mainWindow, {
        message: failureReason.charAt(0).toUpperCase() + failureReason.slice(1),
        type: "error",
        buttons: ["Cancel"],
        defaultId: 0,
        title: "Print Error",
      });
  });
});

//Load menuItem local pages (About, Home page, etc)
module.exports = (pageId) => {
  if (pageId === "home") {
    loadWebContent();
  } else {
    mainWindow.loadFile(path.join(__dirname, `public/${pageId}.html`));
  }
};

app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
