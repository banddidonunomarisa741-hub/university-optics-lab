(function(root){
const lessons={
  "waves": {
    "formula": "E=E₀ cos(k·r−ωt+φ)；I/I₀=1+ρ²+2ρ cosφ",
    "assumptions": [
      "量纲采用 SI；图中空间尺寸与动画速度为教学缩放。",
      "数值为双精度计算并归一化显示，实际测量需按仪器分辨率重新估计不确定度。",
      "两列同频、同偏振简谐平面波；ρ=A₂/A₁。"
    ],
    "explanation": [
      "相位差决定两列光场在同一点的叠加方式。φ=0 时振幅相加，φ=π 时相消。",
      "强度是时间平均能流，不能把振幅直接当强度；等偏振波的强度含交叉项 2ρcosφ。",
      "把 φ 从 0 调到 π，再改变 ρ，可观察“完全相消”只在等振幅时出现。"
    ],
    "challenge": {
      "question": "固定 ρ=1，φ 从 0 调到 π，强度经过哪些极值？",
      "answer": "I/I₀=2(1+cosφ)，φ=0 为 4，φ=π 为 0；中间连续变化。"
    },
    "presets": [
      {
        "label": "相长",
        "values": {
          "phase": 0,
          "ratio": 1
        }
      },
      {
        "label": "相消",
        "values": {
          "phase": 3.1416,
          "ratio": 1
        }
      }
    ],
    "sources": [
      {
        "title": "OpenStax · University Physics Vol. 3 · 3 2 mathematics of interference",
        "url": "https://openstax.org/books/university-physics-volume-3/pages/3-2-mathematics-of-interference"
      }
    ]
  },
  "snell": {
    "formula": "n₁ sinθ₁=n₂ sinθ₂；sinθc=n₂/n₁（n₁>n₂）",
    "assumptions": [
      "量纲采用 SI；图中空间尺寸与动画速度为教学缩放。",
      "数值为双精度计算并归一化显示，实际测量需按仪器分辨率重新估计不确定度。",
      "平面界面、单色光、各向同性非磁介质；角度从法线量起。"
    ],
    "explanation": [
      "界面平移对称性使切向波矢连续，因此频率保持不变而相速和波长改变。",
      "当 n₁>n₂ 且 θ₁>θc 时不存在传播折射波，但第二介质仍有指数衰减的倏逝场。",
      "布儒斯特角属于振幅边界条件的特殊结果；本模块首先关注折射角、临界角和反射率趋势。"
    ],
    "challenge": {
      "question": "玻璃 n₁=1.50 入射空气，θ₁=40° 是否全反射？",
      "answer": "θc=arcsin(1/1.50)=41.8°，40°<θc，因此不会全反射。"
    },
    "presets": [
      {
        "label": "空气→玻璃",
        "values": {
          "n1": 1,
          "n2": 1.5,
          "angle": 30
        }
      },
      {
        "label": "玻璃→空气",
        "values": {
          "n1": 1.5,
          "n2": 1,
          "angle": 50
        }
      }
    ],
    "sources": [
      {
        "title": "OpenStax · University Physics Vol. 3 · 1 3 refraction",
        "url": "https://openstax.org/books/university-physics-volume-3/pages/1-3-refraction"
      }
    ]
  },
  "lens": {
    "formula": "1/f=1/u+1/v；m=−v/u",
    "assumptions": [
      "量纲采用 SI；图中空间尺寸与动画速度为教学缩放。",
      "数值为双精度计算并归一化显示，实际测量需按仪器分辨率重新估计不确定度。",
      "薄透镜、近轴光线、物距 u>0；忽略厚度与球差。"
    ],
    "explanation": [
      "薄透镜把入射波前的曲率改变为新的会聚或发散曲率。符号约定决定实像、虚像与倒立正立的判断。",
      "在近轴条件下，焦距不依赖光线高度。u 接近 f 时像距的绝对值趋于无穷大；是否近轴仍取决于光线与光轴夹角，而非仅由物距是否接近焦距决定。",
      "拖动物距并同时记录 v、m，比死记“二倍焦距”更能建立函数关系。"
    ],
    "challenge": {
      "question": "f=100 mm、u=300 mm 时像距和放大率是多少？",
      "answer": "v=fu/(u−f)=150 mm，m=−v/u=−0.50，得到倒立缩小实像。"
    },
    "presets": [
      {
        "label": "二倍焦距",
        "values": {
          "f": 100,
          "u": 200
        }
      },
      {
        "label": "焦点以内",
        "values": {
          "f": 100,
          "u": 70
        }
      }
    ],
    "sources": [
      {
        "title": "OpenStax · University Physics Vol. 3 · 2 4 thin lenses",
        "url": "https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses"
      }
    ]
  },
  "double": {
    "formula": "I/(4Iₛ) = sinc²β · [1+γ cos(2α+φ)]/2\nβ=πa sinθ/λ，α=πd sinθ/λ\nΔx ≈ λL/d",
    "assumptions": [
      "量纲采用 SI；图中空间尺寸与动画速度为教学缩放。",
      "数值为双精度计算并归一化显示，实际测量需按仪器分辨率重新估计不确定度。",
      "远场或傍轴小角度；双缝等幅、同偏振；有限缝宽用 sinc² 包络修正。",
      "Iₛ 为单缝轴上强度，图像以完全相干相长时的 4Iₛ 归一化。γ=0 表示互不相干，γ=1 表示完全相干。",
      "相位采用 sinθ=x/√(L²+x²)；条纹间距读数为近轴值。角强度模型不含平屏投影因子。"
    ],
    "explanation": [
      "两缝到屏幕的路径差 δ≈d sinθ；相位差 2πδ/λ 把几何差转为亮暗条纹。",
      "条纹间距随 λ、L 增大而增大，随 d 增大而减小；有限缝宽决定中央包络的宽度。",
      "改变一个参数并固定其余参数，导出三组数据，用 Δy 对 λL/d 作线性检验。"
    ],
    "challenge": {
      "question": "λ=633 nm、L=2.00 m、d=0.250 mm，条纹间距是多少？",
      "answer": "Δy=λL/d=5.06×10⁻³ m=5.06 mm。"
    },
    "presets": [
      {
        "label": "标准绿光",
        "values": {
          "lambda": 550,
          "d": 0.25,
          "a": 0.05,
          "L": 1.5,
          "coherence": 1,
          "phase": 0
        }
      },
      {
        "label": "红光",
        "values": {
          "lambda": 633
        }
      },
      {
        "label": "失去相干",
        "values": {
          "coherence": 0
        }
      }
    ],
    "sources": [
      {
        "title": "OpenStax · University Physics Vol. 3 · 4 3 double slit diffraction",
        "url": "https://openstax.org/books/university-physics-volume-3/pages/4-3-double-slit-diffraction"
      }
    ]
  },
  "film": {
    "formula": "R = (r₀₁²+r₁₂²+2r₀₁r₁₂cosδ) /\n(1+r₀₁²r₁₂²+2r₀₁r₁₂cosδ)\nrᵢⱼ=(nᵢ−nⱼ)/(nᵢ+nⱼ)，δ=4πn₁t/λ",
    "assumptions": [
      "严格法向入射、平行薄膜、无吸收无磁介质；波长指真空波长。",
      "保留所有阶次内反射，用复振幅的几何级数求和；反射相位已经包含在 rᵢⱼ 的正负号中。",
      "R、T 是能量比例，此模型满足 R+T=1。无限厚基底不计算背面回波。"
    ],
    "explanation": [
      "每次在膜内往返增加相位 δ=4πn₁t/λ。把所有阶次反射的复振幅相加，得到页面上的反射率表达式；不要再额外重复加入一次半波损失。",
      "增大膜厚会让反射率随相位周期变化；若两侧折射率匹配，相关界面的反射振幅趋近于零。",
      "区分等倾与等厚：本模块固定观察方向并改变 t，牛顿环模块则让 t 随半径变化。"
    ],
    "challenge": {
      "question": "将膜厚从 300 nm 增到 600 nm，反射相位变化多少？",
      "answer": "正入射近似下 Δφ 增加 4πn·300 nm/λ；代入 n=1.5、λ=550 nm 约为 5.14π。"
    },
    "presets": [
      {
        "label": "增透薄膜",
        "values": {
          "n0": 1,
          "n1": 1.38,
          "n2": 1.52,
          "t": 100
        }
      },
      {
        "label": "无膜极限",
        "values": {
          "t": 0
        }
      },
      {
        "label": "折射率全匹配",
        "values": {
          "n0": 1.5,
          "n1": 1.5,
          "n2": 1.5
        }
      }
    ],
    "sources": [
      {
        "title": "OpenStax · University Physics Vol. 3 · 3 4 interference in thin films",
        "url": "https://openstax.org/books/university-physics-volume-3/pages/3-4-interference-in-thin-films"
      },
      {
        "title": "University of Toronto · Single Layer Dielectric Thin Film",
        "url": "https://www.physics.utoronto.ca/~phy326/film/film.htm"
      }
    ]
  },
  "newton": {
    "formula": "t(r)≈r²/(2R)；反射暗环近轴：r_m²≈mλR/n（中心接触时为暗）",
    "assumptions": [
      "平凸透镜与平板在中心接触；薄隙介质折射率小于两侧玻璃，存在一次相对 π 反射跃迁。",
      "近轴膜厚 t≈r²/(2R)，使用两反射波等幅的高可见度近似。",
      "图样为 0–1 明暗对比映射。透射显示互补调制，不能直接解释为绝对能量透射率；真实透射对比度与界面反射率有关。"
    ],
    "explanation": [
      "球面透镜与平板之间的膜厚随半径平方增长，使反射光出现同心等厚干涉环。",
      "空气膜中心接触时，一束反射光发生 π 相位跃迁，中心反射斑为暗；透射观察时明暗互补。",
      "测 r_m² 而不是 r_m：斜率给出 λR/n，可用多级环做线性拟合。"
    ],
    "challenge": {
      "question": "R=1.0 m、λ=550 nm，m=10 暗环半径约多少？",
      "answer": "r₁₀=√(10λR)=2.35 mm（空气隙 n=1，近轴）。"
    },
    "presets": [
      {
        "label": "反射暗环",
        "values": {
          "R": 1,
          "lambda": 550,
          "gap": 0
        }
      },
      {
        "label": "透射互补",
        "values": {
          "R": 1,
          "lambda": 550,
          "gap": 1
        }
      }
    ],
    "sources": [
      {
        "title": "OpenStax · University Physics Vol. 3 · 3 4 interference in thin films",
        "url": "https://openstax.org/books/university-physics-volume-3/pages/3-4-interference-in-thin-films"
      },
      {
        "title": "University of Alberta · Interference in Thin Films",
        "url": "https://sites.ualberta.ca/~pogosyan/teaching/PHYS_130/FALL_2010/lectures/lect34/lecture34.html"
      }
    ]
  },
  "michelson": {
    "formula": "I/Iₘₐₓ = [1+cos(2πΔ cosθ/λ)]/2\ncosθ = f/√(f²+r²)，Δ=2(l₁−l₂)\n镜面每移动 λ/2，中心移过一条纹",
    "assumptions": [
      "理想已补偿两臂、等强单色相干光。两等效反射镜互相平行，观察等倾圆环。",
      "Δ 是光轴方向的往返光程差，控件单位 μm；不是单程镜面位移。",
      "θ 是观察光线相对光轴的倾角，不是镜面倾斜角；焦距 f 将角度映射到观察屏半径 r。",
      "以 Δ=0 为相长参考端口；另一个互补输出端口相位可相反。"
    ],
    "explanation": [
      "分束器让同一光源的两束光分别往返两臂，再合并。沿光轴的镜面位移 Δx 使中心光程差改变 2Δx。",
      "对于平行等效反射面，不同观察方向的光程差为 Δ cosθ。相同 θ 的方向形成一个圆锥，经过观察透镜呈现同心圆环。",
      "改变 Δ 会让环纹移动；改变 f 会按比例改变环的物理半径。播放功能缓慢扫描光程差，用于观察条纹越过参考点。"
    ],
    "challenge": {
      "question": "λ=550 nm，镜面沿光轴移动 0.275 μm，中心移过多少条纹？",
      "answer": "光程差改变 2×0.275=0.550 μm，恰好一个波长，因此中心完成一次明暗周期。控件 Δ 应增加 0.550 μm。"
    },
    "presets": [
      {
        "label": "等臂相长",
        "values": {
          "delta": 0
        }
      },
      {
        "label": "等倾圆环",
        "values": {
          "delta": 200,
          "f": 150
        }
      },
      {
        "label": "更密的圆环",
        "values": {
          "delta": 800,
          "f": 150
        }
      }
    ],
    "sources": [
      {
        "title": "OpenStax · University Physics Vol. 3 · 3 5 the michelson interferometer",
        "url": "https://openstax.org/books/university-physics-volume-3/pages/3-5-the-michelson-interferometer"
      }
    ]
  },
  "single": {
    "formula": "I(θ)=I₀[sinc(πa sinθ/λ)]²；暗纹 a sinθ=mλ",
    "assumptions": [
      "量纲采用 SI；图中空间尺寸与动画速度为教学缩放。",
      "数值为双精度计算并归一化显示，实际测量需按仪器分辨率重新估计不确定度。",
      "夫琅禾费远场、矩形单缝、均匀照明；sinθ≈tanθ≈y/L 仅在小角度。"
    ],
    "explanation": [
      "单缝内不同位置的次波相互干涉，中央主极大宽度约为两侧第一暗纹间距。",
      "减小 a 或增大 λ 会让角分布变宽；孔径有限时衍射不会突然消失。",
      "观察 sinc² 包络并读取第一零点，检验 y₁≈λL/a。"
    ],
    "challenge": {
      "question": "λ=500 nm、a=0.10 mm、L=1.0 m，第一暗纹距中心多远？",
      "answer": "y₁≈λL/a=5.0 mm，角度约 0.286°。"
    },
    "presets": [
      {
        "label": "窄缝",
        "values": {
          "a": 0.1,
          "lambda": 500,
          "L": 1
        }
      },
      {
        "label": "宽缝",
        "values": {
          "a": 0.5,
          "lambda": 500,
          "L": 1
        }
      }
    ],
    "sources": [
      {
        "title": "OpenStax · University Physics Vol. 3 · 4 1 single slit diffraction",
        "url": "https://openstax.org/books/university-physics-volume-3/pages/4-1-single-slit-diffraction"
      }
    ]
  },
  "grating": {
    "formula": "d(sinθ_m−sinθ_i)=mλ；分辨本领 R=λ/Δλ≈mN",
    "assumptions": [
      "量纲采用 SI；图中空间尺寸与动画速度为教学缩放。",
      "数值为双精度计算并归一化显示，实际测量需按仪器分辨率重新估计不确定度。",
      "N 条等距同相狭缝；忽略缝形细节时只看主极大；入射角从法线量起。"
    ],
    "explanation": [
      "多缝叠加把相位差累积为窄主峰；缝数 N 越多，峰越尖，分辨率越高。",
      "光栅常数 d 决定级次位置，缝宽 a 通过单缝包络抑制或缺失某些级次。",
      "先用光栅方程预测角度，再用峰位和峰宽估计实际分辨能力。"
    ],
    "challenge": {
      "question": "λ=600 nm、d=2 μm、正入射，最高整数级次是多少？",
      "answer": "m_max=floor(d/λ)=3；三级满足 sinθ=0.9，仍可传播。"
    },
    "presets": [
      {
        "label": "高分辨",
        "values": {
          "d": 2,
          "N": 200,
          "lambda": 550
        }
      },
      {
        "label": "宽间距",
        "values": {
          "d": 5,
          "N": 20,
          "lambda": 550
        }
      }
    ],
    "sources": [
      {
        "title": "OpenStax · University Physics Vol. 3 · 4 4 diffraction gratings",
        "url": "https://openstax.org/books/university-physics-volume-3/pages/4-4-diffraction-gratings"
      }
    ]
  },
  "circular": {
    "formula": "I(θ)∝[2J₁(q)/q]²；q=πD sinθ/λ；瑞利角 θ_R≈1.22λ/D",
    "assumptions": [
      "无像差圆形孔径、均匀照明、标量傍轴夫琅禾费模型。",
      "两个等强非相干点源，各自艾里强度相加；采用 I=(A₁+A₂)/2，以双点重合时的轴上光强归一化。",
      "二维图按各点源的径向距离独立计算；曲线是通过两点源中心的水平剖面。",
      "1.21967λ/D 来自 J₁ 的第一正零点。瑞利判据是一种分辨约定，不是信息的硬阈值。"
    ],
    "explanation": [
      "圆孔的二维傅里叶变换给出艾里斑，中心亮斑外是同心暗环与弱旁瓣。",
      "q=πD sinθ/λ 是无量纲径向坐标；第一零点对应 q≈3.8317，得到 1.22 λ/D。",
      "比较双点角距与 θ_R 可直观看到“可分辨”是判据而非绝对开关。"
    ],
    "challenge": {
      "question": "λ=550 nm、D=2.0 mm，瑞利角约多少？",
      "answer": "θ_R=1.22λ/D=3.36×10⁻⁴ rad≈69.3 arcsec。"
    },
    "presets": [
      {
        "label": "双星可分辨",
        "values": {
          "D": 2,
          "separation": 120,
          "lambda": 550
        }
      },
      {
        "label": "增大口径",
        "values": {
          "D": 5,
          "separation": 120,
          "lambda": 550
        }
      }
    ],
    "sources": [
      {
        "title": "OpenStax · University Physics Vol. 3 · 4 5 circular apertures and resolution",
        "url": "https://openstax.org/books/university-physics-volume-3/pages/4-5-circular-apertures-and-resolution"
      },
      {
        "title": "NIST DLMF · Bessel function definitions",
        "url": "https://dlmf.nist.gov/10.2"
      }
    ]
  },
  "polarization": {
    "formula": "两片：I/I₀ = cos²θ\n三片：I/I₀ = cos²β · cos²(θ−β)\nI₀ 定义为第一片之后的线偏振光强",
    "assumptions": [
      "理想偏振片；第一片透光轴为 0°。所有读数相对于第一片之后的 I₀。",
      "若从非偏振入射光 Iᵢₙ 开始，理想第一片使 I₀=Iᵢₙ/2。",
      "忽略实际消光比与额外吸收。"
    ],
    "explanation": [
      "偏振片只保留电场在透光轴方向的投影，投影振幅平方产生 cos²θ。",
      "若入射光是非偏振光，第一片理想透射强度约为 I_in/2；后续偏振片才直接遵循马吕斯定律。",
      "三片偏振片在正交首尾片之间插入 45° 中间片时会重新获得透射光。"
    ],
    "challenge": {
      "question": "第一片之后 I₁=8 W·m⁻²，分析器与其夹角 60°，输出多少？",
      "answer": "I=I₁cos²60°=2 W·m⁻²。若 8 是非偏振入射光强，还需先乘第一片透过率。"
    },
    "presets": [
      {
        "label": "平行",
        "values": {
          "theta": 0,
          "three": 0
        }
      },
      {
        "label": "正交 + 45°片",
        "values": {
          "theta": 90,
          "mid": 45,
          "three": 1
        }
      }
    ],
    "sources": [
      {
        "title": "OpenStax · University Physics Vol. 3 · 1 7 polarization",
        "url": "https://openstax.org/books/university-physics-volume-3/pages/1-7-polarization"
      }
    ]
  },
  "waveplate": {
    "formula": "E快/E₀ = cosα · cos(ωt)\nE慢/E₀ = sinα · cos(ωt+δ)\nsin(2χ)=sin(2α)sinδ，短/长轴比=|tanχ|",
    "assumptions": [
      "完全线偏振的单色入射光、理想无损双折射延迟片。",
      "坐标轴沿波片的快轴、慢轴；α 是入射偏振方向与快轴夹角。",
      "图中采用 +δ 的相位约定；改变观察方向或时间符号会改变旋向命名，所以本页不标左右旋。"
    ],
    "explanation": [
      "波片不靠吸收削弱某个方向，而是让正交分量获得相位差 δ。",
      "入射线偏振与快轴成 45° 且 δ=π/2 时，两分量等幅正交，输出为圆偏振。",
      "δ=180° 时仍为线偏振，方向关于波片轴反射；相对于原入射方向的转角大小为 2α。只有 α=45° 或等效取向、且 δ=90° 或 270° 时才得到圆偏振。"
    ],
    "challenge": {
      "question": "为什么 α=45°、δ=90° 得到圆偏振？",
      "answer": "两正交分量振幅相等，且相位差 π/2；电场端点在横截面上匀速转动。"
    },
    "presets": [
      {
        "label": "圆偏振",
        "values": {
          "alpha": 45,
          "retardance": 90
        }
      },
      {
        "label": "半波片",
        "values": {
          "alpha": 23,
          "retardance": 180
        }
      },
      {
        "label": "椭圆偏振",
        "values": {
          "alpha": 20,
          "retardance": 90
        }
      }
    ],
    "sources": [
      {
        "title": "MIT 8.03SC · Lecture 18: Wave Plates",
        "url": "https://ocw.mit.edu/courses/8-03sc-physics-iii-vibrations-and-waves-fall-2016/resources/mit8_03scf16_lec18/"
      }
    ]
  },
  "gaussian": {
    "formula": "w(z)=w₀√[1+(z/z_R)²]；z_R=πw₀²/λ；θ≈λ/(πw₀)",
    "assumptions": [
      "量纲采用 SI；图中空间尺寸与动画速度为教学缩放。",
      "数值为双精度计算并归一化显示，实际测量需按仪器分辨率重新估计不确定度。",
      "理想 TEM₀₀ 基模；w 为 1/e² 强度半径；傍轴传播。"
    ],
    "explanation": [
      "高斯束在束腰处最细，离开束腰后按瑞利长度 z_R 展开；紧聚焦意味着更快发散。",
      "z_R 与 w₀² 成正比，是判断“近场/远场”的自然尺度。",
      "对比同一 λ 下不同 w₀ 的束宽和发散角，建立空间局域与角度扩展的互易关系。"
    ],
    "challenge": {
      "question": "λ=633 nm、w₀=0.50 mm，瑞利长度约多少？",
      "answer": "z_R=πw₀²/λ≈1.24 m。"
    },
    "presets": [
      {
        "label": "束腰截面",
        "values": {
          "lambda": 532,
          "w0": 0.5,
          "z": 0
        }
      },
      {
        "label": "约一瑞利长度",
        "values": {
          "lambda": 532,
          "w0": 0.5,
          "z": 1.48
        }
      },
      {
        "label": "紧束腰",
        "values": {
          "lambda": 532,
          "w0": 0.1,
          "z": 1
        }
      }
    ],
    "sources": [
      {
        "title": "MIT OpenCourseWare · Optics 2.71 · Lecture notes",
        "url": "https://ocw.mit.edu/courses/2-71-optics-spring-2009/resources/lecture-notes/"
      }
    ]
  },
  "fourier": {
    "formula": "U_f(x,y)∝𝓕{U₀(ξ,η)}；矩形孔一维零点 x₁≈λf/a",
    "assumptions": [
      "量纲采用 SI；图中空间尺寸与动画速度为教学缩放。",
      "数值为双精度计算并归一化显示，实际测量需按仪器分辨率重新估计不确定度。",
      "薄透镜、后焦面观察、标量夫琅禾费近似；矩形孔径与均匀入射。",
      "展示一维矩形振幅孔径的横向 sinc² 剖面；长边方向不建模。空间频率 νₓ=x/(λf)。"
    ],
    "explanation": [
      "透镜后焦面把入射场的空间频率分量按角度展开，孔径函数的傅里叶变换决定衍射图。",
      "孔径越宽，中央频谱斑越窄；物面局部细节对应更高的空间频率。",
      "用单缝或矩形孔改变 a，读取后焦面首零点，验证 x₁≈λf/a。"
    ],
    "challenge": {
      "question": "λ=550 nm、f=200 mm、a=1.0 mm，中央斑半宽约多少？",
      "answer": "x₁≈λf/a=0.11 mm。"
    },
    "presets": [
      {
        "label": "窄孔径",
        "values": {
          "a": 0.5,
          "f": 200,
          "lambda": 550
        }
      },
      {
        "label": "宽孔径",
        "values": {
          "a": 2,
          "f": 200,
          "lambda": 550
        }
      }
    ],
    "sources": [
      {
        "title": "MIT OpenCourseWare · Optics 2.71 · Lecture notes",
        "url": "https://ocw.mit.edu/courses/2-71-optics-spring-2009/resources/lecture-notes/"
      }
    ]
  }
};
root.OpticsLessons=lessons;
if(typeof module!=="undefined"&&module.exports)module.exports=lessons;
})(typeof window!=="undefined"?window:globalThis);
