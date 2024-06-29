import Image from 'next/image';
import React, { FC } from 'react';
import { SITE_TITLE } from '../../config';
import logoImage from '../../public/static/logos/app.svg';
import styles from '../../scss/AppTitle.module.scss';

export const AppTitle: FC = () => (
  <h1 className={styles.title}>
    <Image
      className={styles.image}
      src={logoImage}
      width={120}
      height={120}
      alt={`${SITE_TITLE} logo`}
    />
    <span>{SITE_TITLE}</span>
  </h1>
);
