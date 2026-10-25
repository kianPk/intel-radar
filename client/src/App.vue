<script setup>
import { computed, ref } from 'vue'
import { INDICATORS, MATCHES } from './demo'

const q = ref('')
const severity = ref('all')
const type = ref('all')
const tagFilters = ref([])
const selected = ref(null)

const allTags = computed(() => {
  const set = new Set()
  for (const i of INDICATORS) for (const t of i.tags) set.add(t)
  return [...set].sort()
})

const indicators = computed(() => {
  let list = [...INDICATORS]
  if (severity.value !== 'all') list = list.filter((i) => i.severity === severity.value)
  if (type.value !== 'all') list = list.filter((i) => i.type === type.value)
  if (tagFilters.value.length) {
    list = list.filter((i) => tagFilters.value.every((t) => i.tags.includes(t)))
  }
  if (q.value.trim()) {
    const s = q.value.trim().toLowerCase()
    list = list.filter((i) => i.value.toLowerCase().includes(s) || i.tags.some((t) => t.includes(s)))
  }
  return list.sort((a, b) => b.lastSeen - a.lastSeen)
})

function toggleTag(tag) {
  const i = tagFilters.value.indexOf(tag)
  if (i >= 0) tagFilters.value.splice(i, 1)
  else tagFilters.value.push(tag)
}

function clearTagFilters() {
  tagFilters.value = []
}

const overview = computed(() => ({
  indicators: INDICATORS.length,
  critical: INDICATORS.filter((i) => i.severity === 'critical').length,
  matches: MATCHES.length,
  sources: new Set(INDICATORS.map((i) => i.source)).size,
}))

function ind(id) {
  return INDICATORS.find((i) => i.id === id)
}
function ago(ts) {
  const h = Math.floor((Date.now() - ts) / 3600000)
  return h < 24 ? h + 'h ago' : Math.floor(h / 24) + 'd ago'
}
</script>

<template>
  <div class="shell">
    <header>
      <div class="brand">
        <div class="radar" aria-hidden="true"><i /></div>
        <div>
          <h1>Intel Radar</h1>
          <p>Threat intelligence console · IoCs · asset matches</p>
        </div>
      </div>
    </header>

    <section class="kpis">
      <div><b>{{ overview.indicators }}</b><span>Indicators</span></div>
      <div class="crit"><b>{{ overview.critical }}</b><span>Critical</span></div>
      <div><b>{{ overview.matches }}</b><span>Matches</span></div>
      <div><b>{{ overview.sources }}</b><span>Sources</span></div>
    </section>

    <div class="layout">
      <section class="panel">
        <div class="toolbar">
          <input v-model="q" type="search" placeholder="Search IoC / tag…" />
          <select v-model="severity">
            <option value="all">Severity</option>
            <option value="critical">critical</option>
            <option value="high">high</option>
            <option value="medium">medium</option>
            <option value="low">low</option>
          </select>
          <select v-model="type">
            <option value="all">Type</option>
            <option>ip</option>
            <option>domain</option>
            <option>hash</option>
            <option>url</option>
            <option>email</option>
            <option>asn</option>
          </select>
        </div>
        <div class="tag-bar">
          <span class="tag-label">Tags</span>
          <button
            v-for="t in allTags"
            :key="t"
            type="button"
            class="tag-chip"
            :class="{ on: tagFilters.includes(t) }"
            @click="toggleTag(t)"
          >
            {{ t }}
          </button>
          <button v-if="tagFilters.length" type="button" class="tag-clear" @click="clearTagFilters">
            Clear filters
          </button>
        </div>
        <div class="list">
          <button
            v-for="i in indicators"
            :key="i.id"
            type="button"
            class="row"
            :class="{ on: selected?.id === i.id }"
            @click="selected = i"
          >
            <em :data-s="i.severity">{{ i.severity }}</em>
            <div>
              <strong>{{ i.value }}</strong>
              <small>{{ i.type }} · {{ i.source }} · conf {{ i.confidence }}%</small>
            </div>
            <div class="tags">
              <span v-for="t in i.tags" :key="t">{{ t }}</span>
            </div>
          </button>
        </div>
      </section>

      <aside class="panel">
        <h2>Recent matches</h2>
        <article v-for="m in MATCHES" :key="m.id" class="match">
          <div>
            <strong>{{ m.asset }}</strong>
            <small>{{ ind(m.indicatorId)?.value }}</small>
          </div>
          <em :data-a="m.action">{{ m.action }}</em>
          <span>{{ ago(m.at) }}</span>
        </article>

        <template v-if="selected">
          <h2 class="mt">Indicator</h2>
          <p class="val">{{ selected.value }}</p>
          <p class="meta">{{ selected.type }} · {{ selected.source }} · {{ selected.hits }} hits · last {{ ago(selected.lastSeen) }}</p>
          <div class="bar"><i :style="{ width: selected.confidence + '%' }" /></div>
          <p class="meta">confidence {{ selected.confidence }}%</p>
        </template>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.shell { min-height: 100vh; padding: 18px clamp(14px, 3vw, 28px) 28px; display: grid; gap: 14px; }
