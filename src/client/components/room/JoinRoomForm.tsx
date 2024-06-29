'use client';

import React, {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';
import { JoinRoomDto } from '../../../server/rooms/dto/join-room.dto';
import type { RoomInfoDto } from '../../../server/rooms/dto/room-info.dto';
import { useEncryptionContext } from '../../contexts/encryption.context';
import { useAuthenticatedSocket } from '../../hooks/useAuthenticatedScoket';
import { useHash } from '../../hooks/useHash';
import styles from '../../scss/JoinRoomForm.module.scss';
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  encrypt,
  getAESKeyFromPBKDF,
  getKeyFromPassword,
} from '../../utils/crypto';
import { Passphrase } from '../../utils/passphrase';
import { Decrypt } from '../common/Decrypt';

export interface JoinRoomFormProps {
  room: RoomInfoDto;
}

export const JoinRoomForm: FC<JoinRoomFormProps> = ({ room }) => {
  const hash = useHash();
  const salt = useMemo(() => {
    try {
      if (hash.length > 0) {
        return new Uint8Array(base64ToArrayBuffer(hash));
      }
    } catch (e) {
      console.error(e);
    }

    return null;
  }, [hash]);
  const { connected, socket } = useAuthenticatedSocket();
  const { setEncryptionData } = useEncryptionContext();
  const saltId = useId();
  const passwordId = useId();
  const [roomPassphrase, setRoomPassphrase] = useState('');
  const handlePasswordChange: ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setRoomPassphrase(e.target.value);
    }, []);
  const [isValidPassword, setIsValidPassword] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();
      if (!salt || !roomPassphrase) return;

      // Attempt to decrypt room data
      const encryptionKey = await getAESKeyFromPBKDF(
        await getKeyFromPassword(roomPassphrase),
        salt,
      );
      const dto: JoinRoomDto = {
        id: room.id,
        passphrase: await encrypt(roomPassphrase, encryptionKey, salt).then(
          (v) => arrayBufferToBase64(v),
        ),
      };
      socket.emit('rooms.join', dto);
      setEncryptionData({ salt, encryptionKey });
    },
    [room.id, roomPassphrase, salt, setEncryptionData, socket],
  );

  useEffect(() => {
    setIsValidPassword(false);
    if (roomPassphrase.length === 0) {
      return;
    }

    Passphrase.checksum(roomPassphrase)
      .then((result) => {
        setIsValidPassword(result);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [roomPassphrase]);

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>
        Join room <Decrypt text={room.name} />
      </h2>
      <p>
        <input
          id="saltId"
          type="checkbox"
          name="salt"
          checked={salt !== null}
          readOnly
          required
        />
        &nbsp;
        <label htmlFor={saltId}>Salt in URL hash</label>
      </p>
      {!salt && <p className={styles.error}>URL hash is missing or invalid</p>}

      <label htmlFor={passwordId}>Password</label>
      <input
        id={passwordId}
        type="password"
        name="passphrase"
        required
        value={roomPassphrase}
        onChange={handlePasswordChange}
        spellCheck={false}
      />
      {!isValidPassword && (
        <p className={styles.error}>
          Please provide the room password to continue
        </p>
      )}
      <button disabled={!isValidPassword || salt === null || !connected}>
        Join
      </button>
      {!connected && <p>Waiting for gateway connection…</p>}
    </form>
  );
};
