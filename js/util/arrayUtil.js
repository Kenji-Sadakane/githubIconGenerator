// 1次元配列を2次元配列に変換
function arrayToTwoDimension(oneDimensionArray, length) {
  return oneDimensionArray.reduce((result, value, index, array) => {
    let sliceStartIdx = index + 1 - length;
    let sliceEndIdx = index + 1;
    if ((index + 1) % length == 0) {
      result = (Array.isArray(result)) ? result : [];
      result.push(array.slice(sliceStartIdx, sliceEndIdx));
    }
    return result;
  });
}
