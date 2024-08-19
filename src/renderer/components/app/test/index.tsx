import { FC } from 'react';
import { nanoid } from 'nanoid';

import { Props } from '..';

import styles from './test-app.module.scss';
import gif from './assets/images/image.gif';
import jpg from './assets/images/image.jpg';
import png from './assets/images/image.png';
import svg from './assets/images/image.svg';

export const TestApp: FC<Props> = ({ togglePage }) => {
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
          This ID is generated with <code>nanoid()</code>, a package only providing ES Modules in
          its last version: <pre>{nanoid()}</pre>
        </div>
      </section>

      <section>
        <h3>Images</h3>
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
        <ul>
          <li>
            <span className={`${styles.text} ${styles.woff}`}>woff</span>
          </li>
          <li>
            <span className={`${styles.text} ${styles.woff2}`}>woff2</span>
          </li>
          <li>
            <span className={`${styles.text} ${styles.eot}`}>eot</span>
          </li>
          <li>
            <span className={`${styles.text} ${styles.ttf}`}>ttf</span>
          </li>
          <li>
            <span className={`${styles.text} ${styles.otf}`}>otf</span>
          </li>
        </ul>
      </section>
    </div>
  );
};
