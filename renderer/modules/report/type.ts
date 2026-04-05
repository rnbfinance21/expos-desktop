export type Resume = {
  name: string;
  value: number;
};

export type ResumeData = {
  kas: number;
  totalPenjualan: number;
  details: Resume[];
  sum: number;
  sum_no_kas: number;
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
