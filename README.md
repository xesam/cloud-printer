# 外卖云打印机 API

云外卖打印机厂商开放平台的聚合支持，已支持的云打印机品牌：

1. 飞鹅。标签机、小票机。
2. 商鹏。小票机。
3. 芯烨。小票机。

## 使用方式

### 安装

以 飞鹅 为例：

node 环境：

```shell script
npm install @xesam/cloud-node
npm install @xesam/cloud-vender-feie
```

小程序环境：

```shell script
npm install @xesam/cloud-mini
npm install @xesam/cloud-vender-feie
```

代码调用：

```javascript
const CloudCore = require('@xesam/cloud-core');
const NodeCloud = require('@xesam/cloud-node');
const CloudApi = require('@xesam/cloud-vender-feie');
// const CloudApi = require('@xesam/cloud-vender-spyun');
// const CloudApi = require('@xesam/cloud-vender-xpyun');

const cloudApi = new CloudApi(new CloudCore.CloudAuth('xxx id','xxx secret' ), new NodeCloud());
const device = new CloudCore.Device()
                    .sn(authJson.p_sn)
                    .key(authJson.p_key)
                    .name('device name');

cloudApi.addPrinters([device]).then(JSON.stringify).then(console.log).catch(console.error);
```

