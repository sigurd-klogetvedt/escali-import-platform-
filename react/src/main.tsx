import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import '@/index.css';
import "@/config/i18n.ts";

import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from '@/config/authConfig.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setMsalInstance } from '@/api/apiClient.ts';
import { Suspense } from 'react';
import { appRouter } from '@/router.tsx';
import { Toaster } from 'sonner';

const msalInstance = new PublicClientApplication(msalConfig);
setMsalInstance(msalInstance);

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <MsalProvider instance={msalInstance}>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={null}>
        <RouterProvider router={appRouter} />
      </Suspense>
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  </MsalProvider>
)
