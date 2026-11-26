const fs=require('node:fs');
for(const file of fs.readdirSync('.').filter(name=>name.endsWith('.html')&&!name.startsWith('famipay-'))){
 let html=fs.readFileSync(file,'utf8');
 if(!html.includes('assets/css/famipay-pages.css')) html=html.replace('</head>','<link rel="stylesheet" href="assets/css/famipay-pages.css?v=1">\n</head>');
 html=html.replaceAll('index.html#services','services.html');
 fs.writeFileSync(file,html);
}
