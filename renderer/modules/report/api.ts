import axios from "@/utils/axios";
import { GetReportResumeResponse, DownloadReportParams } from "@/modules/report/type";

enum ReportUrl {
  REPORT_RESUME = "/api/report/transaksi",
  REPORT_EXCEL = "/api/report/excel",
}

export const getReportResume = async (
  token: string,
  date: string
): Promise<GetReportResumeResponse> => {
  try {
    const response = await axios.get(ReportUrl.REPORT_RESUME, {
      params: { date },
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const downloadReport = async (
  token: string,
  params: DownloadReportParams
): Promise<Blob> => {
  try {
    const response = await axios.post(ReportUrl.REPORT_EXCEL, params, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
