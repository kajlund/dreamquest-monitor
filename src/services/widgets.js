const FALLBACK_QUOTES = [
  { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
  { text: "What we think, we become.", author: "Buddha" },
  { text: "Happiness depends upon ourselves.", author: "Aristotle" }
];

export async function getQuote() {
  const urls = [
    'http://127.0.0.1:5001/api/random',
    'https://proverbs.dreamquest/api/random'
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        const text = data.quote || data.proverb || data.text || data.content || (typeof data === 'string' ? data : null);
        const author = data.author || data.origin || data.source || data.by || '';
        if (text) {
          return {
            text: `"${text.replace(/^["']|["']$/g, '')}"`,
            author: author ? `— ${author}` : ''
          };
        }
      }
    } catch {}
  }

  const randomFallback = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
  return {
    text: `"${randomFallback.text}"`,
    author: `— ${randomFallback.author}`
  };
}

export async function getWeather() {
  const weatherMap = {
    0: { desc: 'Clear sky', icon: 'ph-sun' },
    1: { desc: 'Mainly clear', icon: 'ph-sun' },
    2: { desc: 'Partly cloudy', icon: 'ph-cloud-sun' },
    3: { desc: 'Overcast', icon: 'ph-cloud' },
    45: { desc: 'Foggy', icon: 'ph-cloud-fog' },
    48: { desc: 'Foggy', icon: 'ph-cloud-fog' },
    51: { desc: 'Light drizzle', icon: 'ph-cloud-drizzle' },
    53: { desc: 'Drizzle', icon: 'ph-cloud-drizzle' },
    55: { desc: 'Heavy drizzle', icon: 'ph-cloud-drizzle' },
    61: { desc: 'Slight rain', icon: 'ph-cloud-rain' },
    63: { desc: 'Rain', icon: 'ph-cloud-rain' },
    65: { desc: 'Heavy rain', icon: 'ph-cloud-rain' },
    71: { desc: 'Light snow', icon: 'ph-snowflake' },
    73: { desc: 'Snow', icon: 'ph-snowflake' },
    75: { desc: 'Heavy snow', icon: 'ph-snowflake' },
    80: { desc: 'Rain showers', icon: 'ph-cloud-rain' },
    85: { desc: 'Snow showers', icon: 'ph-snowflake' },
    95: { desc: 'Thunderstorm', icon: 'ph-lightning' }
  };

  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=63.6749&longitude=22.7042&current=temperature_2m,weather_code&timezone=Europe%2FHelsinki';
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data.current) {
        const temp = Math.round(data.current.temperature_2m);
        const code = data.current.weather_code;
        const info = weatherMap[code] || { desc: 'Partly cloudy', icon: 'ph-cloud-sun' };
        return {
          temp: `${temp}°C`,
          desc: info.desc,
          icon: info.icon,
          city: 'Pietarsaari'
        };
      }
    }
  } catch {}

  return {
    temp: '20°C',
    desc: 'Partly Cloudy',
    icon: 'ph-cloud-sun',
    city: 'Pietarsaari'
  };
}

export async function getWidgets() {
  const [quote, weather] = await Promise.all([getQuote(), getWeather()]);
  return { quote, weather };
}
