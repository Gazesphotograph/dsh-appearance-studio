// Version-scoped desktop patch. Never replaces the bundled runtime or updater.
const fs = require("node:fs"),
  path = require("node:path"),
  crypto = require("node:crypto");
const appDir =
  process.argv.find((a) => a.startsWith("--app-dir="))?.slice(10) ||
  path.join(process.env.LOCALAPPDATA, "Programs", "DeepSeek Harness");
const source = path.join(appDir, "resources", "app.asar"),
  original = fs.readFileSync(source);
const header = JSON.parse(
    original.subarray(16, 16 + original.readUInt32LE(12)),
  ),
  dataStart = 8 + original.readUInt32LE(4);
function entry(p) {
  let n = header;
  for (const part of p.split("/")) n = n.files[part];
  return n;
}
function read(p) {
  const e = entry(p);
  return original
    .subarray(
      dataStart + Number(e.offset),
      dataStart + Number(e.offset) + e.size,
    )
    .toString("utf8");
}
if (JSON.parse(read("package.json")).version !== "0.2.2-rc.3")
  throw Error("This patch requires DeepSeek Harness 0.2.2-rc.3");
if (read("lib/main.js").includes("DSH_LOCAL_SHELL_RC3_V1")) {
  console.log("Desktop compatibility patch already installed.");
  process.exit(0);
}
const replace = (s, a, b) => {
  if (!s.includes(a))
    throw Error("Unrecognized desktop build: " + a.slice(0, 60));
  return s.replace(a, b);
};
let main = read("lib/main.js"),
  preload = read("lib/preload-app.cjs");
main =
  '// DSH_LOCAL_SHELL_RC3_V1\nimport { release as dshGlassOsRelease } from "node:os";\n' +
  main;
main = replace(
  main,
  "ipcMain.handle(DESKTOP_IPC.windowsMenu, (event, name, x, y) => {",
  "ipcMain.handle(DESKTOP_IPC.windowsMenu, async (event, name, x, y) => {",
);
main = replace(
  main,
  'name !== "application" && name !== "edit"',
  '!["application", "edit", "view", "help"].includes(name)',
);
main = replace(
  main,
  'const items = name === "application" ? applicationItems() : [',
  "const chinese = currentDesktopLocale().id.startsWith('zh');\n            const label = (zh,en) => chinese ? zh : en;\n            const uiAction = (action) => {\n                if(!['sidebar','rightbar','back','forward','search','new'].includes(action))return;\n                void window.webContents.executeJavaScript('window.dispatchEvent(new CustomEvent(\"dsh-shell-action\",{detail:'+JSON.stringify(action)+'}))').catch(error=>console.warn('Caption action failed',error));\n            };\n            const historyState = name === 'view' ? await window.webContents.executeJavaScript('(()=>{const buttons=document.querySelectorAll(\".dsh-caption-controls button\");return {back:buttons[0]?.disabled===false,forward:buttons[1]?.disabled===false}})()').catch(()=>({back:false,forward:false})) : {};\n            const actionItem = (zh,en,action,accelerator,enabled=true) => ({label:label(zh,en),enabled,...accelerator?{accelerator,registerAccelerator:false}:{},click:()=>uiAction(action)});\n            const viewItems = [\n                actionItem('显示/隐藏会话列表','Toggle conversations','sidebar','Ctrl+B'),\n                actionItem('显示/隐藏右侧面板','Toggle right panel','rightbar','Ctrl+Alt+B'),\n                {type:'separator'},\n                actionItem('新建会话','New conversation','new','Ctrl+N'),\n                actionItem('搜索会话','Search conversations','search','Ctrl+K'),\n                {type:'separator'},\n                actionItem('返回','Back','back','Alt+Left',historyState.back),\n                actionItem('前进','Forward','forward','Alt+Right',historyState.forward),\n                {type:'separator'},\n                {label:label('放大界面','Zoom in'),accelerator:'Ctrl+Shift+=',click:()=>window.webContents.setZoomFactor(Math.min(2,window.webContents.getZoomFactor()+.1))},\n                {label:label('缩小界面','Zoom out'),accelerator:'Ctrl+Shift+-',click:()=>window.webContents.setZoomFactor(Math.max(.6,window.webContents.getZoomFactor()-.1))},\n                {label:label('实际大小','Actual size'),role:'resetZoom',accelerator:'Ctrl+0'},\n                {type:'separator'},\n                {label:label('刷新界面','Reload interface'),role:'reload',accelerator:'Ctrl+R'},\n                {label:label('切换全屏','Toggle full screen'),role:'togglefullscreen',accelerator:'F11'}\n            ];\n            const items = name === 'view' ? viewItems : name === 'help' ? applicationItems().slice(0,3) : name === \"application\" ? applicationItems() : [",
);
main = replace(
  main,
  "const windowsDevToolsShortcuts = [{",
  `const windowsDevToolsShortcuts = [
    {label:'Toggle full screen',visible:false,accelerator:'F11',click:()=>mainWindow?.setFullScreen(!mainWindow.isFullScreen())},
    {label:'Actual size',visible:false,accelerator:'Ctrl+0',click:()=>mainWindow?.webContents.setZoomFactor(1)},
    {label:'Zoom in',visible:false,accelerator:'Ctrl+Shift+=',click:()=>{if(mainWindow)mainWindow.webContents.setZoomFactor(Math.min(2,mainWindow.webContents.getZoomFactor()+.1))}},
    {label:'Zoom out',visible:false,accelerator:'Ctrl+Shift+-',click:()=>{if(mainWindow)mainWindow.webContents.setZoomFactor(Math.max(.6,mainWindow.webContents.getZoomFactor()-.1))}},
    {`,
);
const handlerStart = main.indexOf(
  "\t\tipcMain.on(DESKTOP_IPC.windowsAppearance,",
);
const handlerEnd = main.indexOf("\n\t}\n\tconst hideMainWindow", handlerStart);
if (handlerStart < 0 || handlerEnd < 0)
  throw Error("Unrecognized appearance handler");
