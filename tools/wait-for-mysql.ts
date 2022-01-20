#!/usr/bin/env ts-node

// https://github.com/joeledwards/node-wait-for-mysql
// MIT

import * as mysql from 'mysql';
import { Command } from 'commander';

interface Config extends mysql.PoolConfig {
  totalTimeout: number;
  acquireTimeout: number;
  connectTimeout: number;
  waitForConnections: boolean;
}

const waitForMysql = async (config: Config) => {
  const startingTime = Date.now();
  return new Promise<string>((resolve, reject) => {
    const pool = mysql.createPool(config);
    let attempts = 0;

    const testConnection = () => {
      pool.getConnection((error, client) => {
        attempts += 1;
        const currentTime = Date.now();
        const elapsedTime = currentTime - startingTime;

        if (error !== null) {
          if (elapsedTime > config.totalTimeout) {
            pool.end();
            reject();
            return;
          }

          setTimeout(testConnection, config.connectTimeout);
          return;
        }

        client.release();
        pool.end();

        resolve(`Connected. ${attempts} attempts over ${elapsedTime / 1000}s`);
      });
    };

    testConnection();
  });
};

const program = new Command('wait-for-mysql');
program
  .option('-D, --database <db_name>', 'MySQL database (default is mysql)')
  .option('-h, --host <hostname>', 'MySQL host (default is localhost)')
  .option('-p, --port <port>', 'MySQL port (default is 3306)', parseInt)
  .option('-P, --password <password>', 'MySQL user password (default is empty)')
  .option(
    '-t, --connect-timeout <milliseconds>',
    'Individual connection attempt timeout (default is 250)',
    parseInt
  )
  .option(
    '-T, --total-timeout <milliseconds>',
    'Total timeout across all connect attempts (default is 15000)',
    parseInt
  )
  .option('-u, --user <user>', 'Mysql user name (default is mysql)')
  .parse(process.argv);

const options = program.opts<Config>();
console.log('Waiting for database connection...');
void waitForMysql({
  host: options.host ?? 'localhost',
  port: options.port ?? 3306,
  user: options.user ?? 'mysql',
  password: options.password ?? '',
  database: options.database ?? 'mysql',
  totalTimeout: options.totalTimeout ?? 15000,
  acquireTimeout: options.connectTimeout ?? 250,
  connectTimeout: options.connectTimeout ?? 250,
  connectionLimit: 1,
  queueLimit: 1,
  waitForConnections: false,
})
  .then((message) => {
    console.log(message);
  })
  .catch(() => {
    console.error('Failed to connect to database...');
    process.exit(1);
  });
