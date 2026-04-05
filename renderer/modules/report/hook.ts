import { useMutation, useQuery } from "react-query";
import { useAuth } from "@/hooks/AuthContext";
import { handleErrorAxios } from "@/utils/errors";
import { getReportResume, downloadReport } from "@/modules/report/api";
import { DownloadReportParams } from "@/modules/report/type";

export const useReportResumeQuery = (date: string) => {
  const { token } = useAuth();
  return useQuery(
    ["report_resume", date],
    () => getReportResume(token, date),
    {
      enabled: !!token && !!date,
      refetchOnWindowFocus: false,
      onError: handleErrorAxios,
    }
  );
};

export const useDownloadReportMutation = () => {
  const { token } = useAuth();
  return useMutation(
    (params: DownloadReportParams) => downloadReport(token, params),
    { onError: handleErrorAxios }
  );
};
