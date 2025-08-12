'use client';

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from 'react';

interface SettingsContextData {
  enable3D: boolean;
  setEnable3D: Dispatch<SetStateAction<boolean>>;
  is3DLoading: boolean;
  setIs3DLoading: Dispatch<SetStateAction<boolean>>;
}

export const SettingsContext = createContext<SettingsContextData>(
  {} as SettingsContextData
);

export function SettingsProvider({ children }: PropsWithChildren) {
  const [enable3D, setEnable3D] = useState<boolean>(false);
  const [is3DLoading, setIs3DLoading] = useState<boolean>(false);

  return (
    <SettingsContext.Provider
      value={{ enable3D, setEnable3D, is3DLoading, setIs3DLoading }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
