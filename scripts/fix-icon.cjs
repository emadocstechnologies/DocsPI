// Generate a valid .ico file from a PNG (Windows RC 3.00+ format)
const fs = require('fs');
const path = require('path');

const pngPath = path.join(__dirname, '..', 'src-tauri', 'icons', 'icon.png');
const icoPath = path.join(__dirname, '..', 'src-tauri', 'icons', 'icon.ico');

const pngData = fs.readFileSync(pngPath);

// .ico header: reserved(2) + type=1(2) + count(2)
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);      // reserved
header.writeUInt16LE(1, 2);      // ICO type = 1
header.writeUInt16LE(1, 4);      // 1 image

// Entry: w, h, colors, reserved, planes, bpp, size, offset
const entry = Buffer.alloc(16);
entry.writeUInt8(0, 0);    // width (0=256)
entry.writeUInt8(0, 1);    // height (0=256)
entry.writeUInt8(0, 2);    // colors
entry.writeUInt8(0, 3);    // reserved
entry.writeUInt16LE(1, 4); // color planes
entry.writeUInt16LE(32, 6); // bpp
entry.writeUInt32LE(pngData.length, 8); // size
entry.writeUInt32LE(22, 12); // offset (6 + 16 = 22)

const ico = Buffer.concat([header, entry, pngData]);
fs.writeFileSync(icoPath, ico);
console.log(`✓ icon.ico generated (${ico.length} bytes) from icon.png (${pngData.length} bytes)`);
