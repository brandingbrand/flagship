import { stderr } from "log-update";
import cliSpinners from "cli-spinners";

import { colors } from "./logger";

let interval: NodeJS.Timer;

/**
 * Start a spinner in stderr with the given text.
 *
 * @param {string} text - The text to be displayed with the spinner.
 * @returns {void}
 */
export const start = (text: string) => {
  const { dots, simpleDots } = cliSpinners;
  let i = 0;

  interval = setInterval(() => {
    i += 1;

    stderr(
      "\n" +
        colors.FgYellow +
        dots.frames[i % dots.frames.length] +
        colors.Reset +
        ` ${text}` +
        simpleDots.frames[i % simpleDots.frames.length] +
        "\n"
    );
  }, dots.interval);
};

/**
 * Stop the currently running spinner.
 *
 * @returns {void}
 */
export const stop = () => {
  clearInterval(interval);
};
