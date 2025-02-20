import {useAsync} from 'react-async';
import {useEffect} from 'react';
import ansiAlign from 'ansi-align';

import {
  FLAGSHIP_CODE_DESCRIPTION,
  FLAGSHIP_CODE_LABEL,
  FLAGSHIP_CODE_LOGO,
  FLAGSHIP_CODE_TITLE,
} from '../constants';

import {StatusAsyncComponents} from './StatusAsyncComponents';
import {StatusMessages} from './StatusMessages';
import {StatusProgress} from './StatusProgress';

/**
 * Props for the Status component
 */
type StatusProps = {
  /** Callback function to be called when status is done loading */
  res: Function;
  numberOfPlugins: number;
  cmd: string;
};

/**
 * Status component that displays the Flagship CLI interface
 * @param {Props} props - Component props
 * @param {Function} props.res - Callback function executed when loading completes
 * @returns {JSX.Element|null} Rendered Status component or null if data is loading/verbose mode
 */
export function Status({
  res,
  numberOfPlugins,
  cmd,
}: StatusProps): JSX.Element | null {
  const {data, isPending} = useAsync({
    promiseFn: StatusAsyncComponents,
  });

  /**
   * Effect hook to trigger callback when loading completes
   */
  useEffect(() => {
    if (!isPending) {
      res();
    }
  }, [isPending]);

  if (!data || isPending) return null;

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
          <Text color="gray"> [ {cmd} ] </Text>
        </Text>
        <StatusProgress numberOfPlugins={numberOfPlugins} />
      </Box>
    </Box>
  );
}
