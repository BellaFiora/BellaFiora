import os, io
from PIL import Image

def resize_image(input_img_path, output_img_path, new_width, new_height):
	image = Image.open(input_img_path)
	resized_image = image.resize((new_width, new_height))
	resized_image.save(output_img_path)

def get_png_size(image_bytes):
	image_stream = io.BytesIO(image_bytes)
	image = Image.open(image_stream)
	width, height = image.size
	return width, height
