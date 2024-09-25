"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCacheVersion = getCacheVersion;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const cosmiconfig_1 = require("cosmiconfig");
const MODULE_NAME = 'flagshipappenvrc';
function getCacheVersion() {
    const explorerSync = (0, cosmiconfig_1.cosmiconfigSync)(MODULE_NAME);
    const result = explorerSync.load(path_1.default.resolve(process.cwd(), '.' + MODULE_NAME));
    if (result === null || result.isEmpty) {
        throw new Error('Unable to find .flagshipappenvrc configuration file');
    }
    const { dir, hiddenEnvs = [], singleEnv, } = result.config;
    const cacheVersionHash = fs_1.default
        .readdirSync(path_1.default.resolve(process.cwd(), dir))
        .filter(it => /^env\.\w+\.ts/gm.test(it))
        .filter(it => {
        const regex = new RegExp(/^env\.(\w+)\.ts/gm);
        const match = regex.exec(it);
        if (!match || !match[1]) {
            return false;
        }
        return !hiddenEnvs.includes(match[1]);
    })
        .filter(it => {
        if (!singleEnv)
            return true;
        const regex = new RegExp(/^env\.(\w+)\.ts/gm);
        const match = regex.exec(it);
        if (!match || !match[1]) {
            return false;
        }
        return singleEnv === match[1];
    })
        .map(file => {
        return path_1.default.resolve(process.cwd(), dir, file);
    })
        .reduce((acc, curr) => {
        if (fs_1.default.existsSync(curr)) {
            const stats = fs_1.default.statSync(curr);
            acc.update(String(stats.mtimeMs));
        }
        return acc;
    }, crypto_1.default.createHash('md5'));
    return cacheVersionHash.digest('hex');
}
