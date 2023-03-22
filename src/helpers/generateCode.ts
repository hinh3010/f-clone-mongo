import CryptoJS from 'crypto-js'

export function generateCode(length: number = 8): string {
  const wordArray = CryptoJS.lib.WordArray.random(length)
  return wordArray.toString(CryptoJS.enc.Hex).toUpperCase().substring(0, length)
}
