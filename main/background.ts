import { app, BrowserWindow, ipcMain, Notification, shell } from "electron";
import {
  PosPrinter,
  PosPrintOptions,
  PosPrintData,
} from "electron-pos-printer";
import serve from "electron-serve";
import { OrderDetail } from "../renderer/services/OrderService";
import { createWindow, PrinterService } from "./helpers";
import Store from "electron-store";
import Toast from "../renderer/utils/toast";
import { InfoOutlet } from "./helpers/printers";
import { setup as setupPushReceiver } from "electron-push-receiver";
import sound from "sound-play";
import path from "path";

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

ipcMain.on("print-order", async (e, data: OrderDetail, print = 2) => {
  let sizeType = store.get("printer-kitchen-size") as string;

  const options: PosPrintOptions = {
    silent: true,
    printerName: store.get("printer-kitchen") as string,
    preview: false,
    boolean: false,
    copies: 1,
    collate: true,
    width: "260px",
    pageSize:
      sizeType === "1"
        ? {
            width: 273,
            height: 100,
          }
        : "80mm",
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
        fontSize: "14px",
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
        fontSize: "14px",
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
        fontSize: "14px",
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
        fontSize: "14px",
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
              (${element.qty}) <span>${element.menu.name}</span>
            </div>
          </div>
          ${variants}
          ${
            element.description !== null
              ? `
              <div style='text-align: left'>
                <span>Catatan:</span>
              </div>
              <div style='text-align: left'>
                ${element.description}
              </div>`
              : ""
          }
        </div>`,
      fontsize: 20,
      style: {
        // fontWeight: '400',
        fontSize: "14px",
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
      Toast.fire("Berhasil", "Pesanan berhasil di cetak ke dapur", "success");
      console.log("success");
    })
    .catch((error: any) => {
      console.error(error);
    });
});

ipcMain.on(
  "print-order-additional",
  async (e, data: OrderDetail, print = 2) => {
    let sizeType = store.get("printer-kitchen-size") as string;

    const options: PosPrintOptions = {
      silent: true,
      printerName: store.get("printer-kitchen") as string,
      preview: false,
      boolean: false,
      copies: 1,
      collate: true,
      pageSize:
        sizeType === "1"
          ? {
              width: 273,
              height: 100,
            }
          : "80mm",
      width: "260px",
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
        value: "Pesanan Tambahan",
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
          fontSize: "14px",
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
          fontSize: "14px",
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
          fontSize: "14px",
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
          fontSize: "14px",
          paddingBottom: "10px",
          borderBottom: "1px dashed black",
        },
      },
    ];

    data.details
      .filter((e) => e.type === 1)
      .forEach((element) => {
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
              (${element.qty}) <span>${element.menu.name}</span>
            </div>
          </div>
          ${variants}
          ${
            element.description !== null
              ? `
              <div style='flex: 1;text-align: left'>
                <span>Catatan:</span>
              </div>
              <div style='text-align: left'>
                ${element.description}
              </div>
          `
              : ""
          }
        </div>`,
          fontsize: 20,
          style: {
            fontSize: "14px",
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
        Toast.fire("Berhasil", "Pesanan berhasil di cetak ke dapur", "success");
        console.log("success");
      })
      .catch((error: any) => {
        console.error(error);
      });
  }
);

ipcMain.on("print-bill", async (e, outlet: InfoOutlet, data: OrderDetail) => {
  let sizeType = store.get("printer-cashier-size") as string;

  const options: PosPrintOptions = {
    silent: true,
    printerName: store.get("printer-cashier") as string,
    preview: false,
    boolean: false,
    copies: 1,
    collate: true,
    pageSize:
      sizeType === "1"
        ? {
            width: 273,
            height: 100,
          }
        : "80mm",
    width: "260px",
    margin: "5 30 5 20",
    timeOutPerLine: 400,
    // margins: {
    //   top: 5,
    //   left: 50,
    //   right: 50,
    //   bottom: 5,
    // },
  };

  const printData: PosPrintData[] = PrinterService.cetakBill(outlet, data);

  PosPrinter.print(printData, options)
    .then(() => {
      Toast.fire("Berhasil", "Pesanan berhasil di cetak ke dapur", "success");
      console.log("success");
    })
    .catch((error: any) => {
      console.error(error);
    });
});

