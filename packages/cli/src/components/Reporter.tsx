import { useAsync } from "react-async";

import { Action } from "./Action";
import { promiseFn } from "./AsyncComponents";

import * as actions from "@/actions";

/**
 * Reporter component responsible for displaying running actions.
 * @returns JSX.Element representing the Reporter component.
 */
export function Reporter(): JSX.Element {
  const { data: Components, isPending } = useAsync({ promiseFn });

  if (!Components || isPending) return <></>;

  const { Box, Text } = Components;

  return (
    <Box flexDirection="column">
      <Text underline>Running actions</Text>
      <Box marginTop={1} marginBottom={1} flexDirection="column">
        {Object.keys(actions)
          // Exclude the "info" action
          .filter((it) => it !== "info")
          .map((it) => (
            <Action key={it} name={it} />
          ))}
      </Box>
    </Box>
  );
}
