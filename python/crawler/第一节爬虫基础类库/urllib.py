from urllib import request

if __name__ == "__main__":
	req = request.Request("http://baidu.com")
	response = request.urlopen(req)
	html = response.read()
	html = html.decode("utf-8")
	print(html)


#cookie
#CookieJar()


import ssl
#忽略ssl安全认证
context = ssl._create_unverified_context()


## 1. 基本使用
from urllib import request

response = request.urlopen(r'http://python.org/')
# http.client.HTTPResponse 类型
page = response.read()
page = page.decode('utf-8')

# HTTPMessage 对象，远程服务器返回头信息
response.info() 

# 返回Http状态码
response.getcode()

# 返回请求的url
response.geturl()

## 2. Request
url = r'http://www.lagou.com/zhaopin/Python/?labelWords=label'
headers = {
	'User-Agent': r'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) '
                  r'Chrome/45.0.2454.85 Safari/537.36 115Browser/6.0.3',
    'Referer': r'http://www.lagou.com/zhaopin/Python/?labelWords=label',
    'Connection': 'keep-alive'
}

req = request.Request(url, headers = headers)
page = request.openurl(req).read()
page = page.decode('utf-8')

## 3. Post数据
# urlopen() 的data参数默认为None， 当不为空时，urlopen提交方式为Post
from urllib import request, parse

data = {
	'first': 'true',
	'pn': '1',
	'kd': 'Python'
}

# urlencode主要作用就是将url附上要提交的数据
data = parse.urlencode(data).encode('utf-8')

req = request.Request(url, headers = headers, data = data)
page = request.urlopen(req).read()
page = page.decode('utf-8')

import error
try:
	page = request.urlopen(req, data = data).read()
	page = page.decode('utf-8')
except error.HTTPError as e:
	print(e.code())
	print(e.read().decode('utf-8'))

## 4. 设置代理
proxy = request.ProxyHandler({ 'http': '5.22.195.215:80' })
opener = request.build_opener(proxy)
request.install_opener(opener)


























