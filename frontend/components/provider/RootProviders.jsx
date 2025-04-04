"use client";

import AuthProvider from "@/components/provider/AuthProvider";
import { AppProvider } from "@/components/provider/AppProvider";
import { FollowProvider } from "@/components/provider/FollowProvider";
import { ModalProvider } from "@/components/provider/ModalProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/components/client/QueryClient";
import { SuggestedUsersProvider } from "./SuggestedUsersProvider";
import { ReportProvider } from "./ReportProvider";
import { BookmarkProvider } from "./BookmarkProvider";
const RootProviders = ({ children }) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <ReportProvider>
            <BookmarkProvider>
              <ModalProvider>
                <SuggestedUsersProvider>
                  <FollowProvider>{children}</FollowProvider>
                </SuggestedUsersProvider>
              </ModalProvider>
            </BookmarkProvider>
          </ReportProvider>
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default RootProviders;
