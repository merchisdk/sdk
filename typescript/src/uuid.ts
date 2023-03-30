import { isNode, isDeno } from 'browser-or-node';

export function generateUUID(): string {
  let d: number;
  if (isNode || isDeno) {
    d = Date.now();
  } else {
    d = Date.now() + performance.now();
  }

  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  uuid = uuid.replace(/[xy]/g, function (c): string {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
  return uuid;
}
