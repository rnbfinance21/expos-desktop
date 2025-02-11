import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Notification,
  shell,
} from "electron";
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
const { autoUpdater } = require("electron-updater");
import log from "electron-log";

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
//Basic flags
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

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
    pagesPerSheet: 1,
    collate: false,
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

  let checkHasFood =
    data.details.filter((e) => e.menu.type !== 2).length === 0 ? false : true;

  let checkHasDrink =
    data.details.filter((e) => e.menu.type === 2).length === 0 ? false : true;

  if (checkHasFood) {
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

    data.details
      .filter((e) => e.menu.type !== 2)
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
            ${
              element.type_order === 2
                ? "<span>Takeaway / dibungkus</span>"
                : ""
            }
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

    await PosPrinter.print(printData, options);
  }

  if (checkHasDrink) {
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

    data.details
      .filter((e) => e.menu.type === 2)
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
            ${
              element.type_order === 2
                ? "<span>Takeaway / dibungkus</span>"
                : ""
            }
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

    await PosPrinter.print(printData, options);
  }
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
      duplexMode: "simplex",
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

    let checkHasFood =
      data.details.filter((e) => e.menu.type !== 2 && e.type === 1).length === 0
        ? false
        : true;

    let checkHasDrink =
      data.details.filter((e) => e.menu.type === 2 && e.type === 1).length === 0
        ? false
        : true;

    if (checkHasFood) {
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

      data.details
        .filter((e) => e.menu.type !== 2 && e.type === 1)
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
            ${
              element.type_order === 2
                ? "<span>Takeaway / dibungkus</span>"
                : ""
            }
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

      await PosPrinter.print(printData, options);
    }

    if (checkHasDrink) {
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
        .filter((e) => e.menu.type === 2 && e.type === 1)
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
            ${
              element.type_order === 2
                ? "<span>Takeaway / dibungkus</span>"
                : ""
            }
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

      await PosPrinter.print(printData, options);
    }
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
    duplexMode: "simplex",
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

  await PosPrinter.print(printData, options);

  // PosPrinter.print(printData, options)
  //   .then(() => {
  //     Toast.fire("Berhasil", "Pesanan berhasil di cetak ke dapur", "success");
  //     console.log("success");
  //   })
  //   .catch((error: any) => {
  //     console.error(error);
  //   });
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

