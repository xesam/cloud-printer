# 外卖云打印机——芯烨云

## 使用方式

### 安装

node 环境：

```shell script
npm install @xesam/cloud-node
npm install @xesam/cloud-vender-xpyun
```

小程序环境：

```shell script
npm install @xesam/cloud-mini
npm install @xesam/cloud-vender-xpyun
```

代码调用：

```javascript
const CloudCore = require('@xesam/cloud-core');
const NodeCloud = require('@xesam/cloud-node');
const CloudApi = require('@xesam/cloud-vender-xpyun');

const cloudApi = new CloudApi(new CloudCore.CloudAuth('xxx id','xxx secret' ), new NodeCloud());
const device = new CloudCore.Device()
                    .sn(authJson.p_sn)
                    .key(authJson.p_key)
                    .name('device name');

cloudApi.addDevice([device]).then(JSON.stringify).then(console.log).catch(console.error);
```

## ChangeLogs

### 0.0.2
1. 接口命名方式修改；