main =
  main.slice(0, handlerStart) +
  '\t\tipcMain.on(DESKTOP_IPC.windowsAppearance, (event, language, color, symbolColor, glassRequested) => {\n\t\t\tif (mainWindow === void 0 || event.sender !== mainWindow.webContents || event.senderFrame !== mainWindow.webContents.mainFrame) return;\n\t\t\tif (!event.senderFrame.url.startsWith(`dsh-app://app/`)) return;\n\t\t\tconst validColor = (value) => typeof value === "string" && /^(?:#[\\da-f]{3,8}|rgba?\\([\\d.,%\\s]+\\))$/iu.test(value);\n\t\t\t// Native Acrylic follows the windows behind this app; opt-in and main-frame only.\n\t\t\tconst supported = Number(dshGlassOsRelease().split(\'.\')[2]) >= 22621;\n\t\t\tconst glass = glassRequested === true && supported && !nativeTheme.prefersReducedTransparency && !nativeTheme.shouldUseHighContrastColors;\n\t\t\tlet active = false;\n\t\t\ttry {\n\t\t\t\tmainWindow.setBackgroundMaterial(glass ? "acrylic" : "none");\n\t\t\t\tmainWindow.setBackgroundColor(glass ? "#00000000" : chromeFallbackFill());\n\t\t\t\tactive = glass;\n                mainWindow.__dshGlass = glass;\n\t\t\t} catch { mainWindow.setBackgroundColor(chromeFallbackFill()); }\n\t\t\tif (validColor(color) && validColor(symbolColor)) mainWindow.setTitleBarOverlay({\n\t\t\t\tcolor: active ? "#00000000" : color,\n\t\t\t\tsymbolColor\n\t\t\t});\n\t\t\tmainWindow.webContents.send(DESKTOP_IPC.windowsAppearance, { glass: active });\n\t\t});' +
  main.slice(handlerEnd);
