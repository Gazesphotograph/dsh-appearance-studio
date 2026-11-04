// Behavioral regression checks for the appearance client. No preview UI is built.
// Run: node tests/appearance-regression.mjs
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const source = await readFile(new URL('../client.js', import.meta.url), 'utf8')
const STORAGE_KEY = 'dsh.appearance-studio.v1'

function reactRuntime() {
  const instances = new Map()
  let current
  let cursor
  let pending = []
  let root
  let dirty = false
  let tree
  const React = {
    createElement: (type, props, ...children) => ({ type, props: props ?? {}, children: children.flat(Infinity) }),
    useState(initial) {
      const instance = current
      const index = cursor++
      if (!(index in instance)) instance[index] = typeof initial === 'function' ? initial() : initial
      return [instance[index], (next) => {
        const value = typeof next === 'function' ? next(instance[index]) : next
        if (!Object.is(value, instance[index])) { instance[index] = value; dirty = true }
      }]
    },
    useRef(initial) {
      const index = cursor++
      return current[index] ?? (current[index] = { current: initial })
    },
    useEffect(effect, deps) {
      const instance = current
      const index = cursor++
      const previous = instance[index]
      if (!previous || !deps || deps.some((value, i) => !Object.is(value, previous.deps?.[i]))) {
        pending.push(() => {
          previous?.cleanup?.()
          instance[index] = { deps, cleanup: effect() }
        })
      }
    },
  }
  function walk(node, path = 'root') {
    if (node === null || node === undefined || typeof node === 'boolean') return null
    if (typeof node === 'string' || typeof node === 'number') return String(node)
    if (Array.isArray(node)) return node.map((child, i) => walk(child, `${path}.${i}`)).filter((child) => child !== null)
    if (typeof node.type === 'function') {
      const key = `${path}:${node.type.name}`
      const saved = [current, cursor]
      current = instances.get(key) ?? []
      instances.set(key, current)
      cursor = 0
      try { return walk(node.type({ ...node.props, children: node.children }), `${key}>`) }
      finally { [current, cursor] = saved }
    }
    return { ...node, children: walk(node.children, `${path}>`) }
  }
  function render({ effects = true } = {}) {
    for (let attempts = 0; attempts < 12; attempts++) {
      dirty = false
      tree = walk(root)
      if (!effects) return tree
      const effectsToRun = pending
      pending = []
      for (const effect of effectsToRun) effect()
      if (!dirty) return tree
    }
    throw new Error('component effects did not settle')
  }
  return {
    React,
    mount(component, props = {}, options) {
      root = React.createElement(component, props)
      return render(options)
    },
    render,
    unmount() {
      for (const instance of instances.values()) for (const hook of instance) hook?.cleanup?.()
      instances.clear()
      pending = []
    },
  }
}

function findAll(tree, predicate, out = []) {
  if (Array.isArray(tree)) { for (const child of tree) findAll(child, predicate, out) }
  else if (tree && typeof tree === 'object') {
    if (predicate(tree)) out.push(tree)
    findAll(tree.children, predicate, out)
  }
  return out
}
const byClass = (tree, name) => findAll(tree, (node) => node.props.className?.split(' ').includes(name))
function text(tree) {
  if (Array.isArray(tree)) return tree.map(text).join(' ')
  if (typeof tree === 'string') return tree
  return tree ? text(tree.children) : ''
}

