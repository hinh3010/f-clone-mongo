const obj = (param: any): boolean => {
  return Object.keys(param).length === 0 && param.constructor === Object
}

function removeFieldEmptyInObj(obj: object): object {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))
}

const checkEmpty = {
  obj, removeFieldEmptyInObj
}

export default checkEmpty
