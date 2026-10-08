# 使い方: python3 convert.py isnetis.onnx isnetis.f16w.onnx   （pip install onnx numpy）
# 重みを fp16 で保存し、読み込み時に fp32 へ戻す（Cast）形に変える。計算は fp32 のまま。
# 大きな重み（1024要素以上）だけを変換し、Resize の定数などの小さなものはそのまま残す。
import onnx, numpy as np
from onnx import numpy_helper, helper, TensorProto
import sys
src, dst = (sys.argv[1:3] + ['isnetis.onnx', 'isnetis.f16w.onnx'][len(sys.argv[1:3]):])[:2]
m = onnx.load(src); g = m.graph
keep, casts, n16 = [], [], 0
for t in g.initializer:
    a = numpy_helper.to_array(t)
    if a.dtype == np.float32 and a.size >= 1024:
        h = numpy_helper.from_array(a.astype(np.float16), t.name + '__f16'); keep.append(h)
        casts.append(helper.make_node('Cast', [t.name + '__f16'], [t.name], to=TensorProto.FLOAT, name=t.name + '__cast')); n16 += 1
    else: keep.append(t)
del g.initializer[:]; g.initializer.extend(keep)
nodes = list(g.node); del g.node[:]; g.node.extend(casts + nodes)
m.producer_name = 'samune-katagami (fp16-stored weights from skytnt/anime-seg isnetis.onnx)'
onnx.checker.check_model(m); onnx.save(m, dst)
import os; print('converted', n16, 'tensors;', os.path.getsize(src) // 1e6, 'MB ->', os.path.getsize(dst) // 1e6, 'MB')
