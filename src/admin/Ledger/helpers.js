export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
const urdu = 'صفر ایک دو تین چار پانچ چھ سات آٹھ نو دس گیارہ بارہ تیرہ چودہ پندرہ سولہ سترہ اٹھارہ انیس بیس اکیس بائیس تئیس چوبیس پچیس چھبیس ستائیس اٹھائیس انتیس تیس اکتیس بتیس تینتیس چونتیس پینتیس چھتیس سینتیس اڑتیس انتالیس چالیس اکتالیس بیالیس تینتالیس چوالیس پینتالیس چھیالیس سینتالیس اڑتالیس انچاس پچاس اکیاون باون ترپن چون چوّن چھپن ستاون اٹھاون انسٹھ ساٹھ اکسٹھ باسٹھ تریسٹھ چونسٹھ پینسٹھ چھیاسٹھ سڑسٹھ اڑسٹھ انہتر ستر اکہتر بہتر تہتر چوہتر پچھتر چھہتر ستتر اٹھہتر اناسی اسی اکیاسی بیاسی تراسی چوراسی پچاسی چھیاسی ستاسی اٹھاسی نواسی نوے اکانوے بانوے ترانوے چورانوے پچانوے چھیانوے ستانوے اٹھانوے ننانوے'.split(' ');
const words = Object.fromEntries(urdu.map((word, i) => [word, i]));
Object.assign(words, {zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90, 'چون':54, 'چوّن':54, 'پچپن':55, 'ڈھائی':2.5, 'ڈیڑھ':1.5});
const scales = {hundred:100,thousand:1000,lakh:100000,million:1000000,'سو':100,'ہزار':1000,'لاکھ':100000,'کروڑ':10000000};
export function speechAmount(text) {
  // Urdu commands such as “کر دو” contain “دو” (also the number two).
  // Remove command phrases before looking for amounts.
  const normalized = text.toLowerCase()
    .replace(/[۰-۹٠-٩]/g, c => '۰۱۲۳۴۵۶۷۸۹'.includes(c) ? '۰۱۲۳۴۵۶۷۸۹'.indexOf(c) : '٠١٢٣٤٥٦٧٨٩'.indexOf(c))
    .replace(/کر\s+(?:دو|دیں|دینا|دیں۔)/g, ' ')
    .replace(/([0-9])[,،٬](?=[0-9]{3}(?:[^0-9]|$))/g, '$1')
    .replace(/٫/g, '.').replace(/[۔،؟!]/g, ' ');
  // Tokenize digits separately: punctuation and attached “روپے” must not hide amounts.
  const tokens = normalized.match(/[0-9]+(?:\.[0-9]+)?|[a-z]+|[\u0600-\u06ff]+/g) || [];
  const groups = []; let current = 0, total = 0, active = false, numeric = false;
  const finish = currency => {
    if (active) groups.push({ value: total + current, numeric, currency });
    current = 0; total = 0; active = false; numeric = false;
  };
  for (const token of tokens) {
    if (/^[0-9]+(?:\.[0-9]+)?$/.test(token)) { current += Number(token); active = true; numeric = true; }
    else if (Object.hasOwn(words, token)) { current += words[token]; active = true; }
    else if (scales[token]) {
      const scale = scales[token];
      if (scale === 100) current = (current || 1) * scale;
      else { total += (current || 1) * scale; current = 0; }
      active = true;
    }
    else if ((token === 'and' || token === 'اور') && active) continue;
    else finish(/^(?:روپے|روپیہ|روپوں|روپے۔|rupees?|rs|pkr|روپے،)$/.test(token));
  }
  finish(false);
  const currency = groups.filter(group => group.currency);
  const digits = groups.filter(group => group.numeric);
  const candidates = currency.length ? currency : digits.length ? digits : groups;
  return candidates.length === 1 && candidates[0].value > 0 ? String(candidates[0].value) : '';
}
export function periodRange(period, anchor) {
  const date = new Date(anchor + 'T12:00:00');
  if (period === 'month') return [localDate(new Date(date.getFullYear(), date.getMonth(), 1)), localDate(new Date(date.getFullYear(), date.getMonth()+1, 0))];
  const start = new Date(date); start.setDate(start.getDate() - ((start.getDay()+6)%7));
  const end = new Date(start); end.setDate(end.getDate()+6);
  return [localDate(start), localDate(end)];
}
export function totalsBy(entries, key) {
  const map = new Map();
  entries.forEach(entry => { const name = entry[key]?.name || 'دیگر / Other'; map.set(name, (map.get(name) || 0) + entry.amount); });
  return [...map].sort((a,b) => b[1]-a[1]);
}

