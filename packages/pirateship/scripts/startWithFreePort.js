var fp =  require('find-free-port');
var child_process = require('child_process');
var path = require('path');

fp(8081, function(err, freePort) {
  if (err) {
    console.error(err);
  } else {
    return new Promise(function(resolve, reject) {
      var appCompiled = false;
      var bundlerClosed = false;
      var spawned = child_process.spawn('react-native', [
        'start',
        '--port',
        freePort
      ], {
        cwd: path.resolve(__dirname, '..'),
        shell: /^win/.test(process.platform)
      });

      if (process.argv[2]) {
        var spawnedApp = child_process.spawn('react-native', [
          'run-' + process.argv[2],
          '--port',
          freePort,
          '--no-packager',
          process.argv[3]
        ], {
          cwd: path.resolve(__dirname, '..'),
          shell: /^win/.test(process.platform)
        });

        // Redirect child process output to process stdout/stderr so we can see script output
        spawnedApp.stdout.pipe(process.stdout);
        spawnedApp.stderr.pipe(process.stderr);

        spawnedApp.on('error', function(e) {
          reject(new Error('Error spawning react-native run-' + process.argv[2] + e));
        });
        spawnedApp.on('close', function() {
          if (bundlerClosed) {
            resolve();
          } else {
            appCompiled = true;
          }
          });

        spawnedApp.stdin.end();
      } else {
        appCompiled = true;
      }

      // Redirect child process output to process stdout/stderr so we can see script output
      spawned.stdout.pipe(process.stdout);
      spawned.stderr.pipe(process.stderr);

      spawned.on('error', function(e) {
        reject(new Error('Error spawning react-native start' + e));
      });
      spawned.on('close', function() {
        if (appCompiled) {
          resolve();
        } else {
          bundlerClosed = true;
        }
      });

      spawned.stdin.end();
    });
  }
});
