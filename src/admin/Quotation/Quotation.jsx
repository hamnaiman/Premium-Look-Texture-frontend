import { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import logo from '../../assets/premium logo - Edited.png';
import { defaultQuotation, quotationTotal, dateLabel, parseQuotationSpeech } from './helpers';
import './quotation.css';
import { printQuotation } from './printQuotation';
import UrduPreview from './UrduPreview';
const storageKey='premium-look-quotation-draft-v2';
function initialDraft(){
 const fallback=defaultQuotation();
 try{
  const current=localStorage.getItem(storageKey);
  const saved=JSON.parse(current||localStorage.getItem('premium-look-quotation-draft-v1')||'null');
  if(saved&&typeof saved==='object')for(const key of Object.keys(fallback)){
   if(typeof saved[key]==='string' && (current || saved[key].trim())) fallback[key]=saved[key].slice(0,['terms','scope','greeting'].includes(key)?2000:150);
  }
 }catch{}
 return fallback;
}
const format=value=>new Intl.NumberFormat('en-PK',{maximumFractionDigits:2}).format(value);
const captions={project:'پروجیکٹ',client:'کلائنٹ',rate:'ریٹ',area:'ایریا',received:'وصول شدہ رقم',date:'تاریخ',receivedDate:'وصولی کی تاریخ'};
export default function Quotation(){
 const [quote,setQuote]=useState(initialDraft),[text,setText]=useState(''),[listening,setListening]=useState(false),[voiceLang,setVoiceLang]=useState('ur-PK'),[message,setMessage]=useState(''),[error,setError]=useState(''),[changed,setChanged]=useState([]),[printing,setPrinting]=useState(false),[previewOpen,setPreviewOpen]=useState(false);
 const recRef=useRef(null),transcript=useRef(''),formRef=useRef(null),logoRef=useRef(null);
 const token=localStorage.getItem('adminToken');
 useEffect(()=>()=>{if(recRef.current){recRef.current.onend=null;recRef.current.onresult=null;recRef.current.onerror=null;recRef.current.abort();}},[]);
 useEffect(()=>{
  const after=()=>setPrinting(false);window.addEventListener('afterprint',after);return()=>window.removeEventListener('afterprint',after);
 },[]);
 if(!token)return <Navigate to="/admin/login" replace />;
 const total=quotationTotal(quote.rate,quote.area);
 const received=quote.received===''?0:Number(quote.received);
 const paymentValid=Number.isFinite(received)&&received>=0&&(total===null||received<=total);
 const change=(key,value)=>setQuote(previous=>({...previous,[key]:value}));
 const applySpeech=value=>{
  const parsed=parseQuotationSpeech(value);const keys=Object.keys(parsed.changes);setChanged(keys);
  if(keys.length){setQuote(previous=>({...previous,...parsed.changes}));setMessage('بات سے یہ خانے بھر گئے ہیں۔ تفصیل دیکھ کر PDF / پرنٹ کریں۔');}
  else setError('خانے واضح نہیں ہوئے۔ اس طرح بولیں: پروجیکٹ ثنا سارہ، کلائنٹ عرفان شاہ، ریٹ 150، ایریا 8000۔');
  if(parsed.warnings.length)setError('یہ معلومات واضح نہیں آئیں، دوبارہ بولیں یا درست کریں: '+parsed.warnings.map(key=>captions[key]).join('، '));
 };
 const speak=()=>{
  if(listening){recRef.current?.stop();return;}
  const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!Speech){setError('آواز اس براؤزر میں دستیاب نہیں۔ نیچے معلومات لکھ سکتے ہیں۔');return;}
  setError('');setMessage('');setText('');setChanged([]);transcript.current='';
  const rec=new Speech();recRef.current=rec;rec.lang=voiceLang;rec.continuous=true;rec.interimResults=true;
  rec.onresult=event=>{let final='',interim='';for(let i=0;i<event.results.length;i++){if(event.results[i].isFinal)final+=event.results[i][0].transcript+' ';else interim+=event.results[i][0].transcript+' ';}transcript.current=final.trim();setText((final+interim).trim());};
  rec.onerror=event=>{if(event.error!=='aborted')setError('آواز نہیں سمجھی جا سکی۔ مائیک کی اجازت چیک کرکے دوبارہ بولیں۔');};
  rec.onend=()=>{setListening(false);recRef.current=null;if(transcript.current)applySpeech(transcript.current);};
  try{rec.start();setListening(true);}catch{setError('مائیک شروع نہیں ہوا۔ دوبارہ کوشش کریں۔');}
 };
 const requestPrint=()=>{setError('');if(!formRef.current.reportValidity())return;if(total===null){setError('ریٹ اور ایریا درست درج کریں۔');return;}if(!paymentValid){setError('وصول شدہ رقم صفر سے کل رقم کے درمیان ہونی چاہیے۔');return;}if(!listening&&!printing)setPreviewOpen(true);};
 const saveDraft=()=>{try{localStorage.setItem(storageKey,JSON.stringify(quote));setMessage('ڈرافٹ اس براؤزر میں محفوظ ہو گیا۔');setError('');}catch{setError('ڈرافٹ محفوظ نہیں ہوا۔ PDF بنا سکتے ہیں۔');}};
 const print=async()=>{
  setError('');
  if(!formRef.current.reportValidity())return;
  if(total===null){setError('ریٹ اور ایریا درست درج کریں۔');return;}
  if(!paymentValid){setError('وصول شدہ رقم صفر سے کل رقم کے درمیان ہونی چاہیے۔');return;}
  if(listening||printing)return;
  setPrinting(true);
  try{
   if(document.fonts?.ready)await Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,1200))]);
   if(logoRef.current && !logoRef.current.complete && logoRef.current.decode)await Promise.race([logoRef.current.decode(),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Logo load timed out')),3000))]);
   if(logoRef.current && (!logoRef.current.complete || !logoRef.current.naturalWidth))throw new Error('Logo not loaded');
   await printQuotation(logoRef.current.closest('.quote-paper'),`Quotation - ${quote.project}`);setPreviewOpen(false);setPrinting(false);
  }catch{setPrinting(false);setError('پرنٹ تیار نہیں ہوا۔ دوبارہ کوشش کریں۔');}
 };
 const field=(key,label,type='text',extra={})=><label className="quote-field" key={key}><span>{label}</span><input type={type} dir={type==='text'?'auto':'ltr'} value={quote[key]} onChange={event=>change(key,event.target.value)} {...extra} /></label>;
 return <AdminLayout className="quote-layout"><div className="quotation-admin" dir="rtl" lang="ur">
  <header className="quote-admin-heading quote-no-print"><div><p>PREMIUM LOOK TEXTURE</p><h1>کوٹیشن بنائیں</h1><p>بول کر معلومات بھریں، دیکھیں، پھر PDF یا پرنٹ نکالیں۔</p></div><button className="quote-secondary" disabled={listening||printing} onClick={()=>{if(window.confirm('نئی کوٹیشن بنائیں؟ موجودہ معلومات بدل جائیں گی۔')){setQuote(defaultQuotation());setText('');setChanged([]);setMessage('');setError('');}}}>نئی کوٹیشن</button></header>
  {error&&<p className="quote-alert quote-no-print" role="alert">{error}</p>}{message&&<p className="quote-message quote-no-print" role="status">{message}</p>}
  <section className="quote-voice quote-no-print"><h2>🎙 بول کر کوٹیشن تیار کریں</h2><p>«پروجیکٹ ثنا سارہ، کلائنٹ عرفان شاہ، ریٹ ڈیڑھ سو روپے، ایریا آٹھ ہزار مربع فٹ، ایڈوانس ایک لاکھ روپے»</p><div className="quote-actions"><div role="group" aria-label="بولنے کی زبان">{[['ur-PK','اردو'],['en-PK','English']].map(([value,label])=><button key={value} disabled={listening} aria-pressed={voiceLang===value} className={voiceLang===value?'quote-primary':'quote-secondary'} onClick={()=>setVoiceLang(value)}>{label}</button>)}</div><button onClick={speak} className={listening?'quote-danger':'quote-primary'} aria-pressed={listening}>{listening?'● بولنا بند کریں':'🎙 بولنا شروع کریں'}</button></div>{listening&&<p role="status">سن رہے ہیں… بات مکمل کرکے «بولنا بند کریں» دبائیں۔</p>}{text&&<div className="quote-readback"><strong>آپ نے کہا:</strong><p dir="auto">{text}</p></div>}{!!changed.length&&<p>بھرے گئے خانے: {changed.map(key=>captions[key]).join('، ')}</p>}<small>آواز کے لیے انٹرنیٹ درکار ہو سکتا ہے؛ براؤزر آواز اپنی سروس کو بھیج سکتا ہے۔</small></section>
  <form ref={formRef} className="quote-editor quote-no-print" onSubmit={event=>{event.preventDefault();requestPrint();}}><h2>معلومات دیکھیں / تبدیل کریں</h2><p className="quote-default-hint">نمونے کی معلومات پہلے سے بھری ہیں، تاریخ آج کی ہے۔ پرنٹ سے پہلے جو چاہیں بدل دیں۔</p><fieldset disabled={listening||printing}><div className="quote-fields">
   {field('project','پروجیکٹ کا نام','text',{required:true,maxLength:150})}{field('client','کلائنٹ کا نام (اختیاری)','text',{maxLength:150})}{field('date','کوٹیشن کی تاریخ','date',{required:true})}
   {field('rate','ریٹ (روپے فی مربع فٹ)','number',{required:true,min:0.01,max:10000000,step:0.01})}{field('area','کل ایریا (مربع فٹ)','number',{required:true,min:0.01,max:1000000000,step:0.01})}
   {field('received','وصول شدہ رقم (اختیاری)','number',{min:0,max:total??1000000000000,step:0.01})}{field('receivedDate','وصولی کی تاریخ','date',{required:received>0})}
  </div><div className="quote-calculated"><span>کل رقم — ریٹ × ایریا</span><strong dir="ltr">{total===null?'—':format(total)} PKR</strong></div>
  <details className="quote-more"><summary>کمپنی، رابطہ نمبر اور باقی عبارت تبدیل کریں</summary>{field('company','کمپنی کا نام','text',{required:true,maxLength:150})}{field('subtitle','کمپنی کی ذیلی عبارت','text',{required:true,maxLength:150})}{field('contact','رابطہ نام / نمبر','text',{required:true,maxLength:150})}{field('job','کام کا عنوان','text',{required:true,maxLength:150})}{[['scope','Scope of Work'],['terms','Payment Terms'],['greeting','تعارفی عبارت']].map(([key,label])=><label className="quote-field" key={key}><span>{label}</span><textarea dir="auto" rows={key==='terms'?5:3} required maxLength={2000} value={quote[key]} onChange={event=>change(key,event.target.value)} /></label>)}</details>
  <div className="quote-actions"><button type="submit" className="quote-primary">پیش نظارہ / PDF</button><button type="button" className="quote-secondary" onClick={saveDraft}>ڈرافٹ محفوظ کریں</button></div></fieldset><small>PDF بنانے کے لیے پرنٹ ونڈو میں “Save as PDF” منتخب کریں۔</small></form>
  <div className={`quote-preview-scroll quote-no-print${previewOpen?' quote-preview-source-open':' quote-preview-source-hidden'}`} aria-hidden={!previewOpen}><article className="quote-paper" dir="ltr" lang="en" aria-label="Quotation preview">
   <img ref={logoRef} className="quote-watermark" src={logo} alt="" aria-hidden="true" />
   <div className="quote-paper-content"><header className="quote-company"><h1>{quote.company}</h1><p>{quote.subtitle}</p></header>
    <div className="quote-meta"><strong>Project: <bdi>{quote.project||'________________'}</bdi></strong><span>DATE: {dateLabel(quote.date)||'__________'}</span></div>
    <div className="quote-job"><p>{quote.job}</p><p>Quotation</p></div>
    <div className="quote-intro"><p>Dear <bdi>{quote.client.trim()||'Sir'}</bdi>,</p><p>{quote.greeting}</p></div>
    <section><h2>Scope of Work</h2><ul>{quote.scope.split('\n').filter(line=>line.trim()).map((line,i)=><li key={i}>{line}</li>)}</ul></section>
    <section><h2>Our Quotation Price</h2><ul><li><strong>Rate: {quote.rate?format(Number(quote.rate)):'____'}</strong> PKR</li><li>Total Amount: <strong>{total===null?'________':format(total)}</strong></li><li>({quote.rate?format(Number(quote.rate)):'____'} × {quote.area?format(Number(quote.area)):'____'})</li></ul></section>
    <section><h2>Total Area</h2><ul><li>Area: {quote.area?format(Number(quote.area)):'____'} Sq.ft Area Approx.</li></ul></section>
    <section><h2>Payment Terms</h2><ul>{quote.terms.split('\n').filter(line=>line.trim()).map((line,i)=><li key={i}>{line}</li>)}</ul></section>
    {received>0&&paymentValid&&<section><h2>Payment Received</h2><ul><li><strong>{format(received)}</strong> Received on {dateLabel(quote.receivedDate)}</li></ul></section>}
    <footer><bdi>{quote.contact}</bdi></footer>
   </div>
  </article></div>
  {previewOpen&&<UrduPreview quote={{...quote,logo}} total={total} received={received} onClose={()=>setPreviewOpen(false)} onPrint={print} />}
 </div></AdminLayout>;
}
