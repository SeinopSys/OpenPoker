'use client';

import { FC, memo, useMemo } from 'react';
import { UserInfoDto } from '../../../server/users/dto/user-info.dto';
import styles from '../../scss/UserAvatar.module.scss';
import { StatusIndicator } from './StatusIndicator';
import { usePreloadedImage } from '../../hooks/usePreloadedImage';

const UserAvatarComponent: FC<{ userData: UserInfoDto }> = ({ userData }) => {
  const avatarUrl: string | undefined = useMemo(() => {
    if (userData.githubUsers.length > 0) {
      const githubAvatar = userData.githubUsers.find((du) => du.avatarUrl);
      if (githubAvatar) {
        return githubAvatar.avatarUrl;
      }
    }
  }, [userData.githubUsers]);

  const { src, loading } = usePreloadedImage(avatarUrl);

  if (loading) return <StatusIndicator />;

  if (!src) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="avatar image" className={styles.avatar} />
  );
};

export const UserAvatar = memo(UserAvatarComponent);
