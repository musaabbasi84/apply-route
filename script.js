var $=function(i){return document.getElementById(i)};

/* ===== EmailJS inquiry sending (shared) ===== */
var EJ=window.EMAILJS_CONFIG||{},EMAIL_RE=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,PHONE_RE=/^\+?\d{7,15}$/,COOL_MS=30000;
function sendInquiry(p){
if(!EJ.serviceId||!EJ.templateId||!EJ.publicKey){console.error("[EmailJS] Public Key is missing. Set it in emailjs-config.js (EmailJS → Account → General).");return Promise.reject({code:"config"})}
var ctl=new AbortController(),to=setTimeout(function(){ctl.abort()},20000);
return fetch("https://api.emailjs.com/api/v1.0/email/send",{method:"POST",headers:{"Content-Type":"application/json"},signal:ctl.signal,body:JSON.stringify({service_id:EJ.serviceId,template_id:EJ.templateId,user_id:EJ.publicKey,template_params:{student_name:p.student_name,student_email:p.student_email,phone:p.phone,country:p.country,message:p.message}})}).then(function(r){clearTimeout(to);return r.text().then(function(t){if(!r.ok){console.error("[EmailJS] "+r.status+": "+t);throw{code:"http",status:r.status}}return t})},function(e){clearTimeout(to);throw{code:e&&e.name==="AbortError"?"timeout":"network"}})}
function sendError(e){var c=e&&e.code;
if(c==="network"||c==="timeout")return"We couldn’t reach the server. Please check your internet connection and try again.";
if(c==="http"&&e.status===429)return"Too many requests right now. Please wait a minute and try again.";
return"Sorry, your message could not be sent. Please try again later or contact us by phone or email."}
function cooling(){try{return Date.now()-(+localStorage.getItem("ar_last")||0)<COOL_MS}catch(x){return false}}
function markSent(){try{localStorage.setItem("ar_last",Date.now())}catch(x){}}
function setBusy(b,on,lt,nt){b.disabled=on;b.classList.toggle("ld",on);b.setAttribute("aria-busy",on?"true":"false");b.textContent=on?lt:nt}
var toastT;function toast(t,k){var el=$("toast");el.textContent=t;el.className="toast on "+(k||"");clearTimeout(toastT);toastT=setTimeout(function(){el.className="toast"},5000)}
var D=[
{n:"United Kingdom",f:"🇬🇧",t:"Quality Education + Great Opportunities",g:"linear-gradient(#7fb2e5,#c9defa)",e:"🎡",fee:"£12,000 – £38,000 / yr",visa:"Student visa (sponsored by a licensed university)",work:"Up to 20 hrs/week in term; Graduate Route stay 2 yrs (3 for PhD)",in:"Sept, Jan",lang:"IELTS UKVI / equivalent",u:["University of Oxford","University of Manchester","University of Edinburgh"],schengen:0},
{n:"Germany",f:"🇩🇪",t:"Affordable Education & Strong Job Market",g:"linear-gradient(#e8a85b,#f6d9a8)",e:"🏛️",fee:"€0 – €3,000 / yr (public)",visa:"German national student visa + residence permit",work:"140 full / 280 half days per year; 18-month job-search permit",in:"Oct (winter), Apr (summer)",lang:"IELTS / TestDaF / DSH",u:["TU Munich","Heidelberg University","RWTH Aachen"]},
{n:"France",f:"🇫🇷",t:"Art, Science & Global Business",g:"linear-gradient(#8fb7f0,#f3c9d8)",e:"🗼",fee:"€2,800 – €4,000 / yr (public, non-EU)",visa:"Long-stay student visa (VLS-TS)",work:"Around 20 hrs/week",in:"Sept, Jan",lang:"IELTS / DELF / TCF",u:["Sorbonne University","Sciences Po","Paris-Saclay University"]},
{n:"Italy",f:"🇮🇹",t:"Design, Heritage & Innovation",g:"linear-gradient(#f2a56b,#fbd9a8)",e:"🏟️",fee:"€1,000 – €4,000 / yr (public)",visa:"National study visa (type D) + permesso di soggiorno",work:"Around 20 hrs/week",in:"Sept/Oct, Feb",lang:"IELTS / CELI / CILS",u:["Politecnico di Milano","University of Bologna","Sapienza University of Rome"]},
{n:"Spain",f:"🇪🇸",t:"Sunny Campuses & Vibrant Life",g:"linear-gradient(#f5c04a,#f08a4b)",e:"⛪",fee:"€1,000 – €4,000 / yr (public)",visa:"National student visa + TIE card",work:"Up to 30 hrs/week permitted",in:"Sept, Feb",lang:"IELTS / DELE",u:["University of Barcelona","Complutense Madrid","Pompeu Fabra"]},
{n:"Netherlands",f:"🇳🇱",t:"English Programs & Open Culture",g:"linear-gradient(#7cc6e8,#cfeaf5)",e:"🌷",fee:"€8,000 – €20,000 / yr",visa:"MVV + residence permit (via university)",work:"16 hrs/week or full-time in summer; orientation year after graduation",in:"Sept, Feb",lang:"IELTS / TOEFL",u:["TU Delft","University of Amsterdam","Utrecht University"]},
{n:"Switzerland",f:"🇨🇭",t:"Elite Research & Innovation",g:"linear-gradient(#9cc3e6,#e6f0f8)",e:"🏔️",fee:"CHF 1,000 – 4,000 / yr (public)",visa:"National D visa + cantonal permit",work:"Up to 15 hrs/week after first 6 months",in:"Sept, Feb",lang:"IELTS / TOEFL / German-French",u:["ETH Zurich","EPFL","University of Zurich"]},
{n:"Sweden",f:"🇸🇪",t:"Innovation & Work-Life Balance",g:"linear-gradient(#7fb5de,#f5e49a)",e:"🦌",fee:"SEK 100,000 – 300,000 / yr",visa:"Residence permit for studies",work:"No fixed weekly hour limit",in:"Aug/Sept, Jan",lang:"IELTS / TOEFL",u:["KTH Royal Institute","Lund University","Uppsala University"]}];
var SC=["Austria","Belgium","Croatia","Czechia","Denmark","Estonia","Finland","France","Germany","Greece","Hungary","Iceland","Italy","Latvia","Liechtenstein","Lithuania","Luxembourg","Malta","Netherlands","Norway","Poland","Portugal","Slovakia","Slovenia","Spain","Sweden","Switzerland"];
var ALL=["United Kingdom"].concat(SC);
ALL.forEach(function(c){["sc","uc","cco"].forEach(function(id){var o=document.createElement("option");o.textContent=o.value=c;$(id).appendChild(o)})});
var FL={"United Kingdom":['0 0 60 30','<rect width="60" height="30" fill="#012169"/><path d="M0 0 60 30M60 0 0 30" stroke="#fff" stroke-width="6"/><path d="M0 0 60 30M60 0 0 30" stroke="#C8102E" stroke-width="2.5"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/>'],
"Germany":['0 0 5 3','<rect width="5" height="1" fill="#000"/><rect y="1" width="5" height="1" fill="#D00"/><rect y="2" width="5" height="1" fill="#FFCE00"/>'],
"France":['0 0 3 2','<rect width="1" height="2" fill="#0055A4"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#EF4135"/>'],
"Italy":['0 0 3 2','<rect width="1" height="2" fill="#009246"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#CE2B37"/>'],
"Spain":['0 0 4 3','<rect width="4" height="3" fill="#AA151B"/><rect y=".75" width="4" height="1.5" fill="#F1BF00"/>'],
"Netherlands":['0 0 3 2','<rect width="3" height="2" fill="#fff"/><rect width="3" height=".67" fill="#AE1C28"/><rect y="1.33" width="3" height=".67" fill="#21468B"/>'],
"Switzerland":['0 0 32 32','<rect width="32" height="32" fill="#D52B1E"/><path d="M16 7v18M7 16h18" stroke="#fff" stroke-width="6"/>'],
"Sweden":['0 0 16 10','<rect width="16" height="10" fill="#006AA7"/><path d="M5 0v10M0 5h16" stroke="#FECC00" stroke-width="2"/>']};
function flag(n){var f=FL[n];return f?'<svg viewBox="'+f[0]+'" preserveAspectRatio="xMidYMid slice" role="img" aria-label="'+n+' flag">'+f[1]+'</svg>':''}
function find(n){return D.filter(function(d){return d.n===n})[0]}
/* cards */
var rail=$("rail");
D.forEach(function(d){var a=document.createElement("button");a.className="cc";a.dataset.n=d.n.toLowerCase();
a.innerHTML='<div class="ph" style="background:'+d.g+'">'+d.e+'<span class="fl">'+flag(d.n)+'</span></div><div class="in"><h4>'+d.n+'</h4><p>'+d.t+'</p><span class="go">→</span></div>';
a.onclick=function(){info(d.n)};rail.appendChild(a)});
function sr(n){rail.scrollBy({left:n*340,behavior:"smooth"})}
$("pv").onclick=function(){sr(-1)};$("nx").onclick=function(){sr(1)};
function filter(t){t=(t||"").toLowerCase();var n=0;[].forEach.call(rail.children,function(e){var m=!t||e.dataset.n.indexOf(t)>-1;e.classList.toggle("hide",!m);if(m)n++});$("none").style.display=n?"none":"block"}
$("all").onclick=function(){$("q").value="";filter("");rail.scrollTo({left:0})};
$("sf").onsubmit=function(e){e.preventDefault();var c=$("sc").value,t=$("q").value.trim();
if(c&&!find(c)){$("cco").value=c;$("clv").value=$("sl").value||"Master's";go("contact");return}
filter(c||t);go("countries")};
function go(id){$(id).scrollIntoView({behavior:"smooth"})}
/* modals */
function show(h){$("mc").innerHTML=h;$("md").classList.add("on")}
function info(n){var d=find(n);
show('<span class="fi" style="width:52px;height:52px;display:block;margin:0 0 8px;border-width:2px">'+flag(d.n)+'</span><h3>Study in '+d.n+'</h3><p style="color:var(--mu)">'+d.t+'</p><div class="kv"><div><small>Tuition</small>'+d.fee+'</div><div><small>Intakes</small>'+d.in+'</div><div><small>Visa</small>'+d.visa+'</div><div><small>Work rights</small>'+d.work+'</div><div style="grid-column:1/-1"><small>Language tests</small>'+d.lang+'</div></div><b>Popular universities</b><ul>'+d.u.map(function(u){return"<li>"+u+"</li>"}).join("")+'</ul><button class="btn g" onclick="enq(\''+d.n+'\')">Enquire about '+d.n+'</button>')}
function enq(c){$("md").classList.remove("on");$("cco").value=c;go("contact")}
function openForm(){show('<h3>Get Started</h3><p style="color:var(--mu);font-size:14px">Tell us where you want to study.</p><div id="fm"><input id="fn" placeholder="Full name" aria-label="Full name" autocomplete="name" maxlength="100"><input id="fe" type="email" placeholder="Email" aria-label="Email" autocomplete="email" inputmode="email" maxlength="120"><input id="fp" type="tel" placeholder="Phone / WhatsApp Number" aria-label="Phone Number" autocomplete="tel" maxlength="25"><select id="fc" aria-label="Country">'+ALL.map(function(c){return"<option>"+c+"</option>"}).join("")+'</select><div class="hp" aria-hidden="true"><label>Leave this field empty<input id="fh" type="text" tabindex="-1" autocomplete="off"></label></div><div class="err" id="er" role="alert" aria-live="polite"></div><button class="btn g" style="width:100%" id="sb">Submit</button></div>');
var t0=Date.now(),busy=false;
$("sb").onclick=function(){if(busy)return;var n=$("fn").value.trim(),e=$("fe").value.trim(),c=$("fc").value,er=$("er");er.className="err";
if(n.length<2)return er.textContent="Please enter your name.";
if(!EMAIL_RE.test(e))return er.textContent="Please enter a valid email.";
if($("fh").value)return done();
if(Date.now()-t0<2500)return er.textContent="Please take a moment to check your details, then submit again.";
if(cooling())return er.textContent="Your enquiry was just sent. Please wait a few seconds before sending another.";
busy=true;er.textContent="";setBusy($("sb"),true,"Sending…","Submit");
sendInquiry({student_name:n,student_email:e,phone:"Not provided",country:c,message:"Quick enquiry from the Get Started form. Interested in studying in "+c+"."}).then(function(){markSent();done()},function(err){busy=false;setBusy($("sb"),false,"","Submit");er.textContent=sendError(err)});
function done(){$("fm").innerHTML='<div style="text-align:center;padding:20px 0"><div style="font-size:42px">✅</div><b id="tk"></b><p style="color:var(--mu)">A counsellor will contact you shortly.</p></div>';$("tk").textContent="Thank you, "+n+"!";toast("Enquiry sent successfully.","ok")}}}
[].forEach.call(document.querySelectorAll("[data-open]"),function(b){b.onclick=openForm});
$("mx").onclick=function(){$("md").classList.remove("on")};$("md").onclick=function(e){if(e.target===this)this.classList.remove("on")};
document.addEventListener("keydown",function(e){if(e.key==="Escape")$("md").classList.remove("on")});
/* universities */
function renderU(){var t=$("us").value.toLowerCase(),c=$("uc").value,h="",n=0;
D.forEach(function(d){d.u.forEach(function(u){if((!t||u.toLowerCase().indexOf(t)>-1)&&(!c||c===d.n)){n++;h+='<div class="un"><b>'+u+'</b><small><span class="fi">'+flag(d.n)+'</span>'+d.n+'</small><button onclick="info(\''+d.n+'\')">View country details →</button></div>'}})});
$("ul").innerHTML=h;$("un0").style.display=n?"none":"block"}
$("us").oninput=renderU;$("uc").onchange=renderU;renderU();
/* faq */
[["Which countries do you cover?","The United Kingdom and all 27 Schengen countries, with featured guides for the most popular destinations."],["Can I work while studying?","Yes in most countries, within limits that differ by country and visa. Open any country card to see typical work rights."],["Do I need one visa for all Schengen countries?","No. You apply to the country where you will study. Once resident there you can travel in the Schengen Area under its rules."],["Are there scholarships?","Yes. Many universities, governments and programs offer funding, and counsellors help you find and apply."],["How early should I apply?","Start 9–12 months before your intake to allow time for tests, documents, offers and visas."]].forEach(function(q){var d=document.createElement("div");d.className="fq";d.innerHTML='<button><b>'+q[0]+'</b><span>+</span></button><div>'+q[1]+'</div>';d.firstChild.onclick=function(){d.classList.toggle("on")};$("fa").appendChild(d)});
/* contact form */
(function(){var f=$("cf"),btn=$("cs"),st=$("ce2"),busy=false,t0=Date.now();
function msg(t,ok){st.textContent=t;st.className="err f"+(ok?" ok":"")}
f.onsubmit=function(e){e.preventDefault();if(busy)return;
var n=$("cn").value.trim(),m=$("ce").value.trim(),p=$("cp").value.trim(),c=$("cco").value,lv=$("clv").value,tx=$("cm").value.trim();
if(n.length<2)return msg("Please enter your name.");
if(!EMAIL_RE.test(m))return msg("Please enter a valid email.");
if(!PHONE_RE.test(p.replace(/[\s\-().]/g,"")))return msg("Please enter a valid phone number (7–15 digits, e.g. +92 300 1234567).");
if(!c)return msg("Please select a country.");
if($("hp").value){f.reset();return msg("Thank you! We will be in touch soon.",1)}
if(Date.now()-t0<2500)return msg("Please take a moment to check your details, then send again.");
if(cooling())return msg("Your message was just sent. Please wait a few seconds before sending another.");
busy=true;msg("");setBusy(btn,true,"Sending…","Send Message →");
sendInquiry({student_name:n,student_email:m,phone:p,country:c,message:"Study level: "+lv+"\n\n"+(tx||"(No additional message)")}).then(function(){
busy=false;setBusy(btn,false,"","Send Message →");markSent();f.reset();msg("✅ Message sent! A counsellor will reply to you soon.",1);toast("Message sent successfully. We will contact you soon.","ok")},function(err){
busy=false;setBusy(btn,false,"","Send Message →");var t=sendError(err);msg(t);toast(t,"bad")})}})();
/* header */
var hd=$("hd");function sy(){hd.classList.toggle("s",scrollY>40)}addEventListener("scroll",sy);sy();
$("bg").onclick=function(){var o=$("lk").classList.toggle("on");hd.classList.toggle("m",o)};
[].forEach.call(document.querySelectorAll(".links a"),function(a){a.onclick=function(){$("lk").classList.remove("on");hd.classList.remove("m")}});
var secs=["home","countries","universities","process","about","faq","contact"];
addEventListener("scroll",function(){var cur="home";secs.forEach(function(s){if($(s).getBoundingClientRect().top<140)cur=s});[].forEach.call(document.querySelectorAll(".links a"),function(a){a.classList.toggle("on",a.getAttribute("href")==="#"+cur)})});
$("th").onclick=function(){var r=document.documentElement,dk=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;r.dataset.theme=dk?"light":"dark"};
/* testimonials */
var T=[["Apply Route made my dream of studying in the UK a reality. Their guidance, support and professionalism were outstanding throughout the process.","Ayesha Khan","University of Manchester, UK"],["From my TU Munich admission to the German student visa, every step was clear and stress-free.","Hamza Ali","TU Munich, Germany"],["They found me a scholarship in the Netherlands I never knew existed. Truly life-changing support.","Sara Ahmed","University of Amsterdam, NL"]],ti=0;
function showT(){var t=T[ti];$("tq").textContent=t[0];$("tn").textContent=t[1];$("tu").textContent=t[2]}
$("tx").onclick=function(){ti=(ti+1)%T.length;showT()};$("tp").onclick=function(){ti=(ti+T.length-1)%T.length;showT()};showT();setInterval(function(){ti=(ti+1)%T.length;showT()},8000);
$("pl").onclick=function(){this.textContent=this.textContent==="▶"?"❚❚":"▶"};
/* reveal + counters */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)e.target.classList.add("in")})},{threshold:.1});
[].forEach.call(document.querySelectorAll(".rv"),function(e){io.observe(e)});
[].forEach.call(document.querySelectorAll("[data-count]"),function(el){var n=parseInt(el.dataset.count,10)||0,i=0,s=Math.ceil(n/60);var t=setInterval(function(){i=Math.min(n,i+s);el.textContent=i.toLocaleString()+"+";if(i>=n)clearInterval(t)},25)});
