const sourceElm = document.getElementById('source');
const dotCountElm = document.getElementById('dotCount');
const generateElm = document.getElementById('generate');
const downloadElm =  document.getElementById('download');
const identityIconElm = document.getElementById('identityIcon');
const iconSize = 300;
const dotCount = 5;
const dotSize = 50;
const defaultColor = '#F0F0F0';

/**
 * generateボタン
 */
generateElm.addEventListener('click', () => {
  // アイコン生成元ハッシュ値生成
  let sourceHash = getSourceHash(sourceElm.value);
  // ハッシュ値を２次元配列に変換
  const dotArray = hashToTwoDimensionArray(sourceHash, dotCount);
  // ２次元配列をrectタグに変換
  const rects = twoDimensionArrayToRect(dotArray);
  // svgタグ内にrectタグ群を追加
  addRectTag(rects);
});

// 文字列をハッシュ値に変換
function getSourceHash(str) {
  let source = (str.length !== 0) ? str : Math.random().toString(36).slice(-8);
  return generateHash(source);
}

// ハッシュ値を元に2次元配列を生成
function hashToTwoDimensionArray(hash) {
  let hue = `rgb(${generateRGBCode(hash).join(',')})`;
  return arrayToTwoDimension(
    splitByLength(hash, dotCount * dotCount)
    .map((value) => { return stringToInt(value) % 2; })
    .map((value) => { return (value !== 0) ? hue : defaultColor; }
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

// ２次元配列を元にrectタグを生成
function twoDimensionArrayToRect(dotArray) {
  return dotArray.reduce((result, value, index, array) => {
    result = (index === 1) ? arrayToRect(result, 25) : result;
    return result += arrayToRect(value, index * dotSize + 25);
  });
}

// １次元配列を元にrectタグを生成
function arrayToRect(dotArray, x) {
  return dotArray.reduce((result, value, index, array) => {
    result = (index === 1) ? generateRect(x, 25, result) : result ;
    return result += generateRect(x, index * dotSize + 25, value);
  });
}

// rectタグを生成
function generateRect(x, y, hue) {
  return `<rect x="${x}" y="${y}" width="${dotSize}" height="${dotSize}" fill="${hue}" />`;
}

function addRectTag(rects) {
  let targetElm = identityIcon.getElementsByTagName('g')[0];
  // 初期化
  targetElm.innerHTML = '';
  // rectタグ追加
  targetElm.insertAdjacentHTML('afterbegin', rects);
  // 背景設定
  targetElm.insertAdjacentHTML('afterbegin', `<rect x="0" y="0" width="300" height="300" fill="#F0F0F0" />`);
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
