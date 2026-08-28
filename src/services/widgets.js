export async function getQuote() {
  const url = 'http://127.0.0.1:5001/api/random';
  let text = null;
  let author = null;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error('Call to Quotes API failed');
    const data = await res.json();
    text = data.proverb.content;
    author = data.proverb.author;
  } catch (err) {
    text = err.message;
    author = '';
  }

  return { text, author };
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
  } catch {

  }

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
