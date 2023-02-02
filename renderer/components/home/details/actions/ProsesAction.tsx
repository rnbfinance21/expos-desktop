import { useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import {
  setId,
  setIdentity,
  setOrders,
  setType,
} from "../../../../features/orderSlice";
import { OrderDetail } from "../../../../services/OrderService";
import DetailActionButton from "../../../form/details/DetailActionButton";

interface ProsesActionProps {
  data: OrderDetail;
}

const ProsesAction = ({ data }: ProsesActionProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const _onChange = () => {
    dispatch(setType("UPDATE"));
    dispatch(
      setIdentity({
        memberId: null,
        name: data.name,
        no_bill: data.no_bill,
        table: data.table,
      })
    );
    dispatch(
      setOrders(
        data.details.map((d) => {
          return {
            id: d.menu.id,
            box: d.box,
            diskon: d.diskon,
            margin: d.margin,
            margin_stat: d.menu.box_state,
            pajak_stat: d.pajak_state,
            notes: d.description,
            price: d.price,
            qty: d.qty,
            menu: d.menu,
            variants: d.variants.map((v) => {
              return {
                option_id: v.variant_option_id,
                price: v.price,
                category_id: v.variant_id,
                category_name: v.variant_name,
                option_name: v.option_name,
              };
            }),
          };
        })
      )
    );
    dispatch(setId(data.id));
    router.push("/form");
  };
  return (
    <div className="flex-1 flex flex-row gap-2">
      <DetailActionButton
        icon="TruckIcon"
        title="Cetak Ke Dapur"
        onClick={() => {}}
      />
      <DetailActionButton
        icon="PrinterIcon"
        title="Cetak Struk"
        onClick={() => {}}
      />
      <DetailActionButton icon="PencilIcon" title="Ubah" onClick={_onChange} />
      <DetailActionButton
        icon="CurrencyDollarIcon"
        title="Bayar"
        onClick={() => {}}
      />
      <DetailActionButton
        icon="XMarkIcon"
        title="Batal"
        outline={false}
        onClick={() => {}}
        iconClassName="text-white"
      />
    </div>
  );
};

export default ProsesAction;
