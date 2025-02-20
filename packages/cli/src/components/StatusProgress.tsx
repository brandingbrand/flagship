import {useAsync} from 'react-async';
import {useEffect, useState} from 'react';

import globalEmitter from '../events';

import {StatusAsyncComponents} from './StatusAsyncComponents';

interface ProgressState {
  percent: number;
  result?: 'success' | 'fail';
}

export default function StatusProgress({
  numberOfPlugins,
}: {
  numberOfPlugins: number;
}) {
  const [state, setState] = useState<ProgressState>({
    percent: 0,
    result: undefined,
  });

  // Track the current animated position
  const [animationPosition, setAnimationPosition] = useState(0);

  const {data, isPending} = useAsync({
    promiseFn: StatusAsyncComponents,
  });

  // Animation effect
  useEffect(() => {
    if (!state.result) {
      const animationInterval = setInterval(() => {
        setAnimationPosition(prev => (prev + 1) % 11); // 11 = screen size + 1
      }, 100); // Adjust speed as needed

      return () => clearInterval(animationInterval);
    }
  }, [state.result]);

  // Your existing useEffect for event handlers
  useEffect(() => {
    const onRun = () => {
      setState(prevState => ({
        ...prevState,
        percent: prevState.percent + 1,
      }));
    };

    const onEnd = () => {
      setState(prevState => ({
        ...prevState,
        result: 'success',
      }));
    };

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

  const {Text} = data;

  function getString() {
    const screen = 10;
    const max = Math.min(
      Math.floor(screen * (state.percent / numberOfPlugins)),
      screen,
    );

    return Array(screen)
      .fill('█')
      .map((char, index) => {
        if (index >= max) {
          // Background portion should be dimmer
          return (
            <Text color="gray" key={index}>
              {' '}
            </Text>
          );
        }
        if (index === animationPosition % (max + 1)) {
          // Animated portion
          return (
            <Text color="gray" key={index}>
              {char}
            </Text>
          );
        }
        // Filled portion
        return (
          <Text color="green" key={index}>
            {char}
          </Text>
        );
      });
  }

  return (
    <>
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
          <Text color={'green'}>[ </Text>
          <Text color={'green'}>{getString()}</Text>
          <Text color={'green'}> ]</Text>
          <Text bold>
            {' '}
            {Math.round((state.percent / numberOfPlugins) * 100)}%
          </Text>
        </>
      )}
    </>
  );
}
