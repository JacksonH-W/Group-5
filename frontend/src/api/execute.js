export function runCode(sourceCode) {
  const logs = []
  const origLog = console.log
  const origError = console.error
  const origWarn = console.warn

  try {
    console.log = (...args) => logs.push(args.map(String).join(' '))
    console.error = (...args) => logs.push(args.map(String).join(' '))
    console.warn = (...args) => logs.push(args.map(String).join(' '))

    // eslint-disable-next-line no-new-func
    new Function(sourceCode)()

    return { stdout: logs.join('\n'), stderr: null, compile_output: null }
  } catch (err) {
    return { stdout: logs.join('\n') || null, stderr: err.toString(), compile_output: null }
  } finally {
    console.log = origLog
    console.error = origError
    console.warn = origWarn
  }
}
