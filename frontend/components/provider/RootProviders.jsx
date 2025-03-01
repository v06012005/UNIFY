'use client'


import AuthProvider from "@/components/provider/AuthProvider";
import {AppProvider} from "@/components/provider/AppProvider";
import {ModalProvider} from "@/components/provider/ModalProvider";
import {FollowProvider} from "@/components/provider/FollowProvider";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const RootProviders = ({ children }) => {

    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient} >
        <AuthProvider>
            <AppProvider>
                <ModalProvider>
                    <FollowProvider>{children}</FollowProvider>
                </ModalProvider>
            </AppProvider>
        </AuthProvider>
        </QueryClientProvider>
    )
}

export default RootProviders;