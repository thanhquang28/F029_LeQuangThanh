// 1. for loop
function sum1(n) {
  let result = 0
  for (let i = 1; i <= n; i++) {
    result += i
  }
  return result
}
// 2. recursion
function sum2(n) {
  if (n === 1) return 1
  return n + sum2(n - 1)
}
// 3. arithmetic progression
function sum3(n) {
  return ((1 + n) * n) / 2
}
