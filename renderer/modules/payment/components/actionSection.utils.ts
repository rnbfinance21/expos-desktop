import { Payment } from "@/features/paymentSlice";
import {
    DetailVariant,
    OrderDetail,
    SavePaymentParams,
} from "@/modules/order/type";
import { OrderType, PaymentType } from "@/modules/payment/type";
import { formatFullDate } from "@/utils/date";

type Identity = {
    name: string;
    table: string;
    no_bill: string | null;
};

type PrintIdentity = {
    name: string;
    address: string;
    instagram: string;
    contact: string;
};

type BuildSimulateOrderParams = {
    bayar: number;
    diskon: number;
    diskonValue: number;
    identity: Identity;
    kembalian: number;
    orderType: number;
    orderTypeList: OrderType[];
    orders: Payment[];
    pajakValue: number;
    paymentType: number;
    paymentTypeList: PaymentType[];
    potongan: number;
    subtotal: number;
    sumSubtotalBox: number;
    sumSubtotalPajak: number;
    tax: number;
    total: number;
};

export const buildReceiptIdentity = (
    outlet: PrintIdentity,
    cashierName: string
) => ({
    name: outlet.name,
    address: outlet.address,
    instagram: outlet.instagram,
    kasir: cashierName,
    contact: outlet.contact,
});

export const mapPaymentDetailsPayload = (
    orders: Payment[]
): SavePaymentParams["details"] =>
    orders.map((order) => ({
        menu_id: order.menu.id,
        box: order.box,
        description: order.notes,
        diskon: order.diskon,
        margin: order.margin,
        pajak_state: order.pajak_stat,
        price: order.price,
        qty: order.qty,
        variants: order.variants.flatMap((variant) =>
            variant.data.map((option) => ({
                option_id: option.option_id,
                price: option.price,
            }))
        ),
        type_order: order.type_order,
    }));

const mapOrderDetailVariants = (order: Payment): DetailVariant[] =>
    order.variants.flatMap((variant) =>
        variant.data.map((option) => ({
            id: 0,
            transaksi_detail_id: order.id,
            variant_option_id: option.option_id,
            price: option.price,
            state: 1,
            deleted_at: null,
            created_at: "",
            updated_at: "",
            option_name: option.option_name,
            variant_name: variant.name,
            variant_id: variant.id,
        }))
    );

export const buildSimulateOrder = ({
    bayar,
    diskon,
    diskonValue,
    identity,
    kembalian,
    orderType,
    orderTypeList,
    orders,
    pajakValue,
    paymentType,
    paymentTypeList,
    potongan,
    subtotal,
    sumSubtotalBox,
    sumSubtotalPajak,
    tax,
    total,
}: BuildSimulateOrderParams): OrderDetail => ({
    id: 0,
    bayar,
    created_at: "",
    updated_at: "",
    date: formatFullDate(new Date()),
    deleted_at: null,
    diskon,
    diskon_value: diskonValue,
    items_count: orders.length,
    kasir_id: null,
    kembalian,
    kategori_order_id: orderType,
    kategori_payment_id: paymentType,
    kategori_order_name: orderTypeList[orderType - 1].name,
    kategori_payment_name: paymentTypeList[paymentType - 1].name,
    kode_transaksi: "-",
    name: identity.name,
    no_bill: identity.no_bill,
    outlet_id: null,
    pajak: tax,
    pajak_value: pajakValue,
    potongan,
    reason: null,
    status: 1,
    status_text: "Proses",
    subtotal,
    subtotal_box: sumSubtotalBox,
    subtotal_pajak: sumSubtotalPajak,
    table: identity.table,
    total,
    type: 1,
    type_text: "Dine In",
    details: orders.map((order) => {
        const margin = (order.price * order.margin) / 100;
        const sum = order.price + margin + order.box;
        const currentDiskon = (sum * order.diskon) / 100;
        const orderTotal = (sum - currentDiskon) * order.qty;

        return {
            box: order.box,
            id: order.id,
            description: order.notes,
            diskon: order.diskon,
            margin: order.margin,
            menu: order.menu,
            menu_id: order.menu.id,
            pajak_state: order.pajak_stat,
            price: order.price,
            qty: order.qty,
            status: 1,
            total: orderTotal,
            transaksi_id: 1,
            variants: mapOrderDetailVariants(order),
            created_at: "",
            updated_at: "",
            deleted_at: "",
            type: 0,
            type_order: 1,
        };
    }),
    member: {
        id: 0,
        name: "",
        username: "",
        password_show: "",
        type: 1,
    },
});
