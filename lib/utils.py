# -*- coding: utf-8 -*-
__author__ = 'blaz'

import base64

def read_image_to_base64(img):
    #with open(image_path,'rb') as img:
    image = base64.b64encode(img.read())
    return image