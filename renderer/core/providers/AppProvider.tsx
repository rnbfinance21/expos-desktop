import React, { ReactNode } from 'react'
import { AuthContextProvider } from '../contexts/AuthContext'
import { QueryClient, QueryClientProvider } from 'react-query'
import { store } from '../../config/store'
import { Provider } from 'react-redux'

type Props = {
    children: ReactNode
}

const queryClient = new QueryClient();

export const AppProvider = ({ children }: Props) => {
    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <AuthContextProvider>{children}</AuthContextProvider>
            </Provider>
        </QueryClientProvider>
    )
}
