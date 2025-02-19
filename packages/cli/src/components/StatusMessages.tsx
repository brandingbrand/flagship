import {useAsync} from 'react-async';
import {useEffect, useState, useCallback} from 'react';

import globalEmitter from '../events';

import {StatusAsyncComponents} from './StatusAsyncComponents';

/**
 * StatusMessages component that displays log messages from FlagshipCodeManager
 * in a vertically stacked list.
 *
 * @returns A React component that renders log messages or null if still loading
 *
 * @example
 * ```tsx
 * <StatusMessages />
 * ```
 */
export function StatusMessages() {
  const [messages, setMessages] = useState<string[]>([]);

  /**
   * Handler for new log messages
   */
  const handleNewMessage = useCallback((evt: string) => {
    setMessages(prevMessages => [...prevMessages, evt]);
  }, []);

  useEffect(() => {
    // Subscribe to log events
    globalEmitter.on('onLog', handleNewMessage);

    // Cleanup subscription on unmount
    return () => {
      globalEmitter.removeAllListeners('onLog');
    };
  }, [handleNewMessage]);

  const {data, isPending} = useAsync({
    promiseFn: StatusAsyncComponents,
  });

  if (!data || isPending) return null;

  const {Box, Text} = data;

  return (
    <Box flexDirection="column">
      {messages.map((message, index) => (
        <Text key={`${message}-${index}`}>{message}</Text>
      ))}
    </Box>
  );
}
