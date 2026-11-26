const fs = require('node:fs');
const rows = [
['We are more than payments','Nous sommes bien plus que des paiements','نحن أكثر من مجرد مدفوعات'],
['FAMIPAY brings everyday services and local businesses together in one place. Discover food delivery through FA-MINNA Express and explore our vision for simpler payments, transfers and more. We are building for our communities in Chad, one service at a time.','FAMIPAY réunit les services du quotidien et les commerces locaux. Découvrez la livraison de repas avec FA-MINNA Express et notre vision de paiements et transferts simplifiés. Nous construisons pour nos communautés au Tchad, un service à la fois.','يجمع FAMIPAY الخدمات اليومية والأعمال المحلية في مكان واحد. اكتشف توصيل الطعام مع فامينا إكسبريس ورؤيتنا للمدفوعات والتحويلات الأسهل. نبني خدماتنا لمجتمعاتنا في تشاد خطوة بخطوة.'],
['FAMIPAY SERVICES','SERVICES FAMIPAY','خدمات FAMIPAY'],
['Everything you need, closer to you.','Tout ce dont vous avez besoin, plus près de vous.','كل ما تحتاجه أقرب إليك.'],
['Discover the app and the services we are building.','Découvrez l’application et les services que nous développons.','اكتشف التطبيق والخدمات التي نعمل على تطويرها.'],
['Your FAMIPAY account','Votre compte FAMIPAY','حسابك في FAMIPAY'],
['Sign in to explore your FAMIPAY dashboard and services.','Connectez-vous pour découvrir votre tableau de bord et les services FAMIPAY.','سجّل الدخول لاستكشاف لوحة التحكم وخدمات FAMIPAY.'],
['Payments and transfers','Paiements et transferts','المدفوعات والتحويلات'],
['Explore our vision for simple financial services. In development.','Découvrez notre vision de services financiers simples. En développement.','اكتشف رؤيتنا لخدمات مالية بسيطة. قيد التطوير.'],
['Explore transfers','Découvrir les transferts','استكشف التحويلات'],
['Everyday services','Services du quotidien','الخدمات اليومية'],
['Find services for food delivery, airtime and bills in one place. Financial services are in development.','Retrouvez la livraison de repas, les recharges et les factures au même endroit. Les services financiers sont en développement.','اعثر على توصيل الطعام وشحن الرصيد والفواتير في مكان واحد. الخدمات المالية قيد التطوير.'],
['Explore services','Découvrir les services','استكشف الخدمات'],
['Local food delivery','Livraison de repas locale','توصيل الطعام المحلي'],
['Discover local restaurants and follow your orders with FA-MINNA Express.','Découvrez les restaurants locaux et suivez vos commandes avec FA-MINNA Express.','اكتشف المطاعم المحلية وتابع طلباتك مع فامينا إكسبريس.'],
['Help and support','Aide et assistance','المساعدة والدعم'],
['Find answers and get in touch with the FAMIPAY team.','Trouvez des réponses et contactez l’équipe FAMIPAY.','اعثر على إجابات وتواصل مع فريق FAMIPAY.'],
['Previous services','Services précédents','الخدمات السابقة'],['Next services','Services suivants','الخدمات التالية'],
['FAMIPAY home screen','Écran d’accueil FAMIPAY','الشاشة الرئيسية لتطبيق FAMIPAY'],
['FAMIPAY wallet screen','Écran du portefeuille FAMIPAY','شاشة محفظة FAMIPAY'],
['FAMIPAY services screen','Écran des services FAMIPAY','شاشة خدمات FAMIPAY'],
['FAMIPAY orders screen','Écran des commandes FAMIPAY','شاشة طلبات FAMIPAY'],
['FAMIPAY account screen','Écran du compte FAMIPAY','شاشة حساب FAMIPAY']
];
for(const [locale,index] of [['en',0],['fr-TD',1],['ar-TD',2]]) {
  const file = 'assets/locales/'+locale+'.json';
  const data = JSON.parse(fs.readFileSync(file,'utf8'));
  for(const row of rows) data.text[row[0]]=row[index];
  fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
}
