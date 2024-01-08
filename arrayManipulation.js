const test = (result, testFn, compareFn, ...args) => {
    const out = testFn(...args)
    console.log(`Test values ${out} are ${compareFn(out, result) ? "" : "not "}equal to ${result} for function ${testFn.name}.`)
}
const arrEqual = (arr1, arr2) => {
    if (arr1.length != arr2.length)
        return false;
    for (let i = 0; i < arr1.length; i++)
        if (arr1[i] !== arr2[i])
            return false;

    return true;
}
const push = (arr, arg) => Array(arr.length + 1).fill().map((val, index) => index === arr.length ? arg : arr[index]);
const push2 = (arr, arg) => [...arr, arg]
const unshift = (arr, arg) => Array(arr.length + 1).fill().map((val, index) => index === 0 ? arg : arr[index - 1]);
const unshift2 = (arr, arg) => [arg, ...arr]
const insertAt = (arr, at, arg) => {
    let mem = 0
    return Array(arr.length + 1).fill().map((val, index) => {
        if (index === at) {
            mem++
            return arg
        }
        return arr[index - mem]
    })
}
const flat = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            const length = arr.length
            arr.splice(i, 1, ...flat(arr[i]))
            i += arr.length - length
        }
    }
    return arr;
}
const sortUnique = (arr) => Array.from(new Set(flat(arr))).sort((a, b) => a - b)

const findDifference = (arr1, arr2) => {
    let map = new Map();
    let merged = [...arr1, ...arr2]
    for (let i = 0; i < merged.length; i++) {
        if (!map.has(merged[i]))
            map.set(merged[i], 1)
        else
            map.delete(merged[i])
    }
    return Array.from(map).map((x) => x[0]).sort((a, b) => a - b)
}

console.log(findDifference([1, 5, 7], [50, 13, 1, 5]))
test([1, 2, 3, 4, 5, 6, 100], push, arrEqual, [1, 2, 3, 4, 5, 6], 100)
test([1, 2, 3, 4, 5, 6, 100], push2, arrEqual, [1, 2, 3, 4, 5, 6], 100)
test([100, 1, 2, 3, 4, 5, 6], unshift, arrEqual, [1, 2, 3, 4, 5, 6], 100)
test([100, 1, 2, 3, 4, 5, 6], unshift2, arrEqual, [1, 2, 3, 4, 5, 6], 100)
test([100, 1, 2, 3, 4, 5, 6], insertAt, arrEqual, [1, 2, 3, 4, 5, 6], 0, 100)
test([1, 2, 3, 4, 5, 100, 6], insertAt, arrEqual, [1, 2, 3, 4, 5, 6], 5, 100)
test([1, 2, 3, 4, 5, 6, 100], insertAt, arrEqual, [1, 2, 3, 4, 5, 6], 6, 100)
test([1, 2, 3, 4, 5, 6], flat, arrEqual, [1, [2], [3, [[4]]], [5, 6]])
test(Array.from(Array(15).keys()).map((_, index) => index + 1), flat, arrEqual, [1, 2, 3, [4, 5, 6], [7, 8, [9, 10, 11], 12], [13, 14, 15]])
test([1, 3, 5, 15, 100], sortUnique, arrEqual, [[5, 1, 15], [3, 5, 1], [5, 100, 1]])
test([7, 13, 50], findDifference, arrEqual, [1, 5, 7], [50, 13, 1, 5])