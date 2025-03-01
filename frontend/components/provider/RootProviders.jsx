'use client'

import AuthProvider from "@/components/provider/AuthProvider";
import {AppProvider} from "@/components/provider/AppProvider";
import {FollowProvider} from "@/components/provider/FollowProvider";

const RootProviders = ({ children }) => {


    return (
        <QueryClientProvider client={queryClient} >
        <AuthProvider>
            <AppProvider>
                <ModalProvider>
                </ModalProvider>
            </AppProvider>
        </AuthProvider>
        </QueryClientProvider>
    )
}

export default RootProviders;