main = main.replaceAll(
  "window.setBackgroundColor(chromeFallbackFill());",
  'window.setBackgroundColor(window.__dshGlass ? "#00000000" : chromeFallbackFill());',
);
preload = replace(
  preload,
  "const next = buttons[index === 0 ? 1 : 0];",
  'const next = buttons[(index + (event.key === "ArrowRight" ? 1 : buttons.length - 1)) % buttons.length];',
);
preload = replace(
  preload,
  'const buttons = [createButton("application", 0), createButton("edit", 1)];',
  'const buttons = [createButton("application", 0), createButton("edit", 1), createButton("view", 2), createButton("help", 3)];',
);
preload = replace(
  preload,
  "buttons[1].textContent = messages.edit;",
  'buttons[1].textContent = messages.edit;\n        const chinese=document.documentElement.lang.toLowerCase().startsWith("zh");\n        buttons[2].textContent=chinese?"视图":"View";\n        buttons[3].textContent=chinese?"帮助":"Help";',
);
const syncStart = preload.indexOf("function syncWindowsAppearance() {"),
  syncEnd = preload.indexOf("\n//#endregion", syncStart);
if (syncStart < 0 || syncEnd < 0)
  throw Error("Unrecognized appearance preload");
preload =
  preload.slice(0, syncStart) +
  'function syncWindowsAppearance() {\n\tif (process.platform !== "win32") return;\n\tconst mark = () => {\n\t\tconst root = document.documentElement;\n\t\troot.dataset.windowsTitlebar = "";\n\t\troot.style.setProperty("--dsh-windows-titlebar-height", `40px`);\n\t};\n\tif (document.documentElement !== null) mark();\n\tconst install = () => {\n\t\tmark();\n\t\tconst root = document.documentElement;\n\t\tconst menu = installWindowsMenu();\n\t\tconst probe = document.createElement("span");\n\t\tprobe.style.cssText = "position:fixed;visibility:hidden;pointer-events:none;background-color:var(--dsw-specific-sidebar-fill);color:var(--dsw-alias-label-primary)";\n\t\tdocument.body.append(probe);\n\t\tconst canvas = document.createElement("canvas");\n\t\tcanvas.width = canvas.height = 1;\n\t\tconst context = canvas.getContext("2d", { willReadFrequently: true });\n\t\tif (context === null) throw new Error("Desktop caption requires a 2D canvas context");\n\t\tconst nativeColor = (color) => {\n\t\t\tcontext.clearRect(0, 0, 1, 1);\n\t\t\tcontext.fillStyle = color;\n\t\t\tcontext.fillRect(0, 0, 1, 1);\n\t\t\tconst [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;\n\t\t\treturn `rgba(${red}, ${green}, ${blue}, ${Number(alpha) / 255})`;\n\t\t};\n\t\tconst transparency = window.matchMedia(\'(prefers-reduced-transparency: reduce)\');\n\t\tconst contrast = window.matchMedia(\'(forced-colors: active)\');\n\t\tconst acknowledge = (_event, value) => {\n\t\t\tif (value?.glass === true) root.setAttribute(\'data-as-native-glass\', \'true\');\n\t\t\telse root.removeAttribute(\'data-as-native-glass\');\n\t\t};\n\t\telectron.ipcRenderer.on(DESKTOP_IPC.windowsAppearance, acknowledge);\n\t\tlet previous = "";\n\t\tconst send = () => {\n\t\t\tconst style = getComputedStyle(probe);\n\t\t\tconst color = nativeColor(style.backgroundColor);\n\t\t\tconst symbolColor = nativeColor(style.color);\n\t\t\tconst values = [\n\t\t\t\troot.lang,\n\t\t\t\tcolor,\n\t\t\t\tsymbolColor,\n\t\t\t\troot.getAttribute("data-as-translucent-sidebar") === "true" && !transparency.matches && !contrast.matches\n\t\t\t];\n\t\t\tconst current = JSON.stringify(values);\n\t\t\tif (current === previous) return;\n\t\t\tprevious = current;\n\t\t\tmenu.update();\n\t\t\telectron.ipcRenderer.send(DESKTOP_IPC.windowsAppearance, ...values);\n\t\t};\n\t\tconst observer = new MutationObserver(send);\n\t\tobserver.observe(root, {\n\t\t\tattributes: true,\n\t\t\tattributeFilter: ["lang", "data-as-translucent-sidebar", "data-ds-theme-source"]\n\t\t});\n\t\tobserver.observe(document.body, {\n\t\t\tattributes: true,\n\t\t\tattributeFilter: ["data-ds-dark-theme", "style"]\n\t\t});\n\t\tobserver.observe(document.head, {\n\t\t\tchildList: true,\n\t\t\tsubtree: true,\n\t\t\tcharacterData: true\n\t\t});\n\t\tdocument.head.addEventListener("load", send, true);\n\t\ttransparency.addEventListener("change", send);\n\t\tcontrast.addEventListener("change", send);\n\t\twindow.addEventListener("pagehide", () => {\n\t\t\tobserver.disconnect();\n\t\t\tmenu.dispose();\n\t\t\tprobe.remove();\n\t\t\tdocument.head.removeEventListener("load", send, true);\n\t\t\ttransparency.removeEventListener("change", send);\n\t\t\tcontrast.removeEventListener("change", send);\n\t\t\telectron.ipcRenderer.removeListener(DESKTOP_IPC.windowsAppearance, acknowledge);\n\t\t}, { once: true });\n\t\tsend();\n\t};\n\tif (document.readyState === "loading") window.addEventListener("DOMContentLoaded", install, { once: true });\n\telse install();\n}' +
  preload.slice(syncEnd);
