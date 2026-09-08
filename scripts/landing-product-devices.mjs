import assert from 'node:assert/strict';

// Owner-reviewed alpha-only edit of the pinned original; no RGB changes.
// Scoped adapters preserve original assets; publishing requires an explicit release.
export const productDeviceImagePath = 'img/danzuni-devices-isolated.png';
export const productDeviceImageHash = '0c15f054217a4d5d598d622b36a34456dae102cd93f9e1cac7beea5ef3ca4368';
export const productStylePath = 'css/product-devices.css';
export const productAssets = {
  [productDeviceImagePath]: productDeviceImagePath.slice('img/'.length),
  [productStylePath]: 'product-devices.css'
};

export const oldProductImage = '<img loading="lazy" decoding="async" class="join__image" src="/v1/img/danzuni-devices-642dba75.png" alt="Danzuni class library illustrated on desktop, tablet and phone" width="1474" height="1067">';
export const productImageMarkup = oldProductImage
  .replace('class="join__image"', 'class="join__image join__image--transparent"')
  .replace('src="/v1/img/danzuni-devices-642dba75.png"', `src="/v1/${productDeviceImagePath}"`);

export function refineProductDevices(html) {
  const images = [...html.matchAll(/<img\b[^>]*class="[^"]*\bjoin__image\b[^"]*"[^>]*>/g)];
  assert.equal(images.length, 1, 'Expected one product image');
  assert.equal(images[0][0], oldProductImage, 'Review changed product image markup');
  assert.equal(html.split('</head>').length, 2, 'Expected one head');
  assert.ok(!html.includes(productStylePath) && !html.includes('join__image--transparent'), 'Product preview must run once');
  return html.replace(oldProductImage, productImageMarkup)
    .replace('</head>', `<link rel="stylesheet" href="/v1/${productStylePath}"></head>`);
}
