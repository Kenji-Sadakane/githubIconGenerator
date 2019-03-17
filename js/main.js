const sourceElm = document.getElementById('source');
const dotCountElm = document.getElementById('dotCount');
const generateElm = document.getElementById('generate');
const downloadElm =  document.getElementById('download');
const identityIconElm = document.getElementById('identityIcon');
const iconSize = 315;
const defaultDotCount = 5;
const defaultColor = '#F0F0F0';

/**
 * generateボタン
 */
generateElm.addEventListener('click', () => {
  let source = (sourceElm.value.length !== 0) ? sourceElm.value : Math.random().toString(36).slice(-8);
  let dotCount = (Number(dotCountElm.value) !== 0) ? Number(dotCountElm.value) : defaultDotCount;
  const dotArray = hashToTwoDimensionArray(generateHash(source), dotCount);
  const rects = twoDimensionArrayToRect(dotArray, iconSize / dotCount);
  identityIcon.innerHTML = `<svg width="${iconSize}" height="${iconSize}"><g>"${rects}"</g></svg>`
});

// 文字列からハッシュ値を生成
function generateHash(str) {
  const sha1hash = sha1(str);
  return Array(10).fill(sha1hash).reduce((result, value) => {
    return result + sha1(result) + value;
  });
}

// ハッシュ値を元に2次元配列を生成
function hashToTwoDimensionArray(hash, dotCount) {
  let hue = `rgb(${generateRGBCode(hash).join(',')})`;
  return arrayToTwoDimension(
    splitByLength(hash, dotCount * dotCount)
    .map((value) => { return stringToInt(value) % 2; })
    .map((value) => { return valueToColor(value, hue) }
  ), dotCount)
  .map((value, index, array) => {
    // 配列の内容が左右対称になるようにする
    return (index > dotCount / 2) ? array[dotCount - index - 1] : value;
  });
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
downloadElm.addEventListener('click', () => {
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
