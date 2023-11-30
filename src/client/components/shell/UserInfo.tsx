'use client';

import { FC } from 'react';
import { useUserInfo } from '../../hooks/useUserInfo';
import styles from '../../scss/UserInfo.module.scss';
import { LoadingIndicator } from '../common/LoadingIndicator';
import { UserAvatar } from '../common/UserAvatar';

export const UserInfo: FC = () => {
  const result = useUserInfo();

  return (
    <div className={styles.info}>
      {!result.error && result.data ? (
        <>
          <UserAvatar userData={result.data} />
          <span className={styles.username}>{result.data.name}</span>
          <span className={styles.divider} />
          <form action="/auth/logout" method="POST" className={styles.logout}>
            <button>Logout</button>
          </form>
        </>
      ) : result.isLoading ? (
        <LoadingIndicator />
      ) : (
        <a href="/auth/login/github">Login</a>
      )}
      <span className={styles.divider} />
      <a
        href="https://github.com/SeinopSys/OpenPoker"
        target="_blank"
        rel="noreferrer noopener"
      >
        View source
      </a>
    </div>
  );
};
