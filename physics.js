/* Quantitative optics models. SI internally; profile coordinate is mm.
   Standalone browser + Node. Analytical scalar models, not a full EM solver. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Optics=api;})(typeof window==='undefined'?globalThis:window,function(){
'use strict';
const PI=Math.PI,TAU=2*PI,C=299792458,rad=x=>x*PI/180,clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function sinc(x){return Math.abs(x)<1e-5?1-x*x/6+x**4/120:Math.sin(x)/x;}
/* Power series near zero; Poincare expansion at large x. Benchmark against
   high precision Bessel J1 at small and large x through 10000 in physics-tests.cjs. */
function besselJ1(x){if(x===0)return 0;const a=Math.abs(x);let r;if(a<12){let term=a/2,sum=term,correction=0;for(let k=1;k<90;k++){term*=-a*a/(4*k*(k+1));const adjusted=term-correction,next=sum+adjusted;correction=(next-sum)-adjusted;sum=next;if(Math.abs(term)<1e-17)break;}r=sum;}else{let term=1,even=1,odd=0;for(let k=1;k<=18;k++){term*=(4-(2*k-1)**2)/(8*k*a);if(k%2)odd+=(k%4===1?1:-1)*term;else even+=(k%4===0?1:-1)*term;}const chi=a-3*PI/4;r=Math.sqrt(2/(PI*a))*(Math.cos(chi)*even-Math.sin(chi)*odd);}return x<0?-r:r;}
function wavelengthRGB(w){w=clamp(w,380,780);let r=0,g=0,b=0;if(w<440){r=(440-w)/60;b=1;}else if(w<490){g=(w-440)/50;b=1;}else if(w<510){g=1;b=(510-w)/20;}else if(w<580){r=(w-510)/70;g=1;}else if(w<645){r=1;g=(645-w)/65;}else r=1;const factor=w<420?.3+.7*(w-380)/40:w>700?.3+.7*(780-w)/80:1;return {r:Math.pow(r*factor,.8),g:Math.pow(g*factor,.8),b:Math.pow(b*factor,.8)};}
const definitions={
waves:{title:'光波与相位',group:'波动基础',description:'观察同频光波的电场叠加，把相位、振幅与平均光强联系起来。',controls:[['lambda','真空波长 λ','nm',380,760,1,550],['phase','相位差 φ','rad',0,6.283185307,0.01,0],['ratio','振幅比 A₂/A₁','',0,2,0.01,1]]},
snell:{title:'折射与全反射',group:'几何光学',description:'改变折射率与入射角，同时观察光路、临界角与菲涅耳反射率。',controls:[['n1','入射折射率 n₁','',1,2.5,.01,1],['n2','透射折射率 n₂','',1,2.5,.01,1.5],['angle','入射角 θᵢ','deg',0,89,.1,35]]},
lens:{title:'薄透镜成像',group:'几何光学',description:'移动物体，观察实像、虚像与焦点处的成像转变。',controls:[['f','焦距 f','mm',40,300,1,100],['u','物距 u','mm',10,2000,1,300],['h','物高 h','mm',1,80,1,30]]},
double:{title:'杨氏双缝干涉',group:'光的干涉',description:'从光程差到明暗条纹，分辨缝距、缝宽与相干度各自的作用。',controls:[['lambda','波长 λ','nm',400,700,1,550],['d','缝距 d','mm',.1,1,.01,.25],['a','缝宽 a','mm',.01,.25,.01,.05],['L','屏距 L','m',.5,3,.05,1.5],['coherence','相干度 γ','',0,1,.01,1],['phase','初相位差 φ','rad',0,6.283185307,.01,0]]},
film:{title:'薄膜干涉',group:'光的干涉',description:'用多次反射的叠加理解薄膜增透、膜厚周期和折射率匹配。',controls:[['lambda','波长 λ','nm',400,700,1,550],['n0','入射介质 n₀','',1,2,.01,1],['n1','膜折射率 n₁','',1,3,.01,1.38],['n2','基底折射率 n₂','',1,3,.01,1.52],['t','膜厚 t','nm',0,2000,1,100]]},
newton:{title:'牛顿环',group:'光的干涉',description:'从薄膜厚度的径向变化理解等厚干涉，以及反射中心的暗斑。',controls:[['lambda','波长 λ','nm',400,700,1,550],['R','曲率半径 R','m',.1,5,.01,1],['n','薄隙折射率 n','',1,1.5,.01,1],['gap','观察模式','',0,1,1,0]]},
michelson:{title:'迈克耳孙干涉',group:'光的干涉',description:'关联等倾圆环、双程光程差与亚微米量级的镜面位移。',controls:[['lambda','波长 λ','nm',400,700,1,550],['delta','中心光程差 Δ','μm',-2000,2000,.05,200],['f','观察透镜焦距 f','mm',50,500,1,150]]},
single:{title:'单缝衍射',group:'光的衍射',description:'观察孔径与衍射角宽的互易关系，并定位中央亮斑两侧的暗纹。',controls:[['lambda','波长 λ','nm',400,700,1,550],['a','缝宽 a','mm',.02,.5,.01,.10],['L','屏距 L','m',.5,3,.05,1.5]]},
grating:{title:'光栅与分辨本领',group:'光的衍射',description:'观察多光束叠加如何形成尖锐主极大，以及缝宽引起的缺级。',controls:[['lambda','波长 λ','nm',400,700,1,550],['d','光栅常数 d','μm',1,10,.01,2],['a','单缝宽度 a','μm',.1,3,.01,.5],['N','有效缝数 N','',2,500,1,20],['L','等效屏距 L','m',.5,3,.05,1]]},
circular:{title:'圆孔与瑞利判据',group:'光的衍射',description:'将两个等强点源的艾里图样叠加，探索衍射对空间分辨率的限制。',controls:[['lambda','波长 λ','nm',400,700,1,550],['D','孔径 D','mm',.5,10,.1,2],['L','等效焦距 L','m',.5,3,.05,1],['separation','双点源角距','arcsec',0,600,1,69]]},
polarization:{title:'马吕斯定律',group:'偏振光学',description:'用电场投影理解光强变化，并检验正交偏振片之间插入第三片的效果。',controls:[['theta','检偏器角 θ','deg',0,180,1,45],['mid','中间片角 β','deg',0,180,1,45],['three','插入中间片','',0,1,1,0]]},
waveplate:{title:'波片与椭圆偏振',group:'偏振光学',description:'调节两个正交分量的振幅与相位差，连续生成线、椭圆和圆偏振。',controls:[['alpha','入射方向与快轴夹角 α','deg',0,180,1,45],['retardance','慢轴相位延迟 δ','deg',0,360,1,90]]},
gaussian:{title:'高斯光束',group:'现代光学拓展',description:'调节束腰与传播距离，理解瑞利长度、衍射发散和截面光强分布。',controls:[['lambda','波长 λ','nm',400,700,1,532],['w0','束腰半径 w₀','mm',.1,2,.01,.3],['z','距束腰位置 z','m',-5,5,.01,1]]},
fourier:{title:'傅里叶光学',group:'现代光学拓展',description:'观察矩形孔径与透镜后焦面光强的变换，联系实空间与空间频率。',controls:[['lambda','波长 λ','nm',400,700,1,550],['a','矩形孔径宽 a','mm',.02,2,.01,.10],['f','透镜焦距 f','mm',50,500,1,200]]}
};
const modules=Object.entries(definitions).map(([id,m])=>({...m,id,subtitle:m.title,controls:m.controls.map(([key,label,unit,min,max,step,value])=>({key,label,unit,min,max,step,value})),formula:'',assumptions:[],explanation:[],challenge:{question:'',answer:''},presets:[],sources:[]}));
function defaults(id){const m=modules.find(m=>m.id===id);if(!m)throw Error('Unknown optics module: '+id);return Object.fromEntries(m.controls.map(c=>[c.key,c.value]));}
function normalize(id,params){const p={...defaults(id),...params};for(const c of definitions[id].controls){const key=c[0];if(!Number.isFinite(+p[key]))p[key]=c[6];p[key]=+p[key];}if(id==='double'||id==='grating')p.a=Math.min(p.a,p.d);if(id==='grating')p.N=Math.max(2,Math.round(p.N));return p;}
function sinScreen(x,L){return x/Math.hypot(L,x);}
function screenFromSin(s,L){return Math.abs(s)<1?L*s/Math.sqrt(1-s*s):Infinity;}
function fresnel(n1,n2,angle){const a=rad(angle),st=n1/n2*Math.sin(a),tir=st>1;if(tir)return {tir:true,angle:null,Rs:1,Rp:1,R:1,T:0};const ca=Math.cos(a),ct=Math.sqrt(Math.max(0,1-st*st)),rs=(n1*ca-n2*ct)/(n1*ca+n2*ct),rp=(n2*ca-n1*ct)/(n2*ca+n1*ct),Rs=rs*rs,Rp=rp*rp;return {tir:false,angle:Math.asin(st)*180/PI,Rs,Rp,R:(Rs+Rp)/2,T:1-(Rs+Rp)/2};}
function thinFilm(p){const r01=(p.n0-p.n1)/(p.n0+p.n1),r12=(p.n1-p.n2)/(p.n1+p.n2),phase=4*PI*p.n1*p.t/p.lambda;const R=(r01*r01+r12*r12+2*r01*r12*Math.cos(phase))/(1+(r01*r12)**2+2*r01*r12*Math.cos(phase));return {R:clamp(R,0,1),T:1-clamp(R,0,1),phase};}
function airy(q){return Math.abs(q)<1e-6?1:(2*besselJ1(q)/q)**2;}
function gratingArray(beta,N){const d=beta-Math.round(beta/PI)*PI;return (sinc(N*d)/sinc(d))**2;}
function modelProfile(id,p,x){const lam=(p.lambda||550)*1e-9,xx=x*1e-3;let I=0;
switch(id){
case 'waves':return 1+p.ratio*p.ratio+2*p.ratio*Math.cos(p.phase);
case 'double':{const s=sinScreen(xx,p.L);I=sinc(PI*p.a*1e-3*s/lam)**2*(1+p.coherence*Math.cos(TAU*p.d*1e-3*s/lam+p.phase))/2;break;}
case 'single':I=sinc(PI*p.a*1e-3*sinScreen(xx,p.L)/lam)**2;break;
case 'grating':{const s=sinScreen(xx,p.L);I=sinc(PI*p.a*1e-6*s/lam)**2*gratingArray(PI*p.d*1e-6*s/lam,p.N);break;}
case 'circular':{const shift=p.L*Math.tan(p.separation/206264.806247/2);I=(airy(PI*p.D*1e-3*(xx-shift)/(lam*p.L))+airy(PI*p.D*1e-3*(xx+shift)/(lam*p.L)))/2;break;}
case 'film':I=thinFilm(p).R;break;
case 'newton':{const phase=TAU*p.n*xx*xx/(p.R*lam);I=(1+(p.gap?1:-1)*Math.cos(phase))/2;break;}
case 'michelson':{const cost=p.f*1e-3/Math.hypot(p.f*1e-3,xx);I=(1+Math.cos(TAU*p.delta*1e-6*cost/lam))/2;break;}
case 'polarization':I=p.three?Math.cos(rad(p.mid))**2*Math.cos(rad(p.theta-p.mid))**2:Math.cos(rad(p.theta))**2;break;
case 'waveplate':I=Math.cos(rad(p.alpha))**2*Math.cos(x)**2+Math.sin(rad(p.alpha))**2*Math.cos(x+rad(p.retardance))**2;break;
case 'gaussian':{const w0=p.w0*1e-3,zR=PI*w0*w0/lam,w=w0*Math.sqrt(1+(p.z/zR)**2);I=Math.exp(-2*xx*xx/(w*w));break;}
case 'fourier':I=sinc(PI*p.a*1e-3*xx/(lam*p.f*1e-3))**2;break;
case 'snell':I=fresnel(p.n1,p.n2,x).R;break;
case 'lens':return p.f*x/(x-p.f);
}return clamp(I,0,1);}
function profile(id,params,x){return modelProfile(id,normalize(id,params),+x);}
function calculate(id,params){const p=normalize(id,params),lam=(p.lambda||550)*1e-9,out={metrics:[],xMax:10,raw:{},warnings:[]},add=(label,value,unit='')=>out.metrics.push({label,value,unit});
switch(id){
case 'waves':{const I=modelProfile(id,p,0);add('相对平均光强',I,'I₁');add('合振幅 / A₁',Math.sqrt(Math.max(0,I)));add('光频率',C/lam/1e12,'THz');out.xMax=3*p.lambda*1e-6;break;}
case 'snell':{const r=fresnel(p.n1,p.n2,p.angle),critical=p.n1>p.n2?Math.asin(p.n2/p.n1)*180/PI:null;add('折射角 θₜ',r.tir?'全反射':r.angle,r.tir?'':'°');add('临界角 θc',critical===null?'不存在':critical,critical===null?'':'°');add('非偏振反射率',r.R*100,'%');out.raw={...r,critical,brewster:Math.atan(p.n2/p.n1)*180/PI};out.xMax=90;break;}
case 'lens':{const v=p.u===p.f?Infinity:p.f*p.u/(p.u-p.f),m=-v/p.u;add('像距 v',v,'mm');add('横向放大率 m',m);add('像的性质',!Number.isFinite(v)?'无穷远':v>0?'倒立实像':'正立虚像');out.raw={v,m,imageHeight:m*p.h};out.xMax=Math.max(500,p.u*1.3);if(p.h/p.u>.1)out.warnings.push('物高 / 物距偏大，真实镜头的近轴近似可能失效；此图仍按理想薄透镜作图。');break;}
case 'double':{const spacing=lam*p.L/(p.d*1e-3)*1000,half=screenFromSin(lam/(p.a*1e-3),p.L)*1000;add('近轴条纹间距 Δx',spacing,'mm');add('包络首零点 |x|',half,'mm');add('局部条纹可见度 γ',p.coherence*100,'%');out.xMax=Math.min(half*1.45,spacing*7);out.raw={spacing,half,visibility:p.coherence};const F=((p.d+p.a)*1e-3/2)**2/(lam*p.L);out.raw.fresnelNumber=F;if(F>.1)out.warnings.push('全孔径菲涅耳数约 '+F.toFixed(2)+'：自由传播未必达到远场，宜在透镜后焦面实现本模型。');break;}
case 'film':{const r=thinFilm(p);add('能量反射率 R',r.R);add('能量透射率 T',r.T);add('膜厚周期 Δt',p.lambda/(2*p.n1),'nm');out.raw=r;out.xMax=2000;break;}
case 'newton':{const r1=Math.sqrt(lam*p.R/p.n)*1000;add('反射首暗环 r₁',r1,'mm');add('相邻暗环 Δ(r²)',lam*p.R/p.n*1e6,'mm²');add('中心归一化光强',p.gap?1:0);out.xMax=r1*Math.sqrt(9);out.raw={r1};break;}
case 'michelson':{add('中心相对光强',modelProfile(id,p,0));add('移过一条纹的镜位移',p.lambda/2,'nm');add('中心干涉级次 Δ/λ',p.delta*1000/p.lambda);out.xMax=p.f*.20;out.raw={centerPhase:TAU*p.delta*1e-6/lam};break;}
case 'single':{const first=screenFromSin(lam/(p.a*1e-3),p.L)*1000;add('首暗纹位置 |x₁|',first,'mm');add('中央主极大宽度',first*2,'mm');add('近轴角半宽',lam/(p.a*1e-3)*1000,'mrad');out.xMax=first*4;out.raw={first};const F=(p.a*1e-3/2)**2/(lam*p.L);if(F>.1)out.warnings.push('菲涅耳数偏大；当前显示夫琅禾费图样，宜用透镜形成远场。');break;}
case 'grating':{const ratio=lam/(p.d*1e-6),first=screenFromSin(ratio,p.L)*1000;add('一级主峰角 θ₁',ratio<=1?Math.asin(ratio)*180/PI:'不存在','°');add('一级分辨本领 R',p.N);add('一级最小 Δλ',p.lambda/p.N,'nm');const s=Math.min(.82,ratio*2.4);out.xMax=screenFromSin(s,p.L)*1000;out.raw={first,mMax:Math.floor(1/ratio),N:p.N};const F=((p.N-1)*p.d*1e-6/2+p.a*1e-6/2)**2/(lam*p.L);if(F>.1)out.warnings.push('总光栅宽度的菲涅耳数较大；本页采用透镜形成的远场角谱模型。');break;}
case 'circular':{const theta=3.8317059702075125/PI*lam/(p.D*1e-3),ray=theta*206264.806247,airyRadius=theta*p.L*1000;add('单点艾里斑半径',airyRadius,'mm');add('瑞利角 θR',ray,'角秒');add('双点角距 / 瑞利角',p.separation/ray);out.xMax=airyRadius*3+p.L*Math.tan(p.separation/206264.806247/2)*1000;out.raw={resolutionArcsec:ray,airyRadius};break;}
case 'polarization':{const I=modelProfile(id,p,0);add('透射强度 I / I₀',I);add('透射振幅比',Math.sqrt(I));add('中间偏振片',p.three?'已插入':'已移除');out.raw={malus:I};out.xMax=180;break;}
case 'waveplate':{const a=rad(p.alpha),d=rad(p.retardance),S1=Math.cos(2*a),S2=Math.sin(2*a)*Math.cos(d),S3=Math.sin(2*a)*Math.sin(d),chi=.5*Math.asin(clamp(S3,-1,1)),ell=Math.abs(Math.tan(chi));const state=ell<1e-6?'线偏振':Math.abs(ell-1)<1e-6?'圆偏振':'椭圆偏振';add('偏振状态',state);add('短 / 长半轴比',ell);add('椭圆率角 χ',chi*180/PI,'°');out.raw={S1,S2,S3,ellipseRatio:ell,azimuth:.5*Math.atan2(S2,S1)*180/PI};out.xMax=360;break;}
case 'gaussian':{const w0=p.w0*1e-3,zR=PI*w0*w0/lam,w=w0*Math.sqrt(1+(p.z/zR)**2);add('瑞利长度 zR',zR,'m');add('截面半径 w(z)',w*1000,'mm');add('远场发散半角',lam/(PI*w0)*1000,'mrad');out.xMax=w*1000*2.3;out.raw={zR,w,curvature:p.z===0?Infinity:p.z*(1+(zR/p.z)**2),gouy:Math.atan(p.z/zR)};break;}
case 'fourier':{const first=lam*p.f/(p.a*1e-3);add('后焦面首零点 |x₁|',first,'mm');add('中央亮斑全宽',first*2,'mm');add('孔径倒数 1/a',1/p.a,'mm⁻¹');out.xMax=first*4;out.raw={first};break;}
}return out;}
function createSampler(id,params){const p=normalize(id,params);return x=>modelProfile(id,p,x);}
function field(id,params,x,y){if(id==='circular'){const p=params,lam=p.lambda*1e-9,scale=PI*p.D*1e-3/(lam*p.L),shift=p.L*Math.tan(p.separation/206264.806247/2);return (airy(scale*Math.hypot(x*1e-3-shift,y*1e-3))+airy(scale*Math.hypot(x*1e-3+shift,y*1e-3)))/2;}return modelProfile(id,params,Math.hypot(x,y));}
return {modules,defaults,calculate,profile,createSampler,field,sinc,besselJ1,wavelengthRGB,fresnel,thinFilm,airy,gratingArray,normalize,constants:{c:C}};
});
