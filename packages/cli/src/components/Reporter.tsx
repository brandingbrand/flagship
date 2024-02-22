import { useAsync } from "react-async";

import { Action } from "./Action";
import { AsyncComponents } from "./AsyncComponents";
import { Results } from "./Results";

type ReporterProps = {
  actions: string[];
};

/**
 * Reporter component responsible for displaying running actions.
 * @returns JSX.Element representing the Reporter component.
 */
export function Reporter({ actions }: ReporterProps): JSX.Element {
  /**
   * Asynchronously import esm ink and ink-spinner
   * @type {Object}
   * @property {Object} data - The data returned by useAsync hook.
   * @property {boolean} isPending - Boolean indicating whether the async operation is pending.
   */
  const { data: Components, isPending } = useAsync({
    promiseFn: AsyncComponents,
  });

  if (!Components || isPending) return <></>;

  /**
   * Destructuring components from Components object.
   * @type {Object}
   * @property {import("ink").Box} Box - Box component from Ink library.
   * @property {import("ink").Text} Text - Text component from Ink library.
   */
  const { Box, Text } = Components;

  return (
    <Box flexDirection="column">
      <Text underline>Running actions</Text>
      <Box marginTop={1} marginBottom={1} flexDirection="column">
        {actions
          // Exclude the "info" action
          .filter((it) => it !== "info")
          .map((it) => (
            <Action key={it} name={it} />
          ))}
      </Box>
      <Results />
    </Box>
  );
}
