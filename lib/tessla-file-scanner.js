'use babel'

export default class TeSSLaFileScanner {

  static fetchCFunctions({file, projectPath}) {
    // get function names
    var namesAssoc = {}
    var names      = []

    // create variables to get regex and matches
    var regex      = /(?:[a-zA-Z][\_\w]*)(?:\s*[\*]?\s+|\s+[\*]\s*)([a-zA-Z][\_\w]*)\s*\(/g
    var match      = ''
    var lineCnt    = 1

    // loop over each line of code and get the match match
    require('fs').readFileSync(file).toString().split('\n').forEach((line) => {
      do {
        // get new match
        match = regex.exec(line)

        // if there where any match
        if (match) {

          // push match group 1 into names array
          var f    = file.replace(projectPath + '/', '')
          var func = match[1]

          namesAssoc[f + ':' + func] = {
            fileName:     f,
            functionName: func,
            occurrence:   lineCnt + ':' + match.index
          }
        }
      }
      // do this as long as there are any matches
      while (match)

      // increment line
      lineCnt++
    })

    // copy elements back to names
    for (var funcObj in namesAssoc) {
      names.push(namesAssoc[funcObj])
    }

    // return function names as a array
    return names
  }

  static fetchCFunctionsFromTeSSLaFile({file, projectPath}) {
    // get function names
    var namesAssoc = {}
    var names      = []

    require('fs').readFileSync(file).toString().split('\n').forEach((line) => {
      // first check if there is a function specified in this line
      var idx_fnCall  = line.indexOf('function_calls("')
      var idx_comment = line.indexOf('--')

      // if there is a comment befor the function call skip this function call
      var onlyFunctionCall = idx_fnCall != -1 && idx_comment == -1
      var functionCallBeforeComment = idx_fnCall != -1 && idx_comment != -1 && idx_fnCall < idx_comment

      if (onlyFunctionCall || functionCallBeforeComment) {
        // extract function name
        var functionName = line.substr(idx_fnCall + 'function_calls("'.length)
        functionName     = functionName.substr(0, functionName.indexOf('"'))

        namesAssoc[functionName] = functionName
      }
    })

    // copy elements back to names
    for (var funcObj in namesAssoc) {
      names.push(namesAssoc[funcObj])
    }

    // return function names as a array
    return names
  }
}
