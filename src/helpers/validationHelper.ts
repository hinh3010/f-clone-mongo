import moment from 'moment'

export const validateEmail = (str: string): boolean => {
  // eslint-disable-next-line no-useless-escape
  const emailReg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  return emailReg.test(str)
}

export const validatePhone = (str: string): boolean => {
  const emailReg = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{9,14}$/g
  return emailReg.test(str)
}

export const validateDate = (str: string): boolean => {
  return moment(str, 'DD-MM-YYYY').isValid()
}

export const validateTime = (str: string): boolean => {
  return moment(str, 'HH:mm:ss').isValid()
}

export const validateDateTime = (str: string): boolean => {
  return moment(str, 'DD-MM-YYYY HH:mm:ss').isValid()
}

export const validateUrl = (str: string): boolean => {
  const urlReg = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/
  return urlReg.test(str)
}

export const validateColor = (str: string): boolean => {
  const urlReg = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
  return urlReg.test(str)
}
