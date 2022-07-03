# Filter Contract Demo Relay

## 使用

### 1. 依赖

* PM2

```shell
$ npm run pm2_start_monitor
$ npm run pm2_start_server
```

### 2. ENV设置

```
NODE_ENV=DEV
PORT=8088
DB_HOST=127.0.0.1
DB_NAME=filter-test
DB_USER=root
DB_PASS=
COOKIE_SECRET=
COOKIE_PREFIX=
FETCHER_BSC_TOKENS=/* 弃用 */
FETCHER_BSC_TESTNET=/* 是否为测试网，1为是，否则去掉 */
MONITOR_START_BLOCK=/* 系统想同步的起始block，因为RPC限制，同步为每次5000块高，所以尽量选择近的块 */
MONITOR_FILTER_ADDRESS=/* filter合约地址 */
MONITOR_FILTER_TOPIC=/* filter事件的topic */
MONITOR_FILTER_DELAY=/* 系统延迟处理事件，毫秒 */
MONITOR_FILTER_OWNER_ADDRESS=/* filter合约owner地址 */
MONITOR_FILTER_OWNER_PK=/* filter合约owner私钥 */
MONITOR_PROVIDER_RPC=/* 网络RPC地址 */
```