import * as env from "./env";
import * as tsc from "./tsc";
import * as logger from "./logger";
import * as normalize from "./normalize";

export const executors = [logger, tsc, env, normalize];
