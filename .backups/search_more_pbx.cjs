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
  const pbx = await searchWiki('PBX rack OR "PBX system" OR "VoIP server" filetype:bitmap');
  console.log('PBX:', pbx.map(p => ({ title: p.title, url: p.url })));

  const ciscoPBX = await searchWiki('"Cisco Unified" OR "Cisco CallManager" OR "Cisco 2811" OR "Cisco 2901" voice gateway filetype:bitmap');
  console.log('Cisco Voice:', ciscoPBX.map(p => ({ title: p.title, url: p.url })));
})();
