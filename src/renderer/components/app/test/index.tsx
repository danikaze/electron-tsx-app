import { clsx } from 'clsx';
import { FC, useCallback, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';

import { Props } from '..';

import styles from './test-app.module.scss';
import gif from './assets/images/image.gif';
import jpg from './assets/images/image.jpg';
import png from './assets/images/image.png';
import svg from './assets/images/image.svg';

export const TestApp: FC<Props> = ({ togglePage }) => {
  const [randomId] = useState(nanoid());
  const [received, setReceived] = useState(false);

  const sendPing = useCallback(() => {
    window.electron.ipcRenderer.invoke('ping');
  }, []);

  useEffect(() => {
    let handler: ReturnType<typeof setTimeout>;

    window.electron.ipcRenderer.on('pong', () => {
      const VISIBLE_TIME = 600;
      clearTimeout(handler);
      setReceived(true);
      handler = setTimeout(() => setReceived(false), VISIBLE_TIME);
    });

    return (): void => {
      window.electron.ipcRenderer.removeAllListeners('pong');
      clearTimeout(handler);
    };
  }, []);

  return (
    <div className={styles.root}>
      <h1>Environment Features</h1>
      <div className={styles.text}>This page serves as a test for the supported features.</div>
      <div className={styles.testLink} onClick={togglePage}>
        Go back Home
      </div>

      <section>
        <h3>ESM Imports</h3>
        <div className={styles.text}>
          This ID is generated with <code>nanoid()</code>, a package only providing ES Modules:
          <pre>{randomId}</pre>
        </div>
      </section>

      <section>
        <h3>IPC</h3>
        <div className={styles.text}>
          The <code>ping</code> is sent via IPC commands, and the <code>pong</code> is received with
          IPC events:
        </div>
        <div className={styles.ipc}>
          <div className={styles.ping} onClick={sendPing}>
            Send ping
          </div>
          <div className={clsx(styles.pong, received && styles.received)}>pong!</div>
        </div>
      </section>

      <section>
        <h3>Images</h3>
        <div className={styles.text}>Assets can be loaded with different formats</div>
        <ul className={styles.images}>
          <li>
            <img src={gif} alt="Image in gif format" />
          </li>
          <li>
            <img src={jpg} alt="Image in jpg format" />
          </li>
          <li>
            <img src={png} alt="Image in png format" />
          </li>
          <li>
            <img src={svg} alt="Image in svg format" />
          </li>
        </ul>
      </section>

      <section>
        <h3>Fonts</h3>
        <div className={styles.text}>Fonts of different types can be used</div>
        <ul>
          <li>
            <span className={clsx(styles.text, styles.woff)}>woff</span>
          </li>
          <li>
            <span className={clsx(styles.text, styles.woff2)}>woff2</span>
          </li>
          <li>
            <span className={clsx(styles.text, styles.eot)}>eot</span>
          </li>
          <li>
            <span className={clsx(styles.text, styles.ttf)}>ttf</span>
          </li>
          <li>
            <span className={clsx(styles.text, styles.otf)}>otf</span>
          </li>
        </ul>
      </section>
    </div>
  );
};
