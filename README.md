# 外观工作室

为 DeepSeek Harness 提供主题配色、系统字体选择、字号调整和半透明侧栏。

插件：`@local/dsh-appearance-studio` · 版本：**1.5.0**

适用版本：**DeepSeek Harness 0.2.1-rc.5**。

## 功能与数据

- 浅色、深色、跟随系统及预设主题，自定义配色和三类字号。
- 读取 Windows 已安装字体，分别设置正文、代码、终端字体；支持搜索和恢复默认。
- Windows 11 原生 Acrylic 半透明侧栏与标题栏、减少动态效果、对比度和差异高亮。

原生半透明效果依赖配套桌面壳补丁，模糊应用下层窗口；正文保持实色。
浅色遮罩 60%，深色 42%。关闭开关、减少透明度或高对比度时回退为实色。
本仓库仅包含插件源码，不包含或自动安装 `app.asar` 补丁；未适配的桌面壳
无法启用原生 Acrylic。DSH 更新覆盖桌面壳后需要重新适配。系统字体枚举依赖 Windows。
主题和字体交给 Harness 的 theme 服务保存；额外外观偏好保存在浏览器的
`localStorage` 项 `dsh.appearance-studio.v1` 中。卸载插件会清理当前注入的样式，
已保存的偏好不会随卸载自动删除。

## 1.5.0 更新

- 统一通用菜单与悬浮面板材质：深色填充 92%、浅色 96% 不透明，保留轻微磨砂感。
- 将 24px 模糊移到浮层表面，避免内部负层级装饰层导致底层文字透入菜单。
- 覆盖账号、会话、工作区、模式、模型、权限、指令、资料库等菜单，以及使用同一材质变量的任务、队列、上下文和目标等面板。
- 资料库提示与临时会话侧栏采用统一材质；设置和字体弹窗保留原本的实色。
- 减少透明度、强制颜色和不支持模糊的环境使用实色回退。

已在对应 Harness 桌面端完成深浅色各 10 类菜单、设置/字体弹窗与两种辅助功能回退检查，共 24 项通过；悬浮侧栏的 13 项交互检查也通过。任务、队列等未启动的面板通过其拥有的样式规则检查，未为验证而创建任务。

## 安装

克隆仓库到固定目录后，在仓库根目录打开 PowerShell：

```powershell
$dsh = Join-Path $env:LOCALAPPDATA 'Programs\DeepSeek Harness\resources\runtime\cli\bin\dsh.cmd'
& $dsh plugin --profile desktop add (Get-Location).Path
```

如 Harness 安装在其他位置，把 `$dsh` 改为对应 CLI 路径。插件使用 DSH
提供的服务，无需自行安装 React 或其他前端运行依赖。安装后刷新页面；涉及
原生启动配置时完整重启桌面程序。使用其他 profile 时替换 `desktop`。

卸载：

```powershell
& $dsh plugin --profile desktop remove @local/dsh-appearance-studio
```

## 验证

使用 Node.js 22.15 或更新版本，在仓库根目录运行：

```powershell
npm test
npm pack --dry-run
```

`tests/` 包含使用本地代码、模拟服务或临时目录的离线回归检查，无需账户密钥。
这些检查不覆盖安装后的完整桌面交互，界面兼容性需在对应 Harness 版本中确认。

## 目录

- `index.js`：Host 服务入口。
- `package.json`、`cordis.patch.yml`：DSH bundle 元数据与加载配置。
- `tests/`：可复跑检查。
- `client.js`、`locale/`、`icon.svg`：客户端页面和界面资源。
