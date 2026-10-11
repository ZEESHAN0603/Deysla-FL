const https = require('https');

async function searchWiki(query) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url|size|mime&format=json&gsrsearch=' + encodeURIComponent(query);
  const data = await new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'DeyslaAudit/1.0 (contact@deysla.com)' } }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (e) { resolve({}); }
      });
    }).on('error', reject);
  });
  if (!data.query || !data.query.pages) return [];
  return Object.values(data.query.pages).map(p => ({
    title: p.title,
    url: p.imageinfo?.[0]?.url,
    mime: p.imageinfo?.[0]?.mime,
    width: p.imageinfo?.[0]?.width,
    height: p.imageinfo?.[0]?.height
  }));
}

(async () => {
  const avaya = await searchWiki('"Avaya" "IP Office" OR "Avaya" PBX OR "UC520" OR "Cisco CallManager" filetype:bitmap');
  console.log('Avaya/Cisco PBX:', avaya);

  const plena = await searchWiki('"Plena" OR "mixer amplifier" OR "public address amplifier" filetype:bitmap');
  console.log('Plena/Amplifier:', plena);

  const speakers = await searchWiki('"ceiling speaker" OR "PA horn" OR "horn speaker" filetype:bitmap');
  console.log('Speakers:', speakers);

  const asterisk = await searchWiki('"IP PBX" OR "Asterisk PBX" OR "VoIP PBX" filetype:bitmap');
  console.log('Asterisk/IP PBX:', asterisk);
})();
