import {useAsync} from 'react-async';
import {useEffect, useState} from 'react';
import {FlagshipCodeManager} from '@brandingbrand/code-cli-kit';

import {StatusAsyncComponents} from './StatusAsyncComponents';

interface ProgressState {
  percent: number;
  result?: 'success' | 'fail';
}

/**
 * Status progress component that displays a loading spinner, progress bar, and completion state
 * @returns A React component showing the current progress state with visual indicators
 */
export default function StatusProgress() {
  const [state, setState] = useState<ProgressState>({
    percent: 0,
    result: undefined,
  });

  const {data, isPending} = useAsync({
    promiseFn: StatusAsyncComponents,
  });

  useEffect(() => {
    /**
     * Handle progress updates during execution
     */
    const onRun = (evt: number) => {
      setState(prevState => ({
        ...prevState,
        percent: evt,
      }));
    };

    /**
     * Handle successful completion
     */
    const onEnd = () => {
      setState(prevState => ({
        ...prevState,
        result: 'success',
      }));
    };

    /**
     * Handle execution failures
     */
    const onError = () => {
      setState(prevState => ({
        ...prevState,
        result: 'fail',
      }));
    };

    FlagshipCodeManager.shared.on('onRun', onRun);
    FlagshipCodeManager.shared.on('onEnd', onEnd);
    FlagshipCodeManager.shared.on('onError', onError);

    return () => {
      FlagshipCodeManager.shared.removeAllListeners('onRun');
      FlagshipCodeManager.shared.removeAllListeners('onEnd');
      FlagshipCodeManager.shared.removeAllListeners('onError');
    };
  }, []);

  if (!data || isPending) return null;

  const {Text, Spinner} = data;

  /**
   * Generates a progress bar string representation
   * @returns A string containing progress bar characters
   */
  function getString() {
    const screen = 10;
    const max = Math.min(Math.floor(screen * state.percent), screen);
    const chars = '█'.repeat(max);

    return chars + ' '.repeat(screen - max);
  }

  return (
    <>
      {!state.result && <Spinner />}
      {state.result === 'success' && (
        <>
          <Text color={'green'}>✓ </Text>
          <Text bold>done!</Text>
        </>
      )}
      {state.result === 'fail' && (
        <>
          <Text color={'red'}>✗ </Text>
          <Text bold>fail!</Text>
        </>
      )}
      {!state.result && (
        <>
          <Text color={'green'}> ⟨ </Text>
          <Text color={'green'}>{getString()}</Text>
          <Text color={'green'}> ⟩ </Text>
          <Text bold>{state.percent * 100}%</Text>
        </>
      )}
    </>
  );
}
