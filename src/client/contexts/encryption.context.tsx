'use client';

import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export interface EncryptionData {
  salt: Uint8Array;
  encryptionKey: CryptoKey;
}

export interface EncryptionContextValue {
  data?: EncryptionData;
  setEncryptionData: (data: EncryptionData) => void;
  clearEncryptionData: () => void;
}

const EncryptionContext = createContext<EncryptionContextValue>({
  setEncryptionData: () => {
    throw new Error('No EncryptionContext is provided');
  },
  clearEncryptionData: () => {
    throw new Error('No EncryptionContext is provided');
  },
});

export const EncryptionContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [data, setData] = useState<EncryptionData | undefined>();

  const setEncryptionData = useCallback((newData: EncryptionData) => {
    setData(newData);
  }, []);
  const clearEncryptionData = useCallback(() => {
    setData(undefined);
  }, []);
  const encryptionContextValue = useMemo(
    (): EncryptionContextValue => ({
      data,
      setEncryptionData,
      clearEncryptionData,
    }),
    [data, setEncryptionData],
  );

  return (
    <EncryptionContext.Provider value={encryptionContextValue}>
      {children}
    </EncryptionContext.Provider>
  );
};

export const useEncryptionContext = () => useContext(EncryptionContext);
