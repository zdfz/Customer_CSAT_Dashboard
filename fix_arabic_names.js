// Script to fix Arabic company names in the Customer Status section
// This addresses the issue where pending customers show English names instead of Arabic

const fs = require('fs');

// Read the current file
let content = fs.readFileSync('index.html', 'utf8');

// Define the mapping of English to Arabic company names
const nameMapping = {
    'Squat Wolf': 'سكوات وولف',
    'Al Rajhi First Store': 'متجر الراجحي الأول',
    'Al Yasra/Ontime': 'اليسرا/أون تايم',
    'Aldo': 'ألدو',
    'Amazon': 'أمازون',
    'Biggbrands': 'بيج براندز',
    'Brands for Less': 'براندز فور ليس',
    'Call it Spring': 'كول إت سبرينغ',
    'Claseera': 'كلاسيرا',
    'Decathlon': 'ديكاثلون',
    'DHL': 'دي إتش إل',
    'Flormar': 'فلورمار',
    'Golden Rose': 'جولدن روز',
    'Homzmart': 'هومزمارت',
    'Hopa Design': 'هوبا ديزاين',
    'Kaafmeem': 'كافميم',
    'Kabrita': 'كابريتا',
    'La Senza': 'لا سينزا',
    'Laveienrose': 'لافين روز',
    'Laverne UAE': 'لافيرن الإمارات',
    'LG': 'إل جي',
    'Lipsy': 'ليبسي',
    'Noon RTV': 'نون آر تي في',
    'Ozen': 'أوزين',
    'Rasees': 'رسيس',
    'Red Cactus/Asteri': 'ريد كاكتوس/أستيري',
    'SACO': 'ساكو',
    'Shiaka Store': 'متجر شياكة',
    'SL Global': 'إس إل جلوبال',
    'TLC': 'تي إل سي',
    'Torod': 'تورود',
    'Al Dakhel Oud': 'الدخيل للعود',
    'Al Esayi Electronics': 'العيسائي للإلكترونيات',
    'Her KSA': 'هير السعودية',
    'Blue Arch': 'بلو آرش',
    'Al Ghanem Electronics': 'الغانم للإلكترونيات',
    'Tahour Store': 'متجر طهور',
    'Sandouq Albadaee': 'صندوق البدائع',
    'Reefi': 'ريفي',
    'Balsam': 'بلسم',
    'Eyen Optics': 'عين البصريات',
    'Trendyol': 'تريندي يول',
    'Makan': 'مكان',
    'Afaq Al Hasoob': 'آفاق الحاسوب',
    'Oud Al Mazim': 'عود المعازيم',
    'Fast Track': 'فاست تراك',
    'Alsaad home': 'السعد هوم',
    'Packman': 'باكمان',
    'Wing Star': 'وينغ ستار'
};

// Replace each English name with its Arabic equivalent
for (const [english, arabic] of Object.entries(nameMapping)) {
    const pattern = new RegExp(`{ name: '${english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g');
    content = content.replace(pattern, `{ name: '${arabic}'`);
}

// Write the updated content back to the file
fs.writeFileSync('index.html', content, 'utf8');

console.log('Successfully updated company names to Arabic in index.html');
console.log('Updated names:', Object.keys(nameMapping).length);