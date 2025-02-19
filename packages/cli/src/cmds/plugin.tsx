// import {program, Option} from 'commander';
// import {
//   type GenerateOptions,
//   logger,
//   FlagshipCodeManager,
// } from '@brandingbrand/code-cli-kit';

// import * as actions from '@/actions';
// import {config} from '@/lib';
// import {Status} from '@/components/Status';

// /**
//  * Defines a command for generating a flagship-code template using the "commander" library.
//  * This command allows users to generate templates with specified types and names.
//  *
//  * @example
//  * ```bash
//  * yarn flagship-code plugin my-plugin
//  * ```
//  *
//  * @remarks
//  * This command is part of a larger program defined using the "commander" library.
//  *
//  * @see {@link https://www.npmjs.com/package/commander | commander} - Command-line framework for Node.js.
//  */
// program
//   .command('plugin')
//   .description('generate a plugin')
//   .addOption(
//     new Option(
//       '-l --log-level [logLevel]',
//       'debug, log, info, warn, error log levels.',
//     )
//       .choices(['debug', 'log', 'info', 'warn', 'error'])
//       .default('info'),
//   )
//   .argument('<string>', 'name of generated plugin')
//   .action(async (str: string, options: GenerateOptions) => {
//     /**
//      * Update the configuration generate options with the provided options and command type.
//      */
//     config.generateOptions = {...options, name: str, command: 'generate'};

//     const {render} = await import('ink');

//     await new Promise(res => {
//       /**
//        * Render the Reporter component to display progress.
//        */
//       const {unmount} = render(<Status res={res} />, {stdout: process.stderr});

//       global.unmount = unmount;
//     });

//     logger.setLogLevel(logger.getLogLevelFromString(options.logLevel));
//     logger.pause();
//     logger.printCmdOptions(options, 'plugin');

//     FlagshipCodeManager.shared
//       .addAction(actions.info)
//       .addAction(actions.config)
//       .addAction(actions.template)
//       .addAction(actions.generator)
//       .addAction(actions.packagers);

//     await FlagshipCodeManager.shared.run();

//     /**
//      * Resume logging with console.log and process.stdout
//      */
//     logger.resume();

//     global.unmount?.();
//   });