ipcMain.on("print-code", async (e, code = "", copies = 2) => {
  let sizeType = store.get("printer-cashier-size") as string;

  const options: PosPrintOptions = {
    silent: true,
    printerName: store.get("printer-cashier") as string,
    preview: false,
    boolean: false,
    copies,
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
      value: `Kode Outlet: ${code}`,
      style: {
        fontWeight: "700",
        fontSize: "20px",
        textAlign: "center",
        border: "1px solid black",
        padding: "2px 4px",
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

    await PosPrinter.print(printData, options);
    // PosPrinter.print(printData, options)
    //   .then(() => {
    //     Toast.fire("Berhasil", "Pesanan berhasil di cetak ke dapur", "success");
    //     console.log("success");
    //   })
    //   .catch((error: any) => {
    //     console.error(error);
    //   });
  }
);

ipcMain.on(
  "print-reprint-with-struk",
  async (e, outlet: InfoOutlet, data: OrderDetail, type = 2) => {
    let sizeType = store.get("printer-kitchen-size") as string;

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

    await PosPrinter.print(printData, options);

    // Prin order
    const options2: PosPrintOptions = {
      silent: true,
      printerName: store.get("printer-kitchen") as string,
      preview: false,
      boolean: false,
      copies: 1,
      pagesPerSheet: 1,
      collate: false,
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
    let checkHasFood =
      data.details.filter((e) => e.menu.type !== 2).length === 0 ? false : true;

    let checkHasDrink =
      data.details.filter((e) => e.menu.type === 2).length === 0 ? false : true;

    if (checkHasFood) {
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

      data.details
        .filter((e) => e.menu.type !== 2)
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
            ${
              element.type_order === 2
                ? "<span>Takeaway / dibungkus</span>"
                : ""
            }
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

      await PosPrinter.print(printData, options2);
    }

    if (checkHasDrink) {
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

      data.details
        .filter((e) => e.menu.type === 2)
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
            ${
              element.type_order === 2
                ? "<span>Takeaway / dibungkus</span>"
                : ""
            }
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

      await PosPrinter.print(printData, options2);
    }
  }
);

ipcMain.on(
  "print-simulate",
  async (e, outlet: InfoOutlet, data: OrderDetail) => {
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

    await PosPrinter.print(printData, options);
    // PosPrinter.print(printData, options)
    //   .then(() => {
    //     Toast.fire("Berhasil", "Pesanan berhasil di cetak ke dapur", "success");
    //     console.log("success");
    //   })
    //   .catch((error: any) => {
    //     console.error(error);
    //   });
  }
);

ipcMain.on("play-sound", async () => {
  let pathFile = path.join(__dirname, "my_sound.mp3");
  sound.play(pathFile);
});

ipcMain.on("get-app-version", async (e) => {
  e.returnValue = app.getVersion();
});

(async () => {
  await app.whenReady();

  mainWindow = createWindow("main", {
    width: 1024,
    height: 768,
    // minWidth: 1280,
    // minHeight: 600,
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

  // setupPushReceiver(mainWindow.webContents);
  // Periksa pembaruan saat aplikasi dimulai
  // const gitToken = process.env.GITLAB_PERSONAL_ACCESS_TOKEN;

  // const server =
  //     "https://gitlab.com/api/v4/projects/42994318/releases/permalink/latest/assets/links";
  autoUpdater.setFeedURL({
    provider: "github",
    owner: "rnbfinance21",
    repo: "expos-desktop",
    token: process.env.GH_TOKEN,
  });
  autoUpdater.checkForUpdatesAndNotify();
})();

app.commandLine.appendSwitch("ignore-certificate-errors");

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Ketika update tersedia
autoUpdater.on("update-available", (info) => {
  log.info(`Update tersedia: Versi ${info.version}`);
  dialog.showMessageBox({
    type: "info",
    title: "Update Tersedia",
    message: `Versi terbaru ${info.version} tersedia. Mengunduh pembaruan...`,
    buttons: ["OK"],
  });
});

// Ketika update tersedia
autoUpdater.on("update-available", (info) => {
  log.info(`Update tersedia: Versi ${info.version}`);

  log.info("Mulai mengunduh update...");
  autoUpdater.downloadUpdate();
//   dialog
//     .showMessageBox({
//       type: "info",
//       title: "Update Tersedia",
//       message: `Versi terbaru ${info.version} tersedia. Apakah ingin mengunduh sekarang?`,
//       buttons: ["Ya, Unduh", "Nanti"],
//       defaultId: 0,
//       cancelId: 1,
//     })
//     .then((result) => {
//       if (result.response === 0) {
//         log.info("Mulai mengunduh update...");
//         autoUpdater.downloadUpdate();
//       } else {
//         log.info("Pengguna menunda update.");
//       }
//     });
});

// Menampilkan progress download
autoUpdater.on("download-progress", (progress) => {
    console.log(`Mengunduh... ${progress.percent.toFixed(2)}%`);
//   log.info(`Mengunduh... ${progress.percent.toFixed(2)}%`);
});

// Jika update telah diunduh
autoUpdater.on("update-downloaded", (info) => {
  log.info(`Update versi ${info.version} sudah diunduh.`);

  dialog
    .showMessageBox({
      type: "question",
      title: "Update Siap",
      message: `Update ke versi ${info.version} sudah diunduh. Apakah ingin restart sekarang?`,
      buttons: ["Restart Sekarang", "Nanti"],
      defaultId: 0,
      cancelId: 1,
    })
    .then((result) => {
      if (result.response === 0) {
        log.info("Restarting aplikasi untuk update...");
        autoUpdater.quitAndInstall();
      } else {
        log.info("Pengguna memilih untuk mengupdate nanti.");
      }
    });
});

// Jika terjadi error
autoUpdater.on("error", (error) => {
  log.error("Error saat update:", error);
  dialog.showMessageBox({
    type: "error",
    title: "Update Gagal",
    message: `Terjadi kesalahan saat update: ${error.message}`,
    buttons: ["OK"],
  });
});

ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});
