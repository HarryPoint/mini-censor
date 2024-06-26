## 🎇 Description

A sensitive word filtering solution based on the Aho–Corasick algorithm. The Aho–Corasick algorithm is a string search algorithm invented by Alfred V. Aho and Margaret J. Corasick. It is used to match substrings from a finite set of "dictionary" words within an input string. Its difference from ordinary string matching is that it matches against all dictionary strings simultaneously. The algorithm has an amortized time complexity that is nearly linear, approximately equal to the length of the string plus the number of matches.

English | [简体中文](./README.zh-CN.md)

## 💪 Supported Platforms

This plugin supports both Node and browser platforms.

### Performance

Average instantiation time with 20,000 random sensitive words: < 96ms

The test strings contain randomly generated Chinese characters, letters, and numbers.
The following tests were conducted under a tree built with 20,000 random sensitive words, averaging 6 trials per test group:

| No. | String Length | Without Replacing Sensitive Words [replace:false] | With Replacing Sensitive Words |
| :-: | :-----------: | :-----------------------------------------------: | :----------------------------: |
|  1  |     1000      |                     < 1.35ms                      |            < 1.55ms            |
|  2  |     5000      |                     < 3.60ms                      |            < 3.60ms            |
|  3  |    10000      |                     < 8.10ms                      |            < 9.81ms            |
|  4  |    20000      |                     < 15.03ms                     |           < 16.03ms            |
|  5  |    50000      |                     < 20.83ms                     |           < 21.18ms            |
|  6  |    100000     |                     < 29.02ms                     |           < 34.45ms            |

Note that the actual production environment performance will be faster than the test data above.

## 📦 Installation

```javascript
npm i -S mini-censor
```

or

```javascript
yarn add mini-censor
```

## 🎉 Usage

### CommonJS Import

```javascript
const Censor = require("mini-censor").default;
const censor = new Censor(["words"]);
```

### TypeScript / ES Module Import

```typescript
import Censor from "mini-censor";
const censor = new Censor(["words"]);
```

### Methods

#### filter(text, options)

> Types are as follows

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

This method returns the filtered text and the filtered sensitive words.

```typescript
import Censor from "mini-censor";
const censor = new Censor(["sensitive"]);

censor.filter("This is a string with a sensitive word");
/**
 * {
 *   text: "This is a string with a ********* word",
 *   words: ["sensitive"];
 *   pass: false;
 * }
 */
censor.filter("This is a string with a sensitive word", { replaceWidth: "😊" });
/**
 * {
 *   text: "This is a string with a 😊😊😊😊😊😊😊😊😊 word",
 *   words: ["sensitive"];
 *   pass: false;
 * }
 */

censor.filter("This is a string with a sensitive word", { replace: false });
/**
 * {
 *   text:  "This is a string with a sensitive word",
 *   words: ["sensitive"];
 *   pass: false;
 * }
 */
```
