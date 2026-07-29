# Dynamic Budget Forecast PWA

一个基于浏览器的**年度预算预测与资金分配规划工具**，支持分阶段账户结余分配、赤字扣款优先级动态调整，并具备完整的 **PWA 离线能力**、**IndexedDB 透明加解密**与**全屏锁屏保护**。

---

## 功能特性

| 特性 | 说明 |
|------|------|
| **全屏锁屏** | 基于 Web Crypto (PBKDF2 + AES-GCM-256) 的密码保护，解锁后方可访问数据 |
| **IndexedDB 加解密** | 所有本地数据（账户、规则、收支、基准列）均以透明加密形式存储于 IndexedDB |
| **PWA 离线缓存** | 通过 Service Worker 预缓存核心资源，支持无网络环境下完全离线运行 |
| **Web App Manifest** | 可安装为独立桌面/移动端应用 (Standalone)，具备原生应用体验 |
| **分阶段资金规则** | 按年份区间配置各账户的分配比例与赤字扣款优先级 |
| **基准 vs 实际对比** | 可冻结任意时刻的预测列为基准，后续与实际决算数据逐行对比偏差 |
| **收支趋势图表** | 集成 Chart.js，年度收支可视化 |
| **保险/固定支出参考表** | 内置可灵活增删的保险保费追踪与固定支出估算草稿表 |
| **加密备份与恢复** | 支持加密或明文导出 JSON 备份，随时迁移或恢复数据 |

---

## 文件结构

```
budget-forecast-pwa/
├── index.html              # 主应用 (单文件即可运行)
├── manifest.json           # PWA 清单配置
├── sw.js                   # Service Worker (离线缓存策略)
├── icons/                  # PWA 多尺寸图标
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
└── README.md               # 本文件
```

---

## 快速开始

### 本地运行

本项目为纯前端应用，无需构建工具。直接在浏览器打开 `index.html` 即可：

```bash
# 方式一：直接打开文件
open index.html

# 方式二：使用任意静态服务器 (推荐，以支持 Service Worker)
npx serve .
# 或
python -m http.server 8080
```

> 注意：Service Worker 要求页面必须在 **HTTPS** 或 **localhost** 环境下运行。

### 安装为桌面/移动应用

1. 使用支持的浏览器（Chrome / Edge / Safari）打开部署后的地址
2. 点击地址栏右侧的 **"安装"** (Install) 图标
3. 应用将以独立窗口运行，支持离线使用与锁屏保护

---

## GitHub Pages 部署

1. Fork 或上传本仓库到 GitHub
2. 进入 **Settings → Pages**
3. Source 选择 **Deploy from a branch**，分支选 `main`，文件夹选 `/ (root)`
4. 保存后即可通过 `https://<你的用户名>.github.io/budget-forecast-pwa/` 访问
5. 首次访问需联网加载 CDN 资源，随后 Service Worker 将缓存全部内容，支持离线使用

---

## 安全说明

- **密码遗忘**：当前版本未提供密码找回机制。若遗忘密码，只能通过 "重置所有数据" 清空数据库并重新初始化。
- **加密强度**：采用 100,000 次 PBKDF2 迭代派生 AES-GCM-256 密钥，所有持久化数据均经过加密。
- **备份安全**：导出备份时可选择加密保护（默认开启），加密备份只能用导出时的同一密码解密恢复。

---

## 技术栈

- **Vanilla JavaScript** (ES2020+)
- **Dexie.js** — IndexedDB 封装
- **Chart.js** — 数据可视化
- **Font Awesome** — 图标
- **Web Crypto API** — PBKDF2 + AES-GCM-256 加解密
- **Service Worker API** — 离线缓存
- **Web App Manifest** — PWA 安装配置

---

## 浏览器兼容性

- Chrome 90+
- Edge 90+
- Safari 14+
- Firefox 90+

> 需要支持 `crypto.subtle` (Web Crypto)、`serviceWorker` 与 `indexedDB` 的现代浏览器。

---

## License

MIT