ipcMain.on(
  "print-account",
  async (
    e,
    info: {
      name: string;
      username: string;
      password: string;
    }
  ) => {
    let sizeType = store.get("printer-cashier-size") as string;

    const options: PosPrintOptions = {
      silent: true,
      printerName: store.get("printer-cashier") as string,
      preview: false,
      boolean: false,
      copies: 1,
      collate: true,
      width: "260px",
      pageSize:
        sizeType === "1"
          ? {
              width: 273,
              height: 100,
            }
          : "80mm",
      margin: "5 30 5 20",
      timeOutPerLine: 400,
    };

    const printData: PosPrintData[] = [
      {
        type: "text",
        value: "Akun Customer",
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
              <div style='width: 70px;'>Nama</div>
              <div style='flex: 1'>
                : ${info.name}
              </div>
            </div>`,
        fontsize: 20,
        style: {
          textAlign: "left",
          fontSize: "14px",
        },
      },
      {
        type: "text",
        value: `<div style='display: flex; flex-direction: row;'>
              <div style='width: 70px;'>Username</div>
              <div style='flex: 1'>
                : ${info.username}
              </div>
            </div>`,
        fontsize: 20,
        style: {
          textAlign: "left",
          fontSize: "14px",
        },
      },
      {
        type: "text",
        value: `<div style='display: flex; flex-direction: row;'>
              <div style='width: 70px;'>Password</div>
              <div style='flex: 1'>
                : ${info.password}
              </div>
            </div>`,
        fontsize: 20,
        style: {
          textAlign: "left",
          fontSize: "14px",
        },
      },
    ];

    PosPrinter.print(printData, options)
      .then(() => {
        Toast.fire("Berhasil", "Akun berhasil dicetak", "success");
        console.log("success");
      })
      .catch((error: any) => {
        console.error(error);
      });
  }
);

ipcMain.on("print-testing", async (e, name: string, sizeType = 1) => {
  const options: PosPrintOptions = {
    silent: true,
    printerName: name,
    preview: false,
    boolean: false,
    copies: 1,
    collate: true,
    pageSize:
      sizeType === 1
        ? {
            width: 273,
            height: 100,
          }
        : "80mm",
    width: "260px",
    margin: "5 30 5 20",
    timeOutPerLine: 400,
  };

  const printData: PosPrintData[] = [
    {
      type: "text",
      value: "Hanya testing",
      style: {
        fontWeight: "700",
        fontSize: "16px",
        textAlign: "center",
        marginBottom: "10px",
      },
    },
  ];

  PosPrinter.print(printData, options)
    .then(() => {
      Toast.fire("Berhasil", "Akun berhasil dicetak", "success");
      console.log("success");
    })
    .catch((error: any) => {
      console.error(error);
    });
});

ipcMain.on(
  "print-reprint",
  async (e, outlet: InfoOutlet, data: OrderDetail, type = 2) => {
    const options: PosPrintOptions = {
      silent: true,
      printerName: store.get("printer-cashier") as string,
      preview: false,
      boolean: false,
      copies: 1,
      collate: true,
      pageSize: {
        width: 273,
        height: 100,
      },
      width: "260px",
      margin: "0 0 0 0",
      timeOutPerLine: 400,
      margins: {
        top: 5,
        left: 10,
        right: 10,
        bottom: 5,
      },
    };

    const printData: PosPrintData[] = PrinterService.cetakStruk(
      outlet,
      data,
      type
    );

    PosPrinter.print(printData, options)
      .then(() => {
        Toast.fire("Berhasil", "Pesanan berhasil di cetak ke dapur", "success");
        console.log("success");
      })
      .catch((error: any) => {
        console.error(error);
      });
  }
);

ipcMain.on(
  "print-simulate",
  async (e, outlet: InfoOutlet, data: OrderDetail) => {
    const options: PosPrintOptions = {
      silent: true,
      printerName: store.get("printer-cashier") as string,
      preview: false,
      boolean: false,
      copies: 1,
      collate: true,
      pageSize: {
        width: 273,
        height: 100,
      },
      width: "260px",
      margin: "0 0 0 0",
      timeOutPerLine: 400,
      margins: {
        top: 5,
        left: 10,
        right: 10,
        bottom: 5,
      },
    };

    const printData: PosPrintData[] = PrinterService.simulateStruk(
      outlet,
      data
    );

    PosPrinter.print(printData, options)
      .then(() => {
        Toast.fire("Berhasil", "Pesanan berhasil di cetak ke dapur", "success");
        console.log("success");
      })
      .catch((error: any) => {
        console.error(error);
      });
  }
);

ipcMain.on("play-sound", async () => {
  let pathFile = path.join(__dirname, "my_sound.mp3");
  sound.play(pathFile);
});
(async () => {
  await app.whenReady();

  mainWindow = createWindow("main", {
    width: 1280,
    height: 1024,
    minWidth: 1280,
    minHeight: 600,
    title: "EXPOS",
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

  setupPushReceiver(mainWindow.webContents);
})();

// const create = async () => {
//   // mainWindow = createWindow("main", {
//   //   show: false,
//   //   width: 1280,
//   //   height: 1024,
//   //   minWidth: 1280,
//   //   minHeight: 768,
//   //   webPreferences: {
//   //     nodeIntegration: true,
//   //   },
//   // });
//   mainWindow = new BrowserWindow({
//     title: "Expos",
//     center: true,
//     width: 1280,
//     height: 768,
//     minHeight: 768,
//     minWidth: 1280,
//     webPreferences: {
//       plugins: true,
//       nodeIntegration: true,
//       contextIsolation: false,
//       webSecurity: false,
//       allowRunningInsecureContent: true,
//     },
//   });

//   // ipcMain.on(NOtif)

//   // setup(mainWindow.webContents);

//   mainWindow.on("ready-to-show", () => {
//     if (!mainWindow) {
//       throw new Error('"mainWindow" is not defined');
//     }
//     if (process.env.START_MINIMIZED) {
//       mainWindow.minimize();
//     } else {
//       mainWindow.show();
//     }
//   });

//   mainWindow.on("closed", () => {
//     mainWindow = null;
//   });

//   mainWindow.webContents.session.on(
//     "will-download",
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     (event, item, _webContents) => {
//       item.once("done", (_, state) => {
//         if (state === "completed") {
//           // console.log('Download successfully');
//           // console.log(item.getSavePath());
//           shell.showItemInFolder(item.getSavePath());
//           new Notification({
//             title: "Pemberitahuan",
//             body: "Download excel berhasil",
//           });
//         } else {
//           console.log(`Download failed: ${state}`);
//           new Notification({
//             title: "Pemberitahuan",
//             body: "Download excel gagal",
//           });
//         }
//       });
//     }
//   );

//   if (isProd) {
//     await mainWindow.loadURL("app://./login.html");
//   } else {
//     const port = process.argv[2];
//     await mainWindow.loadURL(`http://localhost:${port}/login`);
//     mainWindow.webContents.openDevTools();
//   }

//   setupPushReceiver(mainWindow.webContents);
// };

app.commandLine.appendSwitch("ignore-certificate-errors");

app.on("window-all-closed", () => {
  app.quit();
});

// app.on("window-all-closed", () => {
//   // Respect the OSX convention of having the application in memory even
//   // after all windows have been closed
//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });

// app
//   .whenReady()
//   .then(() => {
//     create();
//     app.on("activate", () => {
//       // On macOS it's common to re-create a window in the app when the
//       // dock icon is clicked and there are no other windows open.
//       if (mainWindow === null) create();
//     });
//   })
//   .catch(console.log);
