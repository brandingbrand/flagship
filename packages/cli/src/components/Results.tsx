import { useAsync } from "react-async";
import { useEffect, useState } from "react";

import { AsyncComponents } from "./AsyncComponents";

import { actions, emitter } from "@/lib";

/**
 * Results component responsible for displaying summarized results.
 * @returns JSX.Element | boolean representing the Reporter component.
 */
export function Results(): JSX.Element | boolean {
  /**
   * Asynchronously import esm ink and ink-spinner
   * @type {Object}
   * @property {Object} data - The data returned by useAsync hook.
   * @property {boolean} isPending - Boolean indicating whether the async operation is pending.
   */
  const { data: Components, isPending } = useAsync({
    promiseFn: AsyncComponents,
  });

  /**
   * State to conditionally show the Results component
   */
  const [show, setShow] = useState(false);

  /**
   * Handler function triggered when an action is done.
   * @param {any} e - Event object containing action information.
   */
  function handler(e: any) {
    /**
     * "DONE" is only triggered from prebuild command module
     * when the actions are complete.
     */
    if (e.action === "DONE") {
      setShow(true);
    }
  }

  useEffect(() => {
    // Subscribe to the 'action' event using emitter
    emitter.on("action", handler);

    // Unsubscribe from the 'action' event when component unmounts
    return () => {
      emitter.off("action", handler);
    };
  }, []);

  if (!Components || isPending) return <></>;

  /**
   * Destructuring components from Components object.
   * @type {Object}
   * @property {import("ink").Box} Box - Box component from Ink library.
   * @property {import("ink").Text} Text - Text component from Ink library.
   */
  const { Box, Text } = Components;

  return (
    // Render the Results component only if 'show' is true
    show && (
      // Results container box with column layout
      <Box flexDirection="column">
        <Text underline>Results</Text>
        <Box marginTop={1} marginBottom={1} flexDirection="column">
          <Text color="green">
            Passed: {actions.filter((it) => it.success).length}
          </Text>
          <Text color="green">
            Actions:{" "}
            {actions
              .filter((it) => it.success)
              .map((it) => it.name)
              .join(", ")}
          </Text>
          <Box marginTop={1} />
          <Text color="yellow">
            Warned: {actions.filter((it) => it.warning).length}
          </Text>
          {!!actions.filter((it) => it.error).length && (
            <>
              <Text color="yellow">Actions: </Text>
              <Box marginTop={1} />
              {actions
                .filter((it) => it.warning)
                .map((it) => (
                  <>
                    <Text color="yellow">
                      {it.name} - {it.warning}
                    </Text>
                    <Box marginTop={1} />
                  </>
                ))}
            </>
          )}
          <Box marginTop={1} />
          <Text color="red">
            Failed: {actions.filter((it) => it.error).length}
          </Text>
          {!!actions.filter((it) => it.error).length && (
            <>
              <Text color="red">Actions: </Text>
              <Box marginTop={1} />
              {actions
                .filter((it) => it.error)
                .map((it) => (
                  <>
                    <Text color="red">
                      {it.name} - {it.error}
                    </Text>
                    <Box marginTop={1} />
                  </>
                ))}
            </>
          )}
          <Box marginTop={1} />
          <Text color="cyanBright">Total: {actions.length}</Text>
        </Box>
      </Box>
    )
  );
}
