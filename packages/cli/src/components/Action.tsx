import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import { useState, useEffect, useMemo } from "react";

import { emitter } from "@/lib";

/**
 * Props for the Action component.
 */
type ActionProps = {
  /**
   * Name of the action.
   */
  name: string;
};

/**
 * Type representing possible action types.
 */
type ActionType = {
  type: "running" | "success" | "error" | "warning";
  ctx?: string;
};

/**
 * Action component displays an action with its status and name.
 * @param props - Props for the Action component.
 * @returns The rendered Action component.
 */
export function Action({ name }: ActionProps): JSX.Element {
  /**
   * State to manage the current action type.
   */
  const [action, setAction] = useState<ActionType>({ type: "running" });

  /**
   * Event handler function to update action state.
   * @param e - Event object containing action details.
   */
  function handler(e: any): void {
    if (e.action === name) {
      setAction(e.actionType);
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

  /**
   * Memoized color, title, and icon value based on the action type.
   */
  const data = useMemo(() => {
    if (action.type === "running") {
      return {
        color: "#00FFFF",
        title: "",
        icon: <Spinner type="dots" />,
      };
    }

    if (action.type === "success") {
      return { color: "green", title: "info", icon: "✅" };
    }

    if (action.type === "warning") {
      return {
        color: "yellow",
        title: "warnings",
        icon: "⚠️",
      };
    }

    if (action.type === "error") {
      return {
        color: "red",
        title: "errors",
        icon: "🛑",
      };
    }

    return {
      color: "white",
      title: "",
      icon: "",
    };
  }, [action.type]);

  return (
    <>
      <Text color={data.color}>
        {data.icon}
        {"  "}
        {name}
      </Text>
      {action.ctx && (
        <Box flexDirection="column" marginY={1} marginLeft={4} width={50}>
          <Text underline></Text>
          <Text color={data.color} underline>
            {data.title}
          </Text>
          <Text color={data.color}>{action.ctx}</Text>
        </Box>
      )}
    </>
  );
}
