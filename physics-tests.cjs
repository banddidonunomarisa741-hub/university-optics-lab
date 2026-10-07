const assert=require('node:assert/strict'),O=require('./physics.js');
let checks=0;const reports=[];
function close(label,actual,expected,tol=1e-10){assert.ok(Math.abs(actual-expected)<=tol,`${label}: ${actual}, expected ${expected}`);checks++;reports.push({test:label,actual,expected,tolerance:tol});}
close('sinc removable zero',O.sinc(0),1);close('sinc first null',O.sinc(Math.PI),0);
for(const [x,reference] of [[1,.4400505857449335],[5,-.3275791375914652],[10,.04347274616886144],[12,-.2234471044906276],[20,.06683312417585005],[100,-.07714535201411216],[1000,.004728311907089524],[10000,.0036474507555295803]])close('Bessel J1 reference x='+x,O.besselJ1(x),reference,2e-12);
close('Airy origin',O.airy(0),1);close('Airy first null q=3.8317059702',O.airy(3.8317059702075125),0,1e-18);
close('Snell air/glass 30deg',O.fresnel(1,1.5,30).angle,19.47122063449069);
close('Normal-incidence glass R',O.fresnel(1,1.5,0).R,.04);
close('Brewster p reflection vanishes',O.fresnel(1,1.5,Math.atan(1.5)*180/Math.PI).Rp,0);
assert.equal(O.fresnel(1.5,1,50).tir,true);checks++;
close('TIR energy reflection',O.fresnel(1.5,1,50).R,1);
close('Thin lens 300/100 gives150mm',O.calculate('lens',{f:100,u:300}).raw.v,150);
assert.equal(O.calculate('lens',{f:100,u:100}).raw.v,Infinity);checks++;
close('Thin lens virtual image',O.calculate('lens',{f:100,u:50}).raw.v,-100);
close('Equal waves destructive',O.profile('waves',{phase:Math.PI,ratio:1},0),0);
close('Unequal waves destructive',O.profile('waves',{phase:Math.PI,ratio:2},0),1);
close('Double slit textbook spacing',O.calculate('double',{lambda:633,L:2,d:.25}).raw.spacing,5.064);
close('Double slit central unity',O.profile('double',{},0),1);
close('Incoherent double slit center half coherent maximum',O.profile('double',{coherence:0},0),.5);
close('Double slit phase pi dark center',O.profile('double',{phase:Math.PI},0),0);
for(const N of [2,20,500])for(const order of [-3,-1,0,1,3])close(`Grating limiting principal peak N${N} m${order}`,O.gratingArray(order*Math.PI,N),1);
close('Grating first subsidiary null',O.gratingArray(Math.PI/20,20),0);
const s=.55/2,x=1000*s/Math.sqrt(1-s*s);
close('Grating envelope at first principal peak',O.profile('grating',{lambda:550,d:2,a:.5,N:200,L:1},x),O.sinc(Math.PI*.25)**2,1e-11);
close('Zero film thickness collapses interfaces',O.thinFilm({lambda:550,n0:1,n1:2,n2:1.5,t:0}).R,.04);
close('Quarter-wave impedance matching AR',O.thinFilm({lambda:550,n0:1,n1:Math.sqrt(1.5),n2:1.5,t:550/(4*Math.sqrt(1.5))}).R,0);
close('Thin-film phase change for 300nm thickness increase',O.thinFilm({lambda:550,n0:1,n1:1.5,n2:1.52,t:600}).phase-O.thinFilm({lambda:550,n0:1,n1:1.5,n2:1.52,t:300}).phase,4*Math.PI*1.5*300/550);
close('Matched film no reflection',O.thinFilm({lambda:550,n0:1.5,n1:1.5,n2:1.5,t:321}).R,0);
close('Newton reflected contact dark',O.profile('newton',{gap:0},0),0);
close('Newton transmitted contact bright',O.profile('newton',{gap:1},0),1);
close('Newton first dark ring',O.profile('newton',{lambda:550,R:1,n:1,gap:0},Math.sqrt(550e-9)*1000),0);
close('Michelson zero OPD all inclinations bright',O.profile('michelson',{delta:0},21),1);
close('Michelson halfwave OPD center dark',O.profile('michelson',{lambda:550,delta:.275},0),0);
close('Michelson fullwave OPD center bright',O.profile('michelson',{lambda:550,delta:.55},0),1);
const ps={lambda:500,a:.1,L:1},s1=.005,x1=1000*s1/Math.sqrt(1-s1*s1);
close('Single slit exact angular first zero',O.profile('single',ps,x1),0);
close('Circular single source center',O.profile('circular',{separation:0},0),1);
close('Circular 2D horizontal section matches profile',O.field('circular',O.defaults('circular'),.231,0),O.profile('circular',{},.231));
close('Malus 60deg',O.profile('polarization',{theta:60,three:0},0),.25);
close('Three polarizers at 0,45,90deg',O.profile('polarization',{theta:90,mid:45,three:1},0),.25);
close('Quarterwave circle ratio',O.calculate('waveplate',{alpha:45,retardance:90}).raw.ellipseRatio,1);
close('Halfwave is linear',O.calculate('waveplate',{alpha:22.5,retardance:180}).raw.ellipseRatio,0);
close('Zero-axis waveplate always linear',O.calculate('waveplate',{alpha:0,retardance:90}).raw.ellipseRatio,0);
const gp={lambda:532,w0:.5,z:0},zr=Math.PI*(.5e-3)**2/532e-9;
close('Gaussian waist value',O.calculate('gaussian',gp).raw.w,.5e-3);
close('Gaussian radius at Rayleigh range',O.calculate('gaussian',{...gp,z:zr}).raw.w,.5e-3*Math.SQRT2);
close('Gaussian 1/e² radius',O.profile('gaussian',gp,.5),Math.exp(-2));
close('Fourier first null',O.profile('fourier',{lambda:550,f:200,a:1},.11),0);
assert.equal(typeof O.fft2D,'function');assert.equal(typeof O.fourier2D,'function');assert.equal(typeof O.fourF,'function');assert.equal(typeof O.aperture2D,'function');checks+=4;
function energy(z){let s=0;for(let i=0;i<z.re.length;i++)s+=z.re[i]*z.re[i]+z.im[i]*z.im[i];return s;}
// 2D unitary FFT: Parseval, explicit 4f inversion, and supported aperture modes.
{const n=8,re=new Float64Array(n*n),im=new Float64Array(n*n);for(let i=0;i<re.length;i++){re[i]=((i*17)%23-11)/7;im[i]=((i*13)%19-9)/11;}const F=O.fft2D({width:n,height:n,re,im}),back=O.fft2D({width:n,height:n,re:F.re,im:F.im},{inverse:true});close('2D FFT Parseval n=8',energy({re,im}),energy(F),1e-12);let round=0;for(let i=0;i<re.length;i++)round=Math.max(round,Math.abs(back.re[i]-re[i]),Math.abs(back.im[i]-im[i]));assert.ok(round<1e-12,`2D FFT inverse round trip ${round}`);checks++;const four=O.fourF({width:n,height:n,dx:1,dy:1,re,im});let inv=0;for(let y=0;y<n;y++)for(let x=0;x<n;x++){const s=((n-y)%n)*n+((n-x)%n),d=y*n+x;inv=Math.max(inv,Math.abs(four.re[d]-re[s]),Math.abs(four.im[d]-im[s]));}assert.ok(inv<1e-12,`4f inversion ${inv}`);checks++;}
for(const aperture of ['rectangle','circle','double-slit','grating','grid']){const p={...O.defaults('fourier'),aperture};const f=O.fourier2D(p,{size:256});assert.ok(f.aperture.re.some(v=>v===1),`Fourier aperture ${aperture} is empty`);assert.ok(f.spectrum.peak>0,`Fourier spectrum ${aperture} is empty`);checks+=2;}
{const n=256,dx=1e-5,a=32*dx,field=new Float64Array(n*n);for(let y=0;y<n;y++)for(let x=112;x<144;x++)field[y*n+x]=1;const s=O.fourierSpectrum2D({width:n,height:n,dx,dy:dx,re:field},{lambda:550e-9,f:.2}),center=n/2,zero=center+8;assert.ok(s.intensity[center*n+zero]<1e-20,`Rectangular first zero ${s.intensity[center*n+zero]}`);let rms=0,count=0;for(let k=-32;k<=32;k++){const nu=k/(n*dx),expected=O.sinc(Math.PI*a*nu)**2,actual=s.intensity[center*n+center+k]/s.peak;rms+=(actual-expected)**2;count++;}rms=Math.sqrt(rms/count);assert.ok(rms<.01,`Rectangular sinc RMS ${rms}`);checks+=2;}
{const lambda=550e-9,f=.2,D=2e-3,firstZero=3.8317059702075125/Math.PI*lambda*f/D*1000,expected=1.22*lambda*f/D*1000;assert.ok(Math.abs(firstZero-expected)/expected<.02,`Airy first dark ring ${firstZero} vs ${expected}`);checks++;}
{const n=256,dx=1e-5,a=4*dx,d=32*dx,field=new Float64Array(n*n);for(let y=96;y<160;y++)for(let x=0;x<n;x++){const xx=(x-n/2)*dx;if(Math.abs(xx-d/2)<=a/2||Math.abs(xx+d/2)<=a/2)field[y*n+x]=1;}const s=O.fourierSpectrum2D({width:n,height:n,dx,dy:dx,re:field},{lambda:550e-9,f:.2}),cx=n/2,step=550e-9*.2*(1/(n*dx))*1000;let peaks=[];for(let k=2;k<n/2-2;k++){const v=s.intensity[128*n+cx+k];if(v>s.intensity[128*n+cx+k-1]&&v>=s.intensity[128*n+cx+k+1])peaks.push(k);}const spacing=550e-9*.2/d*1000;assert.ok(peaks.some(k=>Math.abs(k*step-spacing)<step),`Double slit spacing ${peaks.slice(0,3)} expected ${spacing}`);checks++;}
// All controls, both endpoints, plus reproducible combinations: finite bounded intensity.
let seed=98417;function random(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
for(const m of O.modules){const variants=[O.defaults(m.id)];for(const c of m.controls)for(const v of [c.min,c.max])variants.push({...O.defaults(m.id),[c.key]:v});for(let i=0;i<12;i++)variants.push(Object.fromEntries(m.controls.map(c=>[c.key,c.min+(c.max-c.min)*random()])));
for(const p of variants){const calc=O.calculate(m.id,p);assert.ok(Number.isFinite(calc.xMax)&&calc.xMax>0);checks++;
if(!['lens','waves'].includes(m.id))for(let i=0;i<35;i++){const x=calc.xMax*(2*i/34-1),v=O.profile(m.id,p,x);assert.ok(Number.isFinite(v)&&v>=-1e-12&&v<=1+1e-12,`${m.id} profile out of bounds: ${v}`);checks++;}
}}
console.log(JSON.stringify({status:'PASS',checks,benchmarkCount:reports.length,benchmarks:reports},null,2));
