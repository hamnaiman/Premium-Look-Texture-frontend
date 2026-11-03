import { useState } from 'react';
export default function VoiceName({item,kind,lang,api,onSaved,onError}) {
 const [value,setValue]=useState(item.voiceName||''),[busy,setBusy]=useState(false);
 const ur=lang==='ur';
 return <li className="ledger-voice-name"><strong dir="auto">{item.name}</strong><form onSubmit={async event=>{event.preventDefault();setBusy(true);onError('');try{onSaved(await api(`/names/${kind}/${item._id}`,{method:'PATCH',body:JSON.stringify({voiceName:value})}));}catch(error){onError(error.message);}finally{setBusy(false);}}}>
 <label className="ledger-field"><span>{ur?'آواز میں نام (اختیاری)':'Spoken name / Urdu spelling (optional)'}</span><input maxLength="100" dir="auto" placeholder={ur?'مثلاً: ثنا سارہ یا ساجد':'For example: ثنا سارہ or ساجد'} value={value} onChange={event=>setValue(event.target.value)} /></label><button className="ledger-secondary" disabled={busy||value===(item.voiceName||'')}>{busy?(ur?'محفوظ ہو رہا ہے…':'Saving…'):(ur?'نام محفوظ کریں':'Save voice name')}</button></form></li>;
}
