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
  const ceiling = await searchWiki('ceiling loudspeaker OR "ceiling speaker" filetype:bitmap');
  console.log('Ceiling:', ceiling.map(r => ({ title: r.title, url: r.url, w: r.width, h: r.height })));

  const toa = await searchWiki('TOA speaker OR "TOA Corporation" filetype:bitmap');
  console.log('TOA:', toa.map(r => ({ title: r.title, url: r.url, w: r.width, h: r.height })));

  const pbx = await searchWiki('"Grandstream UCM" OR "Yeastar S" OR "Panasonic KX-TDA" OR "Panasonic KX-TDE" filetype:bitmap');
  console.log('PBX specific:', pbx.map(r => ({ title: r.title, url: r.url, w: r.width, h: r.height })));
})();
