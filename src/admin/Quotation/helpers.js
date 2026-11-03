import { localDate, speechAmount } from '../Ledger/helpers.js';
export const CONTACT = 'M.Jawaid : 03272054430';
export const defaultQuotation = () => ({
 project:'SANA SARAH',client:'Irfan Shah',date:localDate(),rate:'150',area:'8000',received:'100000',receivedDate:localDate(),
 company:'PREMIUM LOOK TEXTURE',subtitle:'TEXTURE DESIGN AND JOB',contact:CONTACT,
 scope:'Texture and Paint Finish\nLabor and skilled work',
 terms:'50% Advance Payment before starting the project.\n20% Payment after completion of first stage work.\n20% Payment after further work progress.\nFinal 10% Payment after project completion and final checking.',
 job:'TEXTURE JOB', greeting:'Thank you for your esteemed inquiry. We are pleased to offer our lowest as follows.',
});
export function quotationTotal(rate,area) {
 const r=Number(rate),a=Number(area);
 if(!Number.isFinite(r)||!Number.isFinite(a)||r<=0||a<=0||r>1e7||a>1e9||r*a>1e12)return null;
 return Math.round(r*a*100)/100;
}
export function dateLabel(value) {
 return /^\d{4}-\d{2}-\d{2}$/.test(value)?value.split('-').reverse().join('-'):'';
}
function parseDate(value) {
 const digits=value.replace(/[۰-۹٠-٩]/g,c=>'۰۱۲۳۴۵۶۷۸۹'.includes(c)?'۰۱۲۳۴۵۶۷۸۹'.indexOf(c):'٠١٢٣٤٥٦٧٨٩'.indexOf(c));
 let match=digits.match(/(\d{4})[-/ ](\d{1,2})[-/ ](\d{1,2})/),parts;
 if(match)parts=[match[1],match[2],match[3]];
 else{match=digits.match(/(\d{1,2})[-/ ](\d{1,2})[-/ ](\d{4})/);if(match)parts=[match[3],match[2],match[1]];}
 if(!parts)return '';
 const formatted=`${parts[0]}-${parts[1].padStart(2,'0')}-${parts[2].padStart(2,'0')}`;
 const date=new Date(formatted+'T00:00:00Z');return !Number.isNaN(date.getTime())&&date.toISOString().slice(0,10)===formatted?formatted:'';
}
const fields=[
 ['receivedDate',/received\s+date|payment\s+date|وصولی\s+کی\s+تاریخ|ادائیگی\s+کی\s+تاریخ/giu],
 ['received',/payment\s+received|received\s+amount|advance\s+payment|received|advance|ایڈوانس|وصول\s+شدہ\s+رقم|وصولی|وصول\s+ہوئے/giu],
 ['project',/project\s+name|project|site\s+name|site|پروجیکٹ\s+کا\s+نام|پروجیکٹ\s+نام|پروجیکٹ|سائٹ\s+کا\s+نام|سائٹ|منصوبہ/giu],
 ['client',/client\s+name|customer\s+name|client|customer|کلائنٹ\s+کا\s+نام|کلائنٹ|کسٹمر\s+کا\s+نام|کسٹمر|گاہک/giu],
 ['rate',/rate|ریٹ|فی\s+مربع\s+فٹ/giu],
 ['area',/total\s+area|area|کل\s+رقبہ|ایریا|رقبہ/giu],
 ['date',/quotation\s+date|date|تاریخ/giu],
];
export function parseQuotationSpeech(text) {
 const matches=[];
 for(const [key,pattern] of fields){for(const match of text.matchAll(pattern)){const start=match.index,end=start+match[0].length;if(/^[a-z]/i.test(match[0])&&(/[a-z]/i.test(text[start-1]||'')||/[a-z]/i.test(text[end]||'')))continue;if(!matches.some(item=>start<item.end&&end>item.start))matches.push({key,start,end});}}
 matches.sort((a,b)=>a.start-b.start);
 const changes={},warnings=[];
 matches.forEach((match,index)=>{
  let value=text.slice(match.end,matches[index+1]?.start||text.length).replace(/^[\s:،,=-]+|[\s،,۔;]+$/g,'').replace(/^(?:ہے\s+|is\s+|کا\s+نام\s+|نام\s+)/iu,'').replace(/\s+(?:ہے|ہوگا|رکھو|کر\s+دو|اور|and)$/iu,'').trim();
  if(['rate','area','received'].includes(match.key)){
   // Decimal and Urdu/English number words use the same amount parser as the ledger.
   const number=speechAmount(value);
   if(number)changes[match.key]=number;
   else if(match.key==='received'&&/صفر|نہیں|zero|none|^0(?:\D|$)/iu.test(value))changes.received='0';
   else{changes[match.key]='';warnings.push(match.key);}
  }else if(match.key==='date'||match.key==='receivedDate'){
   const date=/آج|today/iu.test(value)?localDate():parseDate(value);
   if(date)changes[match.key]=date;else warnings.push(match.key);
  }else if(value){changes[match.key]=value.slice(0,150);}
 });
 return {changes,warnings};
}
