/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";
import { useAuth } from "../../../hooks/AuthContext";
import { handleErrorAxios } from "../../../utils/errors";
import Toast from "../../../utils/toast";
import { Button } from "../../globals/buttons";
import { TextInput } from "../../globals/forms";
import { ErrorLabel } from "../../globals/labels";
import MyModal from "../../globals/modal/MyModal";
import ButtonAttributes from "../../payment/ButtonAttributes";
import SupplierService, {
  SaveSupplierParams,
  SupplierName,
} from "../../../services/SupplierService";
import Select from "react-select";

interface FormModalProps {
  visible: boolean;
  formType: number;
  onClose: () => void;
  onSuccess: () => void;
}

type FormData = {
  supplier_id: number;
  jumlah: string;
};

const schema = yup.object({
  supplier_id: yup.number().required("Pilih Supplier"),
  jumlah: yup.string().required("Masukkan jumlah transaksi"),
});

const FormModal = ({
  visible,
  onClose,
  formType,
  onSuccess,
}: FormModalProps) => {
  const { token, outlet } = useAuth();

  const [supplierData, setSupplierData] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      jumlah: "0",
    },
  });

  const fetchSupplier = useQuery(
    "fetchSupplier",
    () => SupplierService.getSupplier(token),
    {
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        setSupplierData(
          res.data.map((e) => {
            return {
              label: e.name,
              value: e.id,
            };
          })
        );
      },
    }
  );

  const mutation = useMutation(
    (params: SaveSupplierParams) => SupplierService.save(token, params),
    {
      onSuccess: (res) => {
        Toast.fire("Berhasil!", res.message, "success");
        onSuccess();
      },
      onError: handleErrorAxios,
    }
  );

  const onSubmit = (data: FormData) => {
    mutation.mutate({
      supplier_id: data.supplier_id,
      jumlah: data.jumlah,
    });
  };

  useEffect(() => {
    if (!visible) {
      reset();
    } else {
      fetchSupplier.refetch();
    }
  }, [visible]);

  return (
    <MyModal title="Supplier" show={visible} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col mb-4">
          <div className="mb-4">
            <label
              htmlFor="supplier_id"
              className="block text-sm font-light mb-2"
            >
              Supplier
            </label>
            <Controller
              control={control}
              name="supplier_id"
              render={({ field }) => {
                return (
                  <Select
                    id="supplier_id"
                    placeholder="Pilih Supplier"
                    options={supplierData}
                    isSearchable={false}
                    onChange={(e) => field.onChange(e.value)}
                    value={supplierData.find((e) => e.value === field.value)}
                  />
                );
              }}
            />
            {errors.supplier_id ? (
              <ErrorLabel text={errors.supplier_id.message ?? ""} />
            ) : null}
          </div>
        </div>
        <div className="flex flex-col mb-4">
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-light mb-2">
              Jumlah
            </label>
            <CurrencyInput
              allowDecimals={false}
              defaultValue={0}
              decimalSeparator=","
              groupSeparator="."
              placeholder="Jumlah"
              className="flex-1 block w-full text-left focus:ring-red-500 focus:border-red-500 min-w-0 rounded-md sm:text-base border-gray-200"
              {...register("jumlah")}
            />
            {errors.jumlah ? (
              <ErrorLabel text={errors.jumlah.message ?? ""} />
            ) : null}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <Button
            type="submit"
            className="text-xs"
            blok
            isLoading={mutation.isLoading}
            disabled={mutation.isLoading}
          >
            Simpan
          </Button>
        </div>
      </form>
    </MyModal>
  );
};

export default FormModal;
