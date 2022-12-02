import * as env from "./env";
import * as tsc from "./tsc";
import * as logger from "./logger";

export const executors = [logger, tsc, env];
