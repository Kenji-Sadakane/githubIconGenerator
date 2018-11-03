const identityIcon = document.getElementById('identityIcon');
const generate = document.getElementById('generate');
const download =  document.getElementById('download');
var source;
var count;

/**
 * generateボタン
 */
generate.addEventListener('click', () => {
  source = document.getElementById('source');
  count = Number(document.getElementById('count').value);
  count = (count != 0) ? count : 5;
  const hash = generateHash(source.value);
  console.log(hash);
  const size = 300;

  identityIcon.innerHTML = generateIcon(hash, size);
});

/**
 * downloadボタン
 */
download.addEventListener('click', () => {
  const svg = identityIcon.querySelector('svg');
  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement('canvas');
  canvas.width = svg.width.baseVal.value;
  canvas.height = svg.height.baseVal.value;

  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
    canvas.toBlob(blob => {
      saveAs(blob, 'icon.png');
    }, 'image/png');
  };
  
  img.src = "data:image/svg+xml;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(svgData)));
});

function generateHash(str) {
  let hash = sha1(str);
  for (var i=0; i<10; i++) {
    hash += sha1(hash);
  }
  return hash;
}

/**
 * IdentityIconを生成し、SVGのパスを返す
 * @param {string} hash sha1などでハッシュ化した値
 * @param {number} size アイコンの横幅
 * @return {string} SVGのパス
 */
function generateIcon(hash, size) {
  const forDraw = hash.substr(0, count*count);

  // rgb(x, y, z)
  const hue = `rgb(${generateRGBCode(hash).join(',')}`;

  const interval = size / count;
  let x = 0;
  let y = 0;
  let path = '';

  for (let c of forDraw) {
    const isDraw = c.charCodeAt() % 2 === 0;

    path += `<rect x="${x}" y="${y}" width="${interval}" height="${interval}" fill="${isDraw ? hue : 'white'}" />`;

    if (x < size - interval) {
      x += interval;
    } else {
      x = 0;
      y += interval;
    }
  }

  return [
    `<svg width="${size}" height="${size}">`,
    '<g>',
    path,
    '</g>',
  ].join('');
}

/**
 * 文字列からRGBを取得する
 * @param {string} val RGBに変換する文字列
 * @return {Array} [r, g, b]で返す
 */
function generateRGBCode(val) {
  if (!val) { return [0,0,0]; }
  const len = Math.floor(val.length / 3);
  // /[\s\S]{1,n}/g
  const regexp = new RegExp(`[\\s\\S]{1,${len}}`, 'g');
  const codes = val.match(regexp);

  const rgb = [];
  codes.forEach(a => {
    let n = 0;
    for (let x of a) {
      n += x.charCodeAt();
    }
    rgb.push(n % 256);
  });

  return rgb;
}

