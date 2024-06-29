'use client';

import { FC, useMemo } from 'react';
import { useAuthenticatedSocket } from '../../hooks/useAuthenticatedScoket';
import styles from '../../scss/GatewayStatus.module.scss';
import { StatusIndicator } from '../common/StatusIndicator';

export const GatewayStatus: FC = () => {
  const { error, connected } = useAuthenticatedSocket();

  const gatewayStatus = useMemo(() => {
    const classes = [styles['gateway-status']];
    let title = 'Connecting…';
    let loading = true;
    if (error) {
      classes.push(styles.error);
      title = 'Gateway Error';
      loading = false;
    }
    if (connected) {
      classes.push(styles.connected);
      title = 'Gateway Connected';
      loading = false;
    }
    return {
      className: classes.join(' '),
      title,
      loading,
    };
  }, [connected, error]);

  const loaded = !gatewayStatus.loading;

  return (
    <span className={gatewayStatus.className} title={gatewayStatus.title}>
      <StatusIndicator inheritColor={loaded} disableAnimation={loaded} />
    </span>
  );
};
