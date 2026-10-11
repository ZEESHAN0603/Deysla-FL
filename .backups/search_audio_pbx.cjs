const https = require('https');
const fs = require('fs');

async function searchWiki(query) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url|size|mime|extmetadata&format=json&gsrsearch=' + encodeURIComponent(query);
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
    height: p.imageinfo?.[0]?.height,
    desc: p.imageinfo?.[0]?.extmetadata?.ObjectName?.value || p.title
  }));
}

(async () => {
  console.log('--- AUDIO HARDWARE SEARCH ---');
  const res1 = await searchWiki('"ceiling speaker" OR "PA speaker" OR "horn speaker" OR "public address" speaker filetype:bitmap');
  console.log('Speakers:', res1.map(r => ({ title: r.title, url: r.url, w: r.width, h: r.height })));

  const res2 = await searchWiki('"mixer amplifier" OR "PA amplifier" OR "commercial amplifier" filetype:bitmap');
  console.log('Amplifiers:', res2.map(r => ({ title: r.title, url: r.url, w: r.width, h: r.height })));

  console.log('--- PBX SEARCH ---');
  const res3 = await searchWiki('"IP PBX" OR "Grandstream" OR "Yeastar" OR "Panasonic KX" PBX filetype:bitmap');
  console.log('PBX:', res3.map(r => ({ title: r.title, url: r.url, w: r.width, h: r.height })));
})();
