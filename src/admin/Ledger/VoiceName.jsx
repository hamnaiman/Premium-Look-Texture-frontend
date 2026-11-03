import { useState } from 'react';
import NameVoiceInput from './NameVoiceInput';

export default function VoiceName({item,kind,lang,api,onSaved,onError}) {
 const [value,setValue]=useState(item.voiceName||''),[busy,setBusy]=useState(false),[editing,setEditing]=useState(false);
 const ur=lang==='ur';
 return <li className="ledger-voice-name">
  <div className="ledger-name-row"><strong dir="auto">{item.name}</strong><button type="button" className="ledger-link ledger-name-edit" aria-expanded={editing} onClick={()=>{setEditing(open=>!open);setValue(item.voiceName||'');}}>{editing?(ur?'بند کریں':'Close'):(ur?'آواز کا نام':'Spoken name')}</button></div>
  {editing&&<form onSubmit={async event=>{event.preventDefault();setBusy(true);onError('');try{onSaved(await api(`/names/${kind}/${item._id}`,{method:'PATCH',body:JSON.stringify({voiceName:value})}));setEditing(false);}catch(error){onError(error.message);}finally{setBusy(false);}}}>
   <label className="ledger-field"><span>{ur?'آواز میں نام (اختیاری)':'Spoken name / Urdu spelling (optional)'}</span><NameVoiceInput required={false} lang={lang} value={value} onChange={setValue} onError={onError} placeholder={ur?'مثلاً: ثنا سارہ یا ساجد':'For example: ثنا سارہ یا ساجد'} /></label>
   <button className="ledger-secondary" disabled={busy||value===(item.voiceName||'')}>{busy?(ur?'محفوظ ہو رہا ہے…':'Saving…'):(ur?'محفوظ کریں':'Save')}</button>
  </form>}
 </li>;
}