header { animation: rise .4s ease; }
@keyframes rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.brand { display: flex; gap: 14px; align-items: center; }
.radar {
  width: 48px; height: 48px; border-radius: 50%; border: 1px solid rgba(61,255,168,.4);
  background: radial-gradient(circle at 50% 50%, rgba(61,255,168,.2), transparent 55%), #0a1510;
  position: relative; overflow: hidden;
}
.radar i {
  position: absolute; inset: 6px; border-radius: 50%;
  background: conic-gradient(from 0deg, transparent 60%, rgba(212,255,107,.75), transparent 75%);
  animation: spin 2.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
h1 { margin: 0; font-size: 1.4rem; }
.brand p { margin: 4px 0 0; color: var(--muted); font-size: .9rem; }
.kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.kpis > div { padding: 14px; border-radius: 14px; background: var(--panel); border: 1px solid var(--line); }
.kpis b { display: block; font-family: var(--mono); font-size: 1.25rem; }
.kpis span { color: var(--faint); font-size: .7rem; text-transform: uppercase; letter-spacing: .06em; }
.kpis .crit b { color: var(--pink); }
.layout { display: grid; grid-template-columns: 1.3fr .9fr; gap: 12px; }
.panel { background: var(--panel); border: 1px solid var(--line); border-radius: 16px; padding: 14px; }
.toolbar { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 8px; margin-bottom: 12px; }
.tag-bar { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-bottom: 12px; }
.tag-label { font-size: .72rem; color: var(--faint); text-transform: uppercase; letter-spacing: .06em; margin-right: 4px; }
.tag-chip {
  font-size: .72rem; padding: 5px 10px; border-radius: 999px; border: 1px solid var(--line);
  color: var(--muted); background: #0a0810;
}
.tag-chip.on { color: var(--lime); border-color: rgba(212,255,107,.35); background: rgba(212,255,107,.08); }
.tag-clear { font-size: .72rem; padding: 5px 10px; border-radius: 999px; border: 1px dashed var(--line); color: var(--violet); }
input, select { padding: 10px 12px; border-radius: 10px; border: 1px solid var(--line); background: #0a0810; outline: none; }
.list { display: grid; gap: 6px; max-height: 520px; overflow: auto; }
.row {
  display: grid; grid-template-columns: 78px 1.4fr 1fr; gap: 10px; align-items: center;
  text-align: left; padding: 10px; border-radius: 12px; border: 1px solid transparent;
}
.row:hover, .row.on { background: #122018; border-color: var(--line); }
.row strong { display: block; font-size: .9rem; word-break: break-all; }
.row small { color: var(--muted); font-size: .72rem; }
em {
  font-style: normal; font-family: var(--mono); font-size: .62rem; text-transform: uppercase;
  padding: 4px 6px; border-radius: 6px; text-align: center; background: #132018;
}
em[data-s='critical'] { color: var(--pink); background: rgba(255,107,107,.12); }
em[data-s='high'] { color: var(--amber); background: rgba(255,200,87,.12); }
em[data-s='medium'] { color: var(--violet); background: rgba(61,255,168,.12); }
em[data-s='low'] { color: var(--lime); background: rgba(212,255,107,.1); }
.tags { display: flex; flex-wrap: wrap; gap: 4px; justify-content: flex-end; }
.tags span { font-size: .68rem; color: var(--muted); border: 1px solid var(--line); padding: 2px 6px; border-radius: 999px; }
h2 { margin: 0 0 12px; font-size: .95rem; }
.match {
  display: grid; grid-template-columns: 1fr auto auto; gap: 10px; align-items: center;
  padding: 10px 0; border-bottom: 1px solid rgba(38,31,53,.8); font-size: .85rem;
}
.match strong { display: block; }
.match small { color: var(--muted); font-size: .72rem; word-break: break-all; }
.match span { color: var(--faint); font-size: .72rem; font-family: var(--mono); }
em[data-a='blocked'] { color: var(--pink); }
em[data-a='logged'] { color: var(--violet); }
.mt { margin-top: 22px; }
.val { margin: 0; font-family: var(--mono); font-size: .85rem; color: var(--lime); word-break: break-all; }
.meta { margin: 8px 0 0; color: var(--muted); font-size: .8rem; }
.bar { margin-top: 10px; height: 8px; border-radius: 99px; background: #0a0810; overflow: hidden; }
.bar i { display: block; height: 100%; background: linear-gradient(90deg, var(--violet), var(--amber)); }
@media (max-width: 900px) {
  .layout, .toolbar, .kpis { grid-template-columns: 1fr; }
  .row { grid-template-columns: 78px 1fr; }
  .tags { display: none; }
}
</style>
