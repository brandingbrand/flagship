import {useAsync} from 'react-async';
import {useEffect, useState} from 'react';
import {FlagshipCodeManager} from '@brandingbrand/code-cli-kit';

import {AsyncComponents} from './AsyncComponents';

export function StatusMessages() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    FlagshipCodeManager.shared.on('onLog', function (evt) {
      setMessages(prevMessages => {
        return [...prevMessages, evt];
      });
    });

    return () => {
      FlagshipCodeManager.shared.removeAllListeners('onLog');
    };
  }, []);

  const {data, isPending} = useAsync({
    promiseFn: AsyncComponents,
  });

  if (!data || isPending) return null;

  const {Box, Text} = data;

  return (
    <Box flexDirection="column">
      {messages.map(it => (
        <Text key={it}>{it}</Text>
      ))}
    </Box>
  );
}
