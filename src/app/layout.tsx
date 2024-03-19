import React, {PropsWithChildren} from 'react';
import Image from 'next/image';
import Script from 'next/script';

import congratulations from '../assets/congratulations.png';
import {MiroSDKInit} from '../components/SDKInit';

export default function RootLayout({children}: PropsWithChildren) {
  return (
    <html>
      <body>
        <Script
          src="https://miro.com/app/static/sdk/v2/miro.js"
          strategy="beforeInteractive"
        />
        <MiroSDKInit />
        {children}
      </body>
    </html>
  );
}
