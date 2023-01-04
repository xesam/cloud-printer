# 外卖云打印机 API

云外卖打印机厂商开放平台的聚合支持，已支持的云打印机品牌：

1. 飞鹅。标签机、小票机。
2. 商鹏。小票机。
3. 芯烨。小票机。

Java 版本：[https://github.com/xesam/cloud-printing](https://github.com/xesam/cloud-printing)

## 使用方式

### 安装

由于小程序的网络请求被限制了，因此，需要区分 node 环境与小程序环境。

以 飞鹅 为例：

node 环境：

```shell script
npm install @xesam/cloud-core
npm install @xesam/cloud-node
npm install @xesam/cloud-vendor-feie
```

小程序环境：

```shell script
npm install @xesam/cloud-core
npm install @xesam/cloud-mini
npm install @xesam/cloud-vender-feie
```

代码调用：

```javascript
const CloudCore = require('@xesam/cloud-core');
const NodeCloud = require('@xesam/cloud-node');
const CloudApi = require('@xesam/cloud-vendor-feie');
// const CloudApi = require('@xesam/cloud-vendor-spyun');
// const CloudApi = require('@xesam/cloud-vendor-xpyun');

//创建 CloudApi
const cloudApi = new CloudApi(new CloudCore.CloudAuth('xxx id','xxx secret' ), new NodeCloud());

//创建设备
const device = new CloudCore.Device()
                    .sn(authJson.p_sn)
                    .key(authJson.p_key)
                    .name('device name');
//添加设备
cloudApi.addDevice([device]).then(JSON.stringify).then(console.log).catch(console.error);
```

完整 api 参见各个 vendor 实现的源码，搜索 vendor.js 即可找到。

## ChangeLogs

### 0.0.3
1. 接口bugfix；

### 0.0.2
1. 接口命名方式修改；
