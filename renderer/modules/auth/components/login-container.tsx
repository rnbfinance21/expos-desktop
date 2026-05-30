import Image from 'next/image'
import React, { useEffect, useState } from 'react'


import IconRamen from "../../../../resources/images/icon-ramen-2.png";
import LoginForm from './login-form';

const LoginContainer = () => {

    const [appVersion, setAppVersion] = useState<string | null>(null);
    const year = new Date().getFullYear();

    useEffect(() => {
        const getAppVersion = () => {
            if (typeof window !== 'undefined' && (window as any).require) {
                try {
                    const ipcRenderer = (window as any).require('electron').ipcRenderer;
                    const version = ipcRenderer.sendSync("get-app-version");
                    setAppVersion(version);
                } catch (e) {
                    setAppVersion(null);
                }
            }
        };
        getAppVersion();
    }, []);

    return (
        <div className="w-full min-h-screen flex flex-row bg-white">
            <div className="flex-1 bg-red-500 flex justify-center items-center">
                <div className="w-40 h-40 bg-white rounded-lg shadow overflow-hidden">
                    <Image src={IconRamen} alt="Icon Ramen" width={160} height={160} />
                </div>
            </div>
            <div className="w-[450px] flex flex-col">
                <div className="flex-1 flex flex-col p-4 justify-center">
                    <div className="mb-4">
                        <p className="text-2xl font-semibold">
                            Selamat Datang
                        </p>
                        <p className="text-sm font-light text-gray-500">
                            Silahkan masuk dengan akun Anda
                        </p>
                    </div>
                    <LoginForm />
                </div>
                <div className="flex flex-row justify-center items-center p-4">
                    <span className="text-sm font-bold">
                        &copy; {year} CV. Ramen Nikmat Barokah{" "}
                        {appVersion ? `v${appVersion}` : ""}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default LoginContainer