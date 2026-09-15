// Rebuild with Node.js + pptxgenjs. All formulas and prose remain editable.
const pptxgen=require('pptxgenjs'),path=require('node:path'),fs=require('node:fs');
const O=require('../physics.js'),L=require('../lesson-content.js');
const pptx=new pptxgen();pptx.layout='LAYOUT_WIDE';pptx.author='光学实验室';pptx.title='大学物理光学 · 从光场到成像';pptx.subject='交互实验与模型边界';pptx.lang='zh-CN';
pptx.theme={headFontFace:'Microsoft YaHei',bodyFontFace:'Microsoft YaHei',lang:'zh-CN'};
const root=path.resolve(__dirname,'..'),C={navy:'132B47',ink:'203B57',blue:'2766CE',cyan:'79DCE5',pale:'F2F6FB',muted:'687F99',line:'DAE4F0',white:'FFFFFF'};
let count=0;
function text(s,t,x,y,w,h,opt={}){s.addText(String(t),{x,y,w,h,fontFace:'Microsoft YaHei',fontSize:15,color:C.ink,margin:0,breakLine:false,fit:'shrink',valign:'mid',...opt});}
function shape(s,x,y,w,h,color){s.addShape(pptx.ShapeType.rect,{x,y,w,h,line:{color,transparency:100},fill:{color}});}
function slide(title,kicker='大学物理 · 光学'){const s=pptx.addSlide();s.background={color:C.pale};count++;shape(s,0,0,13.333,.08,C.navy);text(s,kicker,.65,.32,11,.25,{fontSize:10,color:C.blue});text(s,title,.65,.79,12,.52,{fontSize:28,bold:true,color:C.navy});text(s,'光学实验室 · 可交互 / 可计算 / 可复现',.65,7.12,8,.2,{fontSize:9,color:C.muted});text(s,String(count).padStart(2,'0'),12.0,7.10,.65,.22,{fontSize:10,color:C.muted,align:'right'});return s;}
function link(s,id,x=8.25,y=6.35,w=4.35,label='打开互动实验'){shape(s,x,y,w,.4,C.blue);text(s,label+'  ↗',x+.16,y+.06,w-.32,.26,{fontSize:12,color:C.white,bold:true,hyperlink:{url:'../index.html#'+id}});}
function image(s,file,x,y,w,h){s.addImage({path:file,x,y,w,h});}
function note(s,str){s.addNotes(str);}
function fmt(x){return typeof x==='number'?(Number.isFinite(x)?Number(x.toPrecision(5)).toString():'∞'):String(x);}
function paragraph(s,title,body,x,y,w,h=1.3){text(s,title,x,y,w,.3,{fontSize:16,bold:true,color:C.blue});text(s,body,x,y+.4,w,h-.4,{fontSize:14,color:C.muted,breakLine:false});}

