import { Metadata } from 'next';
import React, { FC, PropsWithChildren } from 'react';
import '../app.scss';
import { clientEnv } from '../client-env';
import { ClientIoProvider } from '../components/shell/ClientIoProvider';
import { RouterTransition } from '../components/shell/RouterTransition';
import { UserInfo } from '../components/shell/UserInfo';
import { SITE_TITLE } from '../config';
import { EncryptionContextProvider } from '../contexts/encryption.context';
import { publicAssetPath } from '../utils/public-asset-path';
import Script from 'next/script';

const openGraph: Metadata['openGraph'] = {
  title: SITE_TITLE,
  description:
    'Helps create and run a SCRUM planning poker session for estimations',
  images: publicAssetPath('/social.png'),
  type: 'website',
  siteName: SITE_TITLE,
  url: '/',
};

export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.PUBLIC_HOST),
  title: openGraph.title,
  description: openGraph.description,
  openGraph,
  icons: publicAssetPath('/logos/logo.png'),
};

const App: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <RouterTransition />
        <ClientIoProvider>
          <EncryptionContextProvider>
            {children}
            <UserInfo />
          </EncryptionContextProvider>
        </ClientIoProvider>
        <Script src="" />
      </body>
    </html>
  );
};

export default App;
