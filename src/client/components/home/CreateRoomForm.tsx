'use client';

import { useRouter } from 'next/navigation';
import {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useCallback,
  useEffect,
  useId,
  useState,
} from 'react';
import { CreateRoomDto } from '../../../server/rooms/dto/create-room.dto';
import { RoomInfoDto } from '../../../server/rooms/dto/room-info.dto';
import { useAuthenticatedSocket } from '../../hooks/useAuthenticatedScoket';
import styles from '../../scss/CreateRoomForm.module.scss';
import {
  arrayBufferToBase64,
  encrypt,
  getAESKeyFromPBKDF,
  getKeyFromPassword,
} from '../../utils/crypto';
import { Passphrase, TargetEntropy } from '../../utils/passphrase';

export const CreateRoomForm: FC = () => {
  const router = useRouter();
  const { connected, socket } = useAuthenticatedSocket();
  const [roomName, setRoomName] = useState('');
  const [roomPassphrase, setRoomPassphrase] = useState('');
  const [passwordBits, setPasswordBits] = useState<TargetEntropy>(256);
  const nameId = useId();
  const passwordId = useId();
  const handleNameChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setRoomName(e.target.value);
    },
    [],
  );
  const handlePasswordBitsChange: ChangeEventHandler<HTMLSelectElement> =
    useCallback((e) => {
      setPasswordBits(parseInt(e.target.value, 10) as TargetEntropy);
    }, []);
  const selectTarget = useCallback((e) => {
    (e.target as HTMLTextAreaElement).select();
  }, []);
  const handleSubmit: FormEventHandler = useCallback(
    async (e) => {
      e.preventDefault();

      const salt = window.crypto.getRandomValues(new Uint8Array(128));
      const encryptionKey = await getAESKeyFromPBKDF(
        await getKeyFromPassword(roomPassphrase),
        salt,
      );
      const dto: CreateRoomDto = {
        name: await encrypt(roomName, encryptionKey, salt).then((v) =>
          arrayBufferToBase64(v),
        ),
        passphrase: await encrypt(roomPassphrase, encryptionKey, salt).then(
          (v) => arrayBufferToBase64(v),
        ),
      };
      socket.emit('rooms.create', dto, (room: RoomInfoDto | undefined) => {
        if (!room) {
          console.error('Failed to create room', room);
          return;
        }

        router.push(`/room/${room.id}#${arrayBufferToBase64(salt)}`);
      });
    },
    [roomName, roomPassphrase, router, socket],
  );
  const generateNewPassphrase = useCallback(() => {
    Passphrase.generate(passwordBits).then((v: string) =>
      setRoomPassphrase(v.replace(/\s+/g, '-')),
    );
  }, [passwordBits]);

  useEffect(() => {
    generateNewPassphrase();
  }, [generateNewPassphrase]);

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Create room</h2>
      <label htmlFor={nameId}>Room name</label>
      <input
        id={nameId}
        name="name"
        type="text"
        required
        value={roomName}
        onChange={handleNameChange}
      />

      <label htmlFor={passwordId}>Password</label>
      <textarea
        id={passwordId}
        className={styles.password}
        name="passphrase"
        required
        value={roomPassphrase}
        readOnly
        spellCheck={false}
        onFocus={selectTarget}
      />
      <div>
        <button type="button" onClick={generateNewPassphrase}>
          Generate new
        </button>
        <select value={passwordBits} onChange={handlePasswordBitsChange}>
          <option value="128">128-bit</option>
          <option value="160">160-bit</option>
          <option value="192">192-bit</option>
          <option value="224">224-bit</option>
          <option value="256">256-bit</option>
        </select>
      </div>

      <p>
        Rooms are end-to-end encrypted and their contents can only be accessed
        by providing the password specified above.
        <br />
        Make sure to save the room password before creating, as you will not be
        able to access it later.
      </p>

      <button disabled={!connected}>Create</button>
      {!connected && <p>Waiting for gateway connection…</p>}
    </form>
  );
};
