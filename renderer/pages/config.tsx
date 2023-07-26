import React, { useEffect, useState } from "react";
import DefaultLayout from "../layouts/DefaultLayout";
import Select from "react-select";
import electron, { PrinterInfo } from "electron";
import { ucwords } from "../utils/string";
import { Button } from "../components/globals/buttons";
import Toast from "../utils/toast";
import { TextInput } from "../components/globals/forms";
import { useAuth } from "../hooks/AuthContext";
import { useMutation } from "react-query";
import AuthService from "../services/AuthService";

const LIST_SIZE = [
  {
    label: "Custom 80mm",
    value: "1",
  },
  {
    label: "80mm",
    value: "2",
  },
];

const config = () => {
  const ipcRenderer = electron.ipcRenderer || false;
  const { accessCode, tableCount, token, refetch } = useAuth();

  const [printers, setPrinters] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  const [printCashier, setPrintCashier] = useState<string>("");
  const [printCashierSize, setPrintCashierSize] = useState<string>("1");
  const [printCashierCopies, setPrintCashierCopies] = useState<string>("1");

  const [printKitchen, setPrintKitchen] = useState<string>("");
  const [printKitchenSize, setPrintKitchenSize] = useState<string>("1");
  const [printKitchenCopies, setPrintKitchenCopies] = useState<string>("1");

  const _onSavePrinterCashier = () => {
    if (ipcRenderer) {
      ipcRenderer.send("electron-store-set", "printer-cashier", printCashier);
      ipcRenderer.send(
        "electron-store-set",
        "printer-cashier-copies",
        printCashierCopies
      );
      ipcRenderer.send(
        "electron-store-set",
        "printer-cashier-size",
        printCashierSize
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
      ipcRenderer.send(
        "electron-store-set",
        "printer-kitchen-size",
        printKitchenSize
      );

      Toast.fire("Berhasil", "Konfigruasi Printer Dapur Berhasil", "success");
    }
  };

  const _onPressTest = (type = 1) => {
    if (ipcRenderer) {
      if (type === 1) {
        if (printCashier !== "" && printCashierSize !== "") {
          ipcRenderer.send(
            "print-testing",
            printCashier,
            parseInt(printCashierSize, 10)
          );
        }
      } else if (type === 2) {
        if (printKitchen !== "" && printKitchenSize !== "") {
          ipcRenderer.send(
            "print-testing",
            printKitchen,
            parseInt(printKitchenSize, 10)
          );
        }
      }
    }
  };

  const _onPrintCode = () => {
    if (ipcRenderer) {
      ipcRenderer.send("print-code", accessCode, tableCount);
    }
  };

  const mutation = useMutation(() => AuthService.regenerateCode(token), {
    onSuccess: () => {
      refetch();
      Toast.fire("Berhasil", "Kode berhasil diperbaharui", "success");
    },
  });

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
      setPrintCashierSize(
        ipcRenderer.sendSync("electron-store-get", "printer-cashier-size")
      );

      setPrintKitchen(
        ipcRenderer.sendSync("electron-store-get", "printer-kitchen")
      );
      setPrintKitchenCopies(
        ipcRenderer.sendSync("electron-store-get", "printer-kitchen-copies")
      );
      setPrintKitchenSize(
        ipcRenderer.sendSync("electron-store-get", "printer-kitchen-size")
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
            <div className="px-4">
              <span className="text-sm font-medium">Ukuran Kertas</span>
              <div className="flex flex-row gap-4 mt-4">
                <Select
                  id="selectCashierSize"
                  placeholder="Pilih Ukuran"
                  options={LIST_SIZE}
                  onChange={(e) => {
                    if (e !== null) {
                      setPrintCashierSize(e.value);
                    }
                  }}
                  value={
                    LIST_SIZE.filter((e) => e.value === printCashierSize)
                      .length > 0
                      ? LIST_SIZE.filter((e) => e.value === printCashierSize)[0]
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
              <Button type="button" onClick={() => _onPressTest(1)}>
                Test Printer
              </Button>
              <Button type="button" onClick={_onSavePrinterCashier}>
                Simpan
              </Button>
            </div>
          </div>
          <form className="flex flex-row mb-4">
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
            <div className="px-4">
              <span className="text-sm font-medium">Ukuran Kertas</span>
              <div className="flex flex-row gap-4 mt-4">
                <Select
                  id="selectKitchenSize"
                  placeholder="Pilih Ukuran"
                  options={LIST_SIZE}
                  onChange={(e) => {
                    if (e !== null) {
                      setPrintKitchenSize(e.value);
                    }
                  }}
                  value={
                    LIST_SIZE.filter((e) => e.value === printKitchenSize)
                      .length > 0
                      ? LIST_SIZE.filter((e) => e.value === printKitchenSize)[0]
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
              <Button type="button" onClick={() => _onPressTest(2)}>
                Test Printer
              </Button>
              <Button type="button" onClick={_onSavePrinterKitchen}>
                Simpan
              </Button>
            </div>
          </form>
        </div>
        <div className="flex flex-row px-4 gap-4">
          <TextInput type="text" readOnly value={accessCode} className="mr-4" />
          <Button type="button" onClick={() => mutation.mutate()}>
            Ganti Kode
          </Button>
          <Button type="button" onClick={() => _onPrintCode()}>
            Cetak Kode
          </Button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default config;
