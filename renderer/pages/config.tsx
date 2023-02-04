import React, { useEffect, useState } from "react";
import DefaultLayout from "../layouts/DefaultLayout";
import Select from "react-select";
import electron, { PrinterInfo } from "electron";
import { ucwords } from "../utils/string";
import { Button } from "../components/globals/buttons";
import Toast from "../utils/toast";
import { TextInput } from "../components/globals/forms";

const config = () => {
  const ipcRenderer = electron.ipcRenderer || false;

  const [printers, setPrinters] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  const [printCashier, setPrintCashier] = useState<string>("");
  const [printCashierCopies, setPrintCashierCopies] = useState<string>("1");

  const [printKitchen, setPrintKitchen] = useState<string>("");
  const [printKitchenCopies, setPrintKitchenCopies] = useState<string>("1");

  const _onSavePrinterCashier = () => {
    if (ipcRenderer) {
      ipcRenderer.send("electron-store-set", "printer-cashier", printCashier);
      ipcRenderer.send(
        "electron-store-set",
        "printer-cashier-copies",
        printCashierCopies
      );

      Toast.fire("Berhasil", "Konfigruasi Printer Kasir Berhasil", "success");
    }
  };

  const _onSavePrinterKitchen = () => {
    if (ipcRenderer) {
      ipcRenderer.send("electron-store-set", "printer-kitchen", printKitchen);
      ipcRenderer.send(
        "electron-store-set",
        "printer-kitchen-copies",
        printKitchenCopies
      );

      Toast.fire("Berhasil", "Konfigruasi Printer Dapur Berhasil", "success");
    }
  };

  useEffect(() => {
    if (ipcRenderer) {
      let getPrinters: PrinterInfo[] = ipcRenderer.sendSync("printer-list");

      setPrinters(
        getPrinters.map((print) => {
          return {
            label: ucwords(print.displayName),
            value: print.name,
          };
        })
      );

      setPrintCashier(
        ipcRenderer.sendSync("electron-store-get", "printer-cashier")
      );
      setPrintCashierCopies(
        ipcRenderer.sendSync("electron-store-get", "printer-cashier-copies")
      );

      setPrintKitchen(
        ipcRenderer.sendSync("electron-store-get", "printer-kitchen")
      );
      setPrintKitchenCopies(
        ipcRenderer.sendSync("electron-store-get", "printer-kitchen-copies")
      );
    }
  }, [ipcRenderer]);

  return (
    <DefaultLayout title="Pengaturan">
      <div className="flex-grow w-full flex flex-col p-4">
        <div className="flex flex-col">
          <div className="flex flex-row mb-4">
            <div className="px-4">
              <span className="text-sm font-medium">Printer Kasir</span>
              <div className="flex flex-row gap-4 mt-4">
                <Select
                  id="selectCashier"
                  placeholder="Pilih Printer"
                  options={printers}
                  onChange={(e) => {
                    if (e !== null) {
                      setPrintCashier(e.value);
                    }
                  }}
                  value={
                    printers.filter((e) => e.value === printCashier).length > 0
                      ? printers.filter((e) => e.value === printCashier)[0]
                      : null
                  }
                  className="w-[300px]"
                />
              </div>
            </div>
            <div className="px-4 items-end">
              <span className="text-sm font-medium">Copies</span>
              <div className="flex flex-row gap-4 mt-3">
                <TextInput
                  id="cashier"
                  name="cashier"
                  type="text"
                  value={printCashierCopies}
                  onChange={(e) => setPrintCashierCopies(e.currentTarget.value)}
                  className="w-10"
                />
              </div>
            </div>
            <div className="flex flex-row gap-4 items-end">
              <Button type="button">Test Printer</Button>
              <Button type="button" onClick={_onSavePrinterCashier}>
                Simpan
              </Button>
            </div>
          </div>
          <form className="flex flex-row">
            <div className="px-4">
              <span className="text-sm font-medium">Printer Dapur</span>
              <div className="flex flex-row gap-4 mt-4">
                <Select
                  id="selectKitchen"
                  placeholder="Pilih Printer"
                  options={printers}
                  onChange={(e) => {
                    if (e !== null) {
                      setPrintKitchen(e.value);
                    }
                  }}
                  value={
                    printers.filter((e) => e.value === printKitchen).length > 0
                      ? printers.filter((e) => e.value === printKitchen)[0]
                      : null
                  }
                  className="w-[300px]"
                />
              </div>
            </div>
            <div className="px-4 items-end">
              <span className="text-sm font-medium">Copies</span>
              <div className="flex flex-row gap-4 mt-3">
                <TextInput
                  id="kitchen"
                  name="kitchen"
                  type="text"
                  value={printKitchenCopies}
                  onChange={(e) => setPrintKitchenCopies(e.currentTarget.value)}
                  className="w-10"
                />
              </div>
            </div>
            <div className="flex flex-row gap-4 items-end">
              <Button type="button">Test Printer</Button>
              <Button type="button" onClick={_onSavePrinterKitchen}>
                Simpan
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default config;
