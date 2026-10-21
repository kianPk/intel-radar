import express from 'express'
import cors from 'cors'
import { randomUUID } from 'crypto'

const PORT = process.env.PORT || 8821
const app = express()
app.use(cors())
app.use(express.json())

const indicators = [
  { type: 'ip', value: '185.220.101.42', severity: 'high', source: 'tor-exit', tags: ['tor', 'relay'] },
  { type: 'domain', value: 'update-cdn-check.example', severity: 'critical', source: 'dns-sink', tags: ['c2', 'dns'] },
  { type: 'hash', value: 'e3b0c44298fc1c149afbf4c8996fb924', severity: 'medium', source: 'malware-db', tags: ['loader'] },
  { type: 'ip', value: '45.33.32.156', severity: 'medium', source: 'scan-feed', tags: ['scanner'] },
  { type: 'url', value: 'https://paste.example/raw/cfg-9f2a', severity: 'high', source: 'urlhaus-sim', tags: ['payload'] },
  { type: 'domain', value: 'ntp-pool-mirror.invalid', severity: 'low', source: 'passive-dns', tags: ['suspicious'] },
  { type: 'ip', value: '103.27.238.90', severity: 'critical', source: 'bruteforce', tags: ['ssh', 'auth'] },
  { type: 'email', value: 'billing-alert@secure-pay.invalid', severity: 'medium', source: 'phish-trap', tags: ['phish'] },
  { type: 'hash', value: 'a94a8fe5ccb19ba61c4c0873d391e987', severity: 'high', source: 'sandbox', tags: ['ransomware'] },
  { type: 'asn', value: 'AS210558', severity: 'low', source: 'geo-risk', tags: ['hosting'] },
].map((i, idx) => ({
  id: randomUUID().slice(0, 8),
  ...i,
  firstSeen: Date.now() - (idx + 1) * 3600_000 * 5,
  lastSeen: Date.now() - idx * 400_000,
  confidence: 55 + ((idx * 7) % 40),
  hits: 1 + ((idx * 3) % 28),
}))

const matches = indicators.slice(0, 6).map((i, idx) => ({
  id: 'm_' + idx,
  indicatorId: i.id,
  asset: ['vpn-hub', 'api-core', 'edge-gw', 'ci-runner', 'mail-mx', 'staging-web'][idx],
  action: idx % 2 === 0 ? 'blocked' : 'logged',
  at: Date.now() - idx * 900_000,
}))

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'intel-radar' }))
app.get('/api/indicators', (req, res) => {
  let list = [...indicators]
  if (req.query.severity) list = list.filter((i) => i.severity === req.query.severity)
  if (req.query.type) list = list.filter((i) => i.type === req.query.type)
  if (req.query.q) {
    const q = String(req.query.q).toLowerCase()
    list = list.filter((i) => i.value.toLowerCase().includes(q) || i.tags.some((t) => t.includes(q)))
  }
  res.json({ indicators: list })
})
app.get('/api/matches', (_req, res) => res.json({ matches }))
app.get('/api/overview', (_req, res) => {
  res.json({
    indicators: indicators.length,
    critical: indicators.filter((i) => i.severity === 'critical').length,
    matches24h: matches.length,
    sources: [...new Set(indicators.map((i) => i.source))].length,
  })
})

app.listen(PORT, () => console.log(`intel-radar on :${PORT}`))
