const https = require('https');
const fs = require('fs');

async function searchWiki(query) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|size|mime&format=json&gsrsearch=' + encodeURIComponent(query);
  const data = await new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'DeyslaAudit/1.0 (contact@deysla.com)' } }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
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
  console.log('--- PBX SEARCH ---');
  const pbx = await searchWiki('Panasonic KX-TDE100 OR "PBX" OR "IP PBX" filetype:bitmap');
  console.log(JSON.stringify(pbx.slice(0, 5), null, 2));

  console.log('--- AUDIO SOLUTIONS SEARCH ---');
  const audio = await searchWiki('ceiling speaker OR "public address amplifier" OR "PA amplifier" filetype:bitmap');
  console.log(JSON.stringify(audio.slice(0, 5), null, 2));
})();
