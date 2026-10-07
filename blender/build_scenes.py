"""Rebuild three editable optical teaching scenes and render with Cycles.
Run: blender --background --python build_scenes.py
Authored rays are visible teaching guides. Cycles does NOT compute interference.
The screen texture is calculated separately from the scalar Fraunhofer model.
"""
import bpy, math, os, json
from mathutils import Vector
from math import pi, sin, cos, sqrt, log
BASE=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT=os.path.join(BASE,'assets','renders')
os.makedirs(OUT,exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)

def material(name,color,metal=0,rough=.35,emission=0,alpha=1):
    m=bpy.data.materials.new(name);m.diffuse_color=(*color,alpha);m.use_nodes=True
    b=m.node_tree.nodes.get('Principled BSDF')
    b.inputs['Base Color'].default_value=(*color,alpha)
    b.inputs['Metallic'].default_value=metal;b.inputs['Roughness'].default_value=rough
    b.inputs['Emission Color'].default_value=(*color,1);b.inputs['Emission Strength'].default_value=emission
    b.inputs['Alpha'].default_value=alpha
    if alpha<1:b.inputs['Transmission Weight'].default_value=.6;b.inputs['IOR'].default_value=1.52
    return m
navy=material('Anodized navy',(0.027,.065,.12),.7,.3)
metal=material('Brushed aluminum',(.42,.53,.65),.85,.25)
dark=material('Optical black',(.018,.028,.042),.25,.34)
cyan=material('Cyan teaching ray',(.08,.68,.8),.1,.25,2)
green=material('550nm approximate display',(.34,.85,.11),0,.3,1.5)
gold=material('Incident ray',(.95,.53,.16),0,.3,2)
violet=material('Polarized output',(.55,.29,.8),0,.3,2)
white=material('Engraving',(.72,.82,.9),.1,.4,.15)
glass=material('Dielectric n=1.52',(.31,.69,.8),0,.09,0,.25)

def cube(name,loc,dims,mat,bevel=.025):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=dims
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    if bevel:
        b=o.modifiers.new('Machined edge','BEVEL');b.width=bevel;b.segments=3
    o.data.materials.append(mat);return o
def cylinder(name,loc,r,length,mat,axis=(0,0,1)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=48,radius=r,depth=length,location=loc)
    o=bpy.context.object;o.name=name;o.rotation_mode='QUATERNION';o.rotation_quaternion=Vector(axis).to_track_quat('Z','Y');o.data.materials.append(mat)
    for poly in o.data.polygons:poly.use_smooth=True
    bevel=o.modifiers.new('Edge radius','BEVEL');bevel.width=.012;bevel.segments=2
    return o
def ray(name,a,b,mat,r=.016):
    va,vb=Vector(a),Vector(b);return cylinder(name,(va+vb)/2,r,(vb-va).length,mat,(vb-va).normalized())
def label(name,text,loc,size=.18):
    cu=bpy.data.curves.new(name,'FONT');cu.body=text;cu.align_x='CENTER';cu.size=size;cu.extrude=.001
    o=bpy.data.objects.new(name,cu);bpy.context.collection.objects.link(o);o.location=loc;o.rotation_euler=(pi/2,0,0);o.data.materials.append(white);return o
def mount(x,y,z=1.25):
    cube('Magnetic foot',(x,y,.1),(.5,.55,.16),dark)
    cylinder('Adjustable optical post',(x,y,z/2),.043,z-.14,metal)
def light(loc,energy,color,size):
    bpy.ops.object.light_add(type='AREA',location=loc);l=bpy.context.object;l.data.energy=energy;l.data.color=color;l.data.shape='DISK';l.data.size=size;l.rotation_euler=(Vector((0,0,.7))-l.location).to_track_quat('-Z','Y').to_euler()
