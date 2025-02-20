import {useAsync} from 'react-async';
import {useEffect, useState, useCallback, memo} from 'react';

import globalEmitter from '../events';

import {StatusAsyncComponents} from './StatusAsyncComponents';

// Add a max number of messages to prevent potential memory issues
const MAX_MESSAGES = 1000;

/**
 * Single message line component to optimize rendering
 */
const MessageLine = memo(({message}: {message: string}) => {
  const {data} = useAsync({promiseFn: StatusAsyncComponents});
  if (!data) return null;

  const {Text} = data;
  return <Text>{message}</Text>;
});

/**
 * StatusMessages component that displays log messages from FlagshipCodeManager
 * in a vertically stacked list.
 *
 * @returns A React component that renders log messages or null if still loading
 */
export function StatusMessages() {
  const [messages, setMessages] = useState<string[]>([]);

  /**
   * Handler for new log messages with message limit
   */
  const handleNewMessage = useCallback((evt: string) => {
    setMessages(prevMessages => {
      const newMessages = [...prevMessages, evt];
      // Keep only the most recent messages if exceeding MAX_MESSAGES
      return newMessages.slice(-MAX_MESSAGES);
    });
  }, []);

  useEffect(() => {
    const onLog = (msg: string) => handleNewMessage(msg);
    globalEmitter.on('onLog', onLog);

    return () => {
      // Remove specific listener instead of all
      globalEmitter.off('onLog', onLog);
    };
  }, [handleNewMessage]);

  const {data, isPending} = useAsync({
    promiseFn: StatusAsyncComponents,
  });

  if (!data || isPending) return null;

  const {Box} = data;

  return (
    <Box flexDirection="column">
      {messages.map((message, index) => (
        <MessageLine
          key={`msg-${index}-${message.slice(0, 10)}`}
          message={message}
        />
      ))}
    </Box>
  );
}
