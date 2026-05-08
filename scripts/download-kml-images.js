import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KML_PATH = path.join(__dirname, '..', 'src', 'data', 'Norades.kml');
const OUT_DIR = path.join(__dirname, '..', 'public', 'kml-images');
const MAP_OUT = path.join(__dirname, '..', 'src', 'data', 'kmlImageMap.json');

async function main() {
  if (!fs.existsSync(KML_PATH)) {
    console.error('KML file not found:', KML_PATH);
    process.exit(1);
  }

  if (typeof fetch === 'undefined') {
    console.error('Global fetch is not available. Please run this script with Node 18+ or install node-fetch and update the script.');
    process.exit(1);
  }

  const kml = fs.readFileSync(KML_PATH, 'utf8');
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/ig;
  const urls = new Set();
  let m;
  while ((m = imgRegex.exec(kml))) {
    urls.add(m[1]);
  }

  if (urls.size === 0) {
    console.log('No images found in KML.');
    fs.writeFileSync(MAP_OUT, JSON.stringify({}, null, 2));
    return;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const map = {};

  for (const url of urls) {
    try {
      console.log('Fetching', url);
      const res = await fetch(url);
      if (!res.ok) {
        console.warn('Failed to fetch', url, res.status);
        continue;
      }
      const arrayBuffer = await res.arrayBuffer();
      const buf = Buffer.from(arrayBuffer);
      const hash = crypto.createHash('md5').update(url).digest('hex');
      let ext = '';
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('jpeg')) ext = 'jpg';
      else if (ct.includes('png')) ext = 'png';
      else if (ct.includes('gif')) ext = 'gif';
      else if (ct.includes('webp')) ext = 'webp';
      else ext = 'jpg';

      const filename = `${hash}.${ext}`;
      const outPath = path.join(OUT_DIR, filename);
      fs.writeFileSync(outPath, buf);
      map[url] = `/kml-images/${filename}`;
      console.log('Saved', outPath);
    } catch (e) {
      console.warn('Error fetching', url, (e && e.message) || e);
    }
  }

  fs.writeFileSync(MAP_OUT, JSON.stringify(map, null, 2));
  console.log('Wrote mapping to', MAP_OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
