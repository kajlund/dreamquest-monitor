import os from 'node:os';
import fs from 'node:fs/promises';

async function temperature() {
  try {
    const raw = await fs.readFile('/sys/class/thermal/thermal_zone0/temp', 'utf8');
    return `${(Number(raw.trim()) / 1000).toFixed(1)} °C`;
  } catch { return 'n/a'; }
}

export async function getSystem() {
  const total = os.totalmem();
  const used = total - os.freemem();
  const seconds = os.uptime();
  return {
    uptime: `${Math.floor(seconds/86400)}d ${Math.floor((seconds%86400)/3600)}h`,
    load: os.loadavg().map(x => x.toFixed(2)).join(' / '),
    memory: `${(used/2**30).toFixed(1)} / ${(total/2**30).toFixed(1)} GB`,
    temperature: await temperature()
  };
}
