import { run } from '../exec.js';

export async function getDocker() {
  const r = await run('/usr/bin/docker', ['ps','--format','{{.Names}}|{{.Status}}']);
  if (!r.ok) return { status:'error', containers:[], message:'Docker unavailable' };

  const containers = r.stdout ? r.stdout.split('\n').map(line => {
    const [name, state] = line.split('|');
    return { name, state, status:/unhealthy/i.test(state) ? 'error':'ok' };
  }) : [];

  return {
    status: containers.some(x => x.status === 'error') ? 'error':'ok',
    containers,
    message:`${containers.length} running`
  };
}
