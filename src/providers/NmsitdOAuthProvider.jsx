import React from 'react';
import BaseProvider from './BaseProvider';

const NmsitdOAuthProvider = ({ children }) => {
  return (
    <BaseProvider>
      { children }
    </BaseProvider>
  );
}

export default NmsitdOAuthProvider;