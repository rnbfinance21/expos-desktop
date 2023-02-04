import { app, BrowserWindow, ipcMain, Notification, shell } from "electron";
import {
  PosPrinter,
  PosPrintOptions,
  PosPrintData,
} from "electron-pos-printer";
import serve from "electron-serve";
import { OrderDetail } from "../renderer/services/OrderService";
import { createWindow } from "./helpers";
import Store from "electron-store";

const store = new Store();

const isProd: boolean = process.env.NODE_ENV === "production";
let mainWindow: BrowserWindow | null = null;

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

// Electron store
ipcMain.on("electron-store-get", async (event, val) => {
  event.returnValue = store.get(val);
});
ipcMain.on("electron-store-set", async (event, key, val) => {
  store.set(key, val);
});
ipcMain.on("electron-store-remove", async (event, key) => {
  store.delete(key);
});

ipcMain.on("test", async (event) => {
  console.log("Pong");
});

ipcMain.on("printer-list", async (event) => {
  const printers = await mainWindow?.webContents.getPrintersAsync();
  event.returnValue = printers;
});

ipcMain.on("print-order", async (e, data: OrderDetail) => {
  const options: PosPrintOptions = {
    silent: true,
    printerName: "DAPUR",
    preview: false,
    boolean: false,
    copies: 1,
    collate: true,
    margin: "0 0 0 0",
    timeOutPerLine: 400,
    margins: {
      top: 5,
      left: 10,
      right: 10,
      bottom: 5,
    },
  };

  const printData: PosPrintData[] = [
    {
      type: "text",
      value: "Pesanan Masuk",
      style: {
        fontWeight: "700",
        fontSize: "16px",
        textAlign: "center",
        marginBottom: "10px",
      },
    },
    {
      type: "text",
      value: `<div style='display: flex; flex-direction: row;'>
                <div style='width: 70px;'>No</div>
                <div style='flex: 1'>
                  : ${data.kode_transaksi}
                </div>
              </div>`,
      fontsize: 20,
      style: {
        textAlign: "left",
      },
    },
    {
      type: "text",
      value: `<div style='display: flex; flex-direction: row;'>
                <div style='width: 70px;'>Nama</div>
                <div style='flex: 1'>
                  : ${data.name}
                </div>
              </div>`,
      fontsize: 20,
      style: {
        textAlign: "left",
      },
    },
    {
      type: "text",
      value: `<div style='display: flex; flex-direction: row;'>
                <div style='width: 70px;'>Table</div>
                <div style='flex: 1'>
                  : ${data.table}
                </div>
              </div>`,
      fontsize: 20,
      style: {
        textAlign: "left",
      },
    },
    {
      type: "text",
      value: `<div style='display: flex; flex-direction: row;'>
                <div style='width: 70px;'>Tanggal</div>
                <div style='flex: 1'>
                  : ${data.date}
                </div>
              </div>`,
      fontsize: 20,
      style: {
        textAlign: "left",
        paddingBottom: "10px",
        borderBottom: "1px dashed black",
      },
    },
  ];

  data.details.forEach((element) => {
    let variants = "";

    element.variants.forEach((v) => {
      variants += `<div>
        <span>- &nbsp;&nbsp;&nbsp; ${v.variant_name}: ${v.option_name}</span>
      </div>`;
    });

    printData.push({
      type: "text",
      value: `
        <div style='display: flex; flex-direction: column;'>
          <div style='display: flex; flex-direction: row'>
            <div style='flex: 1; text-align: left'>
              <span>${element.menu.name}</span>
            </div>
            <div style='flex: 1; text-align: right'>
              (${element.qty})
            </div>
          </div>
          ${variants}
          ${
            element.description !== null
              ? `
            <div style='display: flex; flex-direction: col;'>
              <div style='flex: 1;text-align: left'>
                <span>Catatan:</span>
              </div>
              <div style='text-align: left'>
                ${element.description}
              </div>
            </div>
          `
              : ""
          }
        </div>`,
      fontsize: 20,
      style: {
        // fontWeight: '400',
        marginTop: "5px",
        marginBottom: "5px",
        borderBottom: "1px dashed black",
        paddingTop: "5px",
        paddingBottom: "5px",
      },
    });
  });

  PosPrinter.print(printData, options)
    .then(() => {
      console.log("success");
    })
    .catch((error: any) => {
      console.error(error);
    });
});

// (async () => {
//   await app.whenReady();

// })();

const create = async () => {
  mainWindow = createWindow("main", {
    show: false,
    width: 1280,
    height: 1024,
    minWidth: 1280,
    minHeight: 768,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.on("ready-to-show", () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.webContents.session.on(
    "will-download",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (event, item, _webContents) => {
      item.once("done", (_, state) => {
        if (state === "completed") {
          // console.log('Download successfully');
          // console.log(item.getSavePath());
          shell.showItemInFolder(item.getSavePath());
          new Notification({
            title: "Pemberitahuan",
            body: "Download excel berhasil",
          });
        } else {
          console.log(`Download failed: ${state}`);
          new Notification({
            title: "Pemberitahuan",
            body: "Download excel gagal",
          });
        }
      });
    }
  );

  if (isProd) {
    await mainWindow.loadURL("app://./login.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/login`);
    mainWindow.webContents.openDevTools();
  }
};

app.on("window-all-closed", () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    create();
    app.on("activate", () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) create();
    });
  })
  .catch(console.log);
