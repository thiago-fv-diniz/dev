/* Ovos de páscoa ASCII (fique um tempo na folha 1 e espere…).
   Motor original do portfólio, portado para a prancha: tinta nanquim, respeita
   prefers-reduced-motion e o botão de pausar animações. */
(function(){
"use strict";
var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
var $ = function(s,c){return (c||document).querySelector(s)};
var TD = window.TD || { paused:false };
document.addEventListener("td:pause", function(e){
  var layer=document.getElementById("aeg-layer");
  if(e.detail && layer){ Array.prototype.slice.call(layer.children).forEach(function(k){ if(k._kill) k._kill(); }); }
});
/* ---------- ASCII easter egg (fique um tempo no hero e espere…) ---------- */
if(!RM){(function(){
  var hero=$("#top"); if(!hero) return;
  var layer=document.createElement("div");
  layer.id="aeg-layer"; layer.setAttribute("aria-hidden","true");
  hero.appendChild(layer);
  var MOB=matchMedia("(max-width:640px)").matches;
  var MAXC=MOB?1:2, active=0, timer=null, onHero=false, bag=[];
  function rnd(a,b){return a+Math.random()*(b-a)}

  /* zonas 3×3: cada spawn cai numa região diferente do hero */
  var zoneBag=[];
  function drawZone(){
    if(!zoneBag.length){
      zoneBag=[0,1,2,3,4,5,6,7,8];
      for(var i=zoneBag.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=zoneBag[i];zoneBag[i]=zoneBag[j];zoneBag[j]=t;}
    }
    return zoneBag.pop();
  }
  function zonePos(idx,cell,size,total){
    var lo=cell*idx+10, hi=cell*(idx+1)-size-10;
    if(hi<=lo){
      var c=cell*idx+cell/2-size/2;
      return Math.max(8,Math.min(total-size-8,c));
    }
    return rnd(lo,hi);
  }

  /* áreas vazias da folha 1, em coordenadas do hero */
  function freeZones(){
    var hr=hero.getBoundingClientRect(), out=[];
    function add(box, after, padB){
      if(!box||!after) return;
      var b=box.getBoundingClientRect(), a=after.getBoundingClientRect();
      var r={x:b.left-hr.left+14, y:a.bottom-hr.top+18, w:b.width-28, h:b.bottom-a.bottom-18-(padB||18)};
      if(r.w>60&&r.h>50) out.push(r);
    }
    add($(".hero-fig",hero), $(".hero-fig figcaption",hero), 22);
    add($(".refs",hero), $(".reflist",hero), 46);
    add($(".hero-main",hero), $(".hero-main .links",hero), 18);
    return out;
  }

  /* mini canvas de caracteres */
  function canvas(w,h){
    var rows=[],i;
    for(i=0;i<h;i++) rows.push(new Array(w+1).join(" ").split(""));
    return {
      put:function(x,y,spr){
        for(var r=0;r<spr.length;r++){var ln=spr[r];
          for(var c=0;c<ln.length;c++){var yy=y+r,xx=x+c;
            if(yy>=0&&yy<h&&xx>=0&&xx<w&&ln.charAt(c)!==" ") rows[yy][xx]=ln.charAt(c);
          }}},
      str:function(){var o=[],r2;for(r2=0;r2<h;r2++)o.push(rows[r2].join(""));return o.join("\n")}
    };
  }
  function boxed(body,w){
    var top="┌"+new Array(w+1).join("─")+"┐";
    var bot="└"+new Array(w+1).join("─")+"┘";
    var mid=body.split("\n"),out=[top],i;
    for(i=0;i<mid.length;i++) out.push("│"+mid[i]+"│");
    out.push(bot);
    return out.join("\n");
  }

  /* — água-viva (pulsa e sobe) — */
  var J=[
"  .-~~-.  \n ( o  o ) \n  `~~~~'  \n  ) ( ) ( \n ( ) ( ) )\n  ( ) ( ( ",
"   .~~.   \n  (o  o)  \n   `~~'   \n  ( )( )  \n   )( ) ( \n  ( ( ) ) ",
"  .-~~-.  \n ( o  o ) \n  `~~~~'  \n  ( ) ( ) \n  ) ( ) ( \n ( ( ) ) )",
"   .~~.   \n  (o  o)  \n   `~~'   \n   )( )(  \n  ( ) ( ) \n   ) ( (  "
  ];
  function jelly(){return {frames:J,tick:260,fs:[18,26],loop:true,life:9800,rise:true}}

  /* — logo TD quicando (DVD) — */
  function dvd(){return {frames:["┌─────┐\n│ T D │\n└─────┘"],tick:0,fs:[15,21],dvd:true,life:11500}}

  /* — tetris: O completa a linha, flash, clear, T desce — */
  function tetris(){
    var F=[],W=7,H=8,g=[],x,y,i;
    for(y=0;y<H;y++){g.push([]);for(x=0;x<W;x++)g[y].push(0);}
    for(x=0;x<5;x++)g[H-1][x]=1; g[H-2][0]=1; g[H-2][1]=1;
    function has(cells,cx,cy){if(!cells)return 0;for(var k=0;k<cells.length;k++)if(cells[k][0]===cx&&cells[k][1]===cy)return 1;return 0;}
    function snap(cells,flashRow){
      var s="";
      for(y=0;y<H;y++){
        s+="│";
        for(x=0;x<W;x++){
          if(flashRow===y){s+="▒▒";continue;}
          s+=(g[y][x]||has(cells,x,y))?"[]":" ·";
        }
        s+="│\n";
      }
      s+="└";for(x=0;x<W;x++)s+="──";s+="┘";
      F.push(s);
    }
    function drop(shape){
      var off=0;
      for(;;){
        var cur=[],coll=false;
        for(i=0;i<shape.length;i++)cur.push([shape[i][0],shape[i][1]+off]);
        snap(cur);
        for(i=0;i<shape.length;i++){var ny=shape[i][1]+off+1;
          if(ny>=H||g[ny][shape[i][0]]){coll=true;break;}}
        if(coll){for(i=0;i<cur.length;i++)g[cur[i][1]][cur[i][0]]=1;break;}
        off++;
      }
    }
    drop([[5,0],[6,0],[5,1],[6,1]]);
    snap(null,H-1);snap();snap(null,H-1);
    for(y=H-1;y>0;y--)g[y]=g[y-1].slice();
    g[0]=[0,0,0,0,0,0,0];
    snap();
    drop([[2,0],[3,0],[4,0],[3,1]]);
    snap();snap();
    return {frames:F,tick:200,fs:[16,22]};
  }

  /* — space invaders: marcha, tiro, explosão — */
  function invaders(){
    var F=[],W=26,H=7,t,i;
    var A=["/o o\\"," \\_/ "],B=["\\o o/"," /_\\ "],EX=["\\ | /","- * -"],SH=["  /\\  ","_/__\\_"];
    var sway=[0,1,2,3,3,2,1,0],tgt=2,shotT=5,hitT=8;
    for(t=0;t<18;t++){
      var c=canvas(W,H),ox=1+sway[t%8];
      for(i=0;i<4;i++){
        var x=ox+i*6;
        if(i===tgt){
          if(t>=hitT&&t<=hitT+1){c.put(x,0,EX);continue;}
          if(t>hitT+1)continue;
        }
        c.put(x,0,(t%2)?B:A);
      }
      c.put(10,H-2,SH);
      if(t>=shotT&&t<hitT)c.put(ox+tgt*6+2,4-(t-shotT),["|"]);
      F.push(c.str());
    }
    return {frames:F,tick:230,fs:[15,20]};
  }

  /* — pong: rally infinito de 6 segundos — */
  function pong(){
    var F=[],W=24,H=7,bx=11,by=3,vx=1,vy=1,p1=2,p2=2,t,y2;
    for(t=0;t<52;t++){
      bx+=vx;by+=vy;
      if(by<=0){by=0;vy=1} if(by>=H-1){by=H-1;vy=-1}
      if(bx<=1){bx=1;vx=1} if(bx>=W-2){bx=W-2;vx=-1}
      var tgt=Math.max(0,Math.min(H-2,by));
      if(t%2===0){ if(tgt>p1)p1++; else if(tgt<p1)p1--; }
      else { if(tgt>p2)p2++; else if(tgt<p2)p2--; }
      var c=canvas(W,H);
      for(y2=0;y2<H;y2+=2)c.put(W>>1,y2,["┊"]);
      c.put(0,p1,["█","█"]); c.put(W-1,p2,["█","█"]); c.put(bx,by,["●"]);
      F.push(boxed(c.str(),W));
    }
    return {frames:F,tick:120,fs:[14,19]};
  }

  /* — snake: caça 3 comidas e cresce — */
  function snake(){
    var F=[],W=18,H=7;
    var body=[[4,3],[3,3],[2,3],[1,3]],foods=[[12,2],[6,5],[15,3]],fi=0,grow=0,guard=0,i;
    function frame(){
      var c=canvas(W,H);
      if(fi<foods.length)c.put(foods[fi][0],foods[fi][1],["*"]);
      for(i=body.length-1;i>=0;i--)c.put(body[i][0],body[i][1],[i===0?"@":"o"]);
      F.push(boxed(c.str(),W));
    }
    frame();
    while(fi<foods.length&&guard++<70){
      var h=body[0],f=foods[fi],dx=f[0]-h[0],nh;
      nh = dx!==0 ? [h[0]+(dx>0?1:-1),h[1]] : [h[0],h[1]+((f[1]-h[1])>0?1:-1)];
      body.unshift(nh);
      if(nh[0]===f[0]&&nh[1]===f[1]){fi++;grow+=2;}
      if(grow>0)grow--; else body.pop();
      frame();
    }
    frame();frame();
    return {frames:F,tick:150,fs:[15,20]};
  }

  /* — donut 3D girando (render real: z-buffer + luminância) — */
  var _dn=null;
  function donut(){
    if(_dn)return _dn;
    var F=[],W=26,H=13,A=1,B=.4,f,i,j,k,r;
    var LUM=".,-~:;=!*#$@";
    for(f=0;f<26;f++){
      var b=[],z=[];
      for(k=0;k<W*H;k++){b.push(" ");z.push(0);}
      for(j=0;j<6.28;j+=.07){
        var ct=Math.cos(j),st=Math.sin(j);
        for(i=0;i<6.28;i+=.025){
          var sp2=Math.sin(i),cp=Math.cos(i),
              sA=Math.sin(A),cA=Math.cos(A),sB=Math.sin(B),cB=Math.cos(B),
              h=ct+2,
              D=1/(sp2*h*sA+st*cA+5),
              tt=sp2*h*cA-st*sA,
              x=Math.floor(W/2+10*D*(cp*h*cB-tt*sB)),
              y=Math.floor(H/2+5*D*(cp*h*sB+tt*cB)),
              o=x+W*y,
              N=Math.floor(8*((st*sA-sp2*ct*cA)*cB-sp2*ct*sA-st*cA-cp*ct*sB));
          if(y>=0&&y<H&&x>=0&&x<W&&D>z[o]){z[o]=D;b[o]=LUM.charAt(N>0?(N<12?N:11):0);}
        }
      }
      var s=[];for(r=0;r<H;r++)s.push(b.slice(r*W,(r+1)*W).join(""));
      F.push(s.join("\n"));
      A+=.24;B+=.11;
    }
    _dn={frames:F,tick:95,fs:[11,16],loop:true,life:10500};
    return _dn;
  }

  /* — walk cycle: bonequinho atravessa o hero — */
  var WK=[
"  O  \n /|\\ \n / \\ ",
"  O  \n \\|/ \n  |\\ ",
"  O  \n /|\\ \n / \\ ",
"  O  \n \\|/ \n /|  "
  ];
  function walker(){return {frames:WK,tick:170,fs:[16,24],loop:true,life:9200,walk:true}}

  /* — rádio anos 80: equalizador + notas flutuando — */
  function radio(){
    var F=[],W=20,t,i;
    var bars=[2,4,1,6,3,5,2,7];
    var nx=[2,11],nc=["♪","♫"],nv=[1,2];
    function pad(s){while(s.length<W)s+=" ";return s.slice(0,W);}
    for(t=0;t<36;t++){
      for(i=0;i<8;i++){
        bars[i]+=(Math.random()<.5?-1:1);
        if(bars[i]<0)bars[i]=0; if(bars[i]>7)bars[i]=7;
      }
      var bs="";for(i=0;i<8;i++)bs+="▁▂▃▄▅▆▇█".charAt(bars[i]);
      var sp=(t%4<2)?"(o)":"(O)";
      var nl=new Array(W+3).join(" ").split("");
      for(i=0;i<2;i++){
        if(t%nv[i]===0)nx[i]=(nx[i]+1)%(W+2);
        nl[nx[i]]=nc[i];
      }
      F.push(
        nl.join("")+"\n"+
        boxed([
          pad("   ~ TD·FM 88.3 ~"),
          pad(" "+sp+" "+bs+" "+sp),
          pad("   [≡≡≡≡≡≡≡≡≡≡]"),
          pad("   ◁◁   ▶▶   ▷▷")
        ].join("\n"),W)
      );
    }
    return {frames:F,tick:150,fs:[13,18],loop:true,life:9500};
  }

  /* runner genérico */
  function runSpec(sp){
    if(active>=MAXC)return;
    active++;
    var el=document.createElement("pre");
    el.className="aeg";
    var FS=rnd(sp.fs[0],sp.fs[1]); if(MOB)FS*=.62;
    el.style.fontSize=FS.toFixed(1)+"px";
    if(Math.random()<.33)el.classList.add("tint");
    el.textContent=sp.frames[0];
    layer.appendChild(el);
    var w=el.offsetWidth,h=el.offsetHeight;
    /* só em campo vazio da folha: nunca sobre o nome, a ficha, os links ou os numerais */
    var Z=freeZones(), fit=Z.filter(function(q){return q.w>=w&&q.h>=h;});
    for(var tries=0; !fit.length && tries<3; tries++){
      FS*=0.8; if(FS<8) break;
      el.style.fontSize=FS.toFixed(1)+"px"; w=el.offsetWidth; h=el.offsetHeight;
      fit=Z.filter(function(q){return q.w>=w&&q.h>=h;});
    }
    if(!fit.length){ layer.removeChild(el); active--; return; }
    var q=fit[Math.floor(Math.random()*fit.length)];
    var x0=q.x+rnd(0,q.w-w), y0=q.y+rnd(0,q.h-h);
    if(sp.rise) y0=q.y+q.h-h; /* água-viva nasce embaixo e sobe dentro da área */
    el.style.left=x0+"px"; el.style.top=y0+"px";
    requestAnimationFrame(function(){requestAnimationFrame(function(){el.classList.add("on")})});
    var fi2=0,len=sp.frames.length,iv=null,raf=null,dead=false,start=performance.now();
    if(len>1&&sp.tick>0){
      iv=setInterval(function(){
        fi2++;
        el.textContent=sp.frames[sp.loop?fi2%len:Math.min(fi2,len-1)];
      },sp.tick);
    }
    if(sp.rise){
      (function fl(){if(dead)return;var t=performance.now()-start;
        var up=Math.min(t*.024, y0-q.y), sw=Math.min(12,(q.w-w)/2);
        el.style.transform="translate("+(Math.sin(t/640)*sw).toFixed(1)+"px,"+(-up).toFixed(1)+"px)";
        raf=requestAnimationFrame(fl);})();
    }
    if(sp.walk){
      var span=Math.max(1,q.w-w), p0=x0-q.x, wsp=rnd(.055,.085), dir=(p0<span/2)?1:-1;
      (function fw(){if(dead)return;var t=performance.now()-start;
        var m=((p0+dir*wsp*t)%(2*span)+2*span)%(2*span), px2=m>span?2*span-m:m;
        el.style.transform="translate("+(px2-p0).toFixed(1)+"px,"+(Math.sin(t/170)*1.6).toFixed(1)+"px)";
        raf=requestAnimationFrame(fw);})();
    }
    if(sp.dvd){
      var px=x0,py=y0,vx2=.055+Math.random()*.02,vy2=.05,last=start;
      if(Math.random()<.5)vx2=-vx2;
      el.style.left="0px";el.style.top="0px";
      (function fl2(){if(dead)return;
        var now=performance.now(),dt=Math.min(48,now-last);last=now;
        px+=vx2*dt;py+=vy2*dt;var hit=false;
        if(px<=q.x){px=q.x;vx2=-vx2;hit=true} if(px>=q.x+q.w-w){px=q.x+q.w-w;vx2=-vx2;hit=true}
        if(py<=q.y){py=q.y;vy2=-vy2;hit=true} if(py>=q.y+q.h-h){py=q.y+q.h-h;vy2=-vy2;hit=true}
        if(hit){el.classList.add("flash");setTimeout(function(){el.classList.remove("flash")},320);}
        el.style.transform="translate("+px.toFixed(1)+"px,"+py.toFixed(1)+"px)";
        raf=requestAnimationFrame(fl2);})();
    }
    var life=sp.life||(len*sp.tick+1500);
    var lt=setTimeout(finish,life);
    function finish(){
      if(dead)return;dead=true;
      clearTimeout(lt); if(iv)clearInterval(iv); if(raf)cancelAnimationFrame(raf);
      el.classList.remove("on");
      setTimeout(function(){if(el.parentNode)el.parentNode.removeChild(el)},950);
      active--;
    }
    el._kill=finish;
  }

  var POOL=[jelly,tetris,invaders,pong,snake,dvd,donut,walker,radio];
  function draw(){
    if(!bag.length){
      bag=POOL.slice();
      for(var i=bag.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),tmp=bag[i];bag[i]=bag[j];bag[j]=tmp;}
    }
    return bag.pop()();
  }
  function sched(first){
    clearTimeout(timer);
    timer=setTimeout(function(){
      if(!onHero)return;
      if(TD.paused){ sched(false); return; }
      if(active<MAXC) runSpec(draw());
      sched(false);
    }, first?7500+Math.random()*4000:5000+Math.random()*6500);
  }
  new IntersectionObserver(function(es){
    es.forEach(function(e){
      onHero=e.isIntersecting;
      if(onHero) sched(true);
      else{
        clearTimeout(timer);
        var kids=Array.prototype.slice.call(layer.children);
        kids.forEach(function(k){if(k._kill)k._kill()});
      }
    });
  },{threshold:.3}).observe(hero);
})();}
})();
