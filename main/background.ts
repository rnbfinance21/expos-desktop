import { app, BrowserWindow, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";

const isProd: boolean = process.env.NODE_ENV === "production";
let mainWindow: BrowserWindow | null = null;

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

ipcMain.on("test", async (event) => {
  console.log("Pong");
});

ipcMain.on("printer-list", async (event) => {
  const printers = await mainWindow?.webContents.getPrintersAsync();
  event.returnValue = printers;
});

(async () => {
  await app.whenReady();

  mainWindow = createWindow("main", {
    width: 1280,
    height: 1024,
    minWidth: 1280,
    minHeight: 1024,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (isProd) {
    await mainWindow.loadURL("app://./login.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/login`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});
