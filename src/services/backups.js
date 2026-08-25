import fs from 'node:fs/promises';
import path from 'node:path';

export async function getBackup() {
  const root = path.join(process.env.BACKUP_ROOT || '/srv/backup','snapshots');
  try {
    const entries = await fs.readdir(root, {withFileTypes:true});
    const rows = [];
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      const s = await fs.stat(path.join(root,e.name));
      rows.push({name:e.name, date:s.mtime});
    }
    if (!rows.length) return {status:'warn',message:'No backup found'};
    rows.sort((a,b)=>b.date-a.date);
    const latest=rows[0];
    const days=Math.floor((Date.now()-latest.date.getTime())/86400000);
    return {
      status: days > 14 ? 'warn':'ok',
      message:`${latest.name} · ${days}d ago`
    };
  } catch {
    return {status:'warn',message:'Backup status unavailable'};
  }
}
