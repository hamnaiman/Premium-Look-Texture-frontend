import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import { localDate, periodRange, totalsBy } from './helpers';
import './ledger.css';
import VoiceEntry from './VoiceEntry';
import VoiceName from './VoiceName';
import NameVoiceInput from './NameVoiceInput';
const labels = {
  ur: { title:'لیبر اور سائٹ کا کھاتہ', sub:'روز کا حساب، آسان انداز میں', entry:'بول کر درج کریں', manual:'خود لکھیں', report:'رپورٹ', names:'لیبر / سائٹ شامل کریں', site:'سائٹ', labour:'لیبر', category:'خرچ کی قسم', amount:'رقم (روپے)', date:'تاریخ', note:'تفصیل', save:'محفوظ کریں', cancel:'منسوخ', speak:'بول کر لکھیں', stop:'سننا بند کریں', choose:'منتخب کریں', optional:'کوئی نہیں', add:'شامل کریں', name:'نام', week:'ہفتہ وار', month:'ماہانہ', all:'تمام', total:'کل خرچ', count:'اندراجات', print:'پرنٹ / PDF', empty:'اس مدت میں کوئی خرچ نہیں۔', edit:'درست کریں', remove:'حذف', saved:'محفوظ ہو گیا', loading:'لوڈ ہو رہا ہے…', retry:'دوبارہ کوشش', voice:'پہلے سائٹ اور لیبر منتخب کریں۔ پھر کہیں: «دو ہزار روپے مزدوری دی»۔ رقم اور تفصیل دیکھ کر محفوظ کریں۔', unsupported:'اس براؤزر میں آواز کی سہولت دستیاب نہیں۔ لکھ کر اندراج کریں یا Chrome آزمائیں۔', voiceError:'آواز نہیں سمجھی جا سکی۔ مائیک کی اجازت اور انٹرنیٹ چیک کریں یا لکھ کر درج کریں۔', review:'آواز درج ہو گئی۔ رقم اور تفصیل چیک کریں۔', missingAmount:'رقم واضح نہیں تھی؛ رقم خود درج کریں۔', confirm:'یہ اندراج حذف کریں؟', failed:'کام مکمل نہیں ہوا۔ دوبارہ کوشش کریں۔', siteTotal:'سائٹ کے حساب سے', labourTotal:'لیبر کے حساب سے', filter:'فلٹر', labourName:'لیبر کا نام', siteName:'سائٹ کا نام', busy:'محفوظ ہو رہا ہے…', speechLanguage:'بولنے کی زبان', preview:'اندراج درست کریں', voicePrivacy:'آواز کے لیے انٹرنیٹ درکار ہو سکتا ہے؛ براؤزر آواز اپنی سروس کو بھیج سکتا ہے۔' },
  en: { title:'Labour & Site Ledger',sub:'Daily expenses, simply managed',entry:'Speak entry', manual:'Manual entry',report:'Reports',names:'Add labour / site',site:'Site',labour:'Labour',category:'Expense type',amount:'Amount (PKR)',date:'Date',note:'Details',save:'Save expense',cancel:'Cancel',speak:'Speak entry',stop:'Stop listening',choose:'Select',optional:'None',add:'Add',name:'Name',week:'Weekly',month:'Monthly',all:'All',total:'Total expenses',count:'Entries',print:'Print / PDF',empty:'No expenses in this period.',edit:'Edit',remove:'Delete',saved:'Saved successfully',loading:'Loading…',retry:'Try again',voice:'Select a site and labour first. Say “two thousand rupees labour payment”. Review the amount and details, then save.',unsupported:'Voice is unavailable in this browser. Type your entry or try Chrome.',voiceError:'Could not recognize speech. Check microphone permission and internet, or type the entry.',review:'Speech entered. Review amount and details.',missingAmount:'Amount was unclear; enter it manually.',confirm:'Delete this expense?',failed:'Could not complete the request. Please retry.',siteTotal:'By site',labourTotal:'By labour',filter:'Filter',labourName:'Labour name',siteName:'Site name',busy:'Saving…',speechLanguage:'Speech language',preview:'Edit expense',voicePrivacy:'Voice may require internet; your browser may send audio to its speech service.' }
};
const categories = {fuel:['پیٹرول / ڈیزل','Fuel'],food:['کھانا','Food'],labour:['مزدوری','Labour'],material:['سامان','Material'],transport:['ٹرانسپورٹ','Transport'],other:['دیگر','Other']};
const blank = () => ({site:'',labour:'',category:'labour',amount:'',date:localDate(),note:''});
const money = n => new Intl.NumberFormat('en-PK', {maximumFractionDigits:2}).format(n);
export default function Ledger() {
  const [lang,setLang] = useState('ur'), [tab,setTab] = useState('entry');
  const t = labels[lang]; const ur = lang === 'ur';
  const [names,setNames] = useState({sites:[],labours:[]}), [entries,setEntries] = useState([]), [form,setForm] = useState(blank), [edit,setEdit] = useState(null);
  const [voiceBusy,setVoiceBusy] = useState(false);
  const [loading,setLoading] = useState(true), [busy,setBusy] = useState(false), [error,setError] = useState(''), [notice,setNotice] = useState('');
  const [newSite,setNewSite] = useState(''), [newLabour,setNewLabour] = useState('');
  const [period,setPeriod] = useState('week'), [anchor,setAnchor] = useState(localDate()), [siteFilter,setSiteFilter] = useState(''), [labourFilter,setLabourFilter] = useState('');
  const token = localStorage.getItem('adminToken');
  const api = async (path, options = {}) => {
    const response = await fetch(`${(import.meta.env.VITE_API_URL || '/api').replace(/\/$/,'')}/ledger${path}`, {...options, headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`}});
    if (response.status === 401) { localStorage.removeItem('adminToken'); window.location.assign('/admin/login'); throw new Error('Session expired / دوبارہ لاگ اِن کریں'); }
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || t.failed);
    return data;
  };
  const load = async () => { setLoading(true);setError('');try { const [n,e] = await Promise.all([api('/names'),api('/entries')]);setNames(n);setEntries(e); } catch(e) {setError(e.message || t.failed);} finally {setLoading(false);} };
  useEffect(() => { if(token) load(); }, []);
  if (!token) return <Navigate to="/admin/login" replace />;
  const update = (key,value) => setForm(previous => ({...previous,[key]:value}));
  const save = async event => {event.preventDefault();setBusy(true);setError('');setNotice('');try {const saved = await api(`/entries${edit ? '/'+edit : ''}`,{method:edit?'PUT':'POST',body:JSON.stringify(form)});setEntries(previous => [saved,...previous.filter(e=>e._id!==saved._id)].sort((a,b)=>b.date.localeCompare(a.date)));setEdit(null);setForm(previous=>({...blank(),site:previous.site,labour:previous.labour}));setNotice(t.saved);}catch(e){setError(e.message || t.failed);}finally{setBusy(false);}};
  const addName = async (event,kind) => {event.preventDefault();setBusy(true);setError('');try{const item=await api('/names/'+kind,{method:'POST',body:JSON.stringify({name:kind==='sites'?newSite:newLabour})});setNames(previous=>({...previous,[kind]:[...previous[kind],item]}));if(kind==='sites'){setNewSite('');update('site',item._id);}else{setNewLabour('');update('labour',item._id);}setNotice(t.saved);}catch(e){setError(e.message||t.failed);}finally{setBusy(false);}};
  const remove = async id => {if(!window.confirm(t.confirm))return;setBusy(true);setError('');try{await api('/entries/'+id,{method:'DELETE'});setEntries(previous=>previous.filter(e=>e._id!==id));if(edit===id){setEdit(null);setForm(blank());}}catch(e){setError(e.message||t.failed);}finally{setBusy(false);}};
  const [from,to] = periodRange(period,anchor || localDate());
  const visible = entries.filter(e=>e.date>=from && e.date<=to && (!siteFilter || e.site?._id===siteFilter) && (!labourFilter || e.labour?._id===labourFilter));
  const total = visible.reduce((sum,e)=>sum+e.amount,0);
  const field = (key,label,input) => <label className="ledger-field" key={key}><span>{label}</span>{input}</label>;
  const select = (key,items,required=true) => <select required={required} value={form[key]} onChange={e=>update(key,e.target.value)}><option value="">{required?t.choose:t.optional}</option>{items.map(item=><option key={item._id} value={item._id}>{item.name}</option>)}</select>;
  return <AdminLayout className="ledger-layout"><section className="ledger" dir={ur?'rtl':'ltr'} lang={lang}>
    <header className="ledger-heading"><div><p className="ledger-eyebrow">PREMIUM • {ur?'روزانہ حساب':'DAILY ACCOUNTS'}</p><h1>{t.title}</h1><p>{t.sub}</p></div><button disabled={voiceBusy} className="ledger-secondary" onClick={()=>setLang(ur?'en':'ur')}>{ur?'English':'اردو'}</button></header>
    <nav className="ledger-tabs no-print">{['entry','manual','report','names'].map(key=><button disabled={voiceBusy} key={key} onClick={()=>{setTab(key);setNotice('');}} className={tab===key?'active':''}>{t[key]}</button>)}</nav>
    {error && <div role="alert" className="ledger-error no-print">{error} <button onClick={load} disabled={busy||loading||voiceBusy}>{t.retry}</button></div>}
    {notice && <p role="status" className="ledger-notice no-print">{notice}</p>}
    {loading ? <p role="status">{t.loading}</p> : <>
    <div hidden={tab!=='entry'}><VoiceEntry active={tab==='entry'} onBusy={setVoiceBusy} lang={lang} names={names} api={api} locked={busy} onError={setError} onNotice={setNotice} privacy={t.voicePrivacy} onSaved={saved=>setEntries(previous=>[saved,...previous.filter(entry=>entry._id!==saved._id)].sort((a,b)=>b.date.localeCompare(a.date)))} /></div>
    {tab==='manual' && <form className="ledger-card no-print" onSubmit={save}><h2>{edit?t.preview:t.manual}</h2><div className="ledger-grid">
      {field('site',t.site,select('site',names.sites))}{field('labour',t.labour,select('labour',names.labours,form.category==='labour'))}
      {field('category',t.category,<select value={form.category} onChange={e=>update('category',e.target.value)}>{Object.entries(categories).map(([key,value])=><option key={key} value={key}>{value[ur?0:1]}</option>)}</select>)}
      {field('date',t.date,<input type="date" required value={form.date} onChange={e=>update('date',e.target.value)} />)}
    </div>
      <div className="ledger-grid">{field('amount',t.amount,<input type="number" dir="ltr" min="0.01" max="1000000000" step="0.01" required value={form.amount} onChange={e=>update('amount',e.target.value)} />)}{field('note',t.note,<textarea rows="2" maxLength="1000" dir="auto" value={form.note} onChange={e=>update('note',e.target.value)} />)}</div>
      <div className="ledger-actions"><button className="ledger-primary" disabled={busy||voiceBusy}>{busy?t.busy:t.save}</button>{edit&&<button type="button" className="ledger-secondary" onClick={()=>{setEdit(null);setForm(blank());}}>{t.cancel}</button>}</div>
      {(!names.sites.length || !names.labours.length)&&<button type="button" className="ledger-link" onClick={()=>setTab('names')}>+ {t.names}</button>}
    </form>}
    {tab==='names' && <div className="ledger-grid no-print">{['labours','sites'].map(kind=><div className="ledger-card" key={kind}><h2>{kind==='sites'?t.siteName:t.labourName}</h2><form onSubmit={e=>addName(e,kind)}><label className="ledger-field"><span>{t.name}</span><NameVoiceInput lang={lang} value={kind==='sites'?newSite:newLabour} onChange={value=>kind==='sites'?setNewSite(value):setNewLabour(value)} onError={setError} placeholder={ur?'نام لکھیں یا بول کر درج کریں':'Type or speak a name'} /></label><button className="ledger-primary" disabled={busy}>{t.add}</button></form><ul className="ledger-names">{names[kind].map(item=><VoiceName key={item._id} item={item} kind={kind} lang={lang} api={api} onError={setError} onSaved={saved=>{setNames(previous=>({...previous,[kind]:previous[kind].map(name=>name._id===saved._id?saved:name)}));setNotice(t.saved);}} />)}</ul></div>)}</div>}
    {tab==='report' && <div className="ledger-report">
      <div className="ledger-card ledger-filters no-print">{field('period',t.report,<select value={period} onChange={e=>setPeriod(e.target.value)}><option value="week">{t.week}</option><option value="month">{t.month}</option></select>)}{field('anchor',t.date,<input type="date" required value={anchor} onChange={e=>setAnchor(e.target.value)} />)}{field('siteFilter',t.site,<select value={siteFilter} onChange={e=>setSiteFilter(e.target.value)}><option value="">{t.all}</option>{names.sites.map(n=><option key={n._id} value={n._id}>{n.name}</option>)}</select>)}{field('labourFilter',t.labour,<select value={labourFilter} onChange={e=>setLabourFilter(e.target.value)}><option value="">{t.all}</option>{names.labours.map(n=><option key={n._id} value={n._id}>{n.name}</option>)}</select>)}<button className="ledger-secondary" onClick={()=>window.print()}>{t.print}</button></div>
      <p className="ledger-period">{period==='week'?t.week:t.month} · <bdi>{from} — {to}</bdi>{siteFilter && ' · '+names.sites.find(s=>s._id===siteFilter)?.name}{labourFilter && ' · '+names.labours.find(l=>l._id===labourFilter)?.name}</p>
      <div className="ledger-grid"><div className="ledger-total"><span>{t.total}</span><strong><bdi>{money(total)}</bdi> <small>PKR</small></strong></div><div className="ledger-card"><span>{t.count}</span><h2>{visible.length}</h2></div></div>
      <div className="ledger-grid">{[['site',t.siteTotal],['labour',t.labourTotal]].map(([key,title])=><div className="ledger-card" key={key}><h2>{title}</h2>{totalsBy(visible,key).map(([name,value])=><div className="ledger-summary" key={name}><span dir="auto">{name}</span><bdi>{money(value)}</bdi></div>)}</div>)}</div>
      <div className="ledger-card ledger-table"><table aria-label={t.report}><thead><tr>{[t.date,t.site,t.labour,t.category,t.note,t.amount].map(s=><th key={s}>{s}</th>)}<th className="no-print" /></tr></thead><tbody>{visible.map(e=><tr key={e._id}><td data-label={t.date}><bdi>{e.date}</bdi></td><td data-label={t.site}>{e.site?.name}</td><td data-label={t.labour}>{e.labour?.name||'—'}</td><td data-label={t.category}>{categories[e.category]?.[ur?0:1]}</td><td data-label={t.note}><span dir="auto">{e.note}</span></td><td data-label={t.amount}><bdi>{money(e.amount)}</bdi></td><td className="no-print"><button disabled={busy} className="ledger-link" onClick={()=>{setEdit(e._id);setForm({site:e.site?._id||'',labour:e.labour?._id||'',category:e.category,date:e.date,amount:e.amount,note:e.note});setTab('manual');setNotice('');}}>{t.edit}</button><button disabled={busy} className="ledger-link text-red-600" onClick={()=>remove(e._id)}>{t.remove}</button></td></tr>)}</tbody></table>{!visible.length&&<p className="ledger-empty">{t.empty}</p>}</div>
    </div>}
    </>}
  </section></AdminLayout>;
}

