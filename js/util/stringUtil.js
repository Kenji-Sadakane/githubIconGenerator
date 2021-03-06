// 文字列からハッシュ値を生成
function generateHash(str) {
  const sha1hash = sha1(str);
  return Array(10).fill(sha1hash).reduce((result, value) => {
    return result + sha1(result) + value;
  });
}

// 文字列を特定数に均等な長さで分割する
function splitByLength(str, count) {
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
