import api from "@/lib/api";
import {
  GetOrderDetailResponse,
  GetOrderOutletPaginateParams,
  GetOrderOutletPaginateResponse,
} from "@/modules/order/type";

enum HomeUrl {
  ORDER_OUTLET_PAGINATE = "/api/transaksi/all-paginate",
  ORDER_DETAIL = "/api/transaksi/detail",
}

export const getHomeTransactionList = async (
  params: GetOrderOutletPaginateParams
): Promise<GetOrderOutletPaginateResponse> => {
  const response = await api.get(HomeUrl.ORDER_OUTLET_PAGINATE, {
    params,
  });

  return response.data;
};

export const getHomeTransactionDetail = async (
  transactionId: number
): Promise<GetOrderDetailResponse> => {
  const response = await api.get(`${HomeUrl.ORDER_DETAIL}/${transactionId}`);

  return response.data;
};
