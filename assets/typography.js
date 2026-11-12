/* Template-relative text sizes; only validated data attributes configure this renderer. */
(() => {
 const originals=new WeakMap(); let touched=[]; let resizeTimer;
 const configFor=node=>{try{const cfg=JSON.parse(node.dataset.typography||'{}');return ('web' in cfg||'pdf' in cfg)?(cfg[node.ownerDocument.body.classList.contains('print-view')?'pdf':'web']||{}):cfg}catch(_){return {}}};
 const active=config=>['fields','sections','ranges','bold','boldRanges'].some(key=>Object.keys(config[key]||{}).length);
 const skips=(key,node,root)=>node!==root&&node.nodeType===1&&node.parentElement===root&&node.tagName==='SPAN'&&['cardRole','period','category','footerText','githubLabel'].includes(key);
 function pieces(node,key){const parts=[];let position=0;function walk(n){if(skips(key,n,node))return;if(n.nodeType===3){parts.push({node:n,start:position});position+=n.data.length;}else if(n.nodeType===1){if(n.tagName==='BR'){position++;return;}n.childNodes.forEach(walk);}}walk(node);return {parts,text:parts.map(p=>p.node.data).join(''),length:position};}
 function plain(node,key){let result='';function walk(n){if(skips(key,n,node))return;if(n.nodeType===3)result+=n.data;else if(n.nodeType===1){if(n.tagName==='BR')result+='\n';else n.childNodes.forEach(walk);}}walk(node);return result;}
 function scope(record){const {key,node,kind,owner}=record;if(key.startsWith('@'))return key.slice(1);if(kind==='home'){if(/^(name|englishName|position|label|description\.|facts\.)/.test(key))return 'profile';if(/^(languages|skills\.)/.test(key))return 'skills';if(/^about/.test(key))return 'about';if(/^education/.test(key))return 'education';if(/^footer/.test(key))return 'footer';return 'contact';}if(owner.matches('.featured,.project-card')||/^(card|scopes\.)/.test(key))return 'card';if(/^(name|category|status|summary|period|team|tags)$/.test(key))return 'hero';if(/^(role|result)$/.test(key))return 'keyline';if(/^contributions\./.test(key))return 'contributions';if(/^(images|imageGroups)\./.test(key))return 'images';if(/^flow\./.test(key))return 'flow';if(/^problem\./.test(key))return 'problem';if(/^extraSections\./.test(key))return 'extra:'+(node.closest('.editable-detail-section')?.getAttribute('aria-labelledby')||'');return 'limitations';}
 function collect(doc){
 const records=[],offsets=new WeakMap();const frame={contentWindow:doc.defaultView||{location:new URL(doc.URL)}};
 function add(node,kind,id,key){if(!node)return;const owner=kind==='home'?(node.closest('.pdf-sheet')||doc.body):(node.closest('.featured,.project-card,.project-detail,.pdf-sheet'));if(!owner)return;let positions=offsets.get(owner);if(!positions){positions={};offsets.set(owner,positions);}const offset=positions[key]||0;positions[key]=offset+plain(node,key).trim().length+1;records.push({node,kind,key,owner,offset});}
  function projectId(card) {
    const link = card.querySelector('a[href*="projects/"]');
    return link ? new URL(link.getAttribute('href'), frame.contentWindow.location.href).pathname.split('/').pop().replace(/\.html$/, '') : '';
  }
  function mapHome(doc) {
    const home = (selector, path) => add(doc.querySelector(selector), 'home', '', path);
    home('.hero h1', 'name'); home('.hero .eyebrow', 'label');
    home('.hero-name-en', 'englishName'); home('.hero-position', 'position');
    doc.querySelectorAll('.hero-description>span').forEach((node,i) => add(node,'home','',`description.${i}`));
    doc.querySelectorAll('.profile-facts>div').forEach((node,i) => {
      add(node.querySelector('dt'),'home','',`facts.${i}.label`);
      add(node.querySelector('dd'),'home','',`facts.${i}.value`);
    });
    home('.skills-language', 'languages');
    doc.querySelectorAll('.skill-group').forEach((node,i) => {
      add(node.querySelector('h3'),'home','',`skills.${i}.title`);
      add(node.querySelector('p'),'home','',`skills.${i}.body`);
      add(node.querySelector('.skill-context'),'home','',`skills.${i}.context`);
    });
    home('.about-section h2', 'aboutTitle');
    doc.querySelectorAll('.about-copy').forEach((node,i) => add(node,'home','',`aboutParagraphs.${i}`));
    doc.querySelectorAll('.education article').forEach((node,i) => {
      add(node.querySelector('.education-date'),'home','',`education.${i}.date`);
      add(node.querySelector('h3'),'home','',`education.${i}.title`);
      add(node.querySelector('p'),'home','',`education.${i}.body`);
    });
    home('.contact-section h2', 'contactTitle');
    home('.contact-section .contact-inner>div>p:not(.eyebrow)', 'contactDescription');
    home('.contact-links>a', 'githubLabel'); home('.contact-links>span', 'contactTagline');
    home('.site-footer p', 'footerText'); home('.site-footer p>span', 'footerTagline');

    doc.querySelectorAll('.featured,.project-card').forEach(card => {
      const id = projectId(card);
      if (!id) return;
      const project = (selector,path) => add(card.querySelector(selector),'project',id,path);
      project('h3','name');
      if (card.classList.contains('featured')) {
        project('.featured-content>p:not([class])','cardSummary');
        project('.featured-role','cardRole'); project('.status','status');
        card.querySelectorAll('.feature-scope>div').forEach((node,i) => {
          add(node.querySelector('strong'),'project',id,`scopes.${i}.title`);
          add(node.querySelector('p'),'project',id,`scopes.${i}.description`);
        });
      } else {
        project('.card-summary','cardSummary'); project('.card-role','cardRole');
        project('.card-index','category'); project('.card-state','status');
        project('.card-meta','period'); project('.card-meta>span','team');
      }
      card.querySelectorAll('.tags>li').forEach(node => add(node,'project',id,'cardTags'));
    });
  }
  function mapDetail(doc, rootOverride) {
    const root = rootOverride || doc.querySelector('.project-detail');
    if (!root) return;
    const id = frame.contentWindow.location.pathname.split('/').pop().replace(/\.html$/, '');
    const project = (selector,path) => add(root.querySelector(selector),'project',id,path);
    project('.detail-hero h1','name'); project('.detail-hero .eyebrow','category');
    project('.detail-hero .status','status'); project('.detail-summary','summary');
    project('.detail-meta','period'); project('.detail-meta>span','team');
    project('.pdf-project-heading h1','name'); project('.pdf-kicker','category'); project('.pdf-status','status'); project('.pdf-project-summary','summary'); project('.pdf-meta','period'); project('.pdf-meta>span','team'); root.querySelectorAll('.pdf-tags>li').forEach(n=>add(n,'project',id,'tags'));
    root.querySelectorAll('.detail-hero .tags>li').forEach(node => add(node,'project',id,'tags'));
    project('.role-callout>strong','role'); project('.detail-result>strong','result');
    root.querySelectorAll('.contribution-card').forEach((node,i) => {
      add(node.querySelector('h3'),'project',id,`contributions.${i}.title`);
      node.querySelectorAll('li').forEach(item => add(item,'project',id,`contributions.${i}.items`));
    });
    root.querySelectorAll('.detail-flow>li').forEach((node,i) => {
      add(node.querySelector('strong'),'project',id,`flow.${i}.title`);
      add(node.querySelector('p'),'project',id,`flow.${i}.description`);
    });
    project('.problem-card h3','problem.title');
    root.querySelectorAll('.problem-steps p').forEach((node,i) => add(node,'project',id,`problem.${['problem','action','result'][i]}`));
    project('.limitations-card p','limitation');
    root.querySelectorAll('.editable-detail-section').forEach((node,localIndex) => {
      const i = Number(node.dataset.typoExtraIndex ?? localIndex);
      add(node.querySelector('h2'),'project',id,`extraSections.${i}.title`);
      add(node.querySelector('.eyebrow'),'project',id,`extraSections.${i}.eyebrow`);
      node.querySelectorAll('.editable-copy').forEach((item,j) => add(item,'project',id,`extraSections.${i}.paragraphs.${j}`));
      node.querySelectorAll('.editable-list li').forEach(item => add(item,'project',id,`extraSections.${i}.items`));
    });
    root.querySelectorAll('img').forEach((image,localIndex) => {
      const i = Number(image.dataset.typoImageIndex ?? localIndex);
      const panel = image.closest('.tracking-panel');
      const caption = panel?.querySelector('.tracking-panel-copy') || image.closest('figure')?.querySelector('figcaption');
      if (!caption) return;
      add(caption.querySelector('strong'),'project',id,`images.${i}.label`);
      add(caption.querySelector(panel ? 'span' : 'p'),'project',id,`images.${i}.description`);
      if (!panel) add(caption.querySelector('span'),'project',id,`images.${i}.eyebrow`);
    });
    root.querySelectorAll('.tracking-figure').forEach((node,i) => {
      add(node.querySelector('.tracking-figure-head strong'),'project',id,`imageGroups.${i}.title`);
      add(node.querySelector('.tracking-figure-head span'),'project',id,`imageGroups.${i}.eyebrow`);
      add(node.querySelector('figcaption'),'project',id,`imageGroups.${i}.caption`);
    });
  }

 if(doc.body.classList.contains('home-page'))mapHome(doc);
 else if(doc.querySelector('.project-detail'))mapDetail(doc);
 else {
  doc.querySelectorAll('.pdf-profile').forEach(page=>{
   const h=(sel,key)=>add(page.querySelector(sel),'home','',key);
   h('.pdf-intro-copy h1','name');h('.pdf-kicker','label');h('.pdf-name-en','englishName');h('.pdf-position','position');h('.pdf-profile-link','githubLabel');
   page.querySelectorAll('.pdf-description p').forEach((n,i)=>add(n,'home','',`description.${i}`));
   page.querySelectorAll('.pdf-facts>div').forEach((n,i)=>{add(n.querySelector('dt'),'home','',`facts.${i}.label`);add(n.querySelector('dd'),'home','',`facts.${i}.value`)});
   page.querySelectorAll('.pdf-skill').forEach((n,i)=>{add(n.querySelector('h2'),'home','',`skills.${i}.title`);add(n.querySelector('p'),'home','',`skills.${i}.body`);add(n.querySelector('.pdf-skill-context'),'home','',`skills.${i}.context`)});
  });
  doc.querySelectorAll('.pdf-project').forEach(page=>mapDetail(doc,page));
 }
 const roots=[...doc.querySelectorAll('.project-detail,.pdf-project')];
 for(const root of roots){root.querySelectorAll('.detail-section-head').forEach(head=>{const section=head.closest('.detail-section'),id=section.getAttribute('aria-labelledby');const key=({'contribution-title':'contributions','images-title':'images','flow-title':'flow','problem-title':'problem'})[id]||'extra:'+id;head.querySelectorAll('h2,.eyebrow').forEach(n=>{if(!records.some(r=>r.node===n))add(n,'project','', '@'+key)});});root.querySelectorAll('.detail-flow>li>span').forEach(n=>add(n,'project','','@flow'));root.querySelectorAll('.detail-keyline>div>span').forEach(n=>add(n,'project','','@keyline'));}
 if(doc.body.classList.contains('home-page')){for(const [sel,key]of[['#skills .section-head h2','skills'],['#skills .section-head .eyebrow','skills'],['.about-section>.container>div>.eyebrow','about'],['.education>.eyebrow','education'],['.contact-section .eyebrow','contact']])add(doc.querySelector(sel),'home','', '@'+key);}
 return records;
 }
 function reset(doc){for(const node of touched){const old=originals.get(node);if(old&&node.isConnected){if(old.value)node.style.setProperty('font-size',old.value,old.priority);else node.style.removeProperty('font-size');if(old.weight)node.style.setProperty('font-weight',old.weight,old.weightPriority);else node.style.removeProperty('font-weight');}}touched=[];doc.querySelectorAll('[data-typography-run]').forEach(span=>{const parent=span.parentNode;span.replaceWith(...span.childNodes);parent.normalize();});}
 function ranges(record,entry,boldEntry){
  const sizeRuns=entry?.runs||[],boldRuns=boldEntry?.runs||[];if(!sizeRuns.length&&!boldRuns.length)return;
  const {node,key,offset}=record,value=plain(node,key),leading=value.length-value.trimStart().length,{parts}=pieces(node,key);
  for(const piece of parts){const text=piece.node.data,start=offset+piece.start-leading,end=start+text.length,intersects=r=>r.end>start&&r.start<end;
   const sizes=sizeRuns.filter(intersects),weights=boldRuns.filter(intersects);if(!sizes.length&&!weights.length)continue;
   const points=[...new Set([0,text.length,...[...sizes,...weights].flatMap(r=>[Math.max(0,r.start-start),Math.min(text.length,r.end-start)])])].sort((a,b)=>a-b),frag=node.ownerDocument.createDocumentFragment();
   for(let i=0;i<points.length-1;i++){const a=points[i],b=points[i+1],size=sizes.find(r=>r.start<=start+a&&r.end>=start+b),weight=weights.find(r=>r.start<=start+a&&r.end>=start+b);if(!size&&!weight){frag.append(text.slice(a,b));continue;}
    const span=node.ownerDocument.createElement('span');span.dataset.typographyRun='';if(size)span.style.setProperty('font-size',(size.size/100)+'em','important');if(weight)span.style.setProperty('font-weight',weight.bold?'700':'400','important');span.textContent=text.slice(a,b);frag.append(span);
   }piece.node.replaceWith(frag);
  }
 }
 function apply(doc=document){reset(doc);const records=collect(doc),configs=new Map();for(const record of records){if(!configs.has(record.owner))configs.set(record.owner,configFor(record.owner));}const selected=records.filter(r=>active(configs.get(r.owner)));const bases=selected.map(r=>parseFloat(getComputedStyle(r.node).fontSize));for(let i=0;i<selected.length;i++){const r=selected[i],config=configs.get(r.owner);if(!originals.has(r.node))originals.set(r.node,{value:r.node.style.getPropertyValue('font-size'),priority:r.node.style.getPropertyPriority('font-size'),weight:r.node.style.getPropertyValue('font-weight'),weightPriority:r.node.style.getPropertyPriority('font-weight')});const scale=(config.sections?.[scope(r)]||100)*(config.fields?.[r.key]||100)/10000;r.node.style.setProperty('font-size',(Math.round(bases[i]*scale*1000)/1000)+'px','important');if(Object.prototype.hasOwnProperty.call(config.bold||{},r.key))r.node.style.setProperty('font-weight',config.bold[r.key]?'700':'400','important');touched.push(r.node);}for(const r of selected)ranges(r,configs.get(r.owner).ranges?.[r.key],configs.get(r.owner).boldRanges?.[r.key]);return selected.length;}
 window.PortfolioTypography={apply,collect};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>apply());else apply();
 window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>apply(),80)},{passive:true});
})();
