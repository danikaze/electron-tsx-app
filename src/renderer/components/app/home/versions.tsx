import { FC, useState } from 'react';

import styles from './home.module.scss';

export const Versions: FC = () => {
  const [versions] = useState(window.electron.process.versions);

  return (
    <ul className={styles.versions}>
      <li>Electron v{versions.electron}</li>
      <li>Chromium v{versions.chrome}</li>
      <li>Node v{versions.node}</li>
    </ul>
  );
};
