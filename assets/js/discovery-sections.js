(() => {
  const questions = [
    ['Which restaurants deliver to my area?', 'Choose your delivery point on the homepage, then browse the Abéché restaurant directory. Directory listings are not all delivery partners: look for Ordering available and check the delivery details at checkout.'],
    ['How do I place an order?', 'Choose a restaurant with ordering available, select dishes from its menu and add them to your cart. Sign in, select your delivery address and review your total before confirming.'],
    ['Can I schedule an order for later delivery?', 'Scheduled delivery is not available yet. Check a restaurant’s current availability before placing an order.'],
    ['What payment methods are accepted?', 'Cash on delivery is the payment method currently supported by the platform. Online and mobile-money payments are not enabled yet. Confirm the payment details shown at checkout.'],
    ['Is there a delivery fee?', 'Delivery charges depend on your address and the configured delivery area. Review the fee and final total at checkout before placing an order.'],
    ['How can I follow my order?', 'Sign in and open Orders to view your order status. For an active delivery, use its tracking page. Rider location appears only when location updates are available.'],
    ['Can I order agricultural products or shop essentials?', 'These services are in preparation. Food ordering becomes available as participating restaurants add verified menus. Agricultural products and the online shop will open when sellers are ready.'],
    ['How can my business become a partner?', 'Visit Contact and tell us about your restaurant, farm or shop, your location and the products you offer. Partnership and ordering need to be confirmed before a business can accept orders.']
  ];
  document.querySelectorAll('[data-famina-faq]').forEach((root,index) => {
    const count = Number(root.dataset.limit) || questions.length;
    questions.slice(0,count).forEach(([question,answer]) => {
      const detail = document.createElement('details');
      detail.name = 'famina-faq-'+index;
      const summary = document.createElement('summary');
      summary.textContent = question;
      const body = document.createElement('p');
      body.textContent = answer;
      detail.append(summary,body);
      root.append(detail);
    });
  });
  const grid = document.getElementById('popular-cuisine-grid');
  if (!grid) return;
  const local = 'restaurant.html?cuisine='+encodeURIComponent('Local cuisine');
  const cuisines = [
    ['Boule & okra sauce','chad-boule.jpg',local,'Boule with okra sauce, photographed in Chad'],
    ['Kissar','chad-kissar.jpg',local,'Chadian millet flatbreads with sauce'],
    ['Rice & chicken','chad-rice-chicken.jpg',local,'Rice with grilled chicken and soup in Chad'],
    ['Couscous & charmout','chad-couscous.jpg',local,'Couscous served with charmout sauce'],
    ['Pizza','pazza.jpg','menu.html?category=1','Freshly baked pizza'],
    ['Burgers','burger.jpg','menu.html?category=2','A freshly prepared burger'],
    ['Pasta','Spaghetti Carbonara.jpg','menu.html?category=3','Spaghetti with a creamy sauce'],
    ['Salads','salad.jpg','menu.html?category=4','A fresh mixed salad'],
    ['Desserts','dessert.jpg','menu.html?category=5','A plated dessert'],
    ['Drinks','beverage.jpg','menu.html?category=6','Refreshing drinks']
  ];
  cuisines.forEach(([name,image,href,alt]) => {
    const link = document.createElement('a');
    link.className = 'popular-cuisine';
    link.href = href;
    const title = document.createElement('h3'); title.textContent = name;
    const media = document.createElement('span'); media.className = 'popular-cuisine-image';
    const photo = document.createElement('img');
    photo.src = 'assets/images/'+image; photo.alt = alt; photo.loading = 'lazy'; photo.decoding = 'async'; photo.width = 240; photo.height = 240;
    media.append(photo); link.append(title,media); grid.append(link);
  });
})();
