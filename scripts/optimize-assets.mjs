import {readdir,mkdir,rename,stat} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const moduleName=process.env.SHARP_MODULE_PATH||'sharp';
const sharpModule=await import(moduleName.startsWith('.')||path.isAbsolute(moduleName)?pathToFileURL(path.resolve(moduleName)).href:moduleName);
const sharp=sharpModule.default;
const artDir=path.resolve('public/art');
const sourceDir=path.resolve('artifacts/source-art');
await mkdir(sourceDir,{recursive:true});

const images=(await readdir(artDir)).filter(file=>file.toLowerCase().endsWith('.png'));
let before=0,after=0;
for(const file of images){
  const source=path.join(artDir,file),output=path.join(artDir,file.replace(/\.png$/i,'.webp'));
  before+=(await stat(source)).size;
  await sharp(source).webp({quality:82,alphaQuality:90,effort:6,smartSubsample:true}).toFile(output);
  after+=(await stat(output)).size;
}

for(const file of images)await rename(path.join(artDir,file),path.join(sourceDir,file));
console.log(`Optimized ${images.length} images: ${(before/1048576).toFixed(1)} MB -> ${(after/1048576).toFixed(1)} MB`);
