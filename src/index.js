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

async function collect() {
  const [system,storage,services,docker,apps,backup] = await Promise.all([
    getSystem(),getStorage(),getServices(),getDocker(),getApps(),getBackup()
  ]);
  const states=[...storage,...services,...apps,docker,backup].map(x=>x.status);
  const overall=states.includes('error')?'error':states.includes('warn')?'warn':'ok';
  return {overall,system,storage,services,docker,apps,backup,updated:new Date().toLocaleString()};
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
