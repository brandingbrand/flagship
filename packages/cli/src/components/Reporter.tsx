/**
 * Imports Box and Text components from the "ink" package.
 */
import { Box, Text } from "ink";

/**
 * Imports the Action component from the "./Action" file.
 */
import { Action } from "./Action";

/**
 * Imports all actions from the "@/actions" module.
 */
import * as actions from "@/actions";

/**
 * Reporter component responsible for displaying running actions.
 * @returns JSX.Element representing the Reporter component.
 */
export function Reporter(): JSX.Element {
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
