import { PosPrintData } from "electron-pos-printer";
import { OrderDetail } from "../../renderer/services/OrderService";

export type InfoOutlet = {
    name: string;
    kasir: string;
    address: string;
    instagram: string;
    tax: number;
    contact: string;
};

const numberFormat = (number: number, fixed = 2) => {
    const value = Math.abs(number);

    const currency = value
        .toFixed(fixed)
        .replace(".", ",")
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

    return currency;
};

const cetakBill = (outlet: InfoOutlet, order: OrderDetail): PosPrintData[] => {
    let data: PosPrintData[] = [
        {
            type: "text",
            value: outlet.name,
            style: {
                fontWeight: "700",
                fontSize: "18px",
                textAlign: "center",
            },
        },
        {
            type: "text",
            value: outlet.address,
            fontsize: 20,
            style: {
                fontWeight: "400",
                fontSize: "12px",
                textAlign: "center",
                marginBottom: "5px",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                <div style='width: 70px;'>No</div>
                <div style='flex: 1'>
                  : ${order.kode_transaksi}
                </div>
              </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                <div style='width: 70px;'>Bon</div>
                <div style='flex: 1'>
                  : ${order.no_bill === null ? "-" : order.no_bill}
                </div>
              </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        // {
        //   type: "text",
        //   value: `<div style='display: flex; flex-direction: row;'>
        //             <div style='width: 70px;'>Kasir</div>
        //             <div style='flex: 1'>
        //               : Kasir Lengkong
        //             </div>
        //           </div>`,
        //   fontsize: 20,
        //   style: {
        //     // fontWeight: '400',
        //     textAlign: "left",
        //   },
        // },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                <div style='width: 70px;'>Meja</div>
                <div style='flex: 1'>
                  : ${order.table}
                </div>
              </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
              <div style='width: 70px;'>Nama</div>
              <div style='flex: 1'>
                : ${order.name}
              </div>
            </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        // {
        //     type: "text",
        //     value: `<div style='display: flex; flex-direction: row; item'>
        //         <div style='width: 70px;'>Status</div>
        //         <div style='flex: 1'>
        //           : Belum Lunas
        //         </div>
        //       </div>`,
        //     fontsize: 30,
        //     style: {
        //         // fontWeight: '400',
        //         textAlign: "left",
        //         borderTop: "1px dashed black",
        //         borderBottom: "1px dashed black"
        //     },
        // },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row; align-items: center; justify-items: center;'>
                <span style='font-size: 30px;'>BELUM LUNAS</span>
              </div>`,
            fontsize: 30,
            style: {
                // fontWeight: '400',
                textAlign: "left",
                borderTop: "1px dashed black",
                borderBottom: "1px dashed black",
            },
        },
        {
            type: "text",
            value: order.date,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "right",
                paddingBottom: "5px",
                borderBottom: "1px dashed black",
            },
        },
    ];

    let dataNoPajak: PosPrintData[] = [];

    order.details
        .filter((e) => e.pajak_state === 1)
        .forEach((element) => {
            data.push({
                type: "text",
                value: `
          <div style='display: flex; flex-direction: row'>
            <div style='flex: 1; text-align: left'>
              <span>${element.menu.name}</span> <br> 
              <span>${numberFormat(element.menu.price, 0)}</span> <br>
              ${element.variants
                  .filter((e) => e.price !== 0)
                  .reduce((acc, e) => {
                      return (
                          acc +
                          `<span>- ${e.option_name} + ${numberFormat(
                              e.price,
                              0
                          )}</span> <br>`
                      );
                  }, "")}
            </div>
            <div style='flex: 1; text-align: right'>
              (${element.diskon}%) (${element.qty}) <span>${numberFormat(
                    element.total,
                    0
                )}</span>
            </div>
          </div>
        `,
                fontsize: 20,
                style: {
                    // fontWeight: '400',
                    marginTop: "5px",
                    marginBottom: "5px",
                },
            });
        });

    order.details
        .filter((e) => e.pajak_state === 0)
        .forEach((element) => {
            dataNoPajak.push({
                type: "text",
                value: `
          <div style='display: flex; flex-direction: row'>
            <div style='flex: 1; text-align: left'>
              <span>${element.menu.name}</span> <br> 
              <span>${numberFormat(element.menu.price, 0)}</span> <br>
              ${element.variants
                  .filter((e) => e.price !== 0)
                  .reduce((acc, e) => {
                      return (
                          acc +
                          `<span>- ${e.option_name} + ${numberFormat(
                              e.price,
                              0
                          )}</span> <br>`
                      );
                  }, "")}
            </div>
            <div style='flex: 1; text-align: right'>
              (${element.diskon}%) (${element.qty}) <span>${numberFormat(
                    element.total,
                    0
                )}</span>
            </div>
          </div>
        `,
                fontsize: 20,
                style: {
                    // fontWeight: '400',
                    marginTop: "5px",
                    marginBottom: "5px",
                },
            });
        });

    let subtotal = order.subtotal_pajak;
    let pajak =
        order.status === 2
            ? order.pajak_value
            : (order.subtotal_pajak * outlet.tax) / 100;

    let total =
        order.status === 2
            ? order.total
            : subtotal + pajak + order.subtotal_box;

    data = [
        ...data,
        {
            type: "text",
            value: "",
            style: {
                borderBottom: "1px dashed black",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                  <div style='width: 70px;'>Subtotal</div>
                  <div>:</div>
                  <div style='flex: 1; text-align: right;'>
                    <span>${numberFormat(subtotal, 0)}</span>
                  </div>
                </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                    <div style='width: 70px;'>Pb1</div>
                    <div>:</div>
                    <div style='flex: 1; text-align: right;'>
                      <span>${numberFormat(pajak, 0)}</span>
                    </div>
                  </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        ...dataNoPajak,
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                  <div style='width: 70px;'>Total</div>
                  <div>:</div>
                  <div style='flex: 1; text-align: right;'>
                    <span>${numberFormat(total, 0)}</span>
                  </div>
                </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `--Terima Kasih--`,
            style: {
                // fontWeight: '700',
                textAlign: "center",
                marginTop: "10px",
            },
        },
        {
            type: "text",
            value: `--Silahkan Datang Kembali--`,
            style: {
                // fontWeight: '700',
                textAlign: "center",
            },
        },
        {
            type: "text",
            value: `--Untuk kritik dan saran hubungi: ${outlet.contact}--`,
            style: {
                // fontWeight: '700',
                textAlign: "center",
            },
        },
        {
            type: "text",
            value: `IG: @${outlet.instagram}`,
            style: {
                // fontWeight: '700',
                textAlign: "center",
            },
        },
    ];
    return data;
};

// type, 1 = Reprint, 2 = payment, 3 = void
const cetakStruk = (
    outlet: InfoOutlet,
    order: OrderDetail,
    type = 1
): PosPrintData[] => {
    let data: PosPrintData[] = [
        {
            type: "text",
            value: outlet.name,
            style: {
                fontWeight: "700",
                fontSize: "18px",
                textAlign: "center",
            },
        },
        {
            type: "text",
            value: outlet.address,
            fontsize: 20,
            style: {
                fontWeight: "400",
                fontSize: "12px",
                textAlign: "center",
                marginBottom: "5px",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                  <div style='width: 70px;'>No</div>
                  <div style='flex: 1'>
                    : ${order.kode_transaksi}
                  </div>
                </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                  <div style='width: 70px;'>Bon</div>
                  <div style='flex: 1'>
                    : ${order.no_bill === null ? "-" : order.no_bill}
                  </div>
                </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                  <div style='width: 70px;'>Kasir</div>
                  <div style='flex: 1'>
                    : ${outlet.kasir}
                  </div>
                </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                  <div style='width: 70px;'>Meja</div>
                  <div style='flex: 1'>
                    : ${order.table}
                  </div>
                </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                <div style='width: 70px;'>Nama</div>
                <div style='flex: 1'>
                  : ${order.name}
                </div>
              </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                    <div style='width: 70px;'>Order</div>
                    <div style='flex: 1'>
                      : ${order.kategori_order_name}
                    </div>
                  </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                    <div style='width: 70px;'>Payment</div>
                    <div style='flex: 1'>
                      : ${order.kategori_payment_name}
                    </div>
                  </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                  <div style='width: 70px;'>Status</div>
                  <div style='flex: 1'>
                    : Lunas ${
                        type === 1 ? "(Re-print)" : type === 3 ? "(Void)" : ""
                    }
                  </div>
                </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: order.date,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "right",
                paddingBottom: "5px",
                borderBottom: "1px dashed black",
            },
        },
    ];

    order.details
        .filter((e) => e.pajak_state === 1)
        .forEach((element) => {
            data.push({
                type: "text",
                value: `
            <div style='display: flex; flex-direction: row'>
              <div style='flex: 1; text-align: left'>
                <span>${element.menu.name}</span> <br> 
                <span>${numberFormat(element.menu.price, 0)}</span> <br>
                ${element.variants
                    .filter((e) => e.price !== 0)
                    .reduce((acc, e) => {
                        return (
                            acc +
                            `<span>- ${e.option_name} + ${numberFormat(
                                e.price,
                                0
                            )}</span> <br>`
                        );
                    }, "")}
              </div>
              <div style='flex: 1; text-align: right'>
                (${element.diskon}%) (${element.qty}) <span>${numberFormat(
                    element.total,
                    0
                )}</span>
              </div>
            </div>
          `,
                fontsize: 20,
                style: {
                    // fontWeight: '400',
                    marginTop: "5px",
                    marginBottom: "5px",
                },
            });
        });

    data = [
        ...data,
        {
            type: "text",
            value: "",
            style: {
                borderBottom: "1px dashed black",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                    <div style='width: 70px;'>Subtotal</div>
                    <div>:</div>
                    <div style='flex: 1; text-align: right;'>
                      <span>${numberFormat(order.subtotal_pajak, 0)}</span>
                    </div>
                  </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                    <div style='width: 70px;'>Pb1</div>
                    <div>:</div>
                    <div style='flex: 1; text-align: right;'>
                      <span>${numberFormat(order.pajak_value, 0)}</span>
                    </div>
                  </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
    ];

    order.details
        .filter((e) => e.pajak_state === 0)
        .forEach((element) => {
            data.push({
                type: "text",
                value: `
            <div style='display: flex; flex-direction: row'>
              <div style='flex: 1; text-align: left'>
                <span>${element.menu.name}</span> <br> <span>${numberFormat(
                    element.price,
                    0
                )}</span>
              </div>
              <div style='flex: 1; text-align: right'>
                (${element.diskon}%) (${element.qty}) <span>${numberFormat(
                    element.total,
                    0
                )}</span>
              </div>
            </div>
          `,
                fontsize: 20,
                style: {
                    // fontWeight: '400',
                    marginTop: "5px",
                    marginBottom: "5px",
                },
            });
        });

    data = [
        ...data,
        {
            type: "text",
            value: "",
            style: {
                borderBottom: "1px dashed black",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                      <div style='width: 70px;'>Subtotal</div>
                      <div>:</div>
                      <div style='flex: 1; text-align: right;'>
                        <span>${numberFormat(order.subtotal, 0)}</span>
                      </div>
                    </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                          <div style='width: 70px;'>Diskon</div>
                          <div>:</div>
                          <div style='flex: 1; text-align: right;'>
                            (${order.diskon}%) <span>${numberFormat(
                order.diskon_value,
                0
            )}</span>
                          </div>
                        </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                        <div style='width: 70px;'>Potongan</div>
                        <div>:</div>
                        <div style='flex: 1; text-align: right;'>
                          <span>${numberFormat(order.potongan, 0)}</span>
                        </div>
                      </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                        <div style='width: 70px;'>Total</div>
                        <div>:</div>
                        <div style='flex: 1; text-align: right;'>
                          <span>${numberFormat(order.total, 0)}</span>
                        </div>
                      </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                        <div style='width: 70px;'>Bayar</div>
                        <div>:</div>
                        <div style='flex: 1; text-align: right;'>
                          <span>${numberFormat(order.bayar, 0)}</span>
                        </div>
                      </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                        <div style='width: 70px;'>Kembali</div>
                        <div>:</div>
                        <div style='flex: 1; text-align: right;'>
                          <span>${numberFormat(order.kembalian, 0)}</span>
                        </div>
                      </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `--Terima Kasih--`,
            style: {
                // fontWeight: '700',
                textAlign: "center",
                marginTop: "10px",
            },
        },
        {
            type: "text",
            value: `--Silahkan Datang Kembali--`,
            style: {
                // fontWeight: '700',
                textAlign: "center",
            },
        },
        {
            type: "text",
            value: `--Untuk kritik dan saran hubungi: ${outlet.contact}--`,
            style: {
                // fontWeight: '700',
                textAlign: "center",
            },
        },
        {
            type: "text",
            value: `IG: @${outlet.instagram}`,
            style: {
                // fontWeight: '700',
                textAlign: "center",
            },
        },
    ];
    return data;
};

const simulateStruk = (
    outlet: InfoOutlet,
    order: OrderDetail
): PosPrintData[] => {
    let data: PosPrintData[] = [
        {
            type: "text",
            value: outlet.name,
            style: {
                fontWeight: "700",
                fontSize: "18px",
                textAlign: "center",
            },
        },
        {
            type: "text",
            value: outlet.address,
            fontsize: 20,
            style: {
                fontWeight: "400",
                fontSize: "12px",
                textAlign: "center",
                marginBottom: "5px",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                    <div style='width: 70px;'>No</div>
                    <div style='flex: 1'>
                      : ${order.kode_transaksi}
                    </div>
                  </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                    <div style='width: 70px;'>Bon</div>
                    <div style='flex: 1'>
                      : ${order.no_bill === null ? "-" : order.no_bill}
                    </div>
                  </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                    <div style='width: 70px;'>Kasir</div>
                    <div style='flex: 1'>
                      : ${outlet.kasir}
                    </div>
                  </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                    <div style='width: 70px;'>Meja</div>
                    <div style='flex: 1'>
                      : ${order.table}
                    </div>
                  </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                  <div style='width: 70px;'>Nama</div>
                  <div style='flex: 1'>
                    : ${order.name}
                  </div>
                </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                      <div style='width: 70px;'>Order</div>
                      <div style='flex: 1'>
                        : ${order.kategori_order_name}
                      </div>
                    </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                      <div style='width: 70px;'>Payment</div>
                      <div style='flex: 1'>
                        : ${order.kategori_payment_name}
                      </div>
                    </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                    <div style='width: 70px;'>Status</div>
                    <div style='flex: 1'>
                      : Belum Lunas
                    </div>
                  </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: order.date,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "right",
                paddingBottom: "5px",
                borderBottom: "1px dashed black",
            },
        },
    ];

    order.details
        .filter((e) => e.pajak_state === 1)
        .forEach((element) => {
            data.push({
                type: "text",
                value: `
              <div style='display: flex; flex-direction: row'>
                <div style='flex: 1; text-align: left'>
                  <span>${element.menu.name}</span> <br> 
                  <span>${numberFormat(element.menu.price, 0)}</span> <br>
                ${element.variants
                    .filter((e) => e.price !== 0)
                    .reduce((acc, e) => {
                        return (
                            acc +
                            `<span>- ${e.option_name} + ${numberFormat(
                                e.price,
                                0
                            )}</span> <br>`
                        );
                    }, "")}
                </div>
                <div style='flex: 1; text-align: right'>
                  (${element.diskon}%) (${element.qty}) <span>${numberFormat(
                    element.total,
                    0
                )}</span>
                </div>
              </div>
            `,
                fontsize: 20,
                style: {
                    // fontWeight: '400',
                    marginTop: "5px",
                    marginBottom: "5px",
                },
            });
        });

    data = [
        ...data,
        {
            type: "text",
            value: "",
            style: {
                borderBottom: "1px dashed black",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                      <div style='width: 70px;'>Subtotal</div>
                      <div>:</div>
                      <div style='flex: 1; text-align: right;'>
                        <span>${numberFormat(order.subtotal_pajak, 0)}</span>
                      </div>
                    </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                      <div style='width: 70px;'>Pb1</div>
                      <div>:</div>
                      <div style='flex: 1; text-align: right;'>
                        <span>${numberFormat(order.pajak_value, 0)}</span>
                      </div>
                    </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
    ];

    order.details
        .filter((e) => e.pajak_state === 0)
        .forEach((element) => {
            data.push({
                type: "text",
                value: `
              <div style='display: flex; flex-direction: row'>
                <div style='flex: 1; text-align: left'>
                  <span>${element.menu.name}</span> <br> <span>${numberFormat(
                    element.price,
                    0
                )}</span>
                </div>
                <div style='flex: 1; text-align: right'>
                  (${element.diskon}%) (${element.qty}) <span>${numberFormat(
                    element.total,
                    0
                )}</span>
                </div>
              </div>
            `,
                fontsize: 20,
                style: {
                    // fontWeight: '400',
                    marginTop: "5px",
                    marginBottom: "5px",
                },
            });
        });

    data = [
        ...data,
        {
            type: "text",
            value: "",
            style: {
                borderBottom: "1px dashed black",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                        <div style='width: 70px;'>Subtotal</div>
                        <div>:</div>
                        <div style='flex: 1; text-align: right;'>
                          <span>${numberFormat(order.subtotal, 0)}</span>
                        </div>
                      </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                            <div style='width: 70px;'>Diskon</div>
                            <div>:</div>
                            <div style='flex: 1; text-align: right;'>
                              (${order.diskon}%) <span>${numberFormat(
                order.diskon_value,
                0
            )}</span>
                            </div>
                          </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                          <div style='width: 70px;'>Potongan</div>
                          <div>:</div>
                          <div style='flex: 1; text-align: right;'>
                            <span>${numberFormat(order.potongan, 0)}</span>
                          </div>
                        </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        {
            type: "text",
            value: `<div style='display: flex; flex-direction: row;'>
                          <div style='width: 70px;'>Total</div>
                          <div>:</div>
                          <div style='flex: 1; text-align: right;'>
                            <span>${numberFormat(order.total, 0)}</span>
                          </div>
                        </div>`,
            fontsize: 20,
            style: {
                // fontWeight: '400',
                textAlign: "left",
            },
        },
        // {
        //   type: "text",
        //   value: `<div style='display: flex; flex-direction: row;'>
        //                     <div style='width: 70px;'>Bayar</div>
        //                     <div>:</div>
        //                     <div style='flex: 1; text-align: right;'>
        //                       <span>${numberFormat(order.bayar, 0)}</span>
        //                     </div>
        //                   </div>`,
        //   fontsize: 20,
        //   style: {
        //     // fontWeight: '400',
        //     textAlign: "left",
        //   },
        // },
        // {
        //   type: "text",
        //   value: `<div style='display: flex; flex-direction: row;'>
        //                     <div style='width: 70px;'>Kembali</div>
        //                     <div>:</div>
        //                     <div style='flex: 1; text-align: right;'>
        //                       <span>${numberFormat(order.kembalian, 0)}</span>
        //                     </div>
        //                   </div>`,
        //   fontsize: 20,
        //   style: {
        //     // fontWeight: '400',
        //     textAlign: "left",
        //   },
        // },
        {
            type: "text",
            value: `--Terima Kasih--`,
            style: {
                // fontWeight: '700',
                textAlign: "center",
                marginTop: "10px",
            },
        },
        {
            type: "text",
            value: `--Silahkan Datang Kembali--`,
            style: {
                // fontWeight: '700',
                textAlign: "center",
            },
        },
        {
            type: "text",
            value: `--Untuk kritik dan saran hubungi: ${outlet.contact}--`,
            style: {
                // fontWeight: '700',
                textAlign: "center",
            },
        },
        {
            type: "text",
            value: `IG: @${outlet.instagram}`,
            style: {
                // fontWeight: '700',
                textAlign: "center",
            },
        },
    ];
    return data;
};

const PrintService = {
    cetakBill,
    cetakStruk,
    simulateStruk,
};

export default PrintService;
