"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface SocketContextProps {
  socket: Socket | null;
  cryptoData: any[];
}

const SocketContext = createContext<SocketContextProps>({ socket: null, cryptoData: [] });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [cryptoData, setCryptoData] = useState<any[]>([]);

  useEffect(() => {
    // In production this would be an env var
    const newSocket = io('https://crypto-app-6ns2.onrender.com');
    setSocket(newSocket);

    newSocket.on('cryptoUpdate', (data: any[]) => {
      setCryptoData(data);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, cryptoData }}>
      {children}
    </SocketContext.Provider>
  );
};
