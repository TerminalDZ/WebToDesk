// WebToDesk v2.0.0
// Idriss Boukmouche
// boukemoucheidriss@gamil.com

const { ipcMain } = require("electron");

module.exports = [
  {
    label: "WebToDesk",
    submenu: [
      {
        label: "Home",
        click: () => {
          require("./main")("home");
        },
      },
      {
        label: "About",
        click: () => {
          require("./main")("about");
        },
      },
      { role: "quit" },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { type: "separator" },
      { label: "Print", click: printPage },
    ],
  },
  {
    label: "View",
    submenu: [{ role: "reload" }, { role: "zoomIn" }, { role: "zoomOut" }],
  },
];

// Print page method
function printPage() {
  ipcMain.emit("printPage");
}
