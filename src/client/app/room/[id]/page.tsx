'use client';

import { NextPage } from 'next';
import React, { useCallback, useEffect, useState } from 'react';
import { AppTitle } from '../../../components/common/AppTitle';
import { JoinRoomForm } from '../../../components/room/JoinRoomForm';
import { PokerRoom } from '../../../components/room/PokerRoom';
import { useEncryptionContext } from '../../../contexts/encryption.context';
import { useAuthenticatedSocket } from '../../../hooks/useAuthenticatedScoket';
import { useRoomInfo } from '../../../hooks/useRoomInfo';
import styles from '../../../scss/RoomPage.module.scss';

export interface RoomPageProps {
  params: { id: string };
}

const RoomPage: NextPage<RoomPageProps> = ({ params }) => {
  const roomInfo = useRoomInfo(params.id);
  const [socketRooms, setSocketRooms] = useState<string[]>([]);
  const { socket } = useAuthenticatedSocket();
  const { clearEncryptionData } = useEncryptionContext();
  const handleRoomsJoined = useCallback(
    (joinedRoomId: string) => {
      setSocketRooms([...socketRooms, joinedRoomId]);
    },
    [socketRooms],
  );
  const handleRoomsLeft = useCallback(
    (leftRoomId: string) => {
      setSocketRooms(socketRooms.filter((roomId) => roomId !== leftRoomId));
      if (leftRoomId === params.id) {
        clearEncryptionData();
      }
    },
    [clearEncryptionData, params.id, socketRooms],
  );

  useEffect(() => {
    socket.on('rooms.joined', handleRoomsJoined);
    socket.on('rooms.left', handleRoomsLeft);

    return () => {
      socket.off('rooms.joined', handleRoomsJoined);
      socket.off('rooms.left', handleRoomsLeft);
    };
  }, [handleRoomsJoined, handleRoomsLeft, socket]);

  return (
    <div className={styles['room-layout']}>
      <AppTitle />

      {roomInfo.isLoading && <p>Loading room information&hellip;</p>}
      {roomInfo.error && <p>Loading room information failed.</p>}
      {roomInfo.data &&
        (socketRooms.includes(roomInfo.data.id) ? (
          <PokerRoom room={roomInfo.data} />
        ) : (
          <JoinRoomForm room={roomInfo.data} />
        ))}
    </div>
  );
};

export default RoomPage;
