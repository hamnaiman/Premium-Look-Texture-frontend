import { useEffect, useRef, useState } from 'react';
import { parseExpenses, urduSummary } from './voiceParser';
const copy = {
 ur:{title:'بول کر خرچ درج کریں',hint:'مثال: آج ثنا سارہ پر ساجد کو ۲۰۰ روپے مزدوری دی، ۵۰۰ روپے پیٹرول لگا اور ۱۰۰ روپے کا کھانا کھایا۔',sub:'بات کریں، اردو میں تفصیل دیکھیں، پھر محفوظ کریں۔',start:'بولنا شروع کریں',again:'دوبارہ بولیں',stop:'بولنا بند کریں',heard:'آپ نے کہا',empty:'رقم سمجھ نہیں آئی۔ دوبارہ بولیں اور ہر خرچ کی رقم واضح بتائیں۔',review:'آپ کے خرچ کی تفصیل',save:'محفوظ کریں',saving:'محفوظ ہو رہا ہے…',error:'آواز واضح نہیں آئی۔ مائیک کی اجازت چیک کرکے دوبارہ بولیں۔',unsupported:'اس براؤزر میں آواز دستیاب نہیں۔ Chrome میں کھولیں یا الگ «خود لکھیں» ٹیب استعمال کریں۔',replace:'یہ غیر محفوظ بات بدل جائے گی۔ دوبارہ بولیں؟',listening:'سن رہے ہیں… بات مکمل کرکے «بولنا بند کریں» دبائیں۔',language:'بولنے کی زبان',remaining:'باقی اندراجات محفوظ نہیں ہوئے۔ دوبارہ محفوظ کریں؛ پہلے محفوظ شدہ اندراجات دوبارہ شامل نہیں ہوں گے۔',ready:'تفصیل درست ہے تو «محفوظ کریں» دبائیں۔',missingSite:'سائٹ کا نام واضح نہیں آیا۔ محفوظ شدہ سائٹ کا پورا نام لے کر دوبارہ بولیں۔',missingLabour:'لیبر کا نام واضح نہیں آیا۔ محفوظ شدہ لیبر کا پورا نام لے کر دوبارہ بولیں۔',saved:'محفوظ ہو گیا',namesHint:'لیبر اور سائٹ کے نام پہلے «لیبر / سائٹ» ٹیب میں شامل کریں۔',invalid:'رقم درست نہیں سمجھی گئی۔ دوبارہ بولیں۔',pending:'ابھی محفوظ نہیں ہوا'},
 en:{title:'Speak your expenses',hint:'Example: Today at Sana Sarah, paid Sajid 200 rupees wages, spent 500 on petrol and 100 on food.',sub:'Speak, read the Urdu details, then save.',start:'Start speaking',again:'Speak again',stop:'Stop speaking',heard:'You said',empty:'No amount understood. Speak again and include each expense amount.',review:'Your expense details',save:'Save',saving:'Saving…',error:'Speech was unclear. Check microphone permission and try again.',unsupported:'Voice is unavailable. Open in Chrome or use the separate Manual entry tab.',replace:'Replace this unsaved speech?',listening:'Listening… press Stop speaking when finished.',language:'Speech language',remaining:'Remaining entries were not saved. Retry; saved entries will not be added twice.',ready:'If the details are correct, press Save.',missingSite:'Site name unclear. Speak again using the full saved site name.',missingLabour:'Labour name unclear. Speak again using the full saved labour name.',saved:'Saved',namesHint:'First add labour and site names in the Labour / Site tab.',invalid:'Amount was unclear. Please speak again.',pending:'Not saved yet'}
};
const makeDraft=entry=>({...entry,clientRequestId:crypto.randomUUID()});
export default function VoiceEntry({lang,names,api,onSaved,onError,onNotice,privacy,locked,onBusy,active}) {
 const t=copy[lang],ur=lang==='ur';
 const [text,setText]=useState(''),[drafts,setDrafts]=useState([]),[savedRows,setSavedRows]=useState([]),[listening,setListening]=useState(false),[saving,setSaving]=useState(false),[voiceLang,setVoiceLang]=useState('ur-PK'),[message,setMessage]=useState('');
 const recognition=useRef(null),transcript=useRef(''),abandoned=useRef(false),currentNames=useRef(names);
 currentNames.current=names;
 useEffect(()=>{abandoned.current=false;return()=>{abandoned.current=true;if(recognition.current){recognition.current.onend=null;recognition.current.onerror=null;recognition.current.onresult=null;recognition.current.abort();}};},[]);
 useEffect(()=>{if(!active)recognition.current?.stop();},[active]);
 const busy=saving||locked;
 const build=value=>{const rows=parseExpenses(value,currentNames.current);setDrafts(rows.map(makeDraft));setMessage(rows.length?t.ready:t.empty);};
 const speak=()=>{
  if(listening){recognition.current?.stop();return;}
  const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!Speech){onError(t.unsupported);return;}
  if(drafts.length&&!window.confirm(t.replace))return;
  onError('');onNotice('');setMessage('');setDrafts([]);setSavedRows([]);setText('');transcript.current='';
  const rec=new Speech();recognition.current=rec;rec.lang=voiceLang;rec.continuous=true;rec.interimResults=true;rec.maxAlternatives=5;
  rec.onresult=event=>{
   let final='',interim='';
   const quality=alternative=>{
    const rows=parseExpenses(alternative.transcript,currentNames.current);
    return rows.length*4+rows.filter(row=>row.site).length*3+rows.filter(row=>row.category!=='other').length*2+rows.filter(row=>row.category!=='labour'||row.labour).length*2+(alternative.confidence||0);
   };
   for(let i=0;i<event.results.length;i++){
    const result=event.results[i],alternatives=[...result];
    const best=alternatives.sort((a,b)=>quality(b)-quality(a))[0];
    if(result.isFinal)final+=(best?.transcript||'')+' ';
    else interim+=(alternatives.sort((a,b)=>(b.confidence||0)-(a.confidence||0))[0]?.transcript||'')+' ';
   }
   transcript.current=final.trim();setText((final+interim).trim());
  };
  rec.onerror=event=>{if(event.error!=='aborted')onError(t.error);};
  rec.onend=()=>{setListening(false);recognition.current=null;if(transcript.current)build(transcript.current);};
  try{rec.start();setListening(true);}catch{onError(t.error);}
 };
 const incomplete=entry=>!entry.site?t.missingSite:entry.category==='labour'&&!entry.labour?t.missingLabour:!Number.isFinite(Number(entry.amount))||Number(entry.amount)<=0||Number(entry.amount)>1e9?t.invalid:'';
 const saveAll=async()=>{
  if(!drafts.length||drafts.some(entry=>incomplete(entry)))return;
  setSaving(true);onBusy(true);onError('');onNotice('');let count=0;
  try{
   for(const entry of drafts){const saved=await api('/entries',{method:'POST',body:JSON.stringify(entry)});if(abandoned.current)return;onSaved(saved);count++;setSavedRows(previous=>[...previous,entry]);setDrafts(previous=>previous.filter(item=>item.clientRequestId!==entry.clientRequestId));}
   setMessage('');onNotice(ur?`${count} اندراجات محفوظ ہو گئے۔`:`${count} entries saved.`);
  }catch(error){onError(`${error.message} ${t.remaining}`);}finally{onBusy(false);if(!abandoned.current)setSaving(false);}
 };
 return <section className="ledger-card ledger-dictation ledger-voice-only no-print" aria-label={t.title}>
  <h2>🎙 {t.title}</h2><p>{t.sub}</p><p className="ledger-example">{t.hint}</p>
  <div className="ledger-actions"><div className="ledger-language-buttons" role="group" aria-label={t.language}>{[['ur-PK','اردو'],['en-PK','English']].map(([value,label])=><button key={value} type="button" className={voiceLang===value?'ledger-primary':'ledger-secondary'} aria-pressed={voiceLang===value} disabled={listening||busy} onClick={()=>setVoiceLang(value)}>{label}</button>)}</div><button type="button" disabled={busy} className={listening?'ledger-danger':'ledger-primary'} onClick={speak} aria-pressed={listening}>{listening?'● '+t.stop:'🎙 '+(text?t.again:t.start)}</button></div>
  {listening&&<p role="status" className="ledger-listening">{t.listening}</p>}
  <small className="ledger-privacy">{privacy}</small>
  {!names.sites.length&&<p className="ledger-notice">{t.namesHint}</p>}
  {text&&<div className="ledger-spoken-text" aria-live="polite"><h3>{t.heard}</h3><p dir="auto">{text}</p></div>}
  {message&&<p className="ledger-notice" role="status">{message}</p>}
  {(drafts.length>0||savedRows.length>0)&&<div className="ledger-spoken-results"><h2>{t.review}</h2><ul>
   {[...savedRows,...drafts].map(entry=>{const saved=savedRows.some(item=>item.clientRequestId===entry.clientRequestId);const problem=incomplete(entry);return <li key={entry.clientRequestId} className="ledger-spoken-row"><p className="ledger-urdu-summary" dir="rtl" lang="ur">{urduSummary(entry,names)}</p>{saved?<span className="ledger-saved-badge">✓ {t.saved}</span>:problem?<p role="alert" className="ledger-error">{problem}</p>:<span className="ledger-pending-badge">{t.pending}</span>}</li>;})}
  </ul>{drafts.length>0&&<button type="button" className="ledger-primary ledger-save-all" disabled={busy||listening||drafts.some(entry=>incomplete(entry))} onClick={saveAll}>{saving?t.saving:t.save}</button>}</div>}
 </section>;
}
