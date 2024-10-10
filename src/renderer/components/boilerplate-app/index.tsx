import { FC, useCallback, useState } from 'react';

import { I18nProvider } from '@/shared/i18n';

import { Home } from './home';
import { TestApp } from './test';

export interface Props {
  togglePage: () => void;
}

export const BoilerplateApp: FC = () => {
  const [showTests, setShowTests] = useState(false);
  const togglePage = useCallback(
    () => setShowTests((showTests) => !showTests),
    []
  );

  /*
   * Usually this kind of navigation would be done with React.Router but this is simple enough to
   * not need adding an extra dependency just to show things works ;)
   */
  const contents = showTests ? (
    <TestApp togglePage={togglePage} />
  ) : (
    <Home togglePage={togglePage} />
  );

  return <I18nProvider>{contents}</I18nProvider>;
};
