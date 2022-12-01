import { stderr } from "log-update";
import cliSpinners from "cli-spinners";

import { colors } from "./logger";

let interval: NodeJS.Timer;

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

export const stop = () => {
  clearInterval(interval);
};
