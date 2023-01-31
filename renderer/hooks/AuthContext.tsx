import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Cookie from "js-cookie";
import { useQuery } from "react-query";
import AuthService from "../services/AuthService";
import { AxiosError } from "axios";
import { BaseResponse } from "../services/types";
import Toast from "../utils/toast";
import electron from "electron";

type UserDetail = {
  id: number;
  name: string;
  email: string | null;
  username: string | null;
  photo: string;
  state: boolean;
};

type OutletDetail = {
  id: number;
  name: string;
  code: string;
  open_state: boolean;
};

type authContextType = {
  token: string;
  user: UserDetail;
  outlet: OutletDetail;
  signIn: (token: string) => void;
  logout: () => void;
};

type Props = {
  children: ReactNode;
};

const authContextDefaultValues: authContextType = {
  token: "",
  user: {
    id: null,
    name: "",
    email: "",
    username: "",
    photo: "",
    state: false,
  },
  outlet: {
    id: null,
    name: "",
    code: "",
    open_state: false,
  },
  signIn: (token: string) => {},
  logout: () => {},
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

export const AuthContextProvider = ({ children }: Props) => {
  const ipcRenderer = electron.ipcRenderer || false;

  const [token, setToken] = useState("");
  const [user, setUser] = useState<UserDetail>();
  const [outlet, setOutlet] = useState<OutletDetail>();

  useEffect(() => {
    if (ipcRenderer) {
      // const _token: any =
      //   Cookie.get("_token") === undefined ? "" : Cookie.get("_token");
      const _token: any = ipcRenderer.sendSync("electron-store-get", "_token");

      setToken(_token);
    }
  }, []);

  const fetchUser = useQuery(
    ["user_detail", token],
    () => AuthService.userDetail(token),
    {
      enabled: false,
      onSuccess: (res) => {
        const { data } = res;
        setUser({
          id: data.id,
          email: data.email,
          username: data.username,
          name: data.name,
          photo: data.photo,
          state: data.state ? true : false,
        });
        setOutlet({
          id: data.outlet.id,
          name: data.outlet.name,
          code: data.outlet.code,
          open_state: data.outlet.open_state ? true : false,
        });
      },
      onError: (err: AxiosError<BaseResponse>) => {
        if (err.isAxiosError && err.response) {
          if (err.response.status === 401) {
            Toast.fire("Pemberitahuan", "Waktu sesi telah habis", "warning");
          }
          logout();
        }
      },
    }
  );

  const signIn = (val: string) => {
    setToken(val);

    if (ipcRenderer) {
      ipcRenderer.send("electron-store-set", "_token", val);
    }
    // Cookie.set("_token", val);
  };

  const logout = () => {
    if (ipcRenderer) {
      ipcRenderer.send("electron-store-remove", "_token");
    }
    // Cookie.remove("_token");
    setToken("");
    setUser(undefined);
    setOutlet(undefined);
  };

  useEffect(() => {
    if (token !== "") {
      fetchUser.refetch();
    }
  }, [token]);

  const context = {
    token,
    user,
    outlet,
    logout,
    signIn,
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
