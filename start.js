#!/usr/bin/env node
/**
 * PawPartner — One-command launcher
 * Starts server + client, opens browser automatically.
 * Usage:  npm start
 */
import { spawn }    from 'child_process'
import { platform } from 'os'

const C = {
  reset: '\x1b[0m', server: '\x1b[33m',
  client: '\x1b[36m', info: '\x1b[32m'
}

console.log(`
${C.info}╔══════════════════════════════════════╗
║  🐾  PawPartner — Starting up…       ║
╚══════════════════════════════════════╝${C.reset}
`)

let browserOpened = false

function openBrowser(url) {
  if (browserOpened) return
  browserOpened = true
  const cmd = platform() === 'win32' ? 'start'
            : platform() === 'darwin' ? 'open'
            : 'xdg-open'
  spawn(cmd, [url], { detached: true, stdio: 'ignore', shell: platform() === 'win32' }).unref()
  console.log(`${C.info}[LAUNCH]${C.reset} Opening ${url}…`)
}

function run(label, cmd, args, cwd, color) {
  const proc = spawn(cmd, args, { cwd, shell: true, stdio: 'pipe' })

  proc.stdout.on('data', data => {
    data.toString().split('\n').filter(Boolean).forEach(line => {
      process.stdout.write(`${color}[${label}]${C.reset} ${line}\n`)
      if (label === 'CLIENT' && (line.includes('localhost:5173') || line.includes('Local:'))) {
        setTimeout(() => openBrowser('http://localhost:5173'), 800)
      }
    })
  })

  proc.stderr.on('data', data => {
    data.toString().split('\n').filter(Boolean)
      .filter(l => !l.includes('ExperimentalWarning') && !l.includes('DeprecationWarning'))
      .forEach(l => process.stdout.write(`${color}[${label}]${C.reset} ${l}\n`))
  })

  return proc
}

const serverProc = run('SERVER', 'npm', ['run', 'dev'], './Server', C.server)
const clientProc = run('CLIENT', 'npm', ['run', 'dev'], './Client', C.client)

process.on('SIGINT', () => {
  console.log(`\n🛑 Shutting down…`)
  serverProc.kill('SIGTERM')
  clientProc.kill('SIGTERM')
  process.exit(0)
})
