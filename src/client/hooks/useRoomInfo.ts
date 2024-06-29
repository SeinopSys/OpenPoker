'use client';
import useSWR from 'swr';
import { RoomInfoDto } from '../../server/rooms/dto/room-info.dto';

export const useRoomInfo = (id?: string) =>
  useSWR(
    id ? `/rooms/${id}` : null,
    (key) =>
      fetch(key).then<RoomInfoDto>((r) =>
        r.ok ? r.json() : Promise.reject(r),
      ),
    {
      refreshInterval: 10e3,
      refreshWhenHidden: false,
      errorRetryCount: 3,
      keepPreviousData: true,
    },
  );
