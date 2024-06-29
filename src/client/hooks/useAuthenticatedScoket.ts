'use client';
import { useSocket } from 'socket.io-react-hook';

export const useAuthenticatedSocket = () => {
  return useSocket({
    withCredentials: true,
  });
};
