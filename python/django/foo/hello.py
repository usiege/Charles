#!usr/bin/python
#-*-encoding:utf-8-*-

#**************************************************************
#设置
import os
import sys
from django.conf import settings

DEBUG = os.environ.get('DEBUG', 'on') == 'on'
SECRET_KEY = os.environ.get('SECRET_KEY', 
	'%jv_4#hoaqwig2gu!eg#^ozptd*a@88u(aasv7z!7xt^5(*i&k')

BASE_DIR = os.path.dirname(__file__)

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS','localhost').split(',')

settings.configure(
	
	DEBUG = DEBUG,
	SECRET_KEY = SECRET_KEY,
	ALLOWED_HOSTS = ALLOWED_HOSTS,
	ROOT_URLCONF = __name__,
	MIDDLEWARE_CLASSES = (
		'django.middleware.common.CommonMiddleware',
		'django.middleware.csrf.CsrfViewMiddleware',
		'django.middleware.clickjacking.XFrameOptionsMiddleware',
	),
	INSTALLED_APPS = (
		'django.contrib.staticfiles', #这里少了一个逗号
	),
	TEMPLATES = (
		{
			'BACKEND':'django.template.backends.django.DjangoTemplates',
			'DIRS':(os.path.join(BASE_DIR, 'templates'),),
		},
	),
	STATICFILES_DIRS = (
		os.path.join(BASE_DIR, 'static'),
	),
	STATIC_URL = '/static/',
)

'''
placeholder/
	placeholder.py
	templates/
		home.html
	static/
		site.css
'''
#**************************************************************
#图片表单
from django import forms
from io import BytesIO
from PIL import Image, ImageDraw 	#Pillow 枕头
from django.core.cache import cache		#读取缓存要在设置之后

class ImageFrom(forms.Form):

	height = forms.IntegerField(min_value = 1, max_value = 2000)
	width = forms.IntegerField(min_value = 1, max_value = 2000)

	#创建图片，接收一个参数设置图片格式，默认PNG，以字节的形式返回	
	def generate(self, image_format='PNG'):
		"""generate an image of the given type and 
		return as raw bytes
		"""

		height = self.cleaned_data['height']
		width = self.cleaned_data['width']
		#通过参数生成一个缓存键值
		key = '{}.{}.{}'.format(width, height, image_format)
		content = cache.get(key)

		if content is None:
			#生成图片，在图片中加入文字
			image = Image.new('RGB', (width,height))
			draw = ImageDraw.Draw(image)
			text = '{} X {}'.format(width, height)
			textwidth, textheight = draw.textsize(text)
			if textwidth < width and textheight < height:
				texttop = (height - textheight) // 2 #" / "就表示 浮点数除法，返回浮点结果;" // "表示整数除法
				textleft = (width - textwidth) // 2
				draw.text((textleft, texttop), text, fill = (255,255,255))

			content = BytesIO()
			image.save(content, image_format)
			content.seek(0)
			
			#第三个参数是保存时间，3600秒
			cache.set(key, content, 60*60)
		return content

#**************************************************************
#url模式
from django.conf.urls import url 
from django.http import HttpResponse
from django.http import HttpResponseBadRequest

import hashlib
from django.views.decorators.http import etag
from django.shortcuts import render
from django.core.urlresolvers import reverse

def generate_etag(request, width, height):
	content = 'Placeholder: {0} x {1}'.format(width, height)
	return hashlib.sha1(content.encode('utf-8')).hexdigest()

@etag(generate_etag)	#使用这个修饰符，服务器将在浏览器第一次请求时生成该图片 

def placeholder(request, width, height):
	#TODO: rest of the view will go here
	form = ImageFrom({'height':height, 'width':width})
	if form.is_valid():
		image = form.generate()
		# height = form.cleaned_data['height']
		# width = form.cleaned_data['width']
		# TODO
		return HttpResponse(image, content_type = 'image/png')
	else:
		return HttpResponseBadRequest('Invalid Image Request!')


def index(request):
	example = reverse('placeholder', kwargs = {'width':100, 'height':50})
	context = {
		'example': request.build_absolute_uri(example)
	}
	# return HttpResponse('Hello World!')
	return render(request, 'home.html', context)

urlpatterns = (
	url(r'^image/(?P<width>[0-9]+)x(?P<height>[0-9]+)/$', placeholder, name = 'placeholder'),	#这里有错误
	url(r'^$',index, name = 'homepage'),
)


#**************************************************************
#WSGI
# pip3 install gunicorn==19.3.0
# gunicorn hello --log-file=-
from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()

#**************************************************************
#运行实例
import sys
from django.core.management import execute_from_command_line


if __name__ == '__main__':
	execute_from_command_line(sys.argv)




