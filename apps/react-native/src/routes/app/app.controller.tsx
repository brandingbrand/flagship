// @ts-ignore
import openURLInBrowser from 'react-native/Libraries/Core/Devtools/openURLInBrowser';

import {useNavigator} from '@brandingbrand/fsapp';

export default (
  props: PropsWithChildrenFunction<
    {},
    {onPressDocs: () => void; onPressLink: (link: string) => () => void}
  >,
) => {
  const {children} = props;
  const navigator = useNavigator();

  const onPressDocs = () => {
    openURLInBrowser(
      'https://feat-flagship-12--whimsical-tartufo-49504f.netlify.app/',
    );
  };

  const onPressLink = (link: string) => () => {
    if (link !== 'plugin-permissions') {
      const path = link.replace('plugin-', '');

      return openURLInBrowser(
        `https://feat-flagship-12--whimsical-tartufo-49504f.netlify.app/en/packages/plugins/${path}`,
      );
    }

    navigator.push(`/${link}`);
  };

  return children({
    onPressDocs,
    onPressLink,
  });
};
