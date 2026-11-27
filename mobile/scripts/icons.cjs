const fs=require('node:fs');
const path=require('node:path');
const sharp=require('sharp');
const base=path.resolve(__dirname,'../android/app/src/main/res');
const svg=fs.readFileSync(path.resolve(__dirname,'../../assets/branding/famipay-mark.svg'));
(async()=>{
 const splashMark=await sharp(svg).resize(192,192,{fit:'contain',background:'#00000000'}).png().toBuffer();
 const splashFolder=path.join(base,'drawable-nodpi');fs.mkdirSync(splashFolder,{recursive:true});
 await sharp({create:{width:288,height:288,channels:4,background:'#00000000'}}).composite([{input:splashMark,gravity:'centre'}]).png().toFile(path.join(splashFolder,'famipay_splash_mark.png'));
 for(const [density,size] of [['mdpi',48],['hdpi',72],['xhdpi',96],['xxhdpi',144],['xxxhdpi',192]]){
   const folder=path.join(base,'mipmap-'+density);fs.mkdirSync(folder,{recursive:true});
   for(const name of ['ic_launcher.png','ic_launcher_round.png','ic_launcher_foreground.png']){
     const full=name.includes('foreground')?Math.round(size*2.25):size;
     const mark=await sharp(svg).resize(Math.round(full*.65),Math.round(full*.65)).png().toBuffer();
     await sharp({create:{width:full,height:full,channels:4,background:'#005a46'}}).composite([{input:mark,gravity:'centre'}]).png().toFile(path.join(folder,name));
   }
 }
 for(const folder of fs.readdirSync(base).filter(name=>name.startsWith('drawable'))){
   const file=path.join(base,folder,'splash.png');if(!fs.existsSync(file))continue;
   const {width,height}=await sharp(file).metadata();
   const icon=await sharp(svg).resize(Math.round(Math.min(width,height)*.32)).png().toBuffer();
   await sharp({create:{width,height,channels:4,background:'#005a46'}}).composite([{input:icon,gravity:'centre'}]).png().toFile(file+'.tmp.png');
   fs.renameSync(file+'.tmp.png',file);
 }
})().catch(error=>{console.error(error);process.exitCode=1;});
