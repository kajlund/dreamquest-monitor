const apps = [
  {
    name: 'Activus',
    description: 'Activity tracking',
    healthUrl: 'http://127.0.0.1:5002/',
    publicUrl: 'https://activus.dreamquest/'
  },
  {
    name: 'Foodz',
    description: 'Food application',
    healthUrl: 'http://127.0.0.1:5003/health',
    publicUrl: 'https://foodz.dreamquest/'
  },
  {
    name: 'Proverbs',
    description: 'Proverbs web application',
    healthUrl: 'http://127.0.0.1:5001/',
    publicUrl: 'https://dreamquest/proverbs/'
  },
  {
    name: 'Immich',
    description: 'Photos',
    healthUrl: 'http://127.0.0.1:2283/',
    publicUrl: 'http://dreamquest:2283/'
  },
  {
    name: 'Jellyfin',
    description: 'Movies and media',
    healthUrl: 'http://127.0.0.1:8096/',
    publicUrl: 'http://dreamquest:8096/'
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