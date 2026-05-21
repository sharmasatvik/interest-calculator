const { spawn } = require('child_process');
const port = process.env.PORT || 4200;
const env = { ...process.env, NG_CLI_ANALYTICS: 'false', CI: '1' };
const child = spawn(
  'node',
  [
    'node_modules/@angular/cli/bin/ng.js',
    'serve',
    '--host', '0.0.0.0',
    '--port', String(port),
    '--configuration=development',
    '--no-open',
  ],
  { stdio: 'inherit', env }
);
child.on('exit', (code) => process.exit(code ?? 0));
