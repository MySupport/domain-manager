/**
 *
 * @template T
 * @param {Array<T>} array
 * @param {(item: T, index?: number, array?: Array<T>) => Promise } callback
 */
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

exports.asyncForEach = asyncForEach;
