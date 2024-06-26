# mini-censor

[![NPM][npm-version-image]][npm-version-url] 
[![gzip-size][gzip-size]][gzip-url]

## 🎇 说明

基于 Aho–Corasick 算法实现的敏感词过滤方案，Aho–Corasick 算法是由 Alfred V. Aho 和 Margaret J.Corasick 发明的字符串搜索算法，用于在输入的一串字符串中匹配有限组“字典”中的子串。它与普通字符串匹配的不同点在于同时与所有字典串进行匹配。算法均摊情况下具有近似于线性的时间复杂度，约为字符串的长度加所有匹配的数量。

[English](./README.md) | 简体中文

## 💪 支持平台

本插件支持 Node 及浏览器平台

### 性能

使用 20000 个随机敏感词实例化的平均时间：< 96ms

测试字符串包含随机生成的汉字、字母、数字。
以下测试均在 20000 个随机敏感词构建的树下进行测试，每组测试 6 次取平均值：

| 编号 | 字符串长度 | 不替换敏感词[replace:false] | 替换敏感词 |
| :--: | :--------: | :-------------------------: | :--------: |
|  1   |    1000    |          < 1.35ms           |  < 1.55ms  |
|  2   |    5000    |          < 3.60ms           |  < 3.60ms  |
|  3   |   10000    |          < 8.10ms           |  < 9.81ms  |
|  4   |   20000    |          < 15.03ms          | < 16.03ms  |
|  5   |   50000    |          < 20.83ms          | < 21.18ms  |
|  6   |   100000   |          < 29.02ms          | < 34.45ms  |

需要注意的是，实际生产环境运行速度会比上面测试数据更快。

## 📦 安装

```javascript
npm i -S mini-censor
```

或

```javascript
yarn add mini-censor
```

## 🎉 使用

### CommonJS 引用

```javascript
const Censor = require("mini-censor").default;
const censor = new Censor(["敏感词数组"]);
```

### TypeScript / ES Module 引用

```typescript
import Censor from "mini-censor";
const censor = new Censor(["敏感词数组"]);
```

### 方法

#### filter(text, options)

> 类型如下

```typescript
  filter(text: string, options?: {
      replace: boolean;
      replaceWidth?: string;
  }): {
      text: string;
      words: string[];
      pass: boolean;
  };
```

该方法将返回过滤文本和被过滤的敏感词。

```typescript
import Censor from "mini-censor";
const censor = new Censor(["敏感词", "数组"]);

censor.filter("这是一个敏感词字符串");
/**
 * {
 *   text: "这是一个***字符串",
 *   words: ["敏感词"];
 *   pass: false;
 * }
 */
censor.filter("这是一个敏感词字符串", { replaceWidth: "😊" });
/**
 * {
 *   text: "这是一个😊😊😊字符串",
 *   words: ["敏感词"];
 *   pass: false;
 * }
 */

censor.filter("这是一个敏感词字符串", { replace: false });
/**
 * {
 *   text:  "这是一个敏感词字符串",
 *   words: ["敏感词"];
 *   pass: false;
 * }
 */
```

## LICENSE

MIT

[npm-version-image]: https://img.shields.io/npm/v/mini-censor.svg?style=flat-square
[npm-version-url]: https://www.npmjs.com/package/mini-censor
[gzip-size]: https://img.badgesize.io/https://unpkg.com/mini-censor/dist/index.js?compression=gzip&style=flat-square
[gzip-url]: https://unpkg.com/mini-censor/dist/index.js