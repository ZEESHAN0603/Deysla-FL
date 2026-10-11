const https = require('https');
const fs = require('fs');

async function searchWiki(query) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url|size|mime&format=json&gsrsearch=' + encodeURIComponent(query);
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
  const toa = await searchWiki('TOA amplifier OR "TOA" public address filetype:bitmap');
  console.log('TOA amp:', toa.map(r => ({ title: r.title, url: r.url })));

  const bosch = await searchWiki('"Bosch" loudspeaker OR "Bosch" "public address" OR "Bosch" amplifier filetype:bitmap');
  console.log('Bosch PA:', bosch.map(r => ({ title: r.title, url: r.url })));

  const ceiling = await searchWiki('ceiling loudspeaker filetype:bitmap');
  console.log('Ceiling loudspeaker:', ceiling.map(r => ({ title: r.title, url: r.url })));
})();
