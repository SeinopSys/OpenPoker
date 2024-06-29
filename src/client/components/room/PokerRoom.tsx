'use client';

import React, { FC, useCallback } from 'react';
import type { RoomInfoDto } from '../../../server/rooms/dto/room-info.dto';
import { useAuthenticatedSocket } from '../../hooks/useAuthenticatedScoket';
import { Decrypt } from '../common/Decrypt';

export interface PokerRoomProps {
  room: RoomInfoDto;
}

export const PokerRoom: FC<PokerRoomProps> = ({ room }) => {
  const { socket } = useAuthenticatedSocket();
  const handleLeave = useCallback(() => {
    socket.emit('rooms.leave', { id: room.id });
  }, [room.id, socket]);
  return (
    <>
      <h2>
        Welcome to room <Decrypt text={room.name} />
      </h2>
      <button type="button" onClick={handleLeave}>
        Leave room
      </button>
    </>
  );
};
