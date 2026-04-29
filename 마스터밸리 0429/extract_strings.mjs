// ========================================
// extract_strings.mjs
// JS i18n 모듈을 import해서 중첩 객체를 path:value 형태로 평탄화
//
// usage: node extract_strings.mjs <lang> <filename>
//   ex:  node extract_strings.mjs en masters.js
//
// 출력: stdout에 JSON ({ "default.mastersBasicInfo.vangogh.loading.name": "..." })
// 작업 디렉터리는 i18n 폴더여야 함 (./en/masters.js 식으로 접근)
// ========================================

import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [, , lang, filename] = process.argv;
if (!lang || !filename) {
  console.error('Usage: node extract_strings.mjs <lang> <filename>');
  process.exit(1);
}

const filepath = path.resolve(`./${lang}/${filename}`);
const url = pathToFileURL(filepath).href;

let mod;
try {
  mod = await import(url);
} catch (err) {
  console.error(`Import failed: ${filepath}`);
  console.error(err.message);
  process.exit(2);
}

// 모든 export된 객체를 재귀적으로 순회하며 path:value로 평탄화
const result = {};

function flatten(obj, prefix) {
  if (obj === null || obj === undefined) return;

  if (typeof obj === 'string') {
    // 빈 문자열, 공백만 있는 문자열 제외
    if (obj.trim().length > 1) {
      result[prefix] = obj;
    }
    return;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, i) => flatten(item, `${prefix}[${i}]`));
    return;
  }

  if (typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      flatten(v, prefix ? `${prefix}.${k}` : k);
    }
  }
  // number, boolean, function 등은 무시
}

for (const [exportName, exportValue] of Object.entries(mod)) {
  flatten(exportValue, exportName);
}

console.log(JSON.stringify(result, null, 2));
