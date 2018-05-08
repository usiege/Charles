#!usr/bin/python
#-*-encoding:utf-8-*-

#url模式
from django.conf.urls import url 
from django.http import HttpResponse

def index(request):
	return HttpResponse('Hello World!')

urlpatterns = (
	url(r'^$',index),
	)

#设置
import os
from django.conf import settings

DEBUG = os.environ.get('DEBUG', 'on') == 'on'
SECRET_KEY = os.environ.get('SECRET_KEY', '{ {secret_key} }')
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
	)

#WSGI
# pip3 install gunicorn==19.3.0
# gunicorn hello --log-file=-
from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()

#运行实例
import sys
from django.core.management import execute_from_command_line


if __name__ == '__main__':
	execute_from_command_line(sys.argv)




