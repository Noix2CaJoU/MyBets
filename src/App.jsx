import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";

const SPORTS = ["Football","Tennis","Basketball","Rugby","Formule 1","Hockey","Autre"];
const SPORT_COLORS = {Football:"#378ADD",Tennis:"#1D9E75",Basketball:"#EF9F27",Rugby:"#D85A30","Formule 1":"#E24B4A",Hockey:"#7F77DD",Autre:"#888780"};

const DEMO = [
  {id:"d1",date:"2025-05-20",sport:"Football",evenement:"PSG vs OM",pari:"Victoire PSG",mise:20,cote:1.85,resultat:"gain",gain_net:17},
  {id:"d2",date:"2025-05-18",sport:"Tennis",evenement:"Nadal vs Djokovic",pari:"Djokovic vainqueur",mise:15,cote:2.10,resultat:"perte",gain_net:-15},
  {id:"d3",date:"2025-05-22",sport:"Football",evenement:"Real vs Barça",pari:"Les deux équipes marquent",mise:10,cote:1.65,resultat:"gain",gain_net:6.5},
  {id:"d4",date:"2025-05-23",sport:"Basketball",evenement:"Lakers vs Warriors",pari:"Warriors +5.5",mise:25,cote:1.90,resultat:"encours",gain_net:0},
  {id:"d5",date:"2025-05-15",sport:"Football",evenement:"Man City vs Arsenal",pari:"Match nul",mise:12,cote:3.40,resultat:"perte",gain_net:-12},
];

