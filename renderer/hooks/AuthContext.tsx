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
    address: string;
    code: string;
    open_state: boolean;
    tax: number;
    instagram: string;
    contact: string;
};

type authContextType = {
    kasState: boolean;
    openState: boolean;
    token: string;
    user: UserDetail;
    outlet: OutletDetail;
    accessCode: string | null;
    tableCount: number;
    signIn: (token: string) => void;
    setKasState: (state: boolean) => void;
    logout: () => void;
    setOpenState: (state: boolean) => void;
    refetch: () => void;
};

type Props = {
    children: ReactNode;
};

const authContextDefaultValues: authContextType = {
    kasState: false,
    openState: false,
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
        address: "",
        code: "",
        open_state: false,
        tax: 10,
        instagram: "ramenbajuri",
        contact: "081111118004",
    },
    accessCode: null,
    tableCount: 0,
    signIn: (token: string) => {},
    setKasState: (state: boolean) => {},
    setOpenState: (state: boolean) => {},
    logout: () => {},
    refetch: () => {},
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

export const AuthContextProvider = ({ children }: Props) => {
    const ipcRenderer = electron.ipcRenderer || false;

    const [kasState, setKasState] = useState(false);
    const [openState, setOpenState] = useState(false);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState<UserDetail>();
    const [outlet, setOutlet] = useState<OutletDetail>();
    const [accessCode, setAccessCode] = useState<string | null>(null);
    const [tableCount, setTableCount] = useState<number>(0);

    useEffect(() => {
        if (ipcRenderer) {
            // const _token: any =
            //   Cookie.get("_token") === undefined ? "" : Cookie.get("_token");
            const _token: any = ipcRenderer.sendSync(
                "electron-store-get",
                "_token"
            );

            if (_token !== undefined && _token !== "") {
                setToken(_token);
            } else {
                setToken("");
            }
        }
    }, []);

    const fetchUser = useQuery(
        ["user_detail", token],
        () => AuthService.userDetail(token),
        {
            enabled: token !== null && token !== "" ? true : false,
            retry: 3,
            refetchOnWindowFocus: false,
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
                    address: data.outlet.address,
                    code: data.outlet.code,
                    open_state: data.outlet.open_state ? true : false,
                    tax: data.outlet.tax,
                    instagram: data.outlet.instagram,
                    contact: data.outlet.contact,
                });
                setKasState(data.outlet.kas_state === 1 ? true : false);
                setOpenState(data.outlet.open_state === 1 ? true : false);
                setAccessCode(data.access_code);
                setTableCount(data.table_count);
            },
            onError: (err: AxiosError<BaseResponse>) => {
                if (err.isAxiosError && err.response) {
                    if (err.response.status === 401) {
                        Toast.fire(
                            "Pemberitahuan",
                            "Waktu sesi telah habis",
                            "warning"
                        );
                        logout();
                    } else if (err.response.status === 500) {
                        Toast.fire(
                            "Pemberitahuan",
                            "Terjadi kesalahan pada server",
                            "warning"
                        );
                        logout();
                    } else {
                        Toast.fire(
                            "Pemberitahuan",
                            "Waktu sesi telah habis",
                            "warning"
                        );
                    }
                } else {
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
        setToken(null);
        setUser(undefined);
        setOutlet(undefined);
    };

    const refetch = () => {
        fetchUser.refetch();
    };

    // useEffect(() => {
    //   if (token !== null && token !== "") {
    //     fetchUser.refetch({
    //       throwOnError: true,
    //     });
    //   }
    // }, [token]);

    const context = {
        token,
        user,
        outlet,
        logout,
        signIn,
        kasState,
        setKasState,
        openState,
        setOpenState,
        accessCode,
        tableCount,
        refetch,
    };

    return (
        <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
