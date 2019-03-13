const identityIcon = document.getElementById('identityIcon');
const generate = document.getElementById('generate');
const download =  document.getElementById('download');
const iconSize = 300;
var source;
var count;

/**
 * generateボタン
 */
generate.addEventListener('click', () => {
  source = document.getElementById('source');
  let dotCount = Number(document.getElementById('dotCount').value);
  dotCount = (dotCount != 0) ? dotCount : 5;
  const hash = generateHash(source.value);
  console.log(hash);
  console.log(aaa(hash, dotCount));

  identityIcon.innerHTML = generateIcon(hash);
});

function generateHash(str) {
  return Array(10).fill(sha1(str)).reduce((result, value) => {
    return result + value;
  });
}

function aaa(hash, dotCount) {
  return splitEqualLength(hash, dotCount * dotCount).map((value) => {
    return stringToInt(value) % 2;
  }).reduce((result, item) => {
    if (!result instanceof Array) {
      return new Array(dotCount).push(item);
    } else {
      return result.push(item);
    }
  })
}

function generateIcon(hash) {
  const forDraw = hash.substr(0, count * count);

  // rgb(x, y, z)
  const hue = `rgb(${generateRGBCode(hash).join(',')}`;

  const interval = iconSize / count;
  let x = 0;
  let y = 0;
  let path = '';

  for (let c of forDraw) {
    const isDraw = c.charCodeAt() % 2 === 0;

    path += `<rect x="${x}" y="${y}" width="${interval}" height="${interval}" fill="${isDraw ? hue : 'white'}" />`;

    if (x < iconSize - interval) {
      x += interval;
    } else {
      x = 0;
      y += interval;
    }
  }

  return [
    `<svg width="${iconSize}" height="${iconSize}">`,
    '<g>',
    path,
    '</g>',
  ].join('');
}

// 文字列をRGB値に変換する
function generateRGBCode(str) {
  let rgb = [0,0,0];
  if (str && str.length >= 3) {
    rgb = splitEqualLength(str, 3).map((value) => {
      return stringToInt(value) % 256;
    });
  }
  return rgb;
}

// 文字列を特定数に均等な長さで分割する
function splitEqualLength(str, count) {
  const length = Math.floor(str.length / count);
  const regexp = new RegExp(`[\\s\\S]{1,${length}}`, 'g');
  return str.match(regexp).slice(0, count);
}

// 文字列を数値化する
function stringToInt(str) {
  return str.split('').map((value) => {
    return value.charCodeAt();
  }).reduce((result, value) => {
    return result += value;
  });
}

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
