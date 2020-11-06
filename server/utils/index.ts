/**
 * 
 */ 
function getRand() {
  let text = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let str = ''
  let len = 6
  for (let i = 0; i < len; i++) {
    let random = Math.floor(Math.random() * (text.length))
    str += text.charAt(random)
  }
  return str
}
console.log('6位随机串', getRand())
/**
 * 
 */
function getSequencedId(num: number) {
  let text = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let qutient = +num
  let radix = text.length
  let arr = []
  while (qutient > 0) {
    let mod = qutient % radix
    qutient = (qutient - mod) / radix
    arr.unshift(text[mod])
  }
  return arr.join('')
}
console.log('10进制转62进制', getSequencedId(10000))