const s = {
  app:{display:"flex",flexDirection:"column",height:"100dvh",background:"#0d0d0f",color:"#f0f0f0",fontFamily:"-apple-system,'SF Pro Display',sans-serif",overflow:"hidden"},
  header:{padding:"52px 20px 0",flexShrink:0,transition:"transform .3s ease, opacity .3s ease"},
  title:{fontSize:24,fontWeight:700,letterSpacing:-0.5},
  titleDot:{color:"#1D9E75"},
  sub:{fontSize:12,color:"#666",marginTop:2,marginBottom:14},
  content:{flex:1,overflowY:"auto",overflowX:"hidden",WebkitOverflowScrolling:"touch",padding:"0 16px 80px"},
  nav:{flexShrink:0,background:"#161618",borderTop:"0.5px solid rgba(255,255,255,0.08)",display:"grid",gridTemplateColumns:"repeat(3,1fr)",paddingBottom:"env(safe-area-inset-bottom,0px)"},
  navBtn:{display:"flex",flexDirection:"column",alignItems:"center",padding:"10px 4px 8px",gap:3,background:"transparent",border:"none",color:"#666",fontSize:10,fontFamily:"inherit",cursor:"pointer"},
  navBtnActive:{color:"#1D9E75"},
  metrics:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16},
  metric:{background:"#161618",borderRadius:12,padding:"14px",border:"0.5px solid rgba(255,255,255,0.08)"},
  metricLabel:{fontSize:11,color:"#666",textTransform:"uppercase",letterSpacing:0.5,marginBottom:6},
  metricVal:{fontSize:22,fontWeight:700,letterSpacing:-0.5},
  filterRow:{display:"flex",gap:8,marginBottom:12,alignItems:"center"},
  select:{flex:1,background:"#161618",border:"0.5px solid rgba(255,255,255,0.14)",borderRadius:10,color:"#f0f0f0",fontSize:14,fontFamily:"inherit",padding:"9px 14px",appearance:"none",WebkitAppearance:"none",cursor:"pointer",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 12px center"},
  chip:{flexShrink:0,padding:"8px 14px",borderRadius:10,fontSize:13,cursor:"pointer",border:"0.5px solid rgba(255,255,255,0.14)",background:"transparent",color:"#888",fontFamily:"inherit",whiteSpace:"nowrap"},
  chipActive:{background:"#1D9E7522",color:"#1D9E75",borderColor:"#1D9E7544"},
  card:{background:"#161618",borderRadius:12,border:"0.5px solid rgba(255,255,255,0.08)",marginBottom:10,overflow:"hidden",cursor:"pointer"},
  cardTop:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:14},
  cardEvent:{fontSize:15,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},
  cardDetail:{fontSize:12,color:"#666",marginTop:3},
  cardBot:{display:"flex",borderTop:"0.5px solid rgba(255,255,255,0.08)"},
  cardStat:{flex:1,padding:"10px 4px",textAlign:"center",borderRight:"0.5px solid rgba(255,255,255,0.08)"},
  cardStatLabel:{fontSize:9,color:"#444",textTransform:"uppercase",letterSpacing:0.4,marginBottom:3},
  cardStatVal:{fontSize:13,fontWeight:600},
  sportTag:{fontSize:11,padding:"3px 8px",borderRadius:20,background:"#1e1e21",whiteSpace:"nowrap",marginLeft:8,flexShrink:0},
  sectionTitle:{fontSize:11,color:"#555",fontWeight:500,margin:"14px 0 10px",textTransform:"uppercase",letterSpacing:0.5},
  fab:{position:"fixed",right:20,bottom:"calc(68px + env(safe-area-inset-bottom,0px))",width:52,height:52,borderRadius:"50%",background:"#1D9E75",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(29,158,117,0.4)",zIndex:50},
  overlay:{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:100,display:"flex",alignItems:"flex-end",overflow:"hidden"},
  sheet:{background:"#161618",borderRadius:"20px 20px 0 0",padding:"0 16px calc(28px + env(safe-area-inset-bottom,0px))",width:"100%",maxHeight:"90dvh",overflowY:"auto",boxSizing:"border-box"},
  handle:{width:36,height:4,background:"rgba(255,255,255,0.14)",borderRadius:2,margin:"12px auto 18px"},
  sheetTitle:{fontSize:18,fontWeight:700,marginBottom:20},
  formLabel:{fontSize:11,color:"#666",textTransform:"uppercase",letterSpacing:0.5,marginBottom:6,display:"block"},
  formInput:{width:"100%",background:"#1e1e21",border:"0.5px solid rgba(255,255,255,0.14)",borderRadius:8,color:"#f0f0f0",fontSize:15,fontFamily:"inherit",padding:"11px 12px",appearance:"none",WebkitAppearance:"none",marginBottom:12,boxSizing:"border-box",minWidth:0},
  twoCol:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,minWidth:0},
  btnRow:{display:"flex",gap:10,marginTop:20},
  btnCancel:{flex:1,padding:14,borderRadius:8,background:"#1e1e21",color:"#888",border:"none",fontSize:16,fontWeight:600,fontFamily:"inherit",cursor:"pointer"},
  btnSave:{flex:1,padding:14,borderRadius:8,background:"#1D9E75",color:"#fff",border:"none",fontSize:16,fontWeight:600,fontFamily:"inherit",cursor:"pointer"},
  btnDelete:{width:"100%",padding:12,borderRadius:8,background:"rgba(163,45,45,0.15)",color:"#F09595",border:"0.5px solid rgba(226,75,74,0.3)",fontSize:14,fontFamily:"inherit",cursor:"pointer",marginTop:10},
  empty:{textAlign:"center",padding:"48px 20px",color:"#555",fontSize:14},
  chartCard:{background:"#161618",borderRadius:12,border:"0.5px solid rgba(255,255,255,0.08)",padding:16,marginBottom:14},
  chartTitle:{fontSize:11,color:"#555",textTransform:"uppercase",letterSpacing:0.5,marginBottom:14},
  rateBar:{marginBottom:10},
  rateLabelRow:{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4},
  rateTrack:{background:"#1e1e21",borderRadius:20,height:6,overflow:"hidden"},
};

const Badge = ({r}) => {
  const styles = {
    gain:{background:"rgba(15,110,86,0.2)",color:"#5DCAA5",border:"0.5px solid rgba(29,158,117,0.3)"},
    perte:{background:"rgba(163,45,45,0.2)",color:"#F09595",border:"0.5px solid rgba(226,75,74,0.3)"},
    encours:{background:"rgba(133,79,11,0.2)",color:"#EF9F27",border:"0.5px solid rgba(239,159,39,0.3)"},
  };
  const labels = {gain:"Gagné",perte:"Perdu",encours:"En cours"};
  return <span style={{display:"inline-block",fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,...styles[r]}}>{labels[r]}</span>;
};

