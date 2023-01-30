import { app, BrowserWindow, ipcMain } from "electron";
import { PosPrinter, PosPrintOptions, PosPrintData } from "electron-pos-printer";
import serve from "electron-serve";
import { OrderDetail } from "../renderer/services/OrderService";
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

ipcMain.on("print-order", async (e, data: OrderDetail) => {
  const options: PosPrintOptions = {
    preview: false,
    margin: '0 0 0 0',
    copies: 1,
    printerName: 'DAPUR',
    timeOutPerLine: 400,
    pageSize: '80mm', // page size
    silent: true,
    boolean: false,
  }

  const printData: PosPrintData[] = [
    {
      type: 'text',
      value: `<div style='display: flex; flex-direction: row;'>
                <div style='width: 70px;'>No</div>
                <div style='flex: 1'>
                  : ${data.kode_transaksi}
                </div>
              </div>`,
      fontsize: 20,
      style: {
        textAlign: 'left',
      },
    },
    {
      type: 'text',
      value: `<div style='display: flex; flex-direction: row;'>
                <div style='width: 70px;'>Nama</div>
                <div style='flex: 1'>
                  : ${data.name}
                </div>
              </div>`,
      fontsize: 20,
      style: {
        textAlign: 'left',
      },
    },
    {
      type: 'text',
      value: `<div style='display: flex; flex-direction: row;'>
                <div style='width: 70px;'>Table</div>
                <div style='flex: 1'>
                  : ${data.table}
                </div>
              </div>`,
      fontsize: 20,
      style: {
        textAlign: 'left',
      },
    },
  ];

  PosPrinter.print(printData,options).then(() => {
    console.log('success');
  })
  .catch((error: any) => {
    console.error(error);
  });;
});

(async () => {
  await app.whenReady();

  mainWindow = createWindow("main", {
    width: 1280,
    height: 1024,
    minWidth: 1280,
    minHeight: 768,
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
