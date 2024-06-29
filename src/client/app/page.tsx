'use client';

import { NextPage } from 'next';
import React, { Fragment } from 'react';
import { AppTitle } from '../components/common/AppTitle';
import { CreateRoomForm } from '../components/home/CreateRoomForm';
import { useUserInfo } from '../hooks/useUserInfo';
import styles from '../scss/Index.module.scss';

const Index: NextPage = () => {
  const userInfo = useUserInfo();

  return (
    <Fragment>
      <div className={styles.index}>
        <AppTitle />
        <p>
          Helps create and run a SCRUM planning poker session for estimations
        </p>

        {userInfo.data ? (
          <CreateRoomForm />
        ) : (
          <p className={styles.construction}>
            🚧 Website still under construction! 🚧
          </p>
        )}
      </div>
    </Fragment>
  );
};

export default Index;
