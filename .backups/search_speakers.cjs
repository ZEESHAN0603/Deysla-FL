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
  const q1 = await searchWiki('Paging speaker OR "horn speaker" OR "PA horn" filetype:bitmap');
  console.log('Paging speaker:', q1.map(r => ({ title: r.title, url: r.url })));

  const q2 = await searchWiki('"Grandstream" phone OR "Grandstream" VoIP filetype:bitmap');
  console.log('Grandstream phone:', q2.map(r => ({ title: r.title, url: r.url })));
})();
