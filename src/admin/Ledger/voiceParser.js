import { localDate, speechAmount } from './helpers.js';

// Existing English names can also have a manually supplied Urdu voiceName.
const commonNames = {sajid:['ساجد'],sana:['ثنا','ثناء','سنا','سناء'],sarah:['سارہ','سارا'],sara:['سارہ','سارا'],ali:['علی'],ahmed:['احمد'],ahmad:['احمد'],asad:['اسد'],usman:['عثمان'],umar:['عمر'],hassan:['حسن'],hussain:['حسین'],imran:['عمران'],bilal:['بلال'],hamza:['حمزہ']};
const normalize = value => value.toLowerCase().normalize('NFKC').replace(/[\u064b-\u065f\u0670ـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/ھ/g,'ہ').replace(/[^a-z0-9\u0621-\u063a\u0641-\u064a\u066e-\u06d3]+/g,' ').trim().replace(/\s+/g,' ');
function variants(item) {
  let aliases = [item.name, item.voiceName || ''];
  let combinations = [''];
  for (const word of item.name.toLowerCase().split(/\s+/)) {
    const options = commonNames[word] || [word];
    combinations = combinations.flatMap(prefix=>options.map(option=>(prefix+' '+option).trim())).slice(0,16);
  }
  return [...new Set([...aliases,...combinations].map(normalize).filter(Boolean))];
}
function matches(text, items) {
  const normalized = normalize(text);
  return items.flatMap(item=>variants(item).flatMap(alias=>{
    const result=[];let from=0,index;
    while((index=normalized.indexOf(alias,from))!==-1){
      const end=index+alias.length;
      if((index===0||normalized[index-1]===' ')&&(end===normalized.length||normalized[end]===' ')) result.push({item,index,end});
      from=end;
    }
    return result;
  })).sort((a,b)=>a.index-b.index || (b.end-b.index)-(a.end-a.index));
}
const types = [
 ['labour',/مزدوری|مزدور[ی]?|اجرت|دیہاڑی|تنخواہ|labor|labour|wages?|mazdoori|mazduri|dehari|salary/giu],
 ['fuel',/پیٹرول|پٹرول|ڈیزل|petrol|diesel|fuel/giu],
 ['food',/کھانا|کھانے|کھان[اے]|ناشتہ|روٹی|چائے|food|lunch|dinner|breakfast|khana|khanay|chai/giu],
 ['material',/سامان|سیمنٹ|ریت|بجری|پینٹ|رنگ|اینٹ|material|cement|paint|sand|bajri|samaan/giu],
 ['transport',/کرایہ|ٹرانسپورٹ|گاڑی|رکشہ|transport|fare|rickshaw|kiraya/giu],
];
const typeNames={labour:'مزدوری',fuel:'پیٹرول / ڈیزل',food:'کھانا',material:'سامان',transport:'ٹرانسپورٹ',other:'دیگر خرچ'};
function displayName(item) { return item.voiceName || variants(item).find(alias=>/[\u0600-\u06ff]/.test(alias)) || item.name; }
export function urduSummary(entry, names) {
  const site=names.sites.find(item=>item._id===entry.site);
  const labour=names.labours.find(item=>item._id===entry.labour);
  const siteText=site ? `${displayName(site)} کی سائٹ پر` : 'سائٹ منتخب کریں';
  const person=entry.category==='labour' && labour ? `، ${displayName(labour)} کو` : '';
  return `${siteText}${person} ${entry.amount || '…'} روپے ${typeNames[entry.category] || typeNames.other}۔`;
}
export function parseExpenses(transcript, names, defaults = {}) {
  let text=transcript.toLowerCase().replace(/[۰-۹٠-٩]/g,c=>'۰۱۲۳۴۵۶۷۸۹'.includes(c)?'۰۱۲۳۴۵۶۷۸۹'.indexOf(c):'٠١٢٣٤٥٦٧٨٩'.indexOf(c))
    .replace(/([0-9])[,،٬](?=[0-9]{3}(?:[^0-9]|$))/g,'$1').replace(/٫/g,'.')
    .replace(/کر\s+(?:دو|دیں|دینا)|دے\s+دو|دے\s+دیں|دے\s+دینا/g,match=>' '.repeat(match.length));
  // Names such as “Site 2” must not become an expense amount.
  let masked=text;
  for(const item of [...names.sites,...names.labours]) {
    for(const alias of [item.name,item.voiceName].filter(Boolean)) {
      const escaped=alias.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      masked=masked.replace(new RegExp(escaped,'gu'),match=>' '.repeat(match.length));
    }
  }
  const tokens=[...masked.matchAll(/[0-9]+(?:\.[0-9]+)?|[a-z]+|[\u0621-\u063a\u0641-\u064a\u066e-\u06d3\u064b-\u065f]+/gu)];
  const amounts=[];let start=-1,end=-1,parts=[];
  const finish=()=>{
    if(parts.length){const amount=speechAmount(parts.join(' '));if(amount)amounts.push({start,end,amount});}
    start=-1;end=-1;parts=[];
  };
  for(const token of tokens){
    const word=token[0];
    const isAmount=Boolean(speechAmount(word)) || /^(?:صفر|zero|hundred|thousand|lakh|million|سو|ہزار|لاکھ|کروڑ)$/.test(word);
    const separator=start>=0 ? masked.slice(end,token.index) : '';
    // Only contiguous number words belong to the same amount.
    if(isAmount){if(start>=0 && /[,،۔;\n]/.test(separator))finish();if(start<0)start=token.index;parts.push(word);end=token.index+word.length;}
    else if((word==='and'||word==='اور')&&parts.length){parts.push(word);end=token.index+word.length;}
    else finish();
  }
  finish();
  const categories=types.flatMap(([category,pattern])=>[...text.matchAll(pattern)].map(match=>({category,start:match.index,end:match.index+match[0].length}))).sort((a,b)=>a.start-b.start);
  // Match ordered expense words to ordered amounts; when counts differ use
  // the nearest unused word within the neighbouring amount boundaries.
  const used=new Set();
  const allSites=[...new Map(matches(text,names.sites).map(match=>[match.item._id,match.item])).values()];
  const allLabours=[...new Map(matches(text,names.labours).map(match=>[match.item._id,match.item])).values()];
  let siteContext=allSites.length===1?allSites[0]._id:(defaults.site||'');
  const date=new Date((defaults.date||localDate())+'T12:00:00');
  if(/گزشتہ روز|کل|yesterday|\bkal\b/iu.test(text)) date.setDate(date.getDate()-1);
  return amounts.map((amount,index)=>{
    let category;
    if(categories.length===amounts.length){category=categories[index].category;}
    else {
      const available=categories.map((cat,i)=>({...cat,i})).filter(cat=>!used.has(cat.i)&&cat.start>=(amounts[index-1]?.end||0)&&cat.end<=(amounts[index+1]?.start||text.length));
      available.sort((a,b)=>Math.min(Math.abs(a.start-amount.end),Math.abs(amount.start-a.end))-Math.min(Math.abs(b.start-amount.end),Math.abs(amount.start-b.end)));
      if(available[0]){category=available[0].category;used.add(available[0].i);}
    }
    const segmentStart=amounts[index-1]?.end||0;
    const segmentEnd=amounts[index+1]?.start||text.length;
    const segment=text.slice(segmentStart,segmentEnd);
    const sitesHere=[...new Map(matches(segment,names.sites).map(match=>[match.item._id,match.item])).values()];
    if(sitesHere.length===1)siteContext=sitesHere[0]._id;
    const laboursHere=[...new Map(matches(segment,names.labours).map(match=>[match.item._id,match.item])).values()];
    category=category||(allLabours.length===1?'labour':'other');
    const labour=category==='labour'?(laboursHere.length===1?laboursHere[0]._id:allLabours.length===1?allLabours[0]._id:defaults.labour||''):'';
    const entry={site:siteContext,labour,category,date:localDate(date),amount:amount.amount,note:''};
    entry.note=urduSummary(entry,names);
    return entry;
  });
}
