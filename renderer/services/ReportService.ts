import axios from "../utils/axios";

enum ReportUrl {
  REPORT_RESUME = "/api/report/transaksi",
  REPORT_EXCEL = "/api/report/excel",
}

export type Resume = {
  name: string;
  value: number;
};

export type ResumeData = {
  kas: number;
  totalPenjualan: number;
  details: Resume[];
  sum: number;
  kasMasuk: number;
  kasKeluar: number;
};

export type GetReportResumeResponse = {
  code: number;
  message: string;
  data: ResumeData;
};

export type DownloadReportParams = {
  outlet_id: number;
  date: string;
};

const getReportResume = async (
  token: string,
  date: string
): Promise<GetReportResumeResponse> => {
  try {
    const response = await axios.get(`${ReportUrl.REPORT_RESUME}`, {
      params: {
        date,
      },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const downloadReport = async (
  token: string,
  params: DownloadReportParams
): Promise<Blob> => {
  try {
    const response = await axios.post(`${ReportUrl.REPORT_EXCEL}`, params, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const ReportService = {
  getReportResume,
  downloadReport,
};

export default ReportService;
