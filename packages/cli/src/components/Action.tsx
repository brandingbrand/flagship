import { Text } from "ink";
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
type ActionType = "running" | "success" | "error" | "warning";

/**
 * Action component displays an action with its status and name.
 * @param props - Props for the Action component.
 * @returns The rendered Action component.
 */
export function Action({ name }: ActionProps): JSX.Element {
  /**
   * State to manage the current action type.
   */
  const [action, setAction] = useState<ActionType>("running");

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
   * Memoized color value based on the action type.
   */
  const color = useMemo(() => {
    if (action === "running") {
      return "#00FFFF"; // Cyan
    }

    if (action === "success") {
      return "green";
    }

    if (action === "warning") {
      return "yellow";
    }

    if (action === "error") {
      return "red";
    }

    return "white";
  }, [action]);

  return (
    <Text color={color}>
      {action === "running" && <Spinner type="dots" />}
      {action === "error" && "🛑"}
      {action === "success" && "✅"}
      {action === "warning" && "⚠️"}
      {"  "}
      {name}
    </Text>
  );
}
