import { FC, useEffect, useState } from 'react';
import { useEncryptionContext } from '../../contexts/encryption.context';
import { decrypt } from '../../utils/crypto';

export interface DecryptProps {
  text: string | undefined;
  fallback?: string;
}

export const Decrypt: FC<DecryptProps> = ({ text, fallback = text }) => {
  const { data } = useEncryptionContext();
  const [decryptedText, setDecryptedText] = useState(null);

  useEffect(() => {
    setDecryptedText(null);
    if (data && text) {
      decrypt(text, data.encryptionKey, data.salt).then((result) => {
        setDecryptedText(result);
      });
    }
  }, [data, text]);

  return <>{decryptedText ?? fallback}</>;
};
