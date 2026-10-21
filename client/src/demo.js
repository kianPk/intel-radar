export const INDICATORS = [
  { id: 'i1', type: 'ip', value: '185.220.101.42', severity: 'high', source: 'tor-exit', tags: ['tor', 'relay'], confidence: 82, hits: 14, firstSeen: Date.now() - 86400000 * 3, lastSeen: Date.now() - 120000 },
  { id: 'i2', type: 'domain', value: 'update-cdn-check.example', severity: 'critical', source: 'dns-sink', tags: ['c2', 'dns'], confidence: 91, hits: 6, firstSeen: Date.now() - 86400000 * 2, lastSeen: Date.now() - 400000 },
  { id: 'i3', type: 'hash', value: 'e3b0c44298fc1c149afbf4c8996fb924', severity: 'medium', source: 'malware-db', tags: ['loader'], confidence: 70, hits: 3, firstSeen: Date.now() - 86400000 * 5, lastSeen: Date.now() - 800000 },
  { id: 'i4', type: 'ip', value: '45.33.32.156', severity: 'medium', source: 'scan-feed', tags: ['scanner'], confidence: 64, hits: 22, firstSeen: Date.now() - 86400000, lastSeen: Date.now() - 60000 },
  { id: 'i5', type: 'url', value: 'https://paste.example/raw/cfg-9f2a', severity: 'high', source: 'urlhaus-sim', tags: ['payload'], confidence: 77, hits: 2, firstSeen: Date.now() - 86400000 * 4, lastSeen: Date.now() - 900000 },
  { id: 'i6', type: 'domain', value: 'ntp-pool-mirror.invalid', severity: 'low', source: 'passive-dns', tags: ['suspicious'], confidence: 58, hits: 9, firstSeen: Date.now() - 86400000 * 6, lastSeen: Date.now() - 200000 },
  { id: 'i7', type: 'ip', value: '103.27.238.90', severity: 'critical', source: 'bruteforce', tags: ['ssh', 'auth'], confidence: 94, hits: 31, firstSeen: Date.now() - 86400000 * 1.5, lastSeen: Date.now() - 30000 },
  { id: 'i8', type: 'email', value: 'billing-alert@secure-pay.invalid', severity: 'medium', source: 'phish-trap', tags: ['phish'], confidence: 71, hits: 5, firstSeen: Date.now() - 86400000 * 2.2, lastSeen: Date.now() - 500000 },
  { id: 'i9', type: 'hash', value: 'a94a8fe5ccb19ba61c4c0873d391e987', severity: 'high', source: 'sandbox', tags: ['ransomware'], confidence: 88, hits: 1, firstSeen: Date.now() - 86400000 * 0.8, lastSeen: Date.now() - 100000 },
  { id: 'i10', type: 'asn', value: 'AS210558', severity: 'low', source: 'geo-risk', tags: ['hosting'], confidence: 60, hits: 11, firstSeen: Date.now() - 86400000 * 7, lastSeen: Date.now() - 700000 },
]

export const MATCHES = [
  { id: 'm0', indicatorId: 'i7', asset: 'vpn-hub', action: 'blocked', at: Date.now() - 900000 },
  { id: 'm1', indicatorId: 'i2', asset: 'api-core', action: 'blocked', at: Date.now() - 1800000 },
  { id: 'm2', indicatorId: 'i1', asset: 'edge-gw', action: 'logged', at: Date.now() - 2700000 },
  { id: 'm3', indicatorId: 'i4', asset: 'ci-runner', action: 'logged', at: Date.now() - 3600000 },
  { id: 'm4', indicatorId: 'i5', asset: 'mail-mx', action: 'blocked', at: Date.now() - 4500000 },
  { id: 'm5', indicatorId: 'i9', asset: 'staging-web', action: 'logged', at: Date.now() - 5400000 },
]