function setup(seed, { blockedStorage = false } = {}) {
  const runtime = reactRuntime()
  const attributes = new Map()
  const styles = new Set()
  const stored = new Map(seed === undefined ? [] : [[STORAGE_KEY, JSON.stringify(seed)]])
  const timers = new Map()
  let timerId = 0
  let definition
  const window = {
    __ModuleLoader__: { load: (next) => { definition = next } },
    localStorage: {
      getItem(key) { if (blockedStorage) throw new Error('storage blocked'); return stored.get(key) ?? null },
      setItem(key, value) { if (blockedStorage) throw new Error('storage blocked'); stored.set(key, value) },
    },
  }
  const document = {
    documentElement: {
      setAttribute: (key, value) => attributes.set(key, value),
      removeAttribute: (key) => attributes.delete(key),
    },
    head: { appendChild: (node) => styles.add(node) },
    createElement() { return { dataset: {}, remove() { styles.delete(this) } } },
  }
  new Function('window', 'document', 'setTimeout', 'clearTimeout', 'fetch', source)(
    window, document,
    (fn) => { timers.set(++timerId, fn); return timerId },
    (id) => timers.delete(id),
    () => { throw new Error('offline font catalog unavailable') },
  )
  const plugin = definition.factory((id) => {
    assert.equal(id, 'react')
    return runtime.React
  })
  const events = new Set()
  const registry = new Map([
    ['light', { id: 'light', colorScheme: 'light', tokens: {} }],
    ['dark', { id: 'dark', colorScheme: 'dark', tokens: {} }],
  ])
  const layers = new Map()
  let preference = 'light'
  let fontSizes = { text: 14, code: 11, terminal: 13 }
  let fontFamilies = { text: '', code: '', terminal: '' }
  let revision = 0
  let snapshot
  let eventDepth = 0
  let overrideCalls = 0
  function rebuild() {
    const base = registry.get(preference === 'system' ? 'light' : preference) ?? registry.get('light')
    const tokens = { ...base.tokens }
    for (const layer of layers.values()) for (const [token, pair] of Object.entries(layer)) tokens[token] = pair[base.colorScheme]
    snapshot = Object.freeze({ preference, active: { ...base, tokens }, fontSizes, fontFamilies, themes: [...registry.values()], revision })
  }
  function publish() {
    assert.ok(++eventDepth < 8, 'theme subscription must not recurse through overrideTokens')
    revision++
    rebuild()
    try { for (const listener of [...events]) listener(snapshot) }
    finally { eventDepth-- }
  }
  rebuild()
  const writes = []
  const theme = {
    getTheme: () => snapshot,
    setTheme(id) {
      assert.ok(id === 'system' || registry.has(id), `registered theme ${id}`)
      preference = id
      publish()
    },
    setFontFamily(role, value) {
      writes.push(['family', role, value])
      fontFamilies = { ...fontFamilies, [role]: value }
      publish()
    },
    setFontSize(role, value) {
      writes.push(['size', role, value])
      fontSizes = { ...fontSizes, [role]: value }
      publish()
    },
    register(preset) {
      assert.ok(!registry.has(preset.id))
      registry.set(preset.id, preset)
      publish()
      return () => {
        registry.delete(preset.id)
        if (preference === preset.id) preference = 'system'
        publish()
      }
    },
    overrideTokens(source, tokens) {
      overrideCalls++
      for (const pair of Object.values(tokens)) {
        assert.equal(typeof pair.light, 'string')
        assert.equal(typeof pair.dark, 'string')
      }
      layers.set(source, tokens)
      publish()
      return () => {
        if (layers.get(source) !== tokens) return
        layers.delete(source)
        publish()
      }
    },
  }
  const effects = []
  const slots = []
  const ctx = {
    theme,
    on(name, listener) {
      assert.equal(name, 'theme/change')
      events.add(listener)
      return () => events.delete(listener)
    },
    effect(fn) { const cleanup = fn(); if (typeof cleanup === 'function') effects.push(cleanup) },
    locale: { register: () => () => {}, bind: () => (key) => key },
    slots: {
      inject(_name, fn) { const cleanup = fn(); if (typeof cleanup === 'function') effects.push(cleanup) },
      register(options, component) {
        const row = { options, component }
        slots.push(row)
        return () => slots.splice(slots.indexOf(row), 1)
      },
    },
  }
  plugin.apply(ctx)
  const page = slots.find((row) => row.options.name === 'main').component
  const settings = slots.find((row) => row.options.name === 'settings.section').component
  return {
    runtime, theme, registry, layers, attributes, styles, stored, timers, writes, page, settings,
    get overrideCalls() { return overrideCalls },
    get snapshot() { return snapshot },
    get tree() { return runtime.render() },
    mount(options) { return runtime.mount(page, { t: (key) => key }, options) },
    dispose() {
      runtime.unmount()
      for (const cleanup of [...effects].reverse()) cleanup()
      assert.equal(events.size, 0, 'theme listener released')
      assert.equal(styles.size, 0, 'global stylesheet removed')
      assert.equal(layers.size, 0, 'override layer removed')
      assert.equal(slots.length, 0, 'slots removed')
      assert.equal(attributes.size, 0, 'document attributes removed')
      assert.equal(timers.size, 0, 'page timeout removed')
      assert.equal(registry.size, 2, 'only built-in themes remain')
    },
  }
}