const NavIcon = ({tab}) => {
  if(tab==="home") return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
  if(tab==="stats") return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
};

export default function App() {
  const [paris, setParis] = useState(() => {
    try { const d = JSON.parse(localStorage.getItem("paris_betclic")||"[]"); return d.length ? d : DEMO; }
    catch { return DEMO; }
  });
  const [tab, setTab] = useState("home");
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);
  const contentRef = useRef(null);
  const [period, setPeriod] = useState("week");
  const [resultFilter, setResultFilter] = useState("all");
  const [sheet, setSheet] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({date:"",sport:"Rugby",evenement:"",pari:"",mise:"",cote:"1.10",resultat:"encours"});

  useEffect(() => { localStorage.setItem("paris_betclic", JSON.stringify(paris)); }, [paris]);

  const handleScroll = () => {
    const el = contentRef.current;
    if(!el) return;
    const y = el.scrollTop;
    setHeaderHidden(y > lastScrollY.current && y > 40);
    lastScrollY.current = y;
  };

  const save = () => {
    const mise = parseFloat(form.mise)||0;
    const cote = parseFloat(form.cote)||1;
    const res = form.resultat;
    const gain_net = res==="gain" ? parseFloat(((mise*cote)-mise).toFixed(2)) : res==="perte" ? -mise : 0;
    const obj = {...form, mise, cote, gain_net, id: editId||Date.now().toString()};
    setParis(p => editId ? p.map(x=>x.id===editId?obj:x) : [...p, obj]);
    setSheet(false);
  };

  const del = () => { if(confirm("Supprimer ?")){ setParis(p=>p.filter(x=>x.id!==editId)); setSheet(false); } };

  const openAdd = () => {
    setEditId(null);
    setForm({date:new Date().toISOString().split("T")[0],sport:"Rugby",evenement:"",pari:"",mise:"",cote:"1.10",resultat:"encours"});
    setSheet(true);
  };

  const openEdit = (p) => {
    setEditId(p.id);
    setForm({date:p.date,sport:p.sport,evenement:p.evenement,pari:p.pari||"",mise:p.mise,cote:p.cote,resultat:p.resultat});
    setSheet(true);
  };

  const filtered = paris.filter(p => {
    const now = new Date();
    if(period==="week"){const w=new Date(now);w.setDate(now.getDate()-7);if(new Date(p.date+"T12:00:00")<w) return false;}
    else if(period==="month"){const d=new Date(p.date+"T12:00:00");if(d.getMonth()!==now.getMonth()||d.getFullYear()!==now.getFullYear()) return false;}
    else if(period==="year"){if(new Date(p.date+"T12:00:00").getFullYear()!==now.getFullYear()) return false;}
    if(resultFilter!=="all" && p.resultat!==resultFilter) return false;
    return true;
  }).sort((a,b)=>new Date(b.date)-new Date(a.date));

  const closed = paris.filter(p=>p.resultat!=="encours");
  const totalMise = paris.reduce((s,p)=>s+p.mise,0);
  const gnl = closed.reduce((s,p)=>s+p.gain_net,0);
  const wins = paris.filter(p=>p.resultat==="gain").length;
  const taux = closed.length ? Math.round(wins/closed.length*100) : 0;
  const roi = totalMise>0 ? ((gnl/totalMise)*100).toFixed(1) : "0.0";

  const byMonth = {};
  closed.forEach(p=>{
    const d=new Date(p.date+"T12:00:00");
    const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
    if(!byMonth[k]) byMonth[k]={pnl:0,label:["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"][d.getMonth()]};
    byMonth[k].pnl+=p.gain_net;
  });
  const monthData = Object.keys(byMonth).sort().slice(-6).map(k=>({name:byMonth[k].label,pnl:parseFloat(byMonth[k].pnl.toFixed(2))}));

  const bySport = {};
  paris.forEach(p=>{
    if(!bySport[p.sport]) bySport[p.sport]={total:0,wins:0};
    bySport[p.sport].total++;
    if(p.resultat==="gain") bySport[p.sport].wins++;
  });
  const pieData = Object.entries(bySport).map(([name,d])=>({name,value:d.total,color:SPORT_COLORS[name]||"#888"}));

  const RESULT_FILTERS = [["gain","Gagnés"],["perte","Perdus"],["encours","En cours"]];
  const TABS = [["home","Accueil"],["stats","Stats"],["import","Importer"]];

  return (
    <div style={s.app}>
      <div style={{...s.header, transform: headerHidden?"translateY(-110%)":"translateY(0)", opacity: headerHidden?0:1}}>
        <div style={s.title}>MyBets<span style={s.titleDot}>.</span></div>
        <div style={s.sub}>{paris.length} paris · ROI {roi>=0?"+":""}{roi}%</div>
      </div>

      <div ref={contentRef} onScroll={handleScroll} style={s.content}>
        {tab==="home" && <>
          <div style={s.metrics}>
            <div style={s.metric}><div style={s.metricLabel}>Paris</div><div style={s.metricVal}>{paris.length}</div></div>
            <div style={s.metric}><div style={s.metricLabel}>Misé</div><div style={s.metricVal}>{totalMise.toFixed(0)} €</div></div>
            <div style={s.metric}><div style={s.metricLabel}>Gain net</div><div style={{...s.metricVal,color:gnl>=0?"#1D9E75":"#E24B4A"}}>{gnl>=0?"+":""}{gnl.toFixed(2)} €</div></div>
            <div style={s.metric}><div style={s.metricLabel}>Réussite</div><div style={s.metricVal}>{taux}%</div></div>
          </div>

          <div style={s.filterRow}>
            <select style={s.select} value={period} onChange={e=>setPeriod(e.target.value)}>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
            </select>
            <div style={{display:"flex",gap:6}}>
              {RESULT_FILTERS.map(([v,l])=>
                <button key={v} style={{...s.chip,...(resultFilter===v?s.chipActive:{})}} onClick={()=>setResultFilter(f=>f===v?"all":v)}>{l}</button>
              )}
            </div>
          </div>

          {filtered.length===0
            ? <div style={s.empty}><p>Aucun pari trouvé.<br/>Appuie sur + pour ajouter.</p></div>
            : <>
              <div style={s.sectionTitle}>{filtered.length} pari{filtered.length>1?"s":""}</div>
              {filtered.map(p=>{
                const gainColor=p.resultat==="gain"?"#5DCAA5":p.resultat==="perte"?"#F09595":"#EF9F27";
                const gnDisplay=p.resultat!=="encours"?(p.gain_net>=0?"+":"")+p.gain_net.toFixed(2)+" €":"—";
                return <div key={p.id} style={s.card} onClick={()=>openEdit(p)}>
                  <div style={s.cardTop}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={s.cardEvent}>{p.evenement||"—"}</div>
                      <div style={s.cardDetail}>{p.pari||p.sport} · {new Date(p.date+"T12:00:00").toLocaleDateString("fr-FR",{day:"numeric",month:"short"})}</div>
                    </div>
                    <span style={{...s.sportTag,color:SPORT_COLORS[p.sport]||"#888"}}>{p.sport}</span>
                  </div>
                  <div style={s.cardBot}>
                    <div style={s.cardStat}><div style={s.cardStatLabel}>Mise</div><div style={s.cardStatVal}>{p.mise} €</div></div>
                    <div style={s.cardStat}><div style={s.cardStatLabel}>Cote</div><div style={s.cardStatVal}>{p.cote}</div></div>
                    <div style={s.cardStat}><div style={s.cardStatLabel}>Gain net</div><div style={{...s.cardStatVal,color:gainColor}}>{gnDisplay}</div></div>
                    <div style={{...s.cardStat,borderRight:"none"}}><div style={s.cardStatLabel}>Statut</div><div style={s.cardStatVal}><Badge r={p.resultat}/></div></div>
                  </div>
                </div>;
              })}
            </>
          }
        </>}

        {tab==="stats" && <>
          <div style={{...s.chartCard,marginTop:4}}>
            <div style={s.chartTitle}>Gains / Pertes par mois</div>
            {monthData.length ? <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthData} margin={{top:0,right:0,left:-20,bottom:0}}>
                <XAxis dataKey="name" tick={{fill:"#666",fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#666",fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>v+"€"}/>
                <Tooltip contentStyle={{background:"#1e1e21",border:"0.5px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#f0f0f0",fontSize:12}} formatter={v=>[v+"€","Gain net"]}/>
                <Bar dataKey="pnl" radius={[4,4,0,0]}>
                  {monthData.map((d,i)=><Cell key={i} fill={d.pnl>=0?"#1D9E75":"#E24B4A"}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer> : <div style={{color:"#555",fontSize:13,textAlign:"center",padding:"40px 0"}}>Aucune donnée</div>}
          </div>
          <div style={s.chartCard}>
            <div style={s.chartTitle}>Répartition par sport</div>
            {pieData.length ? <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2}>
                  {pieData.map((d,i)=><Cell key={i} fill={d.color}/>)}
                </Pie>
                <Legend iconSize={8} wrapperStyle={{fontSize:11,color:"#888"}}/>
                <Tooltip contentStyle={{background:"#1e1e21",border:"0.5px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#f0f0f0",fontSize:12}}/>
              </PieChart>
            </ResponsiveContainer> : <div style={{color:"#555",fontSize:13,textAlign:"center",padding:"40px 0"}}>Aucune donnée</div>}
          </div>
          <div style={s.chartCard}>
            <div style={s.chartTitle}>Taux de réussite par sport</div>
            {Object.entries(bySport).length ? Object.entries(bySport).map(([sport,d])=>{
              const r=d.total?Math.round(d.wins/d.total*100):0;
              return <div key={sport} style={s.rateBar}>
                <div style={s.rateLabelRow}><span style={{color:"#f0f0f0"}}>{sport}</span><span style={{color:"#666"}}>{r}% ({d.wins}/{d.total})</span></div>
                <div style={s.rateTrack}><div style={{height:6,borderRadius:20,width:r+"%",background:SPORT_COLORS[sport]||"#888",transition:"width .4s"}}/></div>
              </div>;
            }) : <div style={{color:"#555",fontSize:13,textAlign:"center",padding:"20px 0"}}>Aucune donnée</div>}
          </div>
        </>}

        {tab==="import" && <>
          <div style={{...s.chartCard,marginTop:4}}>
            <div style={{fontSize:15,fontWeight:600,marginBottom:8}}>Importer depuis Betclic</div>
            <div style={{fontSize:13,color:"#666",lineHeight:1.7,marginBottom:16}}>Exporte ton historique depuis ton espace Betclic et importe le fichier CSV ici.</div>
            <ol style={{listStyle:"none"}}>
              {["Connecte-toi sur betclic.fr","Mon compte → Historique des paris","Clique sur Exporter → télécharge le CSV","Importe le fichier ci-dessous"].map((step,i)=>
                <li key={i} style={{display:"flex",gap:12,marginBottom:12,alignItems:"flex-start"}}>
                  <span style={{background:"#1e1e21",color:"#666",width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0,marginTop:1}}>{i+1}</span>
                  <span style={{fontSize:13,color:"#888",lineHeight:1.5}}>{step}</span>
                </li>
              )}
            </ol>
          </div>
          <div style={s.chartCard}>
            <div style={{fontSize:15,fontWeight:600,marginBottom:12}}>Sélectionner un fichier</div>
            <label style={{display:"block",background:"#1e1e21",border:"1px dashed rgba(255,255,255,0.14)",borderRadius:8,padding:24,textAlign:"center",cursor:"pointer",color:"#666",fontSize:13}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.5" style={{margin:"0 auto 8px",display:"block"}}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Appuyer pour sélectionner un CSV
              <input type="file" accept=".csv" style={{display:"none"}} onChange={e=>{
                const file=e.target.files[0];
                if(!file) return;
                const reader=new FileReader();
                reader.onload=ev=>{
                  const lines=ev.target.result.split("\n").filter(l=>l.trim());
                  const headers=lines[0].split(",").map(h=>h.trim().toLowerCase().replace(/["\r]/g,""));
                  let added=0;
                  const newParis=[...paris];
                  for(let i=1;i<lines.length;i++){
                    const cols=lines[i].split(",").map(c=>c.trim().replace(/^"|"$|\r/g,""));
                    if(cols.length<2) continue;
                    const obj={};headers.forEach((h,j)=>obj[h]=cols[j]||"");
                    const mise=parseFloat(obj.mise)||0,cote=parseFloat(obj.cote)||1;
                    const r=(obj.resultat||"").toLowerCase();
                    const resultat=r.includes("gagn")||r==="gain"?"gain":r.includes("perd")||r==="perte"?"perte":"encours";
                    const gain_net=resultat==="gain"?parseFloat(((mise*cote)-mise).toFixed(2)):resultat==="perte"?-mise:0;
                    newParis.push({id:Date.now().toString()+i,date:obj.date||new Date().toISOString().split("T")[0],sport:obj.sport||"Autre",evenement:obj.evenement||obj.match||"",pari:obj.pari||obj.selection||"",mise,cote,resultat,gain_net});
                    added++;
                  }
                  setParis(newParis);
                  alert(`${added} paris importés !`);
                  setTab("home");
                };
                reader.readAsText(file);
              }}/>
            </label>
          </div>
          <div style={{...s.chartCard,borderColor:"rgba(29,158,117,0.3)"}}>
            <div style={{fontSize:13,fontWeight:600,color:"#1D9E75",marginBottom:6}}>Format CSV attendu</div>
            <div style={{fontSize:12,color:"#666",lineHeight:1.7}}>Colonnes reconnues :<br/><code style={{color:"#5DCAA5"}}>date, sport, evenement, pari, mise, cote, resultat</code></div>
          </div>
        </>}
      </div>

      <nav style={s.nav}>
        {TABS.map(([t,l])=><button key={t} style={{...s.navBtn,...(tab===t?s.navBtnActive:{})}} onClick={()=>setTab(t)}><NavIcon tab={t}/>{l}</button>)}
      </nav>

      <button style={s.fab} onClick={openAdd} aria-label="Ajouter un pari">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>

      {sheet && <div style={s.overlay} onClick={e=>{if(e.target===e.currentTarget)setSheet(false);}}>
        <div style={s.sheet}>
          <div style={s.handle}/>
          <div style={s.sheetTitle}>{editId?"Modifier le pari":"Nouveau pari"}</div>
          <div style={s.twoCol}>
            <div><label style={s.formLabel}>Date</label><input type="date" style={s.formInput} value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></div>
            <div><label style={s.formLabel}>Sport</label>
              <select style={s.formInput} value={form.sport} onChange={e=>setForm(f=>({...f,sport:e.target.value}))}>
                {SPORTS.map(sp=><option key={sp}>{sp}</option>)}
              </select>
            </div>
          </div>
          <label style={s.formLabel}>Événement</label>
          <input type="text" style={s.formInput} placeholder="PSG vs OM" value={form.evenement} onChange={e=>setForm(f=>({...f,evenement:e.target.value}))}/>
          <label style={s.formLabel}>Type de pari</label>
          <input type="text" style={s.formInput} placeholder="Victoire PSG, +1.5 buts..." value={form.pari} onChange={e=>setForm(f=>({...f,pari:e.target.value}))}/>
          <div style={s.twoCol}>
            <div><label style={s.formLabel}>Mise (€)</label><input type="number" style={s.formInput} placeholder="10" value={form.mise} onChange={e=>setForm(f=>({...f,mise:e.target.value}))}/></div>
            <div><label style={s.formLabel}>Cote</label><input type="number" style={s.formInput} placeholder="1.10" value={form.cote} onChange={e=>setForm(f=>({...f,cote:e.target.value}))}/></div>
          </div>
          <label style={s.formLabel}>Résultat</label>
          <select style={s.formInput} value={form.resultat} onChange={e=>setForm(f=>({...f,resultat:e.target.value}))}>
            <option value="encours">En cours</option>
            <option value="gain">Gagné ✓</option>
            <option value="perte">Perdu ✗</option>
          </select>
          <div style={s.btnRow}>
            <button style={s.btnCancel} onClick={()=>setSheet(false)}>Annuler</button>
            <button style={s.btnSave} onClick={save}>Enregistrer</button>
          </div>
          {editId && <button style={s.btnDelete} onClick={del}>Supprimer ce pari</button>}
        </div>
      </div>}
    </div>
  );
}
