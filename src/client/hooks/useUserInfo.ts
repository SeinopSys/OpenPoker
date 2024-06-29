'use client';
import useSWR from 'swr';
import { UserInfoDto } from '../../server/users/dto/user-info.dto';
import { useAuthenticatedSocket } from './useAuthenticatedScoket';

export const useUserInfo = () => {
  const { socket, connected } = useAuthenticatedSocket();
  return useSWR(
    connected ? 'users.findMe' : null,
    (key) =>
      new Promise<UserInfoDto>((res, rej) => {
        socket.timeout(5e3).emit(key, (err, response) => {
          if (err || !response) {
            rej(err);
            return;
          }

          res(response);
        });
      }),
    {
      refreshInterval: 10e3,
      refreshWhenHidden: false,
      errorRetryCount: 3,
      keepPreviousData: true,
    },
  );
};