// Single-scheme colors must preserve whichever preset the other scheme uses.
for (const [edited, presetIds] of [['light', ['as-midnight', 'as-forest']], ['dark', ['as-sand']]]) {
  const harness = setup({ colors: { [edited]: { accent: '#ab1234', background: '#123456', foreground: '#abcdef' } } })
  harness.mount()
  for (const id of presetIds) {
    harness.theme.setTheme(id)
    const preset = harness.registry.get(id)
    for (const token of ['--dsw-alias-bg-base', '--dsw-alias-bg-layer-2', '--dsw-alias-state-business-primary', '--dsw-alias-label-primary']) {
      assert.equal(harness.snapshot.active.tokens[token], preset.tokens[token], `${edited}-only customization preserves ${id}/${token}`)
    }
    const cards = byClass(harness.tree, 'as-themeCard')
    assert.equal(cards.filter((card) => card.props['aria-pressed'] === 'true').length, 1)
    assert.ok(cards.some((card) => card.props['aria-pressed'] === 'true' && text(card).includes(id === 'as-sand' ? 'themeSand' : id === 'as-forest' ? 'themeForest' : 'themeMidnight')))
  }
  const before = harness.overrideCalls
  harness.theme.setFontSize('text', 18)
  assert.equal(harness.overrideCalls, before, 'font-only event does not restack the same token layer')
  harness.dispose()
}
console.log('ok   one-scheme colors preserve opposite presets across synchronous theme changes')

// Registered themes outside this plugin also retain their original palette.
{
  const harness = setup({ colors: { light: { accent: '#ab1234' } } })
  harness.theme.register({ id: 'external', colorScheme: 'dark', tokens: { '--dsw-alias-state-business-primary': '#13579b' } })
  harness.theme.setTheme('external')
  assert.equal(harness.snapshot.active.tokens['--dsw-alias-state-business-primary'], '#13579b')
  harness.registry.delete('external')
  harness.theme.setTheme('light')
  harness.dispose()
}
console.log('ok   fallback uses the underlying registered palette without self-feedback')

// Preview the edited scheme and custom values without changing the global mode.
{
  const harness = setup({ editScheme: 'dark', colors: { dark: { accent: '#ab1234', background: '#123456', foreground: '#abcdef' } } })
  const tree = harness.mount()
  const preview = byClass(tree, 'as-preview')[0]
  assert.equal(harness.snapshot.active.colorScheme, 'light')
  assert.equal(preview.props['data-scheme'], 'dark')
  assert.equal(preview.props.style.colorScheme, 'dark')
  assert.equal(preview.props.style['--dsw-alias-bg-base'], '#123456')
  assert.equal(preview.props.style['--dsw-alias-label-primary'], '#abcdef')
  assert.equal(preview.props.style['--dsw-alias-state-business-primary'], '#ab1234')
  assert.equal(byClass(tree, 'as-previewChip').length, 1)
  assert.equal(byClass(tree, 'as-previewSecondary').length, 0, 'border label is not duplicated')
  const wells = findAll(tree, (node) => node.props.type === 'color')
  assert.deepEqual(wells.map((node) => node.props.value), ['#ab1234', '#123456', '#abcdef'])
  for (const clear of byClass(tree, 'as-clearBtn')) clear.props.onClick()
  assert.deepEqual([...harness.layers.values()][0], {}, 'clearing all colors removes the entire override')
  harness.theme.setTheme('as-forest')
  assert.equal(harness.snapshot.active.tokens['--dsw-alias-bg-base'], '#0c1410', 'clear restores the selected preset')
  harness.dispose()
}
console.log('ok   edited-scheme preview, native color inputs, and clear restore the palette')