// 1: physical apparatus, not a decorative cover graphic.
{const s=slide('');s.background={color:C.navy};image(s,path.join(root,'assets/renders/double-slit.png'),5.25,.6,8.0,5.0);text(s,'大学物理 · 光学',.8,1.2,4.5,.4,{fontSize:17,color:C.cyan});text(s,'从光场\n到成像',.8,2.0,4.4,1.55,{fontSize:43,bold:true,color:C.white,breakLine:false});text(s,'14 个参数化实验\n几何光学、干涉、衍射、偏振与拓展',.82,4.0,4.6,.85,{fontSize:16,color:'BBCEE2'});text(s,'先预测，再观察，用模型解释。',.82,5.2,5.3,.35,{fontSize:17,color:C.cyan});link(s,'double',.82,6.12,4.1,'进入光学实验室');note(s,'使用整套课件时保持目录结构不变。点击蓝色链接打开相应本地交互页面。三维图由 Blender 4.5.13 Cycles 渲染；条纹纹理由解析模型计算。');}
// 2
{const s=slide('课程地图：从传播机制到定量判断');const arr=O.modules;arr.forEach((m,i)=>{const col=i<7?0:1,row=i%7,x=.85+col*6.25,y=1.72+row*.66;text(s,String(i+1).padStart(2,'0'),x,y,.5,.33,{fontSize:15,color:C.blue,bold:true});text(s,m.title,x+.65,y,4.5,.34,{fontSize:18,hyperlink:{url:'../index.html#'+m.id}});text(s,m.group,x+.65,y+.33,4.5,.2,{fontSize:10,color:C.muted});});note(s,'前12项为大学物理常见核心主题，第13、14项为现代光学入门拓展。具体院校课程取舍应按教学大纲调整。');}
// 3
{const s=slide('选择模型，先检查尺度与近似');const columns=[['几何光学','λ 远小于结构尺度','Snell 定律、光线和近轴成像','适合判断物像位置；不能给出衍射极限。'],['波动光学','光程差与相位可比较','相干叠加、标量衍射和干涉','应检查远场 / 后焦面条件，明确光强归一化。'],['矢量光学','保留电场振动方向','偏振投影、Jones 延迟片','延迟片改变相位；偏振片改变透射分量。']];columns.forEach((a,i)=>{const x=.72+4.25*i;shape(s,x,1.9,4.02,4.28,C.white);text(s,a[0],x+.24,2.2,3.5,.4,{fontSize:23,bold:true,color:C.blue});text(s,a[1],x+.24,3.0,3.5,.5,{fontSize:17,color:C.navy});text(s,a[2],x+.24,3.82,3.5,.65,{fontSize:16});text(s,a[3],x+.24,4.88,3.5,.95,{fontSize:14,color:C.muted});});note(s,'近轴是限制角度的小量近似，不是全部几何光学的前提。无吸收光学中能量守恒；显示归一化不意味着总光通量固定。');}
// 4..17: one complete teaching page per interactive module.
for(const [i,m] of O.modules.entries()){
 const lesson=L[m.id],p=O.defaults(m.id),calc=O.calculate(m.id,p),s=slide(m.title,m.group+' · 实验 '+String(i+1).padStart(2,'0'));
 image(s,path.join(root,'output/playwright/diagram-'+m.id+'.png'),.65,1.62,7.18,3.29);
 const metrics=calc.metrics.slice(0,3);metrics.forEach((r,j)=>{const x=.75+j*2.35;shape(s,x,5.12,2.15,.86,C.white);text(s,r.label,x+.1,5.21,1.95,.21,{fontSize:10,color:C.muted});text(s,fmt(r.value)+(r.unit?' '+r.unit:''),x+.1,5.53,1.95,.31,{fontSize:19,color:C.blue,bold:true});});
 shape(s,8.08,1.62,4.6,2.3,C.white);text(s,lesson.formula,8.28,1.8,4.18,1.91,{fontFace:'Cambria Math',fontSize:m.id==='film'?16:19,color:C.navy,breakLine:false});
 paragraph(s,'解释现象',lesson.explanation[0],8.23,4.13,4.3,1.65);
 text(s,'先预测：'+lesson.challenge.question,.75,6.22,7.0,.6,{fontSize:13,color:C.ink});link(s,m.id);
 note(s,'默认参数：'+JSON.stringify(p)+'\n\n'+lesson.explanation.join('\n\n')+'\n\n模型条件：\n'+lesson.assumptions.join('\n')+'\n\n问题答案：'+lesson.challenge.answer+'\n\n来源：\n'+lesson.sources.map(x=>x.title+' '+x.url).join('\n'));
}
// 18..20: real Blender renders, each with an explicit connection to the model.
for(const a of [
 ['双缝装置：把光程差与观察屏联系起来','double-slit.png','double','参数与屏幕纹理','λ = 550 nm\nd = 0.25 mm\na = 0.05 mm\nL = 1.50 m','屏幕为解析干涉 × 衍射包络；可见光线为教学标记。'],
 ['折射界面：角度从法线开始量','lens-bench.png','snell','Snell 定律','n₁ = 1.00\nn₂ = 1.52\nθᵢ = 35.00°\nθₜ = 22.17°','虚线标示界面法线。装置尺寸经过缩放；角关系来自 Snell 定律。'],
 ['偏振装置：振幅投影，再取平方','polarization.png','polarization','马吕斯定律','透光轴夹角 45°\n振幅比 cos45°\nI / I₀ = 0.50','I₀ 在第一片之后定义。电场波形的波长与振幅均放大显示。']]){
 const s=slide(a[0],'Blender · Cycles 实体场景');image(s,path.join(root,'assets/renders',a[1]),.65,1.58,8.8,5.5);paragraph(s,a[3],a[4],9.7,1.9,2.95,2.35);text(s,a[5],9.7,4.5,2.95,1.1,{fontSize:14,color:C.muted});link(s,a[2],9.7,6.28,2.95);note(s,'此页为真实 Blender Cycles 固定渲染，1440×900，96采样，降噪。不是完整的电磁波数值传播仿真。可编辑 .blend 源文件与建模脚本见 blender 目录。');
}
//21
{const s=slide('定量实验：用双缝条纹测波长');paragraph(s,'实验输入','缝距 d = (0.250 ± 0.002) mm\n屏距 L = (2.00 ± 0.01) m\n条纹间距 Δx = (5.06 ± 0.03) mm',.9,1.8,6.0,2.3);paragraph(s,'计算与单位','λ ≈ Δx d / L = 632.5 nm\n相对标准不确定度约 1.11%\n可报告为 (633 ± 7) nm',7.25,1.8,5.1,2.3);shape(s,.85,4.55,11.65,1.4,C.white);text(s,'uᵣ(λ) = √[uᵣ(Δx)² + uᵣ(d)² + uᵣ(L)²]',1.13,4.77,11,.42,{fontSize:22,color:C.blue});text(s,'假设三个输入彼此独立，± 数值是同一口径的标准不确定度；近轴模型误差另行评估。',1.13,5.37,11,.3,{fontSize:12,color:C.muted});link(s,'double');note(s,'这是独立的测量示例，不是模拟器制造的测量误差。可用跨越多个条纹的距离除以条纹数，降低位置读数对间距的影响。');}
//22
{const s=slide('四个边界问题，检验是否真正理解');const qs=[['全反射','玻璃 n=1.5 到空气，入射角从40°变到50°，传播折射光如何变化？'],['有限缝宽','同时把双缝间距与单缝宽度增大一倍，条纹间距和包络宽度怎样变化？'],['三偏振片','首尾两片正交，在中间放置45°偏振片，I/I₀ 是多少？'],['波片','α=45°，把相位延迟从90°变为180°，电场轨迹如何变化？']];qs.forEach((q,i)=>{const y=1.72+i*1.17;shape(s,.8,y,11.8,.97,C.white);text(s,q[0],1.0,y+.18,1.7,.45,{fontSize:19,bold:true,color:C.blue});text(s,q[1],3.0,y+.15,9.2,.58,{fontSize:17});});note(s,'答案在下一页；先让学生口头给出理由，再打开相应模块调参。');}
//23
{const s=slide('参考答案：每个结论都对应一个条件');const answers=[['40° → 50°','临界角约41.81°。40°存在传播折射光，50°发生全反射；第二介质仍可有倏逝场。'],['两种空间尺度','近轴条纹间距 λL/d 减半，衍射包络半宽 λL/a 也减半。'],['不是 0，也不是 1/2','相对于第一片之后的 I₀，透射率 cos²45° × cos²45° = 1/4。'],['圆变为直线','90°时两分量等幅正交，轨迹为圆；180°时相位相反，轨迹成为直线。']];answers.forEach((q,i)=>paragraph(s,q[0],q[1],.9,1.65+i*1.24,11.5,1.05));}
//24
{const s=slide('把调参变成一份可以复查的实验记录');const steps=[['预测','先写出趋势，列明保持不变的条件。'],['对照','固定当前曲线，一次只改变一个参数。'],['测量','记录三个读数，导出数据与参数 JSON。'],['解释','检查单位、极限与适用条件。']];steps.forEach((q,i)=>{const x=.75+i*3.17;shape(s,x,2.1,2.95,3.35,C.white);text(s,q[0],x+.2,2.45,2.5,.45,{fontSize:25,color:C.blue,bold:true});text(s,q[1],x+.2,3.3,2.5,1.2,{fontSize:18});});text(s,'交付：一页实验卡 + 3 组参数 + 一张对照图 + 模型条件说明',.9,6.0,11.5,.5,{fontSize:19});note(s,'建议讲授前阅读 teaching-guide.md 的4×45分钟安排。14项实验不必在一堂课全部展开，可按教材选用。');}
//25
{const s=slide('公式来源与继续学习');const refs=[['OpenStax University Physics Vol. 3','几何光学、干涉、衍射与偏振的教材关系','https://openstax.org/books/university-physics-volume-3/pages/1-introduction'],['MIT OpenCourseWare · Optics 2.71 / Physics 8.03','傅里叶光学、波片与场的表示','https://ocw.mit.edu/courses/2-71-optics-spring-2009/resources/lecture-notes/'],['NIST Digital Library of Mathematical Functions','贝塞尔函数定义与数值基准','https://dlmf.nist.gov/10.2']];refs.forEach((r,i)=>{const y=1.8+i*1.43;paragraph(s,r[0],r[1],.9,y,11.5,1.0);text(s,r[2],.9,y+.97,11.5,.25,{fontSize:11,color:C.blue,hyperlink:{url:r[2]}});});text(s,'每个互动模块的“模型与来源”提供对应章节链接；课件讲解与绘图为重新编写。',.9,6.55,11.5,.3,{fontSize:12,color:C.muted});}
//26
{const s=slide('使用边界：精确计算，需要合适的模型');paragraph(s,'本套内容','12 项常见核心实验 + 高斯光束、傅里叶光学入门；可调参数、曲线、模型条件与练习。',.9,1.9,11.5,1.05);paragraph(s,'渲染与科学计算的分工','Blender 用于装置、材质、相机与空间呈现。干涉、衍射、偏振的数值由独立解析模型给出。',.9,3.25,11.5,1.05);paragraph(s,'进一步扩展','厚透镜与像差、材料色散、晶体双折射的空间分束、菲涅耳近场、光学活性与非线性光学可按教材另行扩展。',.9,4.6,11.5,1.1);link(s,'double',.9,6.35,4.2,'返回互动实验室');note(s,'不以“211”作为唯一教学大纲。每个学校教材的内容范围、深度和课时不同，需依据本校教学要求采用。');}

const output=path.join(__dirname,'optics-lecture.pptx');
pptx.writeFile({fileName:output}).then(()=>{fs.copyFileSync(output,path.join(__dirname,'大学物理光学可视化课件.pptx'));console.log('Saved '+count+' slides: '+output);});
