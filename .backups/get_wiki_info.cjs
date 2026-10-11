const https = require('https');

async function getWikiInfo(titles) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=extmetadata|comment|user&format=json&titles=' + encodeURIComponent(titles);
  const data = await new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'DeyslaAudit/1.0 (contact@deysla.com)' } }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
  });
  for (const page of Object.values(data.query.pages)) {
    console.log('Title:', page.title);
    const info = page.imageinfo?.[0];
    if (info) {
      console.log('User:', info.user);
      console.log('Comment:', info.comment);
      console.log('Metadata:', info.extmetadata?.ObjectName?.value, info.extmetadata?.ImageDescription?.value);
    }
  }
}

getWikiInfo('File:NEC SV Series IP PBX Front View.png|File:Panasonic KX-TDA200 Phone System.jpg_.jpg|File:TOA IP Horn Speaker.png|File:Grandstream-GXP1620.jpg|File:Cisco 8851.JPG');
