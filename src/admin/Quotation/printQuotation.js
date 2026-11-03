export const quotationPrintStyles = `
@page {size:A4 portrait;margin:0}
*{box-sizing:border-box}html,body{margin:0!important;padding:0!important;width:210mm;background:#fff;color:#000}
p,h1,h2,ul{margin:0} .quote-print-page{position:relative;width:210mm;height:296.8mm;overflow:hidden}
.quote-paper{position:relative;width:210mm;min-height:0;margin:0;padding:15mm 13mm 12mm;background:white;color:black;font:12pt/1.2 "Times New Roman","Noto Naskh Arabic",serif;letter-spacing:.35px;overflow-wrap:anywhere;transform-origin:top left;print-color-adjust:exact;-webkit-print-color-adjust:exact}
.quote-watermark{position:absolute;width:65%;height:auto;top:49%;left:50%;transform:translate(-50%,-50%);opacity:.065;filter:blur(2px);pointer-events:none;z-index:0}
.quote-paper-content{position:relative;z-index:1}.quote-company{text-align:center;margin-bottom:20px}.quote-company h1{font:700 22pt/1.05 "Times New Roman",serif;letter-spacing:.3px}.quote-company p{font-size:13pt}
.quote-meta{display:flex;justify-content:space-between;align-items:start;gap:20px;font-size:10pt;margin-bottom:14px}.quote-meta strong{max-width:65%}.quote-meta span{white-space:nowrap}.quote-job{text-align:center;font-size:13pt}.quote-intro{margin-bottom:16px}.quote-intro>p:last-child{text-indent:42px}
.quote-paper section{margin-bottom:24px}.quote-paper section h2{font:700 20pt/1.25 "Times New Roman",serif;text-decoration:underline;text-underline-offset:3px;margin-bottom:18px;letter-spacing:.5px}.quote-paper ul{list-style:none;margin:0;padding-inline-start:24px}.quote-paper li{position:relative;padding-inline-start:17px;white-space:pre-wrap}.quote-paper li::before{content:'❖';position:absolute;inset-inline-start:0;font-size:14px}.quote-paper section:nth-of-type(2){margin-bottom:32px}.quote-paper footer{margin-top:24px;font-size:10pt}
`;
export function fitQuotationPage(paper,page){
 const width=page.clientWidth,height=page.clientHeight;
 paper.style.transform='none';
 const scale=Math.min(1,(height-2)/paper.scrollHeight);
 paper.style.transform=`translateX(${Math.max(0,(width-paper.offsetWidth*scale)/2)}px) scale(${scale})`;
 return scale;
}
export function quotationPrintHtml(paperHtml,title='Quotation'){
 const safeTitle=title.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${safeTitle}</title><style>${quotationPrintStyles}</style></head><body><div class="quote-print-page">${paperHtml}</div></body></html>`;
}
export async function printQuotation(paper,title){
 const frame=document.createElement('iframe');
 frame.title='Quotation print';frame.setAttribute('aria-hidden','true');
 Object.assign(frame.style,{position:'fixed',left:'-10000px',top:'0',width:'794px',height:'1123px',border:'0',opacity:'0',pointerEvents:'none'});
 document.body.appendChild(frame);
 try{
  const doc=frame.contentDocument;const clone=paper.cloneNode(true);
  clone.querySelectorAll('img').forEach((image,index)=>{image.src=paper.querySelectorAll('img')[index].src;});
  doc.open();doc.write(quotationPrintHtml(clone.outerHTML,title));doc.close();
  document.querySelectorAll('link[href*="fonts.googleapis.com"]').forEach(link=>doc.head.appendChild(link.cloneNode(true)));
  await Promise.all([...doc.images].map(image=>image.complete&&image.naturalWidth?Promise.resolve():new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error('Logo not loaded'));setTimeout(()=>image.complete&&image.naturalWidth?resolve():reject(new Error('Logo load timed out')),4000);})));
  if(doc.fonts?.ready)await Promise.race([doc.fonts.ready,new Promise(resolve=>setTimeout(resolve,1200))]);
  fitQuotationPage(doc.querySelector('.quote-paper'),doc.querySelector('.quote-print-page'));
  frame.contentWindow.addEventListener('afterprint',()=>frame.remove(),{once:true});
  frame.contentWindow.focus();frame.contentWindow.print();
  // Some browsers omit afterprint on cancellation. Keep the print document
  // alive while the dialog is open, then clean it up later if necessary.
  setTimeout(()=>frame.remove(),300000);
 }catch(error){frame.remove();throw error;}
}
