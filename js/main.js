const identityIcon = document.getElementById('identityIcon');
const dotCount = document.getElementById('dotCount');
const generate = document.getElementById('generate');
const download =  document.getElementById('download');
const iconSize = 300;
const defaultDotCount = 5;
const defaultColor = '#F0F0F0';

/**
 * generateボタン
 */
generate.addEventListener('click', () => {
  let sourceValue = (source.value.length !== 0) ? source.value : Math.random().toString(36).slice(-8);
  let dotCountValue = (Number(dotCount.value) !== 0) ? Number(dotCount.value) : defaultDotCount;
  const hash = generateHash(sourceValue);
  const dotArray = hashToTwoDimensionArray(hash, dotCountValue);
  const rects = twoDimensionArrayToRect(dotArray, iconSize / dotCountValue);
  identityIcon.innerHTML = `<svg width="${iconSize}" height="${iconSize}"><g>"${rects}"</g></svg>`
});

// 文字列からハッシュ値を生成
function generateHash(str) {
  let length = 5;
  return Array(length)
    .fill(str)
    .map((value, index, array) => {
      if (index == 0 || index == 4) { return sha1(value); }
      else if (index == 1 || index == 3) { return sha1(sha1(value)); }
      else { return sha1(sha1(sha1(value))); }
    })
    .reduce((result, value) => {
      return result + value;
    }
  );
}

// ハッシュ値を元に2次元配列を生成
function hashToTwoDimensionArray(hash, dotCount) {
  let hue = `rgb(${generateRGBCode(hash).join(',')})`;
  return arrayToTwoDimension(
    splitByLength(hash, dotCount * dotCount)
    .map((value) => { return stringToInt(value) % 2; })
    .map((value) => { return valueToColor(value, hue) }
  ), dotCount);
}

// 文字列をRGB値の配列に変換する
function generateRGBCode(str) {
  let rgb = [0, 0, 0];
  if (str && str.length >= 3) {
    rgb = splitByLength(str, 3).map((value) => {
      return stringToInt(value) % 256;
    });
  }
  return rgb;
}

// 色を決定
function valueToColor(value, hue) {
  return (value !== 0) ? hue : defaultColor;
}

// ２次元配列を元にrectタグを生成
function twoDimensionArrayToRect(dotArray, dotSize) {
  return dotArray.reduce((result, value, index, array) => {
    result = (index === 1) ? arrayToRect(result, 0, dotSize) : result;
    return result += arrayToRect(value, index * dotSize, dotSize);
  });
}

// １次元配列を元にrectタグを生成
function arrayToRect(dotArray, x, dotSize) {
  return dotArray.reduce((result, value, index, array) => {
    result = (index === 1) ? generateRect(x, 0, dotSize, result) : result ;
    return result += generateRect(x, index * dotSize, dotSize, value);
  });
}

// rectタグを生成
function generateRect(x, y, dotSize, hue) {
  return `<rect x="${x}" y="${y}" width="${dotSize}" height="${dotSize}" fill="${hue}" />`;
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
