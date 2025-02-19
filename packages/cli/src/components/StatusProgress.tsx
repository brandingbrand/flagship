import {useAsync} from 'react-async';
import {useEffect, useState} from 'react';

import globalEmitter from '../events';

import {StatusAsyncComponents} from './StatusAsyncComponents';

interface ProgressState {
  percent: number;
  result?: 'success' | 'fail';
}

/**
 * Status progress component that displays a loading spinner, progress bar, and completion state
 * @returns A React component showing the current progress state with visual indicators
 */
export default function StatusProgress({
  numberOfPlugins,
}: {
  numberOfPlugins: number;
}) {
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
    const onRun = () => {
      setState(prevState => ({
        ...prevState,
        percent: prevState.percent + 1,
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

    globalEmitter.on('onRun', onRun);
    globalEmitter.on('onEnd', onEnd);
    globalEmitter.on('onError', onError);

    return () => {
      globalEmitter.removeAllListeners('onRun');
      globalEmitter.removeAllListeners('onEnd');
      globalEmitter.removeAllListeners('onError');
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
    const max = Math.min(
      Math.floor(screen * (state.percent / numberOfPlugins)),
      screen,
    );
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
          <Text bold>
            {Math.round((state.percent / numberOfPlugins) * 100)}%
          </Text>
        </>
      )}
    </>
  );
}