// A change between render and effect subscription must be adopted at mount.
{
  const harness = setup()
  harness.mount({ effects: false })
  harness.theme.setFontSize('text', 20)
  assert.equal(text(byClass(harness.tree, 'as-stepValue')[0]), '20')
  harness.dispose()
}
console.log('ok   render-to-subscription race adopts the current immutable theme snapshot')

// Current version uses a bounded installed-font picker, replacing the old free-text input.
// A missing catalog must not allow unverified font choices; per-role resets remain available.
{
  const harness = setup()
  harness.mount()
  const fields = byClass(harness.tree, 'as-fontTrigger')
  assert.equal(fields.length, 3)
  assert.ok(fields.every(field => field.type === 'button' && field.props.disabled))
  assert.equal(harness.writes.length, 0, 'unavailable font catalog does not write preferences')
  harness.theme.setFontFamily('text', 'Unavailable Font')
  const reset = findAll(harness.tree, node => node.type === 'button' && node.props['aria-label'] === 'fontText fontReset')[0]
  assert.ok(reset, 'text font reset remains available')
  reset.props.onClick()
  assert.equal(harness.snapshot.fontFamilies.text, '')
  harness.dispose()
}
console.log('ok   installed-font choices are disabled without a catalog; per-role reset remains functional')

// Reset really resets service-owned fonts/sizes as well as studio-owned state.
{
  const harness = setup({ reducedMotion: true, pointerCursor: true, contrast: 'high' })
  harness.mount()
  harness.theme.setFontSize('text', 22)
  harness.theme.setFontSize('code', 16)
  harness.theme.setFontSize('terminal', 20)
  harness.theme.setFontFamily('text', 'Inter')
  harness.theme.setFontFamily('code', 'Mono')
  harness.theme.setFontFamily('terminal', 'Terminal')
  const reset = byClass(harness.tree, 'as-btn').find((node) => text(node) === 'reset')
  reset.props.onClick()
  assert.equal(harness.snapshot.preference, 'system')
  assert.deepEqual(harness.snapshot.fontSizes, { text: 14, code: 11, terminal: 13 })
  assert.deepEqual(harness.snapshot.fontFamilies, { text: '', code: '', terminal: '' })
  assert.deepEqual([...harness.layers.values()][0], {})
  assert.equal(harness.attributes.size, 0)
  assert.equal(harness.timers.size, 1, 'reset announcement has a finite lifetime')
  harness.dispose()
}
console.log('ok   reset restores every font role and unload cleans slots, tokens, styles, listeners, attributes, timers')

// Storage failures leave the session controls functional.
{
  const harness = setup(undefined, { blockedStorage: true })
  harness.mount()
  byClass(harness.tree, 'as-swatch')[2].props.onClick()
  assert.equal(harness.snapshot.active.tokens['--dsw-alias-state-business-primary'], '#8b5cf6')
  assert.equal(byClass(harness.tree, 'as-swatch')[2].props['aria-pressed'], 'true')
  harness.dispose()
}
console.log('ok   blocked persistence still permits accessible in-memory color editing')
console.log('\nall appearance behavioral regressions passed')
