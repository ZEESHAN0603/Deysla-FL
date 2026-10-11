const fs = require('fs');
const content = fs.readFileSync('src/data/productCatalogItems.ts', 'utf8');
const cats = new Set([...content.matchAll(/"categoryId":\s*"([^"]+)"/g)].map(m => m[1]));
console.log('Categories in catalog:', Array.from(cats));

const subcats = new Set([...content.matchAll(/"subcategoryId":\s*"([^"]+)"/g)].map(m => m[1]));
console.log('Subcategories in catalog:', Array.from(subcats));