def setup(name):
    sc=bpy.data.scenes.new(name);bpy.context.window.scene=sc
    sc.render.engine='CYCLES';sc.cycles.samples=96;sc.cycles.use_denoising=True;sc.cycles.max_bounces=8
    sc.render.resolution_x=1440;sc.render.resolution_y=900;sc.render.resolution_percentage=100
    sc.render.image_settings.file_format='PNG';sc.render.film_transparent=False
    sc.view_settings.view_transform='AgX';sc.view_settings.exposure=.3
    sc.world=bpy.data.worlds.new(name+' environment');sc.world.use_nodes=True
    bg=sc.world.node_tree.nodes.get('Background');bg.inputs['Color'].default_value=(.014,.027,.055,1);bg.inputs['Strength'].default_value=.4
    cube('Optical breadboard',(0,0,-.12),(8.8,4.4,.2),navy,.065)
    for x in range(-13,14):
        for y in range(-6,7):
            cylinder('M6 mount hole',(x*.3,y*.3,-.007),.019,.006,dark)
    cube('Floating laboratory plinth',(0,0,-.35),(9.1,4.7,.22),dark,.1)
    bpy.ops.object.camera_add(location=(-7.7,-10.8,6.8));cam=bpy.context.object;cam.name='Teaching Camera';cam.rotation_euler=(Vector((0,0,1.05))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=10.1;sc.camera=cam
    light((-2,-4,7),1400,(.78,.89,1),5)
    light((3,3,5),1800,(.21,.61,1),4)
    light((-4,3,3),700,(.4,1,.88),3)
    return sc
def source(x=-3.3,y=0,z=1.25):
    mount(x,y,z);cylinder('Laser head',(x,y,z),.22,.8,navy,(1,0,0));cylinder('Laser aperture',(x+.415,y,z),.12,.025,green,(1,0,0));label('Laser label','MONOCHROMATIC',(-3.2,-.4,1.84),.15)

double_params={'lambda_nm':550,'d_mm':.25,'a_mm':.05,'L_m':1.5}
screen_half_width_mm=24
sc=setup('01_Double_Slit')
for key,value in double_params.items(): sc[key]=value
sc['physical_screen_half_width_mm']=screen_half_width_mm;sc['geometry_scale']='slits enlarged independently for teaching'
source();x=-.8;z=1.25
mount(x,0,z)
# Two long vertical apertures, separated in y. Do not use false dark marks.
for y0,y1 in [(-.85,-.24),(-.16,.16),(.24,.85)]:cube('Slit plate solid',(x,(y0+y1)/2,z),(.1,y1-y0,1.6),metal,.008)
cube('Top bridge',(x,0,z+.78),(.1,1.7,.10),metal,.008)
cube('Bottom bridge',(x,0,z-.78),(.1,1.7,.10),metal,.008)
label('Slit caption','TWO SLITS',(-.8,-.95,2.38),.2)
label('Slit parameters','d = %.3f mm   a = %.3f mm'%(double_params['d_mm'],double_params['a_mm']),(-.8,-.94,2.08),.135)
ray('Incident guide',(-2.89,0,z),(x-.05,0,z),green,.023)
for yy in [-.2,.2]:
    for dest in [-.9,0,.9]:ray('Wave path guide',(x+.06,yy,z),(3.0,dest,z),green,.008)
mount(3.08,0,z);cube('Screen body',(3.08,0,z),(.12,2.85,1.8),metal,.045)
# Physical y coordinate is in millimetres, converted to SI before phase calculation.
nw,nh=1024,256;img=bpy.data.images.new('Calculated double slit irradiance',width=nw,height=nh,alpha=True)
pixels=[];lam=double_params['lambda_nm']*1e-9;d=double_params['d_mm']*1e-3;a=double_params['a_mm']*1e-3;L=double_params['L_m']
row=[]
for i in range(nw):
    yy=(i/(nw-1)*2-1)*screen_half_width_mm*1e-3;s=yy/math.hypot(L,yy);beta=pi*a*s/lam
    envelope=(sin(beta)/beta)**2 if abs(beta)>1e-12 else 1
    intensity=envelope*cos(pi*d*s/lam)**2
    display=intensity**.5
    row.extend((.006+.28*display,.012+.84*display,.008+.06*display,1))
pixels=row*nh;img.pixels=pixels;img.pack()
me=bpy.data.meshes.new('Screen UV mesh');me.from_pydata([(3.008,-1.34,z-.8),(3.008,1.34,z-.8),(3.008,1.34,z+.8),(3.008,-1.34,z+.8)],[],[(0,1,2,3)]);me.update()
uv=me.uv_layers.new();coords=[(0,0),(1,0),(1,1),(0,1)]
for loop in me.loops:uv.data[loop.index].uv=coords[loop.vertex_index]
o=bpy.data.objects.new('Analytical screen texture',me);sc.collection.objects.link(o)
ma=bpy.data.materials.new('Irradiance visual mapping');ma.use_nodes=True;n=ma.node_tree.nodes;n.clear();tex=n.new('ShaderNodeTexImage');tex.image=img;em=n.new('ShaderNodeEmission');em.inputs['Strength'].default_value=.9;output=n.new('ShaderNodeOutputMaterial');ma.node_tree.links.new(tex.outputs['Color'],em.inputs['Color']);ma.node_tree.links.new(em.outputs[0],output.inputs['Surface']);o.data.materials.append(ma)
label('Screen caption','FRAUNHOFER PATTERN | DISPLAY SQRT(I)',(3.0,-1.42,2.5),.13)
label('Scene title','YOUNG / DOUBLE-SLIT',(0,-2.07,.35),.21)

refraction_params={'n1':1.,'n2':1.52,'incidence_deg':35.}
sc=setup('02_Refraction_Interface')
for key,value in refraction_params.items(): sc[key]=value
sin_theta_t=sin(math.radians(refraction_params['incidence_deg']))*refraction_params['n1']/refraction_params['n2']
tir=abs(sin_theta_t)>1
sc['refraction_deg']='TIR' if tir else math.degrees(math.asin(sin_theta_t));sc['total_internal_reflection']=tir
glass.node_tree.nodes.get('Principled BSDF').inputs['IOR'].default_value=refraction_params['n2']
# Interface plane x=0. Incidence/refraction stay in horizontal x/y plane.
cube('Glass medium',(1.50,0,1.08),(3,3.1,1.70),glass,.012)
cube('Interface outline',(0,0,1.08),(.017,3.14,1.74),material('Interface edge',(.2,.48,.65),0,.3,0,.15),0)
theta=math.radians(refraction_params['incidence_deg']);zz=1.25
origin=(0,0,zz);start=(-2.5,-2.5*math.tan(theta),zz);ref=(-2.5,2.5*math.tan(theta),zz)
ray('Incoming ray',start,origin,gold,.022);ray('Reflected ray',origin,ref,gold,.012)
if not tir:
    theta_t=math.asin(sin_theta_t);trans=(2.6,2.6*math.tan(theta_t),zz);ray('Snell refracted ray',origin,trans,cyan,.022)
for k in range(-10,11):ray('Interface normal dash',(k*.28,0,zz+.014),(k*.28+.13,0,zz+.014),white,.004)
label('Air label','AIR  n = %.2f'%refraction_params['n1'],(-2,-1.6,2.4),.21)
label('Glass label','GLASS  n = %.2f'%refraction_params['n2'],(1.6,-1.9,3.0),.21)
label('Angle values','%.2f deg  ->  %s'%(refraction_params['incidence_deg'],('TOTAL INTERNAL REFLECTION' if tir else '%.2f deg'%sc['refraction_deg'])),(-.2,-2.05,3.5),.15 if tir else .19)
label('Ray note','RAY TUBE BRIGHTNESS IS SCHEMATIC',(0,-1.55,.5),.13)
label('Scene title','SNELL / FLAT INTERFACE',(0,-2.07,.35),.21)

polarization_params={'I0_after_first_polarizer':1.,'analyzer_angle_deg':45.}
polarization_params['transmission']=math.cos(math.radians(polarization_params['analyzer_angle_deg']))**2
sc=setup('03_Polarization')
for key,value in polarization_params.items(): sc[key]=value
source(-3.3)
def polarizer(x,angle,name):
    mount(x,0,1.25)
    bpy.ops.mesh.primitive_torus_add(major_radius=.7,minor_radius=.047,major_segments=64,minor_segments=12,location=(x,0,1.25),rotation=(0,pi/2,0));o=bpy.context.object;o.name=name+' mounting ring';o.data.materials.append(metal)
    ang=math.radians(angle)
    for k in range(-5,6):
        off=k*.11;half=sqrt(.63**2-off**2)
        pts=[]
        for v in [-half,half]:
            yy=off*cos(ang)+v*sin(ang);zz=1.25-off*sin(ang)+v*cos(ang)
            pts.append((x,yy,zz))
        ray(name+' transmission axis',pts[0],pts[1],cyan if angle==0 else violet,.009)
    label(name+' label',name+'  %g deg'%angle,(x,-.88,2.35),.17)
polarizer(-1.45,0,'POLARIZER');polarizer(1.1,polarization_params['analyzer_angle_deg'],'ANALYZER')
ray('Propagation guide',(-2.89,0,1.25),(3.2,0,1.25),green,.007)
analyzer_angle=polarization_params['analyzer_angle_deg'];analyzer_amp=math.cos(math.radians(analyzer_angle))
for side,(x0,x1,angle,amplitude,ma) in enumerate([(-1.3,.95,0,.38,cyan),(1.25,3.15,analyzer_angle,.38*analyzer_amp,violet)]):
    prev=None
    for j in range(121):
        xx=x0+(x1-x0)*j/120;v=amplitude*sin(j/120*4*pi);a=math.radians(angle);pt=(xx,v*sin(a),1.25+v*cos(a))
        if prev:ray('Electric field schematic',prev,pt,ma,.011)
        prev=pt
label('Output ratio','I / I0 = cos^2(%.0f deg) = %.2f'%(analyzer_angle,polarization_params['transmission']),(1,-1.4,2.8),.18)
label('Scene title','POLARIZATION / FIELD PROJECTION',(0,-2.07,.35),.21)

def fourier_display_image(name,mode='spectrum',size=256,lambda_nm=550,f_mm=200,a_mm=.10,b_mm=.10):
    span_mm=2.0;lam=lambda_nm*1e-9;f=f_mm*1e-3;a=a_mm*1e-3;b=b_mm*1e-3
    image=bpy.data.images.new(name,width=size,height=size,alpha=True);pixels=[];max_i=0;values=[]
    for y in range(size):
        for x in range(size):
            xx=(x-size/2)/(size*(span_mm*1e-3));yy=(y-size/2)/(size*(span_mm*1e-3))
            aperture=1 if abs(xx)<=a/2 and abs(yy)<=b/2 else 0
            nu_x=xx/(lam*f);nu_y=yy/(lam*f)
            bx=pi*a*nu_x;by=pi*b*nu_y
            sx=1 if abs(bx)<1e-12 else sin(bx)/bx;sy=1 if abs(by)<1e-12 else sin(by)/by
            spectrum=(sx*sx)*(sy*sy)
            value=aperture if mode=='input' else spectrum
            values.append(value)
            max_i=max(max_i,value)
    for value in values:
        q=value/(max_i or 1);q=sqrt(max(0,q)) if mode!='spectrum' else log(1+500*value)/log(1+500*(max_i or 1))
        pixels.extend((.02+.25*q,.08+.72*q,.12+.82*q,1))
    image.pixels=pixels;image.pack();return image
def image_material(name,image):
    m=bpy.data.materials.new(name);m.use_nodes=True;n=m.node_tree.nodes;n.clear();tex=n.new('ShaderNodeTexImage');tex.image=image;em=n.new('ShaderNodeEmission');em.inputs['Strength'].default_value=.9;out=n.new('ShaderNodeOutputMaterial');m.node_tree.links.new(tex.outputs['Color'],em.inputs['Color']);m.node_tree.links.new(em.outputs[0],out.inputs['Surface']);return m
def fourier_screen(name,x,image,caption):
    cube(name+' body',(x,1,0),(.12,1.9,1.9),metal,.045)
    bpy.ops.mesh.primitive_plane_add(size=1.6,location=(x-.071,1,0),rotation=(0,pi/2,0));o=bpy.context.object;o.name=name+' calculated texture';o.data.materials.append(image_material(name+' DISPLAY material',image));label(name+' caption',caption,(x,2.05,0),.14);return o
def lens_element(name,x):
    mount(x,0,1.25);bpy.ops.mesh.primitive_uv_sphere_add(segments=48,ring_count=24,location=(x,1.25,0));o=bpy.context.object;o.name=name;o.scale=(.16,.72,.72);o.data.materials.append(glass);return o

fourier_params={'lambda_nm':550.,'f_mm':200.,'a_mm':.10,'b_mm':.10,'aperture':'rectangle','filter':'none','filter_size_mm_inv':1.0}
sc=setup('04_Fourier_4f')
for key,value in fourier_params.items(): sc[key]=value
source(-3.55);mount(-2.25,0,1.25);cube('Fourier aperture plate',(-2.25,1.25,0),(.1,1.5,1.5),metal,.02);label('Fourier aperture caption','APERTURE · RECTANGLE',(-2.25,2.18,0),.14)
lens_element('Fourier lens 1',-.75);spectrum_image=fourier_display_image('Fourier spectrum DISPLAY',mode='spectrum',lambda_nm=fourier_params['lambda_nm'],f_mm=fourier_params['f_mm'],a_mm=fourier_params['a_mm'],b_mm=fourier_params['b_mm']);fourier_screen('Fourier spectrum plane',.65,spectrum_image,'FOURIER PLANE · DISPLAY |F|²')
cube('Filter carrier',(.65,.14,0),(.12,.18,1.8),metal,.015);label('Filter label','FILTER SLOT · OPTIONAL',(.65,.18,1.15),.11)
lens_element('Fourier lens 2',1.75);input_image=fourier_display_image('Fourier input DISPLAY',mode='input',lambda_nm=fourier_params['lambda_nm'],f_mm=fourier_params['f_mm'],a_mm=fourier_params['a_mm'],b_mm=fourier_params['b_mm']);fourier_screen('Fourier image plane',3.05,input_image,'IMAGE PLANE · DISPLAY |Uout|²')
ray('4f incident guide',(-3.15,1.25,0),(-2.3,1.25,0),green,.022)
for z in [-.55,0,.55]:
    ray('4f parallel ray',(-2.18,1.25,z),(-.75,1.25,z),cyan,.009);ray('4f converging ray',(-.75,1.25,z),(.65,1.25,z*.15),cyan,.009);ray('4f diverging ray',(.65,1.25,z*.15),(1.75,1.25,z),cyan,.009);ray('4f output ray',(1.75,1.25,z),(2.98,1.25,z),cyan,.009)
label('Scene title','FOURIER OPTICS / 4f FILTERING',(0,-2.07,.35),.21)

names=[('01_Double_Slit','double-slit.png'),('02_Refraction_Interface','lens-bench.png'),('03_Polarization','polarization.png'),('04_Fourier_4f','fourier-4f.png')]
bpy.context.window.scene=bpy.data.scenes['01_Double_Slit']
# Embedded scientific notes and editable custom values accompany named geometry.
notes=bpy.data.texts.new('READ ME - models and controls')
notes.write('Each scene has custom properties documenting parameters. Edit constants in build_scenes.py and rerun to regenerate dependent geometry and screen texture. Custom properties record values; they are not automatic drivers. Dimensions of apertures, apparatus and rays are independently enlarged for teaching. Cycles path tracing renders material/lighting, not coherent wave diffraction. Double slit uses exact sin(theta)=y/hypot(L,y), Fraunhofer model, and square-root display brightness. Default double slit: lambda %.0fnm, d %.3fmm, a %.3fmm, L %.2fm; screen crop ±%.0fmm. Default refraction: n1=%.2f, n2=%.2f, incidence %.2fdeg. Default polarizer analyzer angle %.2fdeg; field amplitude after analyzer is multiplied by cos(angle). Classical scalar idealized models only.' % (double_params['lambda_nm'],double_params['d_mm'],double_params['a_mm'],double_params['L_m'],screen_half_width_mm,refraction_params['n1'],refraction_params['n2'],refraction_params['incidence_deg'],polarization_params['analyzer_angle_deg']))
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(BASE,'blender','optics-lab.blend'))
manifest={'blender_version':bpy.app.version_string,'blend_file':'blender/optics-lab.blend','reproducible_script':'blender/build_scenes.py','render_engine':'Cycles CPU','samples':96,'denoising':True,'resolution':[1440,900],'scenes':[],'limitations':['Authored ray tubes and electric-field shapes are enlarged teaching guides.','Cycles does not solve coherent wave interference: an analytical Fraunhofer image is embedded in the screen.','Rendered emission brightness is a visual map, not linear irradiance; the double-slit screen uses display sqrt(I).','Ray-tube thickness and brightness do not encode Fresnel power or polarization intensity.','The Fourier 4f scene embeds analytical DISPLAY textures; Blender does not calculate diffraction or filtering.','Scene custom properties record parameters. Rerun the build script after editing constants to regenerate dependent geometry.']}
for scene_name,filename in names:
    s=bpy.data.scenes[scene_name];bpy.context.window.scene=s
    png_path=os.path.join(OUT,filename);webp_path=os.path.splitext(png_path)[0]+'.webp'
    s.render.image_settings.file_format='PNG';s.render.filepath=png_path;bpy.ops.render.render(write_still=True)
    s.render.image_settings.file_format='WEBP';s.render.image_settings.quality=82;s.render.filepath=webp_path;bpy.ops.render.render(write_still=True)
    s.render.image_settings.file_format='PNG'
    manifest['scenes'].append({'name':scene_name,'render':'assets/renders/'+filename,'render_webp':'assets/renders/'+os.path.basename(webp_path),'parameters':{k:v for k,v in s.items() if isinstance(v,(str,int,float,bool))}})
with open(os.path.join(BASE,'blender','manifest.json'),'w',encoding='utf-8') as f:json.dump(manifest,f,ensure_ascii=False,indent=2)
bpy.context.window.scene=bpy.data.scenes['01_Double_Slit']
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(BASE,'blender','optics-lab.blend'))
print('SUCCESS: 3 Cycles scenes, source blend, PNGs and manifest written.')
