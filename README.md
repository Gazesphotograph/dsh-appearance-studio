# 外观工作室

DeepSeek Harness 自制插件 `@local/dsh-appearance-studio`，当前插件版本 **1.2.1**。
本仓库独立保存源码、必要资源和可离线运行的回归检查。
整理基于本机 **DeepSeek Harness 0.2.1-rc.5** 使用的源码快照。

## 功能与数据

- 浅色、深色、跟随系统及预设主题，自定义配色和三类字号。
- 读取 Windows 已安装字体，分别设置正文、代码、终端字体；支持搜索和恢复默认。
- 应用内半透明侧栏、磨砂效果、减少动态效果、对比度和差异高亮。

半透明效果是应用内材质，不透视 Windows 桌面。系统字体枚举依赖 Windows。
主题和字体交给 Harness 的 theme 服务保存；额外外观偏好保存在浏览器的
`localStorage` 项 `dsh.appearance-studio.v1` 中。卸载插件会清理当前注入的样式，
已保存的偏好不会随卸载自动删除。

## 安装

克隆此私有仓库到固定目录后，在仓库根目录打开 PowerShell：

```powershell
$dsh = Join-Path $env:LOCALAPPDATA 'Programs\DeepSeek Harness\resources\runtime\cli\bin\dsh.cmd'
& $dsh plugin --profile desktop add (Get-Location).Path
```

如 Harness 安装在其他位置，把 `$dsh` 改为对应 CLI 路径。插件使用 DSH
提供的服务，无需自行安装 React 或其他前端运行依赖。安装后刷新页面；涉及
原生启动配置时完整重启桌面程序。使用其他 profile 时替换 `desktop`。
本次整理未将这些副本重新安装进正在运行的 DSH。

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

检查使用本地代码、模拟服务或临时目录，不需要账户密钥。测试只证明相应离线
行为；从这些独立仓库重新安装后的桌面界面尚未验证。
`tests/` 中保留整理前已有的回归检查，并将路径改为仓库内路径。

## 目录

- `index.js`：Host 服务入口。
- `package.json`、`cordis.patch.yml`：DSH bundle 元数据与加载配置。
- `tests/`：可复跑检查。
- `client.js`、`locale/`、`icon.svg`：客户端页面和界面资源。

## 整理记录

2026-11-04：从当前工作目录独立归档，补全安装与验证说明、忽略规则和仓库元数据。
业务实现保持当前版本，整理差异见 `CHANGELOG.md`。GitHub 仓库设为私有；
`package.json` 中的 `private: true` 同时防止误发布到 npm。
