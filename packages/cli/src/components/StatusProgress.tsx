import {useAsync} from 'react-async';
import {useEffect, useState} from 'react';
import {FlagshipCodeManager} from '@brandingbrand/code-cli-kit';

import {AsyncComponents} from './AsyncComponents';

export default function StatusProgress() {
  const [state, setState] = useState<{
    percent: number;
    result: undefined | 'success' | 'fail';
  }>({
    percent: 0,
    result: undefined,
  });

  const {data, isPending} = useAsync({
    promiseFn: AsyncComponents,
  });

  useEffect(() => {
    FlagshipCodeManager.shared.on('onRun', function (evt) {
      setState(prevState => ({
        ...prevState,
        percent: evt,
      }));
    });

    FlagshipCodeManager.shared.on('onEnd', function () {
      setState(prevState => ({
        ...prevState,
        result: 'success',
      }));
    });

    FlagshipCodeManager.shared.on('onError', function () {
      setState(prevState => ({
        ...prevState,
        result: 'fail',
      }));
    });

    return () => {
      FlagshipCodeManager.shared.removeAllListeners('onRun');
      FlagshipCodeManager.shared.removeAllListeners('onEnd');
      FlagshipCodeManager.shared.removeAllListeners('onError');
    };
  }, []);

  if (!data || isPending) return null;

  const {Text, Spinner} = data;

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
          <Text bold>{Math.round(state.percent * 100)}%</Text>
        </>
      )}
    </>
  );
}
