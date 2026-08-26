import os from 'node:os';
import fs from 'node:fs/promises';

async function temperature() {
  try {
    const raw = await fs.readFile(
      '/sys/class/thermal/thermal_zone0/temp',
      'utf8'
    );

    return `${(Number(raw.trim()) / 1000).toFixed(1)} °C`;
  } catch {
    return 'n/a';
  }
}

export async function getSystem() {
  const total = os.totalmem();
  const used = total - os.freemem();

  const seconds = os.uptime();
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);

  const load1 = os.loadavg()[0];
  const cpuCount = os.cpus().length;

  const loadPercent = Math.round((load1 / cpuCount) * 100);

  return {
    uptime: `${days}d ${hours}h`,

    load: `${loadPercent}%`,
    loadDetail: `1 min · ${load1.toFixed(2)}`,

    memory: `${(used / 2 ** 30).toFixed(1)} / ${(total / 2 ** 30).toFixed(1)} GB`,

    temperature: await temperature()
  };
}