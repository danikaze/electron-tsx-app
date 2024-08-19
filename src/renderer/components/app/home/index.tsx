import { FC } from 'react';

import { Versions } from './versions';

import styles from './home.module.scss';
import electronLogo from '@/renderer/assets/electron.svg';
import { Props } from '..';

export const Home: FC<Props> = ({ togglePage }) => {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping');

  return (
    <>
      <img alt="logo" className={styles.logo} src={electronLogo} />
      <div className={styles.creator}>Powered by electron-vite</div>
      <div className={styles.creator}>
        Curated by{' '}
        <a
          href="https://github.com/danikaze/electron-tsx-app?tab=readme-ov-file#readme"
          target="_blank"
          rel="noreferrer"
        >
          danikaze
        </a>
      </div>
      <div className={styles.text}>
        Build an Electron app with <span className={styles.react}>React</span>
        &nbsp;and <span className={styles.ts}>TypeScript</span>
      </div>
      <p className={styles.tip}>
        Press <code>F12</code> to open the DevTools
      </p>
      <div className={styles.actions}>
        <div className={styles.action}>
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className={styles.action}>
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
      </div>
      <div className={styles.testLink} onClick={togglePage}>
        See tests
      </div>
      <Versions />
    </>
  );
};
