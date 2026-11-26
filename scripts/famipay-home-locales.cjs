// Maintains the landing page phrases in each existing locale catalog.
const fs = require('node:fs');
const entries = [
 ['More for your','Plus pour votre','المزيد من أجل'],['everyday.','quotidien.','حياتك اليومية.'],
 ['Discover local food today and explore the services we’re building to make everyday life simpler in Chad.','Découvrez les restaurants locaux et les services que nous développons pour simplifier le quotidien au Tchad.','اكتشف الطعام المحلي والخدمات التي نطورها لتسهيل الحياة اليومية في تشاد.'],
 ['Order food','Commander un repas','اطلب الطعام'],['Explore FAMIPAY','Découvrir FAMIPAY','استكشف FAMIPAY'],['Made for our communities in Chad.','Conçu pour nos communautés au Tchad.','صُمم لمجتمعاتنا في تشاد.'],
 ['Local favorites','Les favoris locaux','المفضلات المحلية'],['Close to home','Près de chez vous','بالقرب منك'],['Made for you','Conçu pour vous','مصمم لك'],['Everyday convenience','La simplicité au quotidien','سهولة كل يوم'],
 ['Everyday services,','Les services du quotidien,','خدمات يومية،'],['closer to you.','plus proches de vous.','أقرب إليك.'],
 ['From local meals to the future of everyday payments, explore what’s available and what we’re building.','Des repas locaux aux paiements du quotidien, découvrez les services disponibles et ceux en préparation.','من الوجبات المحلية إلى المدفوعات اليومية، اكتشف المتاح وما نعمل على تطويره.'],
 ['EXPLORE','DÉCOUVRIR','استكشف'],['IN DEVELOPMENT','EN DÉVELOPPEMENT','قيد التطوير'],['COMING SOON','BIENTÔT DISPONIBLE','قريباً'],['Food delivery','Livraison de repas','توصيل الطعام'],['Discover restaurants, order your favorites and follow your delivery.','Découvrez les restaurants, commandez vos plats préférés et suivez votre livraison.','اكتشف المطاعم واطلب وجباتك المفضلة وتابع توصيلها.'],['Explore restaurants','Découvrir les restaurants','استكشف المطاعم'],
 ['Explore our vision for transfers, bill payments and other everyday financial services.','Découvrez notre vision des transferts, du paiement des factures et des services financiers du quotidien.','اكتشف رؤيتنا للتحويلات ودفع الفواتير والخدمات المالية اليومية.'],['Local marketplace','Marché local','السوق المحلي'],['Fresh produce and everyday essentials from local growers and shops.','Des produits frais et essentiels proposés par les producteurs et commerces locaux.','منتجات طازجة واحتياجات يومية من المزارعين والمتاجر المحلية.'],['Discover more','En savoir plus','اكتشف المزيد']
];
for(const [file,index] of [['en',0],['fr-TD',1],['ar-TD',2]]) {
 const path=`assets/locales/${file}.json`;
 const data=JSON.parse(fs.readFileSync(path,'utf8'));
 data.text ||= {};
 for(const entry of entries)data.text[entry[0]]=entry[index];
 fs.writeFileSync(path,JSON.stringify(data,null,2)+'\n');
}
