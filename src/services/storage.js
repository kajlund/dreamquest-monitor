import { run } from '../exec.js';

async function inspect(path, label) {
  const mounted = await run('/usr/bin/findmnt', ['-n', path]);
  if (!mounted.ok) return { label, path, status:'error', message:'Not mounted' };

  const df = await run('/usr/bin/df', ['-hP', path]);
  const line = df.stdout.split('\n')[1] || '';
  const p = line.trim().split(/\s+/);
  const percent = Number((p[4] || '0').replace('%',''));
  const status = percent >= 90 ? 'error' : percent >= 80 ? 'warn' : 'ok';

  return {
    label, path, status,
    message: p.length >= 6 ? `${p[2]} / ${p[1]} (${percent}%)` : 'Mounted'
  };
}

export function getStorage() {
  return Promise.all([
    inspect(process.env.STORAGE_ROOT || '/srv/storage', 'STORAGE'),
    inspect(process.env.BACKUP_ROOT || '/srv/backup', 'DQ-BACKUP')
  ]);
}
