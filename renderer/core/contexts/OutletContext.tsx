import React, { createContext, useContext, useState, ReactNode } from "react";
import { useQuery } from "react-query";
import AuthService from "../../modules/auth/api";

export type OutletDetail = {
    id: number | null;
    name: string;
    address: string;
    code: string;
    open_state: boolean;
    tax: number;
    instagram: string;
    contact: string;
};

type OutletContextType = {
    outlet: OutletDetail;
    kasState: boolean;
    setKasState: (state: boolean) => void;
    openState: boolean;
    setOpenState: (state: boolean) => void;
    refetchOutlet: () => void;
};

type Props = {
    children: ReactNode;
};

const outletContextDefaultValues: OutletContextType = {
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
    kasState: false,
    setKasState: () => { },
    openState: false,
    setOpenState: () => { },
    refetchOutlet: () => { },
};

const OutletContext = createContext<OutletContextType>(outletContextDefaultValues);

export const OutletContextProvider = ({ children }: Props) => {
    const [outlet, setOutlet] = useState<OutletDetail>(outletContextDefaultValues.outlet);
    const [kasState, setKasState] = useState(false);
    const [openState, setOpenState] = useState(false);

    // Helper untuk validasi tax outlet
    const resolveOutletTax = (nextTax: unknown, prevTax: number): number => {
        if (typeof nextTax === "number" && !Number.isNaN(nextTax)) {
            return nextTax;
        }
        return prevTax;
    };

    // Query outlet profile
    const fetchOutlet = useQuery(
        ["outlet_profile"],
        async () => {
            const outletRes = await AuthService.profileOutlet();
            return outletRes.data;
        },
        {
            retry: 3,
            refetchOnWindowFocus: false,
            onSuccess: (outlet) => {
                setOutlet((prevOutlet) => ({
                    id: outlet.id,
                    name: outlet.name,
                    address: outlet.address,
                    code: outlet.code,
                    open_state: !!outlet.open_state,
                    tax: resolveOutletTax(outlet.tax, prevOutlet.tax),
                    instagram: outlet.instagram,
                    contact: outlet.contact,
                }));
                setKasState(outlet.kas_state);
                setOpenState(outlet.open_state);
            },
        }
    );

    const refetchOutlet = () => {
        fetchOutlet.refetch();
    };

    const context: OutletContextType = {
        outlet,
        kasState,
        setKasState,
        openState,
        setOpenState,
        refetchOutlet,
    };

    return (
        <OutletContext.Provider value={context}>{children}</OutletContext.Provider>
    );
};

export const useOutlet = () => useContext(OutletContext);
