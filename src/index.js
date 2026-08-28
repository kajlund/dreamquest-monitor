import express from 'express';
import nunjucks from 'nunjucks';
import { getSystem } from './services/system.js';
import { getStorage } from './services/storage.js';
import { getServices } from './services/services.js';
import { getDocker } from './services/docker.js';
import { getApps } from './services/apps.js';
import { getBackup } from './services/backups.js';

const app = express();
const port = Number(process.env.PORT || 5004);

nunjucks.configure('src/views',{autoescape:true,express:app,noCache:process.env.NODE_ENV!=='production'});
app.set('view engine','njk');
app.use(express.static('public'));
app.use('/vendor/phosphor', express.static('node_modules/@phosphor-icons/web/src'));

async function collect() {
  const [system,storage,services,docker,apps,backup] = await Promise.all([
    getSystem(),getStorage(),getServices(),getDocker(),getApps(),getBackup()
  ]);
  const states=[...storage,...services,...apps,docker,backup].map(x=>x.status);
  const overall=states.includes('error')?'error':states.includes('warn')?'warn':'ok';
  const affected = [
    ...storage.map(x => ({ label:x.label, status:x.status })),
    ...services.map(x => ({ label:x.label, status:x.status })),
    ...apps.map(x => ({ label:x.name, status:x.status })),
    ...(docker.status === 'error' ? [{ label:'Docker', status:docker.status }] : []),
    ...(backup.status !== 'ok' ? [{ label:'Backup', status:backup.status }] : [])
  ].filter(x => x.status !== 'ok');
  return {overall,system,storage,services,docker,apps,backup,affected,updated:new Date().toLocaleString()};
}

app.get('/health', async (_req,res) => {
  const x = await collect();

  res
    .status(x.overall === 'error' ? 503 : 200)
    .json({ status: x.overall });
});

app.get('/api/status', async (_req,res) => res.json(await collect()));

app.get('/', (_req, res) => {
  res.render('home.njk');
});

app.get('/status', async (_req, res) => {
  try {
    res.render('status.njk', await collect());
  } catch {
    res.status(500).send('Unable to collect DreamQuest status');
  }
});

app.listen(port,'127.0.0.1',()=>console.log(`Monitor listening on 127.0.0.1:${port}`));
