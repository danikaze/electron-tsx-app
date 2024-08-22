import { clsx } from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';

import { i18n, useTranslation, WithI18nNs } from '@/shared/i18n';

import { Props } from '..';

import styles from './test-app.module.scss';
import gif from './assets/images/image.gif';
import jpg from './assets/images/image.jpg';
import png from './assets/images/image.png';
import svg from './assets/images/image.svg';

export const TestApp = WithI18nNs<Props>(
  { ns: 'test-app', renderWhileLoading: false },
  ({ togglePage }) => {
    const { t } = useTranslation('test-app');

    const [randomId] = useState(nanoid());
    const [received, setReceived] = useState(false);

    const setEnglish = useCallback(() => i18n.changeLanguage('en'), []);
    const setJapanese = useCallback(() => i18n.changeLanguage('ja'), []);

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
        <h1>{t('title')}</h1>
        <div className={styles.text}>{t('intro')}</div>
        <div className={styles.testLink} onClick={togglePage}>
          {t('goBack')}
        </div>

        <section>
          <h3>{t('i18n.title')}</h3>
          <div className={styles.text}>
            {t('i18n.desc')}
            <ul className={styles.langs}>
              <li className={clsx(i18n.language === 'en' && styles.active)} onClick={setEnglish}>
                {t('en')}
              </li>
              <li className={clsx(i18n.language === 'ja' && styles.active)} onClick={setJapanese}>
                {t('ja')}
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h3>{t('esm.title')}</h3>
          <div className={styles.text}>
            {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
            <span dangerouslySetInnerHTML={{ __html: t('esm.desc') }} />
            <pre>{randomId}</pre>
          </div>
        </section>

        <section>
          <h3>{t('ipc.title')}</h3>
          {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
          <div className={styles.text} dangerouslySetInnerHTML={{ __html: t('ipc.desc') }} />
          <div className={styles.ipc}>
            <div className={styles.ping} onClick={sendPing}>
              {t('sendPing')}
            </div>
            <div className={clsx(styles.pong, received && styles.received)}>{t('pong')}</div>
          </div>
        </section>

        <section>
          <h3>{t('images.title')}</h3>
          <div className={styles.text}>{t('images.desc')}</div>
          <ul className={styles.images}>
            <li>
              <img src={gif} alt={t('images.alt', { format: 'gif' })} />
            </li>
            <li>
              <img src={jpg} alt={t('images.alt', { format: 'jpg' })} />
            </li>
            <li>
              <img src={png} alt={t('images.alt', { format: 'png' })} />
            </li>
            <li>
              <img src={svg} alt={t('images.alt', { format: 'svg' })} />
            </li>
          </ul>
        </section>

        <section>
          <h3>{t('fonts.title')}</h3>
          <div className={styles.text}>{t('fonts.desc')}</div>
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
  }
);
