import {useAsync} from 'react-async';
import {useEffect, useState} from 'react';

import {Action} from './Action';
import {AsyncComponents} from './AsyncComponents';

import {
  CODE_EVENT,
  DEPENDENCIES_EVENT,
  ENV_EVENT,
  Group,
  Status,
  TEMPLATE_EVENT,
  config,
  emitter,
} from '@/lib';

const groups: Record<Group, string> = {
  template: TEMPLATE_EVENT,
  env: ENV_EVENT,
  code: CODE_EVENT,
  dependencies: DEPENDENCIES_EVENT,
};

type Event = {
  name: Group;
  status: Status;
};

export function Actions() {
  const [actions, setActions] = useState({});

  function handler(event: Event): void {
    setActions(prevState => ({
      ...prevState,
      [event.name]: event.status,
    }));
  }

  useEffect(() => {
    emitter.on('action', handler as any);

    return () => {
      emitter.off('action', handler as any);
    };
  }, []);

  const {data: Components, isPending} = useAsync({
    promiseFn: AsyncComponents,
  });

  if (!Components || isPending) return <></>;

  const {Box} = Components;

  if (config.options.verbose) return null;

  return (
    <Box flexDirection="column">
      <Box marginTop={1} marginBottom={1} flexDirection="column">
        {Object.keys(actions).map(it => (
          <Action
            key={it}
            status={(actions as any)[it]}
            name={(groups as any)[it]}
          />
        ))}
      </Box>
    </Box>
  );
}
