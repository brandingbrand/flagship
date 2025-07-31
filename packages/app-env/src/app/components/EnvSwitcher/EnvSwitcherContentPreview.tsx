import React, {useMemo} from 'react';

import {useEnvSwitcher} from '../../lib/context';
import {envs} from '../../lib/env';
import {CodeBlock} from '../ui';

export function EnvSwitcherContentPreview() {
  const [env] = useEnvSwitcher();

  const content = useMemo(() => {
    const data = (envs as any)[env];

    return JSON.stringify(data, null, 2);
  }, [env]);

  return <CodeBlock>{content}</CodeBlock>;
}
