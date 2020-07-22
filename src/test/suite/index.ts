import * as path from 'path';
import * as Mocha from 'mocha';
import * as glob from 'glob';

// eslint-disable-next-line import/prefer-default-export
export function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: 'tdd',
  });
  mocha.useColors(true);

  const testsRoot = path.resolve(__dirname, '..');

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return new Promise((c, e) => {
    // eslint-disable-next-line consistent-return
    glob('**/**.test.js', { cwd: testsRoot }, (err, files) => {
      if (err) {
        return e(err);
      }

      // Add files to the test suite
      files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

      try {
        // Run the mocha test
        mocha.run(failures => {
          if (failures > 0) {
            e(new Error(`${failures} tests failed.`));
          } else {
            c();
          }
        });
      // eslint-disable-next-line no-shadow
      } catch (err) {
        console.error(err);
        e(err);
      }
    });
  });
}
