
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

import { useMutation, useQuery } from "react-query";
import { AxiosError } from "axios";
import electron from "electron";

import { BaseResponse } from "../../services/types";
import Toast from "../../utils/toast";
import AuthService from "../../modules/auth/api";


type UserDetail = {
    id: number | null;
    name: string;
    email: string | null;
    username: string | null;
    photo: string;
    state: boolean;
};


type AuthContextType = {
    token: string | null;
    user: UserDetail;
    signIn: (token: string) => void;
    logout: () => void;
    refetch: () => void;
};


type Props = {
    children: ReactNode;
};


const authContextDefaultValues: AuthContextType = {
    token: null,
    user: {
        id: null,
        name: "",
        email: "",
        username: "",
        photo: "",
        state: false,
    },
    signIn: () => { },
    logout: () => { },
    refetch: () => { },
};

const AuthContext = createContext<AuthContextType>(authContextDefaultValues);


export const AuthContextProvider = ({ children }: Props) => {
    const ipcRenderer = electron.ipcRenderer || false;
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserDetail>(authContextDefaultValues.user);

    // Ambil token dari electron-store saat mount
    useEffect(() => {
        if (ipcRenderer) {
            const _token: any = ipcRenderer.sendSync("electron-store-get", "_token");
            setToken(_token !== undefined && _token !== "" ? _token : null);
        }
    }, []);

    // Query user profile
    const fetchUser = useQuery(
        ["user_profile", token],
        async () => {
            const profileRes = await AuthService.profile();
            return profileRes.data;
        },
        {
            enabled: !!token,
            retry: 3,
            refetchOnWindowFocus: false,
            onSuccess: (profile) => {
                setUser({
                    id: profile.id,
                    email: profile.email,
                    username: profile.username,
                    name: profile.name,
                    photo: profile.photo,
                    state: !!profile.state,
                });
            },
            onError: (err: AxiosError<BaseResponse>) => {
                if (err.isAxiosError && err.response) {
                    if (err.response.status === 401) {
                        Toast.fire("Pemberitahuan", "Waktu sesi telah habis", "warning");
                        logout();
                    } else if (err.response.status === 500) {
                        Toast.fire("Pemberitahuan", "Terjadi kesalahan pada server", "warning");
                        logout();
                    } else {
                        Toast.fire("Pemberitahuan", "Waktu sesi telah habis", "warning");
                    }
                } else {
                    logout();
                }
            },
        }
    );

    // mutation logout
    const logoutMutation = useMutation(
        () => AuthService.logout(),
        {
            onSuccess: () => {
                setToken(null);
                setUser(authContextDefaultValues.user);
                if (ipcRenderer) {
                    ipcRenderer.send("electron-store-set", "_token", "");
                }
            },
            onError: (err: AxiosError<BaseResponse>) => {
                if (err.isAxiosError && err.response) {
                    const statusCode = err.response.status;
                    const { message } = err.response.data;

                    switch (statusCode) {
                        case 422:
                            Toast.fire("Pemberitahuan!", message, "warning");
                            break;

                        default:
                            Toast.fire("Error!", message, "error");
                            break;
                    }
                } else {
                    Toast.fire("Error!", "Terjadi kesalahan pada sistem", "error");
                }
            },
        }
    );

    // Simpan token ke electron-store dan state
    const signIn = (val: string) => {
        setToken(val);
        if (ipcRenderer) {
            ipcRenderer.send("electron-store-set", "_token", val);
        }
    };

    // Hapus token dan reset state
    const logout = () => {
        logoutMutation.mutate();
    };

    // Refetch user detail
    const refetch = () => {
        fetchUser.refetch();
    };

    const context: AuthContextType = {
        token,
        user,
        logout,
        signIn,
        refetch,
    };

    return (
        <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);

