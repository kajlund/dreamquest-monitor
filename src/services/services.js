import { run } from '../exec.js';

const systemUnits = [
  ['Caddy','caddy.service'],
  ['Samba','smbd.service'],
  ['MongoDB','mongod.service'],
  ['PostgreSQL','postgresql.service'],
  ['Docker','docker.service']
];

async function check(label, unit) {
  const r = await run('/usr/bin/systemctl', ['is-active',unit]);
  const active = r.stdout === 'active';
  return { label, status: active ? 'ok':'error', message: r.stdout || 'inactive' };
}

async function checkSyncthing() {
  const r = await run('/usr/bin/pgrep', ['-x','syncthing']);
  return {
    label: 'Syncthing',
    status: r.ok && r.stdout ? 'ok' : 'error',
    message: r.ok && r.stdout ? 'running' : 'not running'
  };
}

export async function getServices() {
  const normal = await Promise.all(systemUnits.map(([l,u]) => check(l,u)));
  return [...normal, await checkSyncthing()];
}
