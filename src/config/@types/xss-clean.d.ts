declare module 'xss-clean' {
  import express = require('express')
  function xssClean(options?: object): express.RequestHandler
  export = xssClean
}
