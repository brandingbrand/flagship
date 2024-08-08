import {useAsync} from 'react-async';
import {program} from 'commander';
import {useEffect} from 'react';
import ansiAlign from 'ansi-align';

import {AsyncComponents} from './AsyncComponents';
import {StatusMessages} from './StatusMessages';
import StatusProgress from './StatusProgress';

import {
  config,
  FLAGSHIP_CODE_DESCRIPTION,
  FLAGSHIP_CODE_LABEL,
  FLAGSHIP_CODE_LOGO,
  FLAGSHIP_CODE_TITLE,
} from '@/lib';

type Props = {
  res: Function;
};

export function Status({res}: Props) {
  const {data, isPending} = useAsync({
    promiseFn: AsyncComponents,
  });

  useEffect(() => {
    if (!isPending) {
      res();
    }
  }, [isPending]);

  if (!data || isPending || config.options.verbose) return null;

  const {Box, Text} = data;

  return (
    <Box flexDirection="column">
      <Text>{FLAGSHIP_CODE_LOGO}</Text>
      <Text>
        {ansiAlign([FLAGSHIP_CODE_TITLE, FLAGSHIP_CODE_DESCRIPTION]).join(
          '\n',
        ) + '\n'}
      </Text>
      <StatusMessages />
      <Box marginTop={1} marginBottom={1} flexDirection="row">
        <Text>
          {FLAGSHIP_CODE_LABEL}
          <Text color="gray"> [ {program.args[0]} ] </Text>
        </Text>
        <StatusProgress />
      </Box>
    </Box>
  );
}
