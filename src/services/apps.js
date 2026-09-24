export const apps = [
  {
    id: 'activus',
    name: 'Activus',
    description: 'Activity tracking',
    healthUrl: 'http://127.0.0.1:5009/health',
    publicUrl: 'https://activus.dreamquest/',
    icon: '/icons/activus.png',
    fallbackIcon: 'heartbeat'
  },
  {
    id: 'taskbook',
    name: 'TaskBook',
    description: 'Task management',
    healthUrl: 'http://127.0.0.1:5006/api/health',
    publicUrl: 'https://taskbook.dreamquest/',
    icon: '/icons/taskbook.svg',
    fallbackIcon: 'check-square'
  },
  {
    id: 'healthz',
    name: 'Healthz',
    description: 'Health monitoring',
    healthUrl: 'http://127.0.0.1:5005/health',
    publicUrl: 'https://healthz.dreamquest/',
    icon: '',
    fallbackIcon: 'heartbeat'
  },
  {
    id: 'penga',
    name: 'Penga',
    description: 'Personal finance',
    healthUrl: 'http://127.0.0.1:5010/health',
    publicUrl: 'https://penga.dreamquest/',
    icon: '/icons/penga.svg',
    fallbackIcon: 'money-bill-1'
  },
  {
    id: 'mise',
    name: 'Mise',
    description: 'Food recipes',
    healthUrl: 'http://127.0.0.1:5007/health',
    publicUrl: 'https://mise.dreamquest/',
    icon: '/icons/mise.svg',
    fallbackIcon: 'fork-knife'
  },
  {
    id: 'saywell',
    name: 'Saywell',
    description: 'Proverbs',
    healthUrl: 'http://127.0.0.1:5008/',
    publicUrl: 'https://saywell.dreamquest/',
    icon: '/icons/saywell.png',
    fallbackIcon: 'quotes'
  },
  {
    id: 'immich',
    name: 'Immich',
    description: 'Photos',
    healthUrl: 'http://127.0.0.1:2283/',
    publicUrl: 'https://immich.dreamquest/',
    icon: '',
    fallbackIcon: 'image'
  },
  {
    id: 'jellyfin',
    name: 'Jellyfin',
    description: 'Movies and media',
    healthUrl: 'http://127.0.0.1:8096/',
    publicUrl: 'https://jellyfin.dreamquest/',
    icon: '',
    fallbackIcon: 'film-strip'
  }
];

async function check(app) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(app.healthUrl, {
      signal: controller.signal,
      redirect: 'manual'
    });

    const ok = response.status >= 200 && response.status < 500;

    return {
      ...app,
      status: ok ? 'ok' : 'error',
      message: `HTTP ${response.status}`
    };
  } catch {
    return {
      ...app,
      status: 'error',
      message: 'Unavailable'
    };
  } finally {
    clearTimeout(timer);
  }
}

export function getApps() {
  return Promise.all(apps.map(check));
}
