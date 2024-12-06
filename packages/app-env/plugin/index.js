"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cosmiconfig_1 = require("cosmiconfig");
const NODE_PROCESS_IDENTIFIER = 'process';
const NODE_PROCESS_ENV_IDENTIFIER = 'env';
const FLAGSHIP_APP_ENV_IDENTIFIER = 'FLAGSHIP_APP_ENV';
const MODULE_NAME = 'flagshipappenvrc';
function default_1({ types: t }) {
    function getEnvs() {
        const explorerSync = (0, cosmiconfig_1.cosmiconfigSync)(MODULE_NAME);
        const result = explorerSync.load(path_1.default.resolve(process.cwd(), '.' + MODULE_NAME));
        if (result === null || result.isEmpty) {
            throw new Error('Unable to find .flagshipappenvrc configuration file');
        }
        const { dir, hiddenEnvs = [], singleEnv, } = result.config;
        const envFiles = fs_1.default
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
        });
        const envs = envFiles.reduce((acc, curr) => {
            const env = cosmiconfig_1.defaultLoadersSync['.ts'](curr, fs_1.default.readFileSync(curr, 'utf-8'));
            const regex = new RegExp(/env\.(\w+)\.ts/gm);
            const match = regex.exec(curr);
            if (!match || !match[1]) {
                return acc;
            }
            const envName = match[1];
            return { ...acc, [envName]: env };
        }, {});
        return envs;
    }
    function convertToBabelAST(value) {
        if (Array.isArray(value)) {
            return t.arrayExpression(value.map(convertToBabelAST));
        }
        else if (value === null) {
            return t.nullLiteral();
        }
        else if (typeof value === 'undefined') {
            return t.identifier('undefined');
        }
        else if (typeof value === 'boolean') {
            return t.booleanLiteral(value);
        }
        else if (typeof value === 'number') {
            return t.numericLiteral(value);
        }
        else if (typeof value === 'string') {
            return t.stringLiteral(value);
        }
        else if (typeof value === 'object') {
            const properties = Object.keys(value).map(key => {
                const propValue = convertToBabelAST(value[key]);
                return t.objectProperty(t.stringLiteral(key), propValue);
            });
            return t.objectExpression(properties);
        }
        else {
            throw new Error(`Unsupported type: ${typeof value}`);
        }
    }
    return {
        visitor: {
            MemberExpression({ node, parentPath: parent }, state) {
                if (!t.isIdentifier(node.object, { name: NODE_PROCESS_IDENTIFIER }) ||
                    !t.isIdentifier(node.property, { name: NODE_PROCESS_ENV_IDENTIFIER })) {
                    return;
                }
                if (!t.isMemberExpression(parent.node)) {
                    return;
                }
                if (t.isIdentifier(parent.node.property, {
                    name: FLAGSHIP_APP_ENV_IDENTIFIER,
                })) {
                    let envs = state.file.metadata[FLAGSHIP_APP_ENV_IDENTIFIER];
                    if (!envs) {
                        envs = getEnvs();
                        state.file.metadata[FLAGSHIP_APP_ENV_IDENTIFIER] = envs;
                    }
                    parent.replaceWith(convertToBabelAST(envs));
                }
            },
        },
    };
}
