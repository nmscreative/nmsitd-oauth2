import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Main from '../components/Main';

const queryClient = new QueryClient();
const BaseProvider = ({ children }) => {
  return (
     <QueryClientProvider client={queryClient}>
      <Main>
        { children }
      </Main>
    </QueryClientProvider>
  );
}

export default BaseProvider;
