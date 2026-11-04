window.__ModuleLoader__.load({
  id: '@local/dsh-appearance-studio',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useState, useEffect, useRef } = React

    const NS = 'appearanceStudio'
    const STORAGE_KEY = 'dsh.appearance-studio.v1'
    const OVERRIDE_SOURCE = 'appearance-studio'

    // -----------------------------------------------------------------------
    // Copy
    // -----------------------------------------------------------------------

    const zh = {
      panel: '外观',
      title: '外观工作室',
      intro: '模式、主题、颜色、字体与界面细节，全部在这里集中调整。',
      reset: '恢复默认',
      resetHint: '把颜色、字体与界面开关恢复为默认值。',

      sectionMode: '模式',
      sectionModeHint: '选择界面的明暗偏好。',
      modeLight: '浅色',
      modeDark: '深色',
      modeSystem: '跟随系统',
      modeActive: '当前生效：{scheme}',

      sectionTheme: '主题',
      sectionThemeHint: '一套预设配色，选择后会同时改变背景与强调色。',
      themeLight: '浅色',
      themeDark: '深色',
      themeMidnight: '午夜蓝',
      themeSand: '暖沙',
      themeForest: '深林',
      themeSwatch: '预览',

      sectionColors: '强调色、背景、前景',
      sectionColorsHint: '分别设置浅色与深色模式下的颜色，留空则使用主题默认值。',
      editLight: '正在编辑浅色模式',
      editDark: '正在编辑深色模式',
      accent: '强调色',
      accentHint: '按钮、选中态与高亮的主色。',
      background: '背景',
      backgroundHint: '页面底色，卡片层级会据此自动推导。',
      foreground: '前景',
      foregroundHint: '正文颜色，次级文字会据此自动推导。',
      clearColor: '恢复默认颜色',
      pickColor: '选择颜色',
      customValue: '自定义',
      previewTitle: '预览',
      previewBody: '正文文字示例，用于确认对比度是否合适。',
      previewAccent: '强调按钮',
      previewBorder: '卡片描边',

      sectionFonts: '字体',
      sectionFontsHint: '直接选择本机已安装的字体，分别应用于界面、代码和终端。',
      fontText: '界面与内容字体',
      fontTextHint: '用于侧边栏、按钮、设置页与会话正文。',
      fontCode: '代码字体',
      fontCodeHint: '用于代码块、行内代码与工具输出。',
      fontTerminal: '终端字体',
      fontTerminalHint: '用于侧边栏终端。',
      fontPlaceholder: '默认字体',
      fontReset: '恢复默认', fontSearch:'搜索已安装字体…', fontReload:'重新读取', fontLoading:'正在读取本机字体…', fontFailed:'未能读取本机字体，请点击重新读取。', fontCount:'已读取 {total} 款本机字体', fontMatches:'匹配 {count} / {total} 款字体', fontCurrent:'当前设置：{font}', fontNoMatches:'没有匹配的字体',

      sectionSizes: '字号',
      sectionSizesHint: '分别调整界面、代码与终端的字号。',
      sizeInterface: '界面字号',
      sizeCode: '代码字号',
      sizeTerminal: '终端字号',
      sizeIncrease: '增大',
      sizeDecrease: '减小',
      sizeUnit: 'px',

      sectionMotion: '减少动态效果',
      sectionMotionHint: '关闭过渡与动画，界面切换会立即完成。',
      reducedMotion: '减少动态效果',
      reducedMotionHint: '适合对动效敏感或在低性能设备上使用。',

      sectionDetails: '界面细节',
      sectionDetailsHint: '侧栏材质、边框对比度与代码差异高亮。',
      translucentSidebar: '半透明侧边栏',
      translucentSidebarHint: '模糊应用背后的窗口内容，浅色与深色自动适配。',
      contrast: '对比度',
      contrastHint: '提高边框和键盘焦点的可见度。',
      contrastDefault: '标准',
      contrastMedium: '较高',
      contrastHigh: '最高',
      diffMarkers: '差异标记',
      diffMarkersHint: '增强新增与删除内容的底色标记。',
      pointerCursor: '使用指针光标',
      pointerCursorHint: '悬停在按钮与链接上时显示手型光标。',

      on: '开启',
      off: '关闭',
      applied: '已应用',
      resetDone: '已恢复默认外观',
    }

    const en = {
      panel: 'Appearance',
      title: 'Appearance studio',
      intro: 'Mode, themes, colors, fonts, and interface details in one place.',
      reset: 'Reset to defaults',
      resetHint: 'Restore default colors, fonts, and interface switches.',

      sectionMode: 'Mode',
      sectionModeHint: 'Choose the light or dark preference for the interface.',
      modeLight: 'Light',
      modeDark: 'Dark',
      modeSystem: 'System',
      modeActive: 'Active: {scheme}',

      sectionTheme: 'Theme',
      sectionThemeHint: 'A preset palette that changes the background and accent together.',
      themeLight: 'Light',
      themeDark: 'Dark',
      themeMidnight: 'Midnight',
      themeSand: 'Warm sand',
      themeForest: 'Deep forest',
      themeSwatch: 'Preview',

      sectionColors: 'Accent, background, foreground',
      sectionColorsHint: 'Set colors for light and dark separately; empty means the theme default.',
      editLight: 'Editing light mode',
      editDark: 'Editing dark mode',
      accent: 'Accent',
      accentHint: 'Primary color for buttons, selection, and highlights.',
      background: 'Background',
      backgroundHint: 'Page base color; surface layers are derived from it.',
      foreground: 'Foreground',
      foregroundHint: 'Body text color; secondary text is derived from it.',
      clearColor: 'Reset this color',
      pickColor: 'Pick a color',
      customValue: 'Custom',
      previewTitle: 'Preview',
      previewBody: 'Sample body text, to check that the contrast reads well.',
      previewAccent: 'Accent button',
      previewBorder: 'Card border',

      sectionFonts: 'Fonts',
      sectionFontsHint: 'Choose installed fonts for the interface, code, and terminal.',
      fontText: 'Interface & content font',
      fontTextHint: 'Used by the sidebar, buttons, settings pages, and conversation text.',
      fontCode: 'Code font',
      fontCodeHint: 'Used by code blocks, inline code, and tool output.',
      fontTerminal: 'Terminal font',
      fontTerminalHint: 'Used by the sidebar terminal.',
      fontPlaceholder: 'Default font',
      fontReset: 'Reset', fontSearch:'Search installed fonts…', fontReload:'Reload fonts', fontLoading:'Reading installed fonts…', fontFailed:'Unable to read local fonts. Please reload.', fontCount:'{total} installed font families', fontMatches:'{count} / {total} font families match', fontCurrent:'Current: {font}', fontNoMatches:'No matching fonts',

      sectionSizes: 'Font size',
      sectionSizesHint: 'Adjust the interface, code, and terminal sizes separately.',
      sizeInterface: 'Interface size',
      sizeCode: 'Code size',
      sizeTerminal: 'Terminal size',
      sizeIncrease: 'Increase',
      sizeDecrease: 'Decrease',
      sizeUnit: 'px',

      sectionMotion: 'Reduced motion',
      sectionMotionHint: 'Turn off transitions and animations for instant switching.',
      reducedMotion: 'Reduce motion',
      reducedMotionHint: 'For motion sensitivity or low-performance devices.',

      sectionDetails: 'Interface details',
      sectionDetailsHint: 'Sidebar material, contrast, and diff highlighting.',
      translucentSidebar: 'Translucent sidebar',
      translucentSidebarHint: 'Blur the windows behind this app with native Acrylic, adapted to light and dark mode.',
      contrast: 'Contrast',
      contrastHint: 'Strengthen borders and keyboard focus indicators.',
      contrastDefault: 'Standard',
      contrastMedium: 'Higher',
      contrastHigh: 'Highest',
      diffMarkers: 'Diff markers',
      diffMarkersHint: 'Strengthen the background marking for added and removed content.',
      pointerCursor: 'Pointer cursor',
      pointerCursorHint: 'Show a hand cursor over buttons and links.',

      on: 'On',
      off: 'Off',
      applied: 'Applied',
      resetDone: 'Appearance reset to defaults',
    }

    // -----------------------------------------------------------------------
    // Token defaults — the built-in light/dark palette for every token this
    // studio can override. Used to fill a scheme where the user set no custom
    // value, because one override layer must carry both schemes.
    // -----------------------------------------------------------------------

    const TOKEN_DEFAULTS = {
      '--dsw-alias-bg-base': { light: '#ffffff', dark: '#151517' },
      '--dsw-alias-bg-layer-1': { light: '#ffffff', dark: '#232324' },
      '--dsw-alias-bg-layer-2': { light: '#ffffff', dark: '#2c2c2e' },
      '--dsw-alias-bg-layer-3': { light: '#ffffff', dark: '#353638' },
      '--dsw-specific-sidebar-fill': { light: '#fafafa', dark: '#1b1b1c' },
      '--dsw-alias-label-primary': { light: '#0f1115', dark: '#fafafa' },
      '--dsw-alias-label-secondary': { light: '#61666b', dark: '#cfd3d6' },
      '--dsw-alias-label-tertiary': { light: '#545557', dark: '#adb2b8' },
      '--dsw-alias-label-caption': { light: '#a2a4a6', dark: '#545557' },
      '--dsw-alias-border-l2': { light: '#0000001a', dark: '#ffffff1f' },
      '--dsw-alias-border-l3': { light: '#0000001f', dark: '#ffffff29' },
      '--dsw-alias-border-l4': { light: '#00000029', dark: '#ffffff33' },
      '--dsw-alias-state-business-primary': { light: '#4176e6', dark: '#7aaaff' },
      '--dsw-alias-state-business-tertiary': { light: '#e4edfd', dark: '#34415b' },
      '--dsw-alias-markdown-code-block': { light: '#fafafa', dark: '#1b1b1c' },
      '--dsw-alias-code-diff-added': { light: '#22c55e14', dark: '#22c55e1f' },
      '--dsw-alias-code-diff-deleted': { light: '#ec131314', dark: '#f25a5a1f' },
      '--dsw-alias-file-diff-added-bg': { light: '#e6f4e7', dark: '#1f3124' },
      '--dsw-alias-file-diff-deleted-bg': { light: '#fce6e2', dark: '#3c1f1b' },
    }

    // -----------------------------------------------------------------------
    // Preset themes registered through the theme service
    // -----------------------------------------------------------------------

    const PRESET_THEMES = [
      {
        id: 'as-midnight',
        colorScheme: 'dark',
        labelKey: 'themeMidnight',
        tokens: {
          '--dsw-alias-bg-base': '#0b0f16',
          '--dsw-alias-bg-layer-1': '#121821',
          '--dsw-alias-bg-layer-2': '#18202b',
          '--dsw-alias-bg-layer-3': '#1f2836',
          '--dsw-alias-bg-overlay': '#232d3d',
          '--dsw-alias-label-primary': '#e8eef7',
          '--dsw-alias-label-secondary': '#a9b6c8',
          '--dsw-alias-label-tertiary': '#7f8ea3',
          '--dsw-alias-label-caption': '#5b6879',
          '--dsw-alias-border-l1': '#ffffff12',
          '--dsw-alias-border-l2': '#ffffff1f',
          '--dsw-alias-border-l3': '#ffffff2b',
          '--dsw-alias-border-l4': '#ffffff38',
          '--dsw-specific-sidebar-fill': '#0e131b',
          '--dsw-alias-markdown-code-block': '#0e131b',
          '--dsw-alias-state-business-primary': '#5b9dff',
          '--dsw-alias-state-business-tertiary': '#1b2a44',
        },
      },
      {
        id: 'as-sand',
        colorScheme: 'light',
        labelKey: 'themeSand',
        tokens: {
          '--dsw-alias-bg-base': '#faf7f2',
          '--dsw-alias-bg-layer-1': '#fffdf9',
          '--dsw-alias-bg-layer-2': '#fffdf9',
          '--dsw-alias-bg-layer-3': '#f5f0e8',
          '--dsw-alias-bg-overlay': '#efe9df',
          '--dsw-alias-label-primary': '#2a2620',
          '--dsw-alias-label-secondary': '#5c554a',
          '--dsw-alias-label-tertiary': '#837a6c',
          '--dsw-alias-label-caption': '#a89e8e',
          '--dsw-alias-border-l1': '#0000000a',
          '--dsw-alias-border-l2': '#00000014',
          '--dsw-alias-border-l3': '#0000001f',
          '--dsw-alias-border-l4': '#00000029',
          '--dsw-specific-sidebar-fill': '#f3eee5',
          '--dsw-alias-markdown-code-block': '#f3eee5',
          '--dsw-alias-state-business-primary': '#b4622a',
          '--dsw-alias-state-business-tertiary': '#f6e6d8',
        },
      },
      {
        id: 'as-forest',
        colorScheme: 'dark',
        labelKey: 'themeForest',
        tokens: {
          '--dsw-alias-bg-base': '#0c1410',
          '--dsw-alias-bg-layer-1': '#121c17',
          '--dsw-alias-bg-layer-2': '#17241d',
          '--dsw-alias-bg-layer-3': '#1e2d24',
          '--dsw-alias-bg-overlay': '#24382c',
          '--dsw-alias-label-primary': '#e6f0e9',
          '--dsw-alias-label-secondary': '#a8bcae',
          '--dsw-alias-label-tertiary': '#7e9486',
          '--dsw-alias-label-caption': '#5a6b60',
          '--dsw-alias-border-l1': '#ffffff12',
          '--dsw-alias-border-l2': '#ffffff1f',
          '--dsw-alias-border-l3': '#ffffff2b',
          '--dsw-alias-border-l4': '#ffffff38',
          '--dsw-specific-sidebar-fill': '#0f1813',
          '--dsw-alias-markdown-code-block': '#0f1813',
          '--dsw-alias-state-business-primary': '#4ec98a',
          '--dsw-alias-state-business-tertiary': '#1c3328',
        },
      },
    ]

    /** Accent swatches offered for the custom accent picker. */
    const ACCENT_SWATCHES = [
      '#4176e6', '#7aaaff', '#8b5cf6', '#c026d3', '#ec4899',
      '#ef4444', '#f59e0b', '#22c55e', '#14b8a6', '#64748b',
    ]

    /** Font-size ranges, mirroring the theme service contract. */
    const SIZE_SPECS = {
      text: { min: 10, max: 22, default: 14 },
      code: { min: 10, max: 16, default: 11 },
      terminal: { min: 10, max: 20, default: 13 },
    }

    // -----------------------------------------------------------------------
    // Persisted state
    // -----------------------------------------------------------------------

    const DEFAULT_STATE = {
      version: 1,
      colors: {
        light: { accent: '', background: '', foreground: '' },
        dark: { accent: '', background: '', foreground: '' },
      },
      editScheme: 'light',
      reducedMotion: false,
      translucentSidebar: false,
      contrast: 'default',
      diffMarkers: false,
      pointerCursor: false,
    }

    /** Deep-copy the default state so callers cannot mutate the constant. */
    function defaultState() {
      return JSON.parse(JSON.stringify(DEFAULT_STATE))
    }

    /** Merge a stored value over the defaults, dropping anything malformed. */
    function normalizeState(raw) {
      const state = defaultState()
      if (raw === null || typeof raw !== 'object') return state
      for (const scheme of ['light', 'dark']) {
        const source = raw.colors?.[scheme]
        if (source === null || typeof source !== 'object') continue
        for (const key of ['accent', 'background', 'foreground']) {
          const value = source[key]
          if (typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value)) state.colors[scheme][key] = value.toLowerCase()
        }
      }
      if (raw.editScheme === 'light' || raw.editScheme === 'dark') state.editScheme = raw.editScheme
      for (const key of ['reducedMotion', 'translucentSidebar', 'diffMarkers']) {
        if (typeof raw[key] === 'boolean') state[key] = raw[key]
      }
      if (raw.contrast === 'default' || raw.contrast === 'medium' || raw.contrast === 'high') state.contrast = raw.contrast
      return state
    }

    /** Read the persisted state, tolerating a missing or corrupt entry. */
    function loadState() {
      try {
        const text = window.localStorage.getItem(STORAGE_KEY)
        if (text === null) return defaultState()
        return normalizeState(JSON.parse(text))
      } catch {
        return defaultState()
      }
    }

    /** Persist the state; a full or blocked store must not break the UI. */
    function saveState(state) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      } catch {
        // Private mode or a full quota: the session keeps working in memory.
      }
    }

    // -----------------------------------------------------------------------
    // Override layer construction
    // -----------------------------------------------------------------------

    /** Read the registered palette, which excludes our composed override layer. */
    function paletteFor(scheme, snapshot) {
      const palette = Object.fromEntries(Object.entries(TOKEN_DEFAULTS).map(([token, modes]) => [token, modes[scheme]]))
      const activeId = snapshot?.active?.id
      const definition = snapshot?.themes?.find((entry) => entry.id === activeId)
        ?? PRESET_THEMES.find((entry) => entry.id === activeId)
      if (definition?.colorScheme === scheme) Object.assign(palette, definition.tokens)
      return palette
    }

    /**
     * Override pairs must preserve the selected registered palette in an
     * unedited scheme. Reading active.tokens here would feed our own previous
     * overrides back into the next layer and prevent colors from being cleared.
     */
    function buildOverrides(state, snapshot) {
      /** @type {Record<string, string>} */
      const light = {}
      /** @type {Record<string, string>} */
      const dark = {}

      for (const scheme of ['light', 'dark']) {
        const colors = state.colors[scheme]
        const target = scheme === 'light' ? light : dark

        if (colors.background !== '') {
          const base = colors.background
          target['--dsw-alias-bg-base'] = base
          target['--dsw-alias-bg-layer-1'] = `color-mix(in srgb, var(--dsw-alias-label-primary) 3%, ${base})`
          target['--dsw-alias-bg-layer-2'] = `color-mix(in srgb, var(--dsw-alias-label-primary) 5%, ${base})`
          target['--dsw-alias-bg-layer-3'] = `color-mix(in srgb, var(--dsw-alias-label-primary) 8%, ${base})`
          target['--dsw-specific-sidebar-fill'] = `color-mix(in srgb, var(--dsw-alias-label-primary) 2%, ${base})`
          target['--dsw-alias-markdown-code-block'] = `color-mix(in srgb, var(--dsw-alias-label-primary) 4%, ${base})`
        }

        if (colors.foreground !== '') {
          const fg = colors.foreground
          target['--dsw-alias-label-primary'] = fg
          target['--dsw-alias-label-secondary'] = `color-mix(in srgb, ${fg} 74%, var(--dsw-alias-bg-base))`
          target['--dsw-alias-label-tertiary'] = `color-mix(in srgb, ${fg} 60%, var(--dsw-alias-bg-base))`
          target['--dsw-alias-label-caption'] = `color-mix(in srgb, ${fg} 46%, var(--dsw-alias-bg-base))`
        }

        if (colors.accent !== '') {
          const accent = colors.accent
          target['--dsw-alias-state-business-primary'] = accent
          target['--dsw-alias-state-business-tertiary'] = `color-mix(in srgb, ${accent} 16%, var(--dsw-alias-bg-base))`
        }
      }

      // Contrast raises border and secondary-text strength in both schemes.
      const contrastAlpha = state.contrast === 'high' ? { l2: 30, l3: 40, l4: 52 } : state.contrast === 'medium' ? { l2: 20, l3: 28, l4: 38 } : null
      if (contrastAlpha !== null) {
        for (const scheme of ['light', 'dark']) {
          const target = scheme === 'light' ? light : dark
          target['--dsw-alias-border-l2'] = `color-mix(in srgb, var(--dsw-alias-label-primary) ${contrastAlpha.l2}%, transparent)`
          target['--dsw-alias-border-l3'] = `color-mix(in srgb, var(--dsw-alias-label-primary) ${contrastAlpha.l3}%, transparent)`
          target['--dsw-alias-border-l4'] = `color-mix(in srgb, var(--dsw-alias-label-primary) ${contrastAlpha.l4}%, transparent)`
        }
      }

      // Glass is presented in CSS over an application-owned backdrop.

      // Diff markers strengthen the added/deleted tints in both schemes.
      if (state.diffMarkers) {
        for (const scheme of ['light', 'dark']) {
          const target = scheme === 'light' ? light : dark
          target['--dsw-alias-code-diff-added'] = 'color-mix(in srgb, var(--dsw-alias-state-success-primary) 26%, transparent)'
          target['--dsw-alias-code-diff-deleted'] = 'color-mix(in srgb, var(--dsw-alias-state-error-primary) 26%, transparent)'
          target['--dsw-alias-file-diff-added-bg'] = 'color-mix(in srgb, var(--dsw-alias-state-success-primary) 20%, var(--dsw-alias-bg-base))'
          target['--dsw-alias-file-diff-deleted-bg'] = 'color-mix(in srgb, var(--dsw-alias-state-error-primary) 20%, var(--dsw-alias-bg-base))'
        }
      }

      // Uncustomized tokens stay absent. A required value for the other scheme
      // comes from the underlying registered theme, never the composed snapshot.
      const defaults = { light: paletteFor('light', snapshot), dark: paletteFor('dark', snapshot) }
      const layer = {}
      for (const token of new Set([...Object.keys(light), ...Object.keys(dark)])) {
        layer[token] = {
          light: light[token] ?? defaults.light[token],
          dark: dark[token] ?? defaults.dark[token],
        }
      }
      return layer
    }

    // -----------------------------------------------------------------------
    // Studio store — owns the override layer, the document attributes, and the
    // theme subscription, so appearance survives navigating away from the page.
    // -----------------------------------------------------------------------

    /**
     * Create the studio store bound to one plugin context.
     * @param {object} ctx the client plugin context.
     * @param {object} theme the `ctx.theme` service.
     * @returns {object} the store handle used by the page components.
     */
    function createStudio(ctx, theme) {
      let state = loadState()
      let disposeOverrides = null
      let appliedLayer = null
      let applying = false
      let disposed = false
      const listeners = new Set()
      const themeListeners = new Set()

      const readTheme = () => {
        try {
          return theme.getTheme()
        } catch {
          return { preference: 'system', active: { colorScheme: 'light', tokens: {} }, fontSizes: { text: 14, code: 11, terminal: 13 }, fontFamilies: { text: '', code: '', terminal: '' }, themes: [] }
        }
      }

      let themeSnapshot = readTheme()

      const notify = () => {
        for (const listener of listeners) {
          try {
            listener()
          } catch {
            // A broken subscriber must not stop the others.
          }
        }
      }

      const notifyTheme = () => {
        for (const listener of themeListeners) {
          try {
            listener()
          } catch {
            // Same isolation as above.
          }
        }
      }

      const applyLayer = () => {
        if (disposed || applying) return
        const layer = buildOverrides(state, themeSnapshot)
        const signature = JSON.stringify(layer)
        if (signature !== appliedLayer) {
          applying = true
          try {
            // Replacing one source is atomic. Disposing first briefly exposes
            // the old palette and emits an unnecessary second change event.
            const previous = disposeOverrides
            disposeOverrides = theme.overrideTokens(OVERRIDE_SOURCE, layer)
            appliedLayer = signature
            previous?.()
          } catch {
            // Preserve the last working layer if the service rejects a change.
          } finally {
            applying = false
            themeSnapshot = readTheme()
          }
        }
        const root = document.documentElement
        const toggle = (name, enabled) => {
          if (enabled) root.setAttribute(name, 'true')
          else root.removeAttribute(name)
        }
        toggle('data-as-reduced-motion', state.reducedMotion)
        toggle('data-as-translucent-sidebar', state.translucentSidebar)
        toggle('data-as-contrast', state.contrast !== 'default')
      }

      const commit = (next) => {
        if (disposed) return
        state = normalizeState(next)
        saveState(state)
        applyLayer()
        notify()
        notifyTheme()
      }

      const disposeThemeListener = ctx.on('theme/change', (snapshot) => {
        if (disposed) return
        themeSnapshot = snapshot ?? readTheme()
        // Theme registration, selection and OS scheme changes can change the
        // fallback of a one-scheme override. Self-generated events stop here.
        if (applying) return
        applyLayer()
        notifyTheme()
      })

      applyLayer()

      return {
        get: () => state,
        getTheme: () => themeSnapshot,
        set(patch) {
          commit({ ...state, ...patch })
        },
        setColor(scheme, key, value) {
          commit({
            ...state,
            colors: {
              ...state.colors,
              [scheme]: { ...state.colors[scheme], [key]: value },
            },
          })
        },
        reset() {
          if (disposed) return
          commit(defaultState())
          for (const role of Object.keys(SIZE_SPECS)) {
            try {
              theme.setFontSize(role, SIZE_SPECS[role].default)
              theme.setFontFamily(role, '')
            } catch {
              // Continue resetting the other roles if one writer is unavailable.
            }
          }
          try {
            theme.setTheme('system')
          } catch {
            // An unknown preference is already the default.
          }
        },
        subscribe(listener) {
          listeners.add(listener)
          return () => listeners.delete(listener)
        },
        subscribeTheme(listener) {
          themeListeners.add(listener)
          return () => themeListeners.delete(listener)
        },
        dispose() {
          if (disposed) return
          disposed = true
          try {
            disposeThemeListener()
          } catch {
            // Finish removing our effects even if the context was disposed first.
          }
          listeners.clear()
          themeListeners.clear()
          if (disposeOverrides !== null) {
            try {
              disposeOverrides()
            } catch {
              // Nothing to release.
            }
            disposeOverrides = null
          }
          const root = document.documentElement
          root.removeAttribute('data-as-reduced-motion')
          root.removeAttribute('data-as-pointer-cursor'); root.removeAttribute('data-as-translucent-sidebar')
          root.removeAttribute('data-as-contrast')
        },
      }
    }

    /** The store created by `apply`; set before any slot renders. */
    let studio = null

    /** Subscribe a component to the studio state. */
    function useStudioState() {
      const current = studio
      const [snapshot, setSnapshot] = useState(() => current?.get() ?? defaultState())
      useEffect(() => {
        if (current === null) return undefined
        const sync = () => setSnapshot(current.get())
        const unsubscribe = current.subscribe(sync)
        sync()
        return unsubscribe
      }, [current])
      return snapshot
    }

    /** Subscribe a component to the theme service snapshot. */
    function useThemeState() {
      const current = studio
      const [snapshot, setSnapshot] = useState(() => current?.getTheme() ?? null)
      useEffect(() => {
        if (current === null) return undefined
        const sync = () => setSnapshot(current.getTheme())
        const unsubscribe = current.subscribeTheme(sync)
        sync()
        return unsubscribe
      }, [current])
      return snapshot
    }

    // -----------------------------------------------------------------------
    // Icons
    // -----------------------------------------------------------------------

    function Icon({ size = 20, active }) {
      return h('svg', {
        width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: active ? 1.9 : 1.7,
        strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true,
      },
        h('path', { d: 'M12 3.5a8.5 8.5 0 1 0 0 17c1.2 0 1.8-.7 1.8-1.6 0-.9-.6-1.4-.6-2.2 0-.9.7-1.6 1.7-1.6h1.4a4.7 4.7 0 0 0 4.7-4.7c0-3.8-4-6.9-9-6.9Z' }),
        h('circle', { cx: 8.4, cy: 9.6, r: 1.1, fill: 'currentColor', stroke: 'none' }),
        h('circle', { cx: 12, cy: 7.4, r: 1.1, fill: 'currentColor', stroke: 'none' }),
        h('circle', { cx: 15.6, cy: 9.6, r: 1.1, fill: 'currentColor', stroke: 'none' }),
      )
    }

    function ChevronUp({ size = 9 }) {
      return h('svg', { width: size, height: size, viewBox: '0 0 12 12', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true },
        h('path', { d: 'm2.5 7.5 3.5-3.5 3.5 3.5' }))
    }

    function ChevronDown({ size = 9 }) {
      return h('svg', { width: size, height: size, viewBox: '0 0 12 12', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true },
        h('path', { d: 'm2.5 4.5 3.5 3.5 3.5-3.5' }))
    }

    function CloseIcon({ size = 11 }) {
      return h('svg', { width: size, height: size, viewBox: '0 0 12 12', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', 'aria-hidden': true },
        h('path', { d: 'm3 3 6 6M9 3 3 9' }))
    }

    // -----------------------------------------------------------------------
    // Styles
    // -----------------------------------------------------------------------

    const CSS = `
      .as-page, .as-section, .as-page *, .as-section *,
      .as-page *::before, .as-page *::after, .as-section *::before, .as-section *::after {
        box-sizing: border-box;
      }
      .as-page { height: 100%; width: 100%; min-width: 0; color: var(--dsw-alias-label-primary);
        display: flex; flex-direction: column; align-items: center; gap: 32px;
        container: as-studio / inline-size;
        padding: 0 clamp(24px, 4vw, 48px) 48px; overflow: auto; }
      .as-page > * { width: 100%; max-width: 960px; min-width: 0; flex-shrink: 0; }
      .as-page .as-head { padding-top: 28px; }
      @media (min-width: 800px) {
        [data-platform='darwin'] .as-page .as-head { padding-top: calc(28px + var(--dsh-frame-top-clearance, 0px)); }
      }
      .as-section { display: flex; flex-direction: column; gap: 20px; width: 100%; min-width: 0;
        container: as-studio / inline-size; color: var(--dsw-alias-label-primary); }
      .as-section > * { width: 100%; min-width: 0; flex-shrink: 0; }
      .as-head, .as-card, .as-foot { overflow-wrap: anywhere; }

      .as-head { display: flex; justify-content: space-between; align-items: flex-start;
        flex-wrap: wrap; gap: 16px; }
      .as-title { margin: 0; font-size: 20px; font-weight: 500; line-height: 28px; }
      .as-intro { margin: 4px 0 0; color: var(--dsw-alias-label-secondary);
        font-size: 13px; line-height: 20px; }

      .as-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-height: 32px;
        padding: 0 12px; border-radius: var(--dsw-radius-sm);
        border: 1px solid var(--dsw-alias-border-l3);
        background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary);
        font-size: 13px; line-height: 20px; font-family: inherit; cursor: pointer; }
      .as-btn:hover { background: var(--dsw-alias-interactive-bg-hover); }
      .as-btn:active { background: var(--dsw-alias-interactive-bg-active); }
      .as-btn:focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary); outline-offset: 2px; }
      .as-btnGhost { background: transparent; border-color: transparent;
        color: var(--dsw-alias-label-tertiary); }
      .as-btnGhost:hover { background: var(--dsw-alias-interactive-bg-hover);
        color: var(--dsw-alias-label-primary); }

      .as-card { background: var(--dsw-alias-bg-layer-2);
        border: 1px solid var(--dsw-alias-border-l3);
        border-radius: var(--dsw-radius-lg); padding: 4px 24px; }
      .as-cardHead { padding: 18px 0 4px; }
      .as-cardTitle { margin: 0; font-size: 15px; font-weight: 500; line-height: 22px; }
      .as-cardHint { margin: 2px 0 0; font-size: 12px; line-height: 18px;
        color: var(--dsw-alias-label-tertiary); }

      .as-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;
        gap: 16px 24px; padding: 16px 0;
        border-bottom: .5px solid var(--dsw-alias-border-l2); }
      .as-row:last-child { border-bottom: 0; }
      .as-rowText { display: flex; flex-direction: column; gap: 4px; min-width: 0;
        flex: 1 1 160px; }
      .as-rowTitle { font-size: 14px; font-weight: 400; line-height: 22px;
        color: var(--dsw-alias-label-primary); }
      .as-rowDesc { font-size: 12px; font-weight: 400; line-height: 18px;
        color: var(--dsw-alias-label-tertiary); }
      .as-rowControl { display: inline-flex; align-items: center; gap: 8px;
        flex: 0 1 auto; min-width: 0; max-width: 100%; }
      .as-rowControl > .as-btn { flex: none; }

      /* segmented control */
      .as-seg { display: inline-flex; flex-wrap: wrap; max-width: 100%; min-width: 0; padding: 2px; gap: 2px;
        background: var(--dsw-alias-bg-module-platform);
        border-radius: var(--dsw-radius-sm); }
      .as-segBtn { height: 28px; padding: 0 14px; border: none; background: transparent;
        border-radius: 6px; font-family: inherit; font-size: 13px; line-height: 20px;
        color: var(--dsw-alias-label-secondary); cursor: pointer; white-space: nowrap; }
      .as-segBtn:hover { color: var(--dsw-alias-label-primary); }
      .as-segBtn[aria-pressed='true'] { background: var(--dsw-alias-bg-layer-2);
        color: var(--dsw-alias-label-primary); font-weight: 500;
        box-shadow: 0 1px 2px rgba(0,0,0,.08); }
      .as-segBtn:focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary);
        outline-offset: -1px; }

      /* switch */
      .as-switch { position: relative; width: 40px; height: 24px; flex: none;
        border-radius: 999px; border: none; padding: 0; cursor: pointer;
        background: var(--dsw-alias-border-l4); transition: background 160ms ease; }
      .as-switch[aria-checked='true'] { background: var(--dsw-alias-state-business-primary); }
      .as-switch::after { content: ''; position: absolute; top: 3px; left: 3px;
        width: 18px; height: 18px; border-radius: 50%; background: #fff;
        box-shadow: 0 1px 2px rgba(0,0,0,.25); transition: transform 160ms ease; }
      .as-switch[aria-checked='true']::after { transform: translateX(16px); }
      .as-switch:focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary);
        outline-offset: 2px; }

      /* stepper */
      .as-stepper { display: inline-flex; align-items: center; gap: 2px;
        background: var(--dsw-alias-bg-module-platform);
        border-radius: var(--dsw-radius-md); height: 36px; padding: 0 4px; }
      .as-stepBtn { width: 26px; height: 28px; border: none; background: transparent;
        border-radius: 6px; color: var(--dsw-alias-label-primary); cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center; padding: 0; }
      .as-stepBtn:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }
      .as-stepBtn:disabled { color: var(--dsw-alias-label-caption); cursor: default; }
      .as-stepBtn:focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary);
        outline-offset: -1px; }
      .as-stepValue { min-width: 34px; text-align: center; font-size: 14px;
        line-height: 22px; font-variant-numeric: tabular-nums;
        color: var(--dsw-alias-label-primary); }
      .as-stepUnit { font-size: 12px; color: var(--dsw-alias-label-secondary);
        padding-right: 6px; }

      /* text field */
      .as-field { height: 32px; width: 220px; min-width: 0; max-width: 100%; flex: 1 1 160px; padding: 0 10px;
        border-radius: var(--dsw-radius-sm); border: 1px solid var(--dsw-alias-border-l3);
        background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary);
        font-family: inherit; font-size: 13px; line-height: 20px; }
      .as-field::placeholder { color: var(--dsw-alias-label-caption); }
      .as-field:focus { outline: 2px solid var(--dsw-alias-state-business-primary);
        outline-offset: -1px; border-color: transparent; }

      /* theme cards */
      .as-themes { display: grid; gap: 12px; padding: 12px 0 20px;
        grid-template-columns: repeat(auto-fit, minmax(min(150px, 100%), 1fr)); }
      .as-themeCard { display: flex; flex-direction: column; min-width: 0; gap: 8px; padding: 10px;
        border-radius: var(--dsw-radius-md); cursor: pointer; text-align: left;
        border: 1.5px solid var(--dsw-alias-border-l3);
        background: var(--dsw-alias-bg-layer-2); font-family: inherit; }
      .as-themeCard:hover { border-color: var(--dsw-alias-border-l4); }
      .as-themeCard[aria-pressed='true'] { border-color: var(--dsw-alias-state-business-primary);
        box-shadow: 0 0 0 1px var(--dsw-alias-state-business-primary); }
      .as-themeCard:focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary);
        outline-offset: 2px; }
      .as-themeSwatch { height: 44px; border-radius: var(--dsw-radius-sm);
        border: 1px solid var(--dsw-alias-border-l2); display: flex;
        align-items: center; justify-content: center; gap: 5px; }
      .as-themeDot { width: 12px; height: 12px; border-radius: 50%; }
      .as-themeLabel { font-size: 12px; line-height: 18px;
        color: var(--dsw-alias-label-primary); }

      /* color rows */
      .as-colorRow { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;
        gap: 16px 24px; padding: 16px 0;
        border-bottom: .5px solid var(--dsw-alias-border-l2); }
      .as-colorRow:last-child { border-bottom: 0; }
      .as-colorControl { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 8px;
        flex: 0 1 auto; min-width: 0; max-width: 100%; }
      .as-swatches { display: inline-flex; flex-wrap: wrap; min-width: 0; max-width: 100%; gap: 5px; }
      .as-colorWell, .as-colorValue, .as-clearBtn, .as-swatch { flex: none; }
      .as-swatch { width: 20px; height: 20px; border-radius: 50%; padding: 0;
        border: 1px solid var(--dsw-alias-border-l3); cursor: pointer; }
      .as-swatch:hover { transform: scale(1.1); }
      .as-swatch:focus-visible { outline: 2px solid var(--dsw-alias-label-primary);
        outline-offset: 1px; }
      .as-colorWell { position: relative; width: 34px; height: 28px; padding: 0;
        border-radius: var(--dsw-radius-sm); overflow: hidden; cursor: pointer;
        border: 1px solid var(--dsw-alias-border-l3);
        background: var(--dsw-alias-bg-module-platform); }
      .as-colorWell input { position: absolute; inset: 0; width: 100%; height: 100%;
        border: none; padding: 0; cursor: pointer; background: transparent; }
      .as-colorWell:focus-within, .as-clearBtn:focus-visible {
        outline: 2px solid var(--dsw-alias-state-business-primary); outline-offset: 2px;
      }
      .as-swatch[aria-pressed='true'] { outline: 2px solid var(--dsw-alias-state-business-primary); outline-offset: 2px; }
      .as-colorValue { font-size: 11px; line-height: 16px; min-width: 62px;
        color: var(--dsw-alias-label-tertiary); font-variant-numeric: tabular-nums; }
      .as-clearBtn { width: 24px; height: 24px; border: none; border-radius: 6px;
        background: transparent; color: var(--dsw-alias-label-tertiary); cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center; padding: 0; }
      .as-clearBtn:hover { background: var(--dsw-alias-interactive-bg-hover);
        color: var(--dsw-alias-label-primary); }
      .as-clearBtn:disabled { opacity: .35; cursor: default; }

      /* preview */
      .as-preview { margin: 4px 0 20px; padding: 16px 18px;
        border-radius: var(--dsw-radius-md);
        border: 1px solid var(--dsw-alias-border-l3);
        background: var(--dsw-alias-bg-base);
        display: flex; flex-direction: column; gap: 12px; }
      .as-previewHead { display: flex; align-items: center; justify-content: space-between;
        gap: 12px; flex-wrap: wrap; }
      .as-previewLabel { font-size: 11px; line-height: 16px; letter-spacing: .04em;
        text-transform: uppercase; color: var(--dsw-alias-label-caption); }
      .as-previewBody { margin: 0; font-size: 14px; line-height: 22px;
        color: var(--dsw-alias-label-primary); }
      .as-previewSecondary { margin: 0; font-size: 12px; line-height: 18px;
        color: var(--dsw-alias-label-tertiary); }
      .as-previewRow { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
      .as-previewBtn { min-height: 28px; padding: 5px 12px; border: none; border-radius: 6px;
        display: inline-flex; align-items: center; justify-content: center;
        background: var(--dsw-alias-state-business-primary);
        color: var(--dsw-alias-bg-base); font-family: inherit; font-size: 12px;
        line-height: 18px; font-weight: 500; }
      .as-previewChip { min-height: 28px; padding: 4px 10px; border-radius: 6px;
        display: inline-flex; align-items: center; justify-content: center; font-size: 12px; line-height: 18px;
        border: 1px solid var(--dsw-alias-border-l3);
        color: var(--dsw-alias-label-secondary); }
      .as-previewCode { font-size: 12px; line-height: 18px; padding: 6px 10px;
        border-radius: 6px; background: var(--dsw-alias-markdown-code-block);
        color: var(--dsw-alias-label-primary); }

      .as-foot { display: flex; align-items: center; justify-content: space-between;
        gap: 16px; flex-wrap: wrap; padding: 4px 0 8px; }
      .as-footHint { font-size: 12px; line-height: 18px;
        color: var(--dsw-alias-label-tertiary); }
      .as-toast { font-size: 12px; line-height: 18px;
        color: var(--dsw-alias-state-success-primary); }


      .as-fontToolbar{display:flex;gap:12px;justify-content:space-between;align-items:center;margin:8px 0 2px;flex-wrap:wrap}.as-fontStatus{margin:0}
      .as-fontControl{display:grid;grid-template-columns:minmax(0,232px) 88px;gap:12px;max-width:100%;width:332px}.as-fontPicker{min-width:0;width:100%}
      .as-fontTrigger.as-field{box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;min-width:0;max-width:100%;height:36px;padding:0 12px;text-align:left;font-size:13px;line-height:20px;cursor:pointer;border-radius:9px}
      .as-fontTrigger:hover,.as-fontTrigger[aria-expanded=true]{border-color:var(--dsw-alias-state-business-primary)}.as-fontTrigger:disabled{opacity:.55;cursor:default}.as-fontSelected{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;flex:1}.as-fontChevron{flex:none;opacity:.7;transition:transform 160ms ease}.as-fontTrigger[aria-expanded=true] .as-fontChevron{transform:rotate(180deg)}
      .as-page{scrollbar-gutter:stable both-edges}.as-card{padding-inline:24px}.as-rowControl:has(.as-fontPicker){align-self:auto}
      @container as-studio (max-width: 640px) {
        .as-row, .as-colorRow { flex-direction: column; align-items: stretch; gap: 10px; }
        .as-rowText { flex-basis: auto; }
        .as-rowControl, .as-colorControl { align-self: flex-start; }
        .as-rowControl:has(.as-field) { width: 100%; }
        .as-field { width: 100%; }
        .as-card { padding-inline: 16px; }
      }
      @media (max-width: 400px) {
        .as-page { padding-inline: 16px; }
      }
    `

    /** The global stylesheet plus the attribute-driven effects. */
    const GLOBAL_CSS = `
      html[data-as-translucent-sidebar=true] .mP3x-q_frame{
        background:radial-gradient(ellipse at 2% 15%,color-mix(in srgb,var(--dsw-alias-label-primary) 3%,transparent),transparent 42%),var(--dsw-specific-sidebar-fill);
      }
      html[data-as-translucent-sidebar=true] .mP3x-q_sidebarCol{
        background:color-mix(in srgb,var(--dsw-specific-sidebar-fill) 66%,transparent);
        backdrop-filter:blur(24px) saturate(1.22);
        -webkit-backdrop-filter:blur(24px) saturate(1.22);
        box-shadow:inset -1px 0 color-mix(in srgb,var(--dsw-alias-label-primary) 6%,transparent);
      }
      html[data-as-translucent-sidebar=true] .dsh-function-rail{background:color-mix(in srgb,var(--dsw-alias-bg-base) 14%,transparent)}
      html[data-as-translucent-sidebar=true][data-windows-titlebar] .mP3x-q_frame:before{background:color-mix(in srgb,var(--dsw-specific-sidebar-fill) 75%,transparent)}
      /* The shell confirms native support before any opaque root is removed. */
      html[data-as-native-glass=true][data-as-translucent-sidebar=true],
      html[data-as-native-glass=true][data-as-translucent-sidebar=true] body,
      html[data-as-native-glass=true][data-as-translucent-sidebar=true] .mP3x-q_frame{background:transparent!important}
      html[data-as-native-glass=true][data-as-translucent-sidebar=true] .mP3x-q_sidebarCol{
        background:color-mix(in srgb,var(--dsw-specific-sidebar-fill) 60%,transparent);
        backdrop-filter:none;-webkit-backdrop-filter:none;
      }
      html[data-as-native-glass=true][data-as-translucent-sidebar=true] body[data-ds-dark-theme] .mP3x-q_sidebarCol{
        background:color-mix(in srgb,var(--dsw-specific-sidebar-fill) 42%,transparent);
      }
      html[data-as-native-glass=true][data-as-translucent-sidebar=true][data-windows-titlebar] .mP3x-q_frame:before{background:color-mix(in srgb,var(--dsw-specific-sidebar-fill) 60%,transparent)}
      html[data-as-native-glass=true][data-as-translucent-sidebar=true][data-windows-titlebar] body[data-ds-dark-theme] .mP3x-q_frame:before{background:color-mix(in srgb,var(--dsw-specific-sidebar-fill) 42%,transparent)}
      @media(prefers-reduced-transparency:reduce){html[data-as-translucent-sidebar=true] .mP3x-q_sidebarCol{background:var(--dsw-specific-sidebar-fill);backdrop-filter:none;-webkit-backdrop-filter:none}}

      html[data-as-reduced-motion='true'] *,
      html[data-as-reduced-motion='true'] *::before,
      html[data-as-reduced-motion='true'] *::after {
        transition-duration: 0s !important;
        animation-duration: 0s !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
      }
      html[data-as-contrast='true'] :focus-visible {
        outline-width: 2.5px !important;
      }
      html[data-as-contrast='true'] ::selection {
        background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 42%, transparent) !important;
      }
    `

    // -----------------------------------------------------------------------
    // Small helpers
    // -----------------------------------------------------------------------

    /** Substitute {name} placeholders in a localized template. */
    function fill(template, values) {
      return String(template).replace(/\{(\w+)\}/g, (match, key) => (
        values[key] === undefined || values[key] === null ? match : String(values[key])
      ))
    }

    // -----------------------------------------------------------------------
    // Controls
    // -----------------------------------------------------------------------

    function Row({ title, description, children }) {
      return h('div', { className: 'as-row' },
        h('div', { className: 'as-rowText' },
          h('div', { className: 'as-rowTitle' }, title),
          description ? h('div', { className: 'as-rowDesc' }, description) : null,
        ),
        h('div', { className: 'as-rowControl' }, children),
      )
    }

    function Segmented({ value, options, onChange, label }) {
      return h('div', { className: 'as-seg', role: 'group', 'aria-label': label },
        options.map((option) => h('button', {
          key: option.id,
          type: 'button',
          className: 'as-segBtn',
          'aria-pressed': value === option.id ? 'true' : 'false',
          onClick: () => onChange(option.id),
        }, option.label)),
      )
    }

    function Switch({ checked, onChange, label }) {
      return h('button', {
        type: 'button',
        className: 'as-switch',
        role: 'switch',
        'aria-checked': checked ? 'true' : 'false',
        'aria-label': label,
        onClick: () => onChange(!checked),
      })
    }

    function Stepper({ value, min, max, unit, onChange, labelIncrease, labelDecrease, label }) {
      return h('div', { className: 'as-stepper', role: 'group', 'aria-label': label },
        h('button', {
          type: 'button', className: 'as-stepBtn',
          'aria-label': labelDecrease, disabled: value <= min,
          onClick: () => onChange(Math.max(min, value - 1)),
        }, h(ChevronDown)),
        h('span', { className: 'as-stepValue', 'aria-live': 'polite' }, String(value)),
        h('button', {
          type: 'button', className: 'as-stepBtn',
          'aria-label': labelIncrease, disabled: value >= max,
          onClick: () => onChange(Math.min(max, value + 1)),
        }, h(ChevronUp)),
        h('span', { className: 'as-stepUnit' }, unit),
      )
    }

    // -----------------------------------------------------------------------
    // Sections
    // -----------------------------------------------------------------------

    function ModeSection({ t, themeSnapshot }) {
      const preference = themeSnapshot?.preference ?? 'system'
      const scheme = themeSnapshot?.active?.colorScheme === 'dark' ? t('modeDark') : t('modeLight')
      const options = [
        { id: 'light', label: t('modeLight') },
        { id: 'dark', label: t('modeDark') },
        { id: 'system', label: t('modeSystem') },
      ]
      return h('section', { className: 'as-card' },
        h('div', { className: 'as-cardHead' },
          h('h2', { className: 'as-cardTitle' }, t('sectionMode')),
          h('p', { className: 'as-cardHint' }, t('sectionModeHint')),
        ),
        h(Row, { title: t('sectionMode'), description: fill(t('modeActive'), { scheme }) },
          h(Segmented, {
            value: preference,
            options,
            label: t('sectionMode'),
            onChange: (id) => {
              try {
                themeSet(id)
              } catch {
                // An unregistered id cannot be selected.
              }
            },
          }),
        ),
      )
    }

    /** The theme service handle, resolved lazily from the store's context. */
    let themeSet = () => {}

    function ThemeSection({ t, themeSnapshot }) {
      const preference = themeSnapshot?.preference ?? 'system'
      const cards = [
        { id: 'light', label: t('themeLight'), scheme: 'light', tokens: null },
        { id: 'dark', label: t('themeDark'), scheme: 'dark', tokens: null },
        ...PRESET_THEMES.map((preset) => ({
          id: preset.id,
          label: t(preset.labelKey),
          scheme: preset.colorScheme,
          tokens: preset.tokens,
        })),
      ]
      return h('section', { className: 'as-card' },
        h('div', { className: 'as-cardHead' },
          h('h2', { className: 'as-cardTitle' }, t('sectionTheme')),
          h('p', { className: 'as-cardHint' }, t('sectionThemeHint')),
        ),
        h('div', { className: 'as-themes' },
          cards.map((card) => {
            const base = card.tokens?.['--dsw-alias-bg-base'] ?? (card.scheme === 'dark' ? '#151517' : '#ffffff')
            const accent = card.tokens?.['--dsw-alias-state-business-primary'] ?? (card.scheme === 'dark' ? '#7aaaff' : '#4176e6')
            const text = card.tokens?.['--dsw-alias-label-primary'] ?? (card.scheme === 'dark' ? '#fafafa' : '#0f1115')
            return h('button', {
              key: card.id,
              type: 'button',
              className: 'as-themeCard',
              'aria-pressed': preference === card.id ? 'true' : 'false',
              onClick: () => {
                try {
                  themeSet(card.id)
                } catch {
                  // Ignore an id the registry no longer knows.
                }
              },
            },
              h('span', { className: 'as-themeSwatch', style: { background: base } },
                h('span', { className: 'as-themeDot', style: { background: accent } }),
                h('span', { className: 'as-themeDot', style: { background: text } }),
              ),
              h('span', { className: 'as-themeLabel' }, card.label),
            )
          }),
        ),
      )
    }

    function ColorRow({ t, label, description, scheme, field, state, themeSnapshot }) {
      const value = state.colors[scheme][field]
      const token = field === 'accent' ? '--dsw-alias-state-business-primary'
        : field === 'background' ? '--dsw-alias-bg-base' : '--dsw-alias-label-primary'
      const fallback = paletteFor(scheme, themeSnapshot)[token]
      // Native color inputs accept six-digit hex only, even when a third-party
      // registered palette uses rgb(), color-mix() or another valid CSS color.
      const wellValue = value || (/^#[0-9a-f]{6}$/i.test(fallback) ? fallback : TOKEN_DEFAULTS[token][scheme])
      return h('div', { className: 'as-colorRow' },
        h('div', { className: 'as-rowText' },
          h('div', { className: 'as-rowTitle' }, label),
          h('div', { className: 'as-rowDesc' }, description),
        ),
        h('div', { className: 'as-colorControl' },
          field === 'accent'
            ? h('div', { className: 'as-swatches' },
              ACCENT_SWATCHES.map((swatch) => h('button', {
                key: swatch,
                type: 'button',
                className: 'as-swatch',
                style: { background: swatch },
                'aria-label': `${label} ${swatch}`,
                'aria-pressed': value === swatch ? 'true' : 'false',
                onClick: () => studio?.setColor(scheme, field, swatch),
              })),
            )
            : null,
          h('span', { className: 'as-colorWell', title: t('pickColor') },
            h('input', {
              type: 'color',
              value: wellValue,
              'aria-label': `${label} ${t('pickColor')}`,
              onChange: (event) => studio?.setColor(scheme, field, event.target.value),
            }),
          ),
          h('span', { className: 'as-colorValue' }, value === '' ? '—' : value),
          h('button', {
            type: 'button',
            className: 'as-clearBtn',
            'aria-label': t('clearColor'),
            title: t('clearColor'),
            disabled: value === '',
            onClick: () => studio?.setColor(scheme, field, ''),
          }, h(CloseIcon)),
        ),
      )
    }

    function ColorsSection({ t, state, themeSnapshot }) {
      const scheme = state.editScheme
      const schemeLabel = scheme === 'dark' ? t('editDark') : t('editLight')
      const previewPalette = paletteFor(scheme, themeSnapshot)
      for (const [token, modes] of Object.entries(buildOverrides(state, themeSnapshot))) previewPalette[token] = modes[scheme]
      return h('section', { className: 'as-card' },
        h('div', { className: 'as-cardHead' },
          h('h2', { className: 'as-cardTitle' }, t('sectionColors')),
          h('p', { className: 'as-cardHint' }, t('sectionColorsHint')),
        ),
        h(Row, { title: schemeLabel, description: t('sectionColorsHint') },
          h(Segmented, {
            value: scheme,
            label: t('sectionColors'),
            options: [
              { id: 'light', label: t('modeLight') },
              { id: 'dark', label: t('modeDark') },
            ],
            onChange: (id) => studio?.set({ editScheme: id }),
          }),
        ),
        h('div', { className: 'as-preview', 'data-scheme': scheme, style: { ...previewPalette, colorScheme: scheme } },
          h('div', { className: 'as-previewHead' },
            h('span', { className: 'as-previewLabel' }, t('previewTitle')),
            h('span', { className: 'as-previewLabel' }, schemeLabel),
          ),
          h('p', { className: 'as-previewBody' }, t('previewBody')),
          h('div', { className: 'as-previewRow' },
            h('span', { className: 'as-previewBtn' }, t('previewAccent')),
            h('span', { className: 'as-previewChip' }, t('previewBorder')),
            h('code', { className: 'as-previewCode' }, 'const answer = 42'),
          ),
        ),
        h(ColorRow, { t, label: t('accent'), description: t('accentHint'), scheme, field: 'accent', state, themeSnapshot }),
        h(ColorRow, { t, label: t('background'), description: t('backgroundHint'), scheme, field: 'background', state, themeSnapshot }),
        h(ColorRow, { t, label: t('foreground'), description: t('foregroundHint'), scheme, field: 'foreground', state, themeSnapshot }),
      )
    }

    function fontSelection(current,fonts) {
      const plain=current.trim().replace(/^['"]|['"]$/g,'');
      return fonts.find(name=>name.toLocaleLowerCase()===plain.toLocaleLowerCase())??null;
    }

    function useInstalledFonts() {
      const [state,setState]=useState({status:'loading',fonts:[]});
      const active=useRef(null);
      const deadline=useRef(null);
      const mounted=useRef(false);
      const load=async(force=false)=>{
        active.current?.abort();
        clearTimeout(deadline.current);
        const request=new AbortController();
        active.current=request;
        setState(previous=>({...previous,status:'loading'}));
        const timer=setTimeout(()=>request.abort(),15000);
        deadline.current=timer;
        try{
          const response=await fetch('/api/dsh-appearance-studio/fonts'+(force?'/refresh':''),{method:force?'POST':'GET',credentials:'same-origin',signal:request.signal});
          if(!response.ok)throw new Error('Local font catalog unavailable');
          const body=await response.json();
          if(!body.ok||!Array.isArray(body.fonts)||!body.fonts.every(name=>typeof name==='string')||body.fonts.length===0)throw new Error('Invalid font catalog');
          if(mounted.current&&active.current===request&&!request.signal.aborted)setState({status:'ready',fonts:body.fonts});
        }catch{
          if(mounted.current&&active.current===request)setState(previous=>({...previous,status:'failed'}));
        }finally{clearTimeout(timer);if(deadline.current===timer)deadline.current=null;if(active.current===request)active.current=null;}
      };
      useEffect(()=>{mounted.current=true;void load();return()=>{mounted.current=false;active.current?.abort();active.current=null;clearTimeout(deadline.current);deadline.current=null;};},[]);
      return [state,()=>load(true)];
    }

    function FontPicker({t,label,role,current,fonts}) {
      const selected=fontSelection(current,fonts);
      const [open,setOpen]=useState(false);
      const [query,setQuery]=useState('');
      const [active,setActive]=useState(0);
      const [position,setPosition]=useState(null);
      const trigger=useRef(null),popup=useRef(null),search=useRef(null);
      const listId='as-font-list-'+role;
      const matched=fonts.filter(name=>name.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
      const items=[{value:'',label:t('fontPlaceholder')},...matched.map(name=>({value:name,label:name}))];
      const close=(restore=false)=>{setOpen(false);if(restore)trigger.current?.focus();};
      const choose=value=>{themeSetFontFamily(role,value);close(true);};
      useEffect(()=>{
        if(!open)return;
        const menu=popup.current;
        menu.showPopover();
        const measure=()=>{
          const rect=trigger.current.getBoundingClientRect();
          const width=Math.min(320,innerWidth-24);
          const below=innerHeight-rect.bottom-12,above=rect.top-12;
          const preferred=360;
          const upward=below<Math.min(preferred,220)&&above>below;
          const height=Math.min(preferred,Math.max(120,upward?above:below));
          const next={left:Math.max(12,Math.min(rect.left,innerWidth-width-12)),top:Math.max(12,upward?rect.top-height-6:rect.bottom+6),width,height};
          setPosition(previous=>JSON.stringify(previous)===JSON.stringify(next)?previous:next);
        };
        measure();
        const outside=event=>{if(!menu.contains(event.target)&&!trigger.current?.contains(event.target))close();};
        const scroll=event=>{if(!menu.contains(event.target))measure();};
        document.addEventListener('pointerdown',outside,true);
        window.addEventListener('resize',measure);
        document.addEventListener('scroll',scroll,true);
        const observer=new ResizeObserver(measure);observer.observe(trigger.current);
        return()=>{observer.disconnect();document.removeEventListener('pointerdown',outside,true);window.removeEventListener('resize',measure);document.removeEventListener('scroll',scroll,true);if(menu.matches(':popover-open'))menu.hidePopover();};
      },[open]);
      useEffect(()=>{if(open&&position)search.current?.focus({preventScroll:true});},[open,position]);
      useEffect(()=>{if(open&&position)popup.current?.querySelector('[data-active=true]')?.scrollIntoView({block:'nearest'});},[open,active,position]);
      const keys=event=>{
        if(event.nativeEvent?.isComposing)return;
        if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close(true);}
        else if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();setActive(value=>(value+(event.key==='ArrowDown'?1:-1)+items.length)%items.length);}
        else if(event.key==='Enter'){event.preventDefault();choose(items[Math.min(active,items.length-1)].value);}
        else if(event.key==='Tab')close();
      };
      return h('div',{className:'as-fontPicker'},
        h('button',{ref:trigger,type:'button',className:'as-field as-fontTrigger','aria-label':label,'aria-haspopup':'dialog','aria-expanded':open,'data-font-role':role,disabled:fonts.length===0,onClick:()=>{setQuery('');setActive(Math.max(0,items.findIndex(item=>item.value===selected)));setOpen(value=>!value);},onKeyDown:event=>{if(event.key==='ArrowDown'){event.preventDefault();setQuery('');setActive(0);setOpen(true);}}},
          h('span',{className:'as-fontSelected'},selected??(current||t('fontPlaceholder'))),
          h('svg',{className:'as-fontChevron',width:16,height:16,viewBox:'0 0 16 16','aria-hidden':true},h('path',{d:'m4 6 4 4 4-4',fill:'none',stroke:'currentColor',strokeWidth:1.4,strokeLinecap:'round',strokeLinejoin:'round'}))),
        open&&h('div',{ref:popup,popover:'manual',className:'as-font-popup',role:'dialog','aria-label':label,style:{...position,visibility:position?'visible':'hidden'},onKeyDown:keys},
          h('style',null,FONT_POPUP_CSS),
          h('div',{className:'as-font-popup-head'},
            h('input',{ref:search,type:'search',className:'as-fontSearch',value:query,onChange:event=>{setQuery(event.target.value);setActive(0);},placeholder:t('fontSearch'),'aria-label':t('fontSearch'),'aria-controls':listId,'aria-activedescendant':listId+'-'+active,autoComplete:'off',spellCheck:false}),
            h('span',{className:'as-font-popup-count'},fill(t('fontMatches'),{count:matched.length,total:fonts.length}))),
          h('div',{id:listId,className:'as-font-options',role:'listbox','aria-label':label},
            items.map((item,index)=>h('button',{key:item.value,id:listId+'-'+index,type:'button',role:'option',tabIndex:-1,className:'as-font-option','data-active':index===active||undefined,'aria-selected':item.value===(selected??''),onPointerMove:()=>setActive(index),onPointerDown:event=>event.preventDefault(),onClick:()=>choose(item.value)},h('span',null,item.label),item.value===(selected??'')&&h('span',{'aria-hidden':true,className:'as-font-check'},'✓'))),
            matched.length===0&&h('div',{className:'as-font-empty'},t('fontNoMatches')))));
    }

    const FONT_POPUP_CSS=`
      .as-font-popup{position:fixed;inset:auto;margin:0;box-sizing:border-box;max-width:calc(100vw - 24px);max-height:calc(100vh - 24px);padding:0;border:1px solid var(--dsw-alias-border-l3);border-radius:14px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);box-shadow:0 16px 48px #0004,0 3px 12px #0002;overflow:hidden;display:flex;flex-direction:column;font-family:var(--dsw-font-family);font-size:13px;line-height:20px;-webkit-app-region:no-drag}
      .as-font-popup-head{box-sizing:border-box;padding:10px 10px 7px;border-bottom:1px solid var(--dsw-alias-border-l2);flex:none;display:flex;flex-direction:column;gap:5px}
      .as-font-popup .as-fontSearch{box-sizing:border-box;width:100%;height:34px;min-height:34px;border:1px solid var(--dsw-alias-border-l3);border-radius:8px;padding:0 10px;background:var(--dsw-alias-bg-base);color:inherit;font:inherit;outline:none}
      .as-font-popup .as-fontSearch:focus{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-alias-state-business-primary) 15%,transparent)}
      .as-font-popup-count{font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary);padding-left:2px}
      .as-font-options{flex:1;min-height:0;overflow:auto;padding:5px;scrollbar-width:thin;overscroll-behavior:contain}
      .as-font-option{box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;height:34px;min-height:34px;padding:0 10px;border:0;border-radius:7px;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}
      .as-font-option>span:first-child{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}.as-font-option[data-active=true]{background:var(--dsw-alias-interactive-bg-hover)}.as-font-option[aria-selected=true]{color:var(--dsw-alias-state-business-primary);font-weight:550}.as-font-check{flex:none}.as-font-empty{padding:14px 10px;color:var(--dsw-alias-label-tertiary);font-size:12px}
    `;

    function FontRow({t,label,description,role,themeSnapshot,fonts}) {
      const current=themeSnapshot?.fontFamilies?.[role]??'';
      return h('div',{className:'as-row'},
        h('div',{className:'as-rowText'},h('div',{className:'as-rowTitle'},label),h('div',{className:'as-rowDesc'},description)),
        h('div',{className:'as-rowControl as-fontControl'},h(FontPicker,{t,label,role,current,fonts}),
          h('button',{type:'button',className:'as-btn as-btnGhost','aria-label':`${label} ${t('fontReset')}`,onClick:()=>themeSetFontFamily(role,'')},t('fontReset'))));
    }


    /** Font-family writer resolved from the store's theme service. */
    let themeSetFontFamily = () => {}

    /** Font-size writer resolved from the store's theme service. */
    let themeSetFontSize = () => {}

    function FontsSection({t,themeSnapshot}) {
      const [catalog,refresh]=useInstalledFonts();
      const rows=[{role:'text',label:t('fontText'),description:t('fontTextHint')},{role:'code',label:t('fontCode'),description:t('fontCodeHint')},{role:'terminal',label:t('fontTerminal'),description:t('fontTerminalHint')}];
      return h('section',{className:'as-card as-fonts-card'},
        h('div',{className:'as-cardHead'},h('h2',{className:'as-cardTitle'},t('sectionFonts')),h('p',{className:'as-cardHint'},t('sectionFontsHint'))),
        h('div',{className:'as-fontToolbar'},
          h('p',{className:'as-cardHint as-fontStatus',role:'status','aria-live':'polite'},catalog.status==='loading'?t('fontLoading'):catalog.status==='failed'?t('fontFailed'):fill(t('fontCount'),{total:catalog.fonts.length})),
          h('button',{type:'button',className:'as-btn as-btnGhost',disabled:catalog.status==='loading',onClick:()=>{void refresh();}},t('fontReload'))),
        rows.map(row=>h(FontRow,{...row,key:row.role,t,themeSnapshot,fonts:catalog.fonts})));
    }


    function SizesSection({ t, themeSnapshot }) {
      const sizes = themeSnapshot?.fontSizes ?? { text: 14, code: 11, terminal: 13 }
      const rows = [
        { role: 'text', label: t('sizeInterface') },
        { role: 'code', label: t('sizeCode') },
        { role: 'terminal', label: t('sizeTerminal') },
      ]
      return h('section', { className: 'as-card' },
        h('div', { className: 'as-cardHead' },
          h('h2', { className: 'as-cardTitle' }, t('sectionSizes')),
          h('p', { className: 'as-cardHint' }, t('sectionSizesHint')),
        ),
        rows.map((row) => {
          const spec = SIZE_SPECS[row.role]
          const rawValue = Number(sizes[row.role])
          const value = Number.isFinite(rawValue) ? Math.max(spec.min, Math.min(spec.max, Math.round(rawValue))) : spec.default
          return h(Row, { key: row.role, title: row.label, description: `${spec.min}–${spec.max} ${t('sizeUnit')}` },
            h(Stepper, {
              value,
              min: spec.min,
              max: spec.max,
              unit: t('sizeUnit'),
              label: row.label,
              labelIncrease: `${t('sizeIncrease')} ${row.label}`,
              labelDecrease: `${t('sizeDecrease')} ${row.label}`,
              onChange: (next) => {
                try {
                  themeSetFontSize(row.role, next)
                } catch {
                  // Out-of-range values are rejected by the service.
                }
              },
            }),
          )
        }),
      )
    }

    function MotionSection({ t, state }) {
      return h('section', { className: 'as-card' },
        h('div', { className: 'as-cardHead' },
          h('h2', { className: 'as-cardTitle' }, t('sectionMotion')),
          h('p', { className: 'as-cardHint' }, t('sectionMotionHint')),
        ),
        h(Row, { title: t('reducedMotion'), description: t('reducedMotionHint') },
          h(Switch, {
            checked: state.reducedMotion,
            label: t('reducedMotion'),
            onChange: (next) => studio?.set({ reducedMotion: next }),
          }),
        ),
      )
    }

    function DetailsSection({ t, state }) {
      return h('section', { className: 'as-card' },
        h('div', { className: 'as-cardHead' },
          h('h2', { className: 'as-cardTitle' }, t('sectionDetails')),
          h('p', { className: 'as-cardHint' }, t('sectionDetailsHint')),
        ),
        h(Row, { title: t('translucentSidebar'), description: t('translucentSidebarHint') },
          h(Switch, {
            checked: state.translucentSidebar,
            label: t('translucentSidebar'),
            onChange: (next) => studio?.set({ translucentSidebar: next }),
          }),
        ),
        h(Row, { title: t('contrast'), description: t('contrastHint') },
          h(Segmented, {
            value: state.contrast,
            label: t('contrast'),
            options: [
              { id: 'default', label: t('contrastDefault') },
              { id: 'medium', label: t('contrastMedium') },
              { id: 'high', label: t('contrastHigh') },
            ],
            onChange: (id) => studio?.set({ contrast: id }),
          }),
        ),
        h(Row, { title: t('diffMarkers'), description: t('diffMarkersHint') },
          h(Switch, {
            checked: state.diffMarkers,
            label: t('diffMarkers'),
            onChange: (next) => studio?.set({ diffMarkers: next }),
          }),
        ),

      )
    }

    // -----------------------------------------------------------------------
    // Page
    // -----------------------------------------------------------------------

    function AppearancePage({ t, variant }) {
      const state = useStudioState()
      const themeSnapshot = useThemeState()
      const [toast, setToast] = useState('')
      const toastTimer = useRef(null)

      useEffect(() => () => {
        if (toastTimer.current !== null) clearTimeout(toastTimer.current)
      }, [])

      const reset = () => {
        studio?.reset()
        setToast(t('resetDone'))
        if (toastTimer.current !== null) clearTimeout(toastTimer.current)
        toastTimer.current = setTimeout(() => setToast(''), 2600)
      }

      const body = [
        h(ModeSection, { key: 'mode', t, themeSnapshot }),
        h(ThemeSection, { key: 'theme', t, themeSnapshot }),
        h(ColorsSection, { key: 'colors', t, state, themeSnapshot }),
        h(FontsSection, { key: 'fonts', t, themeSnapshot }),
        h(SizesSection, { key: 'sizes', t, themeSnapshot }),
        h(MotionSection, { key: 'motion', t, state }),
        h(DetailsSection, { key: 'details', t, state }),
        h('div', { key: 'foot', className: 'as-foot' },
          h('span', { className: 'as-footHint', role: 'status', 'aria-live': 'polite' }, toast !== '' ? h('span', { className: 'as-toast' }, toast) : t('resetHint')),
          h('button', { type: 'button', className: 'as-btn', onClick: reset }, t('reset')),
        ),
      ]

      if (variant === 'settings') {
        return h('section', { className: 'as-section' }, h('style', null, CSS), body)
      }

      return h('section', { className: 'as-page' },
        h('style', null, CSS),
        h('div', { className: 'as-head' },
          h('div', null,
            h('h1', { className: 'as-title' }, t('title')),
            h('p', { className: 'as-intro' }, t('intro')),
          ),
        ),
        body,
      )
    }

    // -----------------------------------------------------------------------
    // Registration
    // -----------------------------------------------------------------------

    return {
      inject: ['slots', 'locale', 'theme'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'appearance-studio: dictionaries')
        const t = ctx.locale.bind(NS)
        const theme = ctx.theme

        // Bind the writers the sections call.
        themeSet = (id) => theme.setTheme(id)
        themeSetFontFamily = (role, value) => theme.setFontFamily(role, value)
        themeSetFontSize = (role, px) => theme.setFontSize(role, px)

        ctx.effect(() => {
          const current = createStudio(ctx, theme)
          studio = current
          return () => {
            current.dispose()
            if (studio === current) {
              studio = null
              themeSet = () => {}
              themeSetFontFamily = () => {}
              themeSetFontSize = () => {}
            }
          }
        }, 'appearance-studio: studio store')

        // The global effects sheet lives exactly as long as the plugin.
        ctx.effect(() => {
          if (typeof document === 'undefined') return () => {}
          const tag = document.createElement('style')
          tag.dataset.plugin = '@local/dsh-appearance-studio'
          tag.dataset.pluginCss = '@local/dsh-appearance-studio/effects.css'
          tag.textContent = GLOBAL_CSS
          document.head.appendChild(tag)
          return () => tag.remove()
        }, 'appearance-studio: effects stylesheet')

        // Preset themes are registry entries owned by this plugin's lifetime.
        ctx.effect(() => {
          const disposers = []
          for (const preset of PRESET_THEMES) {
            try {
              disposers.push(theme.register({
                id: preset.id,
                colorScheme: preset.colorScheme,
                tokens: preset.tokens,
              }))
            } catch {
              // A duplicate id from a previous generation keeps the original.
            }
          }
          return () => {
            for (const dispose of disposers) {
              try {
                dispose()
              } catch {
                // Already released.
              }
            }
          }
        }, 'appearance-studio: preset themes')

        const SettingsPage = (props) => h(AppearancePage, { t: props.t ?? t, variant: 'settings' })

        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist',
          id: 'appearance-studio',
          order: 20,
          label: () => t('panel'),
          locale: NS,
        }, Icon))

        ctx.slots.inject('main', () => ctx.slots.register({
          name: 'main',
          key: 'appearance-studio',
          locale: NS,
        }, AppearancePage))

        ctx.slots.inject('settings.section', () => ctx.slots.register({
          name: 'settings.section',
          id: 'appearance-studio',
          order: 20,
          label: () => t('panel'),
          locale: NS,
        }, SettingsPage))
      },
    }
  },
})
