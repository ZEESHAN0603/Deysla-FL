const https = require('https');
const fs = require('fs');

const candidates = [
  {
    name: 'nec_sv_pbx.png',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/00/NEC_SV_Series_IP_PBX_Front_View.png'
  },
  {
    name: 'panasonic_pbx.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Panasonic_KX-TDA200_Phone_System.jpg_.jpg'
  },
  {
    name: 'addpac_pbx.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/AddPac_IP-PBX.jpg'
  },
  {
    name: 'toa_horn_speaker.png',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/15/TOA_IP_Horn_Speaker.png'
  }
];

async function download(item) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream('.backups/' + item.name);
    https.get(item.url, { headers: { 'User-Agent': 'DeyslaAudit/1.0 (contact@deysla.com)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, { headers: { 'User-Agent': 'DeyslaAudit/1.0 (contact@deysla.com)' } }, (redirectRes) => {
          redirectRes.pipe(file);
          file.on('finish', () => file.close(resolve));
        }).on('error', reject);
      } else {
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      }
    }).on('error', reject);
  });
}

(async () => {
  for (const c of candidates) {
    try {
      console.log('Downloading', c.name);
      await download(c);
      const stat = fs.statSync('.backups/' + c.name);
      console.log('Downloaded', c.name, stat.size, 'bytes');
    } catch (e) {
      console.error('Failed to download', c.name, e);
    }
  }
})();
