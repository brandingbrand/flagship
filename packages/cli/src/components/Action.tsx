import {useMemo} from 'react';
import {useAsync} from 'react-async';

import {AsyncComponents} from './AsyncComponents';

type ActionType = {
  name: string;
  status: 'pending' | 'success' | 'fail';
};

/**
 * Action component displays an action with its status and name.
 * @param props - Props for the Action component.
 * @returns The rendered Action component.
 */
export function Action({name, status}: ActionType): JSX.Element {
  const {data, isPending} = useAsync({
    promiseFn: AsyncComponents,
  });

  const color = useMemo(() => {
    if (status === 'pending') {
      return '#00FFFF';
    }

    if (status === 'success') {
      return 'green';
    }

    if (status === 'fail') {
      return 'red';
    }

    return 'white';
  }, [status]);

  if (!data || isPending) return <></>;

  const {Text, Spinner} = data;

  return (
    <Text color={color}>
      {status === 'pending' && <Spinner />}
      {status === 'fail' && '𐄂'}
      {status === 'success' && '✔'}
      {'  '}
      {name}
      {status === 'pending' && <Spinner type="simpleDotsScrolling" />}
    </Text>
  );
}
