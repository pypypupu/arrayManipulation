const withSpread = (fn, ...args) => {
    console.log(...args)
    console.log(args)
}
const withoutSpread = (fn, args) => {
    console.log(...args)
    console.log(args)
}
try {
    withSpread(1, 2, 3, 4, 5)
}
catch (e) {
    console.log(e)
}
try {
    withoutSpread(1, 2, 3, 4, 5)
}
catch(e) {
    console.log(e)
    withoutSpread([1,2,3,4,5])
}