var colors = require('colors');
colors.enable();
const measurePerformance = (fn) => {
    const t0 = performance.now();
    const results = fn();
    const t1 = performance.now();
    return [results, t1 - t0];
}
const testFn = (resultFn, testedFn, compareResultsFn) => {
    return {
        test: (...args) => {
            const testValues = measurePerformance(() => testedFn(...args))
            const testAgainst = measurePerformance(() => resultFn(...args))
            const testResult = compareResultsFn(testValues[0], testAgainst[0])
            const testFnName = testedFn.name
            let result = `Function ${testFnName} took ${testValues[1]}ms with result ${testValues[0]} that is ${testResult ? "" : "not "}equal to ${testAgainst[0]}. Expect function took ${testAgainst[1]}ms.`
            console.log(testResult ? result.green : result.red)
        }
    }
}
const arrEqual = (arr1, arr2) => {
    if (arr1.length != arr2.length) {
        return false
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false
        }
    }
    return true
}
const push = (arr, arg) => {
    let length = arr.length + 1
    let resArr = new Array(length).fill()
    for (let i = 0; i < length - 1; i++) {
        resArr[i] = arr[i]
    }
    resArr[resArr.length - 1] = arg
    arr = resArr
    return arr
}
const unshift = (arr, arg) => {
    let length = arr.length + 1
    let resArr = new Array(length).fill()
    resArr[0] = arg
    for (let i = 1; i < length; i++) {
        resArr[i] = arr[i - 1]
    }
    arr = resArr
    return arr
}
const insertAt = (arr, at, arg) => {
    let length = arr.length + 1
    let res = new Array(length).fill()

    for (let i = 0; i < at; i++) {
        res[i] = arr[i]
    }
    res[at] = arg
    for (let i = at + 1; i < length; i++) {
        res[i] = arr[i - 1]
    }
    return res;
}
//works differently than the actual splice
const splice = (arr, at, deleteCount, ...args) => {
    let length = arr.length + (args.length - deleteCount)
    let res = new Array(length).fill()
    for (let i = 0; i < at; i++) {
        res[i] = arr[i]
    }
    for (let i = 0; i < args.length; i++) {
        res[at + i] = args[i]
    }
    for (let i = 0; i < arr.length - at - deleteCount; i++) {
        res[length - 1 - i] = arr[arr.length - 1 - i]
    }
    arr = res
    return arr
}
const flat = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            const length = arr.length
            arr = splice(arr, i, 1, ...flat(arr[i]))
            i += arr.length - length
        }
    }
    return arr
}
const sortUnique = (arr) => {
    //rudimentary hash table
    let hashSize = 1000
    let hashMap = Array(hashSize).fill([])
    let uniqueArr = []
    for (let i = 0; i < arr.length; i++) {
        let skip = false;
        for (let j = 0; j < hashMap[arr[i] % hashSize].length; j++) {
            if (arr[i] === hashMap[arr[i] % hashSize][j]) {
                skip = true;
                break
            }
        }
        if (!skip) {
            hashMap[arr[i] % hashSize] = push(hashMap[arr[i] % hashSize], arr[i]);
            uniqueArr = push(uniqueArr, arr[i])
            skip = false
        }
    }
    return uniqueArr.sort((a, b) => a - b)
}

const findDifference = (arr1, arr2) => {
    let mergedLength = arr1.length + arr2.length
    let merged = Array(mergedLength).fill()
    for (let i = 0; i < arr1.length; i++) {
        merged[i] = arr1[i]
    }
    for (let i = 0; i < arr2.length; i++) {
        merged[arr1.length + i] = arr2[i]
    }

    let hashSize = 1000
    let valuesHashMap = Array(hashSize).fill([])
    let idxHashMap = Array(hashSize).fill([])
    let uniqueArr = []
    for (let i = 0; i < merged.length; i++) {
        let skip = false;
        for (let j = 0; j < valuesHashMap[merged[i] % hashSize].length; j++) {
            if (merged[i] === valuesHashMap[merged[i] % hashSize][j]) {
                idxHashMap[merged[i] % hashSize][j] = -1
                skip = true
                break
            }
        }
        if (!skip) {
            valuesHashMap[merged[i] % hashSize] = push(valuesHashMap[merged[i] % hashSize], merged[i]);
            idxHashMap[merged[i] % hashSize] = push(idxHashMap[merged[i] % hashSize], uniqueArr.length)
            uniqueArr = push(uniqueArr, merged[i])
            skip = false
        }
    }
    let outerJoinArr = []
    for (let i = 0; i < uniqueArr.length; i++) {
        for (let j = 0; j < valuesHashMap[uniqueArr[i] % hashSize].length; j++) {
            if (idxHashMap[uniqueArr[i] % hashSize][j] != -1) {
                idxHashMap[uniqueArr[i] % hashSize][j] = -1
                outerJoinArr = push(outerJoinArr, valuesHashMap[uniqueArr[i] % hashSize][j])
            }
        }
    }
    return outerJoinArr.sort((a, b) => a - b)
}

// tests
const testPush = testFn((arr, arg) => {
    let copyArr = Array.from(arr)
    copyArr.push(arg)
    return copyArr
}, push, arrEqual)

const testUnshift = testFn((arr, arg) => {
    let copyArr = Array.from(arr)
    copyArr.unshift(arg)
    return copyArr
}, unshift, arrEqual)

const testFlat = testFn((arr) => arr.flat(Infinity), flat, arrEqual)

const testFindDifference = testFn((arr1, arr2) => {
    let map = new Map();
    let merged = [...arr1, ...arr2]
    for (let i = 0; i < merged.length; i++) {
        if (!map.has(merged[i]))
            map.set(merged[i], 1)
        else
            map.set(merged[i], undefined)
    }
    mapArr = Array.from(map).filter((x) => x[1]).map((x) => x[0]).sort((a, b) => a - b)
    return mapArr

}, findDifference, arrEqual)

const testError = testFn((arr, arg) => {
    return [1]
}, push, arrEqual)
testError.test([1], 2)
testPush.test([1, 2, 3, 4, 5, 6, 7, 8, 9], 100)
testPush.test([1, 124, 17, 568, 3, 801, 8, 4641], 9726)
testUnshift.test([1, 2, 3, 4, 5, 6, 7, 8, 9], 100)
testUnshift.test([1, 124, 17, 568, 3, 801, 8, 4641], 9726)
testFlat.test([1, [2], [3, [[4]]], [5, 6]])
testFlat.test([1, 2, 3, [4, 5, 6], [7, 8, [9, 10, 11], 12], [13, 14, 15]])
testFindDifference.test([1, 1001, 2301, 10], [0, 10, 230, 40, 1010, 1, 1001, 10])
testFindDifference.test([1, 1001, 2301, 10, 10, 10, 1010, 2010, 4051, 5329, 1234, 1534, 2859, 43], [0, 10, 230, 54, 43, 3010, 2010, 40, 1010, 1, 1001, 10])
testFindDifference.test([1, 5, 7], [50, 13, 1, 5])
