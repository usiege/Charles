title: Python抓取One网页上的内容
date: 2016-05-06 16:46:00
categories: coder
tags: [python, request, beautifulsoup4]
-----------

Summary: 本文是从微信推送内容中摘取下来的，其中某些内容进行了小的改动，本文作者在Mac 10.11.4下运行正常，脚本会存取网页上的内容并保存到本地txt文件中，文件中内容以json格式保存。


# 1.python环境搭建

## 安装homebrew

`/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`

## 安装pip

首先安装easy_install

`curl https://bootstrap.pypa.io/ez_setup.py -o - | sudo python`

接着

`sudo easy_install pip`

## 安装virtualenv

`pip install virtualenv`

## 安装request和beautifulsoup4

`pip install requests beautifulsoup4`

# 2.网页分析

[请移步源网址，本文参考原文](https://mp.weixin.qq.com/s?__biz=MzA5ODUzOTA0OQ==&mid=2651688023&idx=1&sn=ce865e87c60777c52ff60c2381c1a353&scene=1&srcid=0505caJlTtmQucm6toGF6Qiw&key=b28b03434249256bfa726a59c0a981ca91726f8ece7ac2a4e4552ba24a316f23dd587233818175463c02bedea86bb34d&ascene=0&uin=MjA4NjU4OTk1&devicetype=iMac+MacBookPro12%2C1+OSX+OSX+10.11.4+build(15E65)&version=11020201&pass_ticket=EVsyFUgOaslYvrzF%2Bee4tQMk2jt%2F5PtB04iRB0X4XzE%3D)

# 3.python编码

```python
import argparse
import re
from multiprocessing import Pool

import requests
import bs4

import time
import json
import io

root_url = 'http://wufazhuce.com'

def get_url(num):
	return root_url+'/one/'+str(num)

def get_urls(num):
	urls = map(get_url,range(100,100+num))
	return urls

def get_data(url):
	dataList = {}
	response = requests.get(url)
	if response.status_code != 200:
		return {'noValue':'noValue'}
	soup = bs4.BeautifulSoup(response.text,'html.parser')
	print soup.title.string
	dataList['index'] = soup.title.string[4:7]
	for meta in soup.select('meta'):
		if meta.get('name') == 'description':
			dataList['content'] = meta.get('content')
		dataList['imgUrl'] = soup.find_all('img')[1]['src']
	return dataList


if __name__ == '__main__':
	pool = Pool(4)
	dataList = []
	urls = get_urls(10)

	start = time.time()
	dataList = pool.map(get_data,urls)
	end = time.time()

	print 'use:%.2f s'%(end-start)
	jsonData = json.dumps({'data':dataList})
	with open('data.txt','w') as outfile:
		json.dump(jsonData,outfile)
```


