import {QueryClient, isServer} from "@tanstack/react-query";

const makeQueryClient = () => {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000
            }
        }
    })
}

let browserQueryClient;

export const getQueryClient = () => {
    if(isServer) {
        return makeQueryClient();
    }else {
        if(!browserQueryClient) {
            browserQueryClient = makeQueryClient();
            return browserQueryClient;
        }
    }
}