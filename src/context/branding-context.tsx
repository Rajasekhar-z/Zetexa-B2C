'use client';
import React, { createContext, useContext } from 'react';

// Create context
const BrandingContext = createContext<any>(null);

// Create hook to use it
export const useBranding = () => useContext(BrandingContext);

// Export provider component
export const BrandingProvider = ({ value, children }: { value: any, children: React.ReactNode }) => {
  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
};