const replacements = new Map([
  ["lib/main.js", Buffer.from(main)],
  ["lib/preload-app.cjs", Buffer.from(preload)],
]);
const chunks = [];
let offset = 0;
let verifiedFiles = 0;
function walk(node, prefix = "") {
  for (const [name, e] of Object.entries(node.files || {})) {
    const p = prefix ? prefix + "/" + name : name;
    if (e.files) {
      walk(e, p);
      continue;
    }
    if (e.unpacked || e.link) continue;
    const bytes =
      replacements.get(p) ||
      original.subarray(
        dataStart + Number(e.offset),
        dataStart + Number(e.offset) + e.size,
      );
    if (replacements.has(p)) {
      const blockSize = e.integrity?.blockSize || 4194304,
        blocks = [];
      for (let i = 0; i < bytes.length; i += blockSize)
        blocks.push(
          crypto
            .createHash("sha256")
            .update(bytes.subarray(i, i + blockSize))
            .digest("hex"),
        );
      e.integrity = {
        algorithm: "SHA256",
        hash: crypto.createHash("sha256").update(bytes).digest("hex"),
        blockSize,
        blocks,
      };
    }
    e.offset = String(offset);
    e.size = bytes.length;
    chunks.push(bytes);
    offset += bytes.length;
    verifiedFiles++;
  }
}
walk(header);
const json = Buffer.from(JSON.stringify(header)),
  h = Buffer.alloc(8 + Math.ceil(json.length / 4) * 4);
h.writeUInt32LE(h.length - 4, 0);
h.writeUInt32LE(json.length, 4);
json.copy(h, 8);
const size = Buffer.alloc(8);
size.writeUInt32LE(4, 0);
size.writeUInt32LE(h.length, 4);
const packed = Buffer.concat([size, h, ...chunks]);
const verifyHeader = JSON.parse(
    packed.subarray(16, 16 + packed.readUInt32LE(12)),
  ),
  verifyStart = 8 + packed.readUInt32LE(4);
let checked = 0;
function verify(n) {
  for (const e of Object.values(n.files || {})) {
    if (e.files) {
      verify(e);
      continue;
    }
    if (e.unpacked || e.link) continue;
    if (
      !packed
        .subarray(
          verifyStart + Number(e.offset),
          verifyStart + Number(e.offset) + e.size,
        )
        .equals(chunks[checked++])
    )
      throw Error("Archive verification failed");
  }
}
verify(verifyHeader);
const report = {
  version: "0.2.2-rc.3",
  modified: [...replacements.keys()],
  verifiedFiles,
  sourceSha256: crypto.createHash("sha256").update(original).digest("hex"),
  patchedSha256: crypto.createHash("sha256").update(packed).digest("hex"),
};
if (process.argv.includes("--check")) {
  console.log(JSON.stringify({ ...report, checkOnly: true }));
  process.exit(0);
}
const backup = source + ".rc3-original";
if (!fs.existsSync(backup))
  fs.copyFileSync(source, backup, fs.constants.COPYFILE_EXCL);
fs.writeFileSync(source + ".local-new", packed);
fs.renameSync(source + ".local-new", source);
console.log(JSON.stringify(report));
