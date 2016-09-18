from scipy.misc import imread, imresize
from keras.models import load_model

import sys
import numpy as np


def sigmoid(x, k = 1):
    return 1.0/(1.0 + np.exp(-k*x))

def contr2(im, vmin, vmax, k = 1):
    im1 = ((im - (vmin + vmax)/2.0))
    return sigmoid(im1, k)*255

model = load_model('big_model.h5')
Xi = imread(sys.argv[1])
Xi = imresize(Xi[:,15:-15], (80,64))
Xi = contr2(Xi, 40, 160, 0.005)
Xi = Xi.reshape(1, 1, 80, 64) / 255

for val in model.predict(Xi)[0]:
    print val
