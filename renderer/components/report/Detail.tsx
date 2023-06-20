import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useSelector } from "react-redux";
import { getReport } from "../../features/reportSlice";
import { useAuth } from "../../hooks/AuthContext";
import ReportService, {
  DownloadReportParams,
  ResumeData,
} from "../../services/ReportService";
import { numberFormat } from "../../utils/currency";
import { formatDate } from "../../utils/date";
import { handleErrorAxios } from "../../utils/errors";
import { ucwords } from "../../utils/string";
import { Button } from "../globals/buttons";
import Swal from "sweetalert2";

const Detail = () => {
  const { token, outlet } = useAuth();
  const { date, refetchReport } = useSelector(getReport);

  const [data, setData] = useState<ResumeData>({
    kas: 0,
    kasKeluar: 0,
    kasMasuk: 0,
    sum: 0,
    sum_no_kas: 0,
    totalPenjualan: 0,
    details: [],
  });

  const { refetch } = useQuery({
    queryKey: ["resume_report"],
    queryFn: () => ReportService.getReportResume(token, date),
    onSuccess: (res) => {
      setData(res.data);
    },
    onError: handleErrorAxios,
  });

  const downloadMutation = useMutation(
    (params: DownloadReportParams) =>
      ReportService.downloadReport(token, params),
    {
      onSuccess: (res) => {
        const url = window.URL.createObjectURL(res);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `Laporan Tutup Transaksi ${formatDate(new Date(date))}.xlsx`
        );
        document.body.appendChild(link);
        link.click();
      },
      onError: handleErrorAxios,
    }
  );

  useEffect(() => {
    refetch();
  }, [date]);

  useEffect(() => {
    if (refetchReport) {
      refetch();
    }
  }, [refetchReport]);

  return (
    <div className="w-[450px] px-4 border-l">
      <div className="flex-1">
        <div className="flex flex-col my-2">
          <span className="text-sm font-medium text-gray-900 w-[150px]">
            Pendapatan
          </span>
          <span className="text-xs font-light text-gray-900 w-[150px]">
            {formatDate(date)}
          </span>
        </div>
        {/* <div className="flex flex-row justify-between items-start mb-1 pb-1">
          <span className="text-sm font-tight text-gray-500 w-[150px]">
            Uang Kas / Laci
          </span>
          <span className="text-sm font-semibold text-gray-900 text-end">
            {numberFormat(data.kas, 2)}
          </span>
        </div> */}
        <div className="flex flex-row justify-between items-start mb-1 pb-1">
          <span className="text-sm font-tight text-gray-500 w-[150px]">
            Total Penjualan
          </span>
          <span className="text-sm font-semibold text-gray-900 text-end">
            {numberFormat(data.totalPenjualan, 2)}
          </span>
        </div>
        <div className="pl-4">
          {data.details.map((item) => {
            return item.value === 0 ? null : (
              <div
                key={`resume_${item.name}`}
                className="flex flex-row justify-between items-start mb-1 pb-1"
              >
                <span className="text-sm font-tight text-gray-500 w-[150px]">
                  {ucwords(item.name)}
                </span>
                <span className="text-sm font-medium text-gray-900 text-end">
                  {numberFormat(item.value, 2)}
                </span>
              </div>
            );
          })}
        </div>
        {/* <div className="flex flex-row justify-between items-start mb-1 pb-1">
          <span className="text-sm font-tight text-gray-500 w-[150px]">
            Kas Masuk
          </span>
          <span className="text-sm font-medium text-gray-900 text-end">
            {numberFormat(data.kasMasuk, 2)}
          </span>
        </div> */}
        <div className="flex flex-row justify-between items-start mb-1 pb-1">
          <span className="text-sm font-tight text-gray-500 w-[150px]">
            Total Pengeluaran
          </span>
          <span className="text-sm font-medium text-gray-900 text-end">
            {numberFormat(data.kasKeluar, 2)}
          </span>
        </div>
        <div className="flex flex-row justify-between items-start mb-1 pt-1 border-t">
          <span className="text-sm font-medium text-gray-900 w-[150px]">
            Total
          </span>
          <span className="text-sm font-medium text-red-500 text-end">
            Rp {data.sum_no_kas < 0 ? "-" : ""}
            {numberFormat(data.sum_no_kas, 2)}
          </span>
        </div>
      </div>
      <div className="mt-4">
        <Button
          type="button"
          onClick={() => {
            Swal.fire({
              title: "Apakah Anda yakin?",
              text: "Pastikan Anda sudah melakukan input pengeluaran dan supplier",
              icon: "question",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Ya, saya yakin",
              cancelButtonText: "Tidak",
            }).then((result) => {
              if (result.isConfirmed) {
                downloadMutation.mutate({
                  date,
                  outlet_id: outlet.id,
                });
              }
            });
          }}
          isLoading={downloadMutation.isLoading}
          disabled={downloadMutation.isLoading}
          blok
        >
          DOWNLOAD EXCEL
        </Button>
      </div>
    </div>
  );
};

export default Detail;
