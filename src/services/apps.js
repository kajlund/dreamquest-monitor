const apps = [
  ['AuthZ','http://127.0.0.1:5000/ping','https://dreamquest/authz/'],
  ['Proverbs','http://127.0.0.1:5001/','https://dreamquest/proverbs/'],
  ['Activus','http://127.0.0.1:5002/','https://activus.dreamquest/'],
  ['Foodz','http://127.0.0.1:5003/health','https://foodz.dreamquest/']
];

async function check([name,url,publicUrl]) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  try {
    const r = await fetch(url, { signal:controller.signal, redirect:'manual' });
    const ok = r.status >= 200 && r.status < 500;
    return { name, publicUrl, status:ok?'ok':'error', message:`HTTP ${r.status}` };
  } catch {
    return { name, publicUrl, status:'error', message:'Unavailable' };
  } finally { clearTimeout(timer); }
}

export function getApps() { return Promise.all(apps.map(check)); }
