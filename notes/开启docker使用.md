# 开启docker使用

标签（空格分隔）： 开发日常

---

[TOC]

## 解决环境配置难题

docker mac客户端，直接使用dmg安装，这里需要先注册帐号，[Docker Desktop for Mac](https://hub.docker.com/editions/community/docker-ce-desktop-mac)；

ubuntu上可以使用snap安装：
```
$ sudo snap install docker
```
或：
```
$ sudo apt install docker.io
```

安装完成，验证是否成功：
```
$ docker version
```
![image_1dba384lvhsu3vr14sdfr97dm9.png-125.5kB][1]

如需要在非root用户下直接运行，则需要：
```
$ sudo usermod -aG docker username
```

启动docker后台服务：
```
$ sudo service docker start
```
运行docker(若有)
```
$ sudo docker run hello-world
```

## 国内网络问题

鉴于国内网络问题，添加网易镜像地址（mac下）；

![image_1dbc64gn71olj1bokdr4l92di61j.png-60.2kB][2]

Linux下，使用如下：
对于使用 systemd 的系统（Ubuntu 16.04+、Debian 8+、CentOS 7）， 在配置文件 /etc/docker/daemon.json 中加入：

```
{
  "registry-mirrors": ["https://docker.mirrors.ustc.edu.cn/"]
}
```
重新启动 docker：

```sh
$ sudo systemctl restart docker
```

另： DaoCloud 加速器（收费）
DaoCloud是国内第一家Dock Hub加速器提供商 
网址： 
[https://dashboard.daocloud.io/mirror](https://dashboard.daocloud.io/mirror)

注册后进入：
[https://www.daocloud.io/mirror#accelerator-doc](https://www.daocloud.io/mirror#accelerator-doc)


## 使用docker

在本地电脑终端使用下面的命令拉取库，这个操作有点像git的pull:
```
docker pull usiege/hello-world
```
报错解决：
![image_1dbc202711qsmkmpc0e146f1o1am.png-20.1kB][3]

通过dig @114.114.114.114 registry-1.docker.io找到可用IP：
```
dig @114.114.114.114 registry-1.docker.io 
```

修改/etc/hosts强制docker.io相关的域名解析到其它可用IP：
```
yourip registry-1.docker.io
```

### 下面开始使用

查看docker信息：
```
docker info
```

完成拉取后在本地就会有镜像了，使用以下命令进行查看：
```
docker images
```

## 后续



[1]: http://static.zybuluo.com/usiege/eryfxa34xzddyomcsk6bfm9g/image_1dba384lvhsu3vr14sdfr97dm9.png
[2]: http://static.zybuluo.com/usiege/rwcb7824fh8uyqp24ecpru7n/image_1dbc64gn71olj1bokdr4l92di61j.png
[3]: http://static.zybuluo.com/usiege/i7914ylbh37scx0coduhxxxp/image_1dbc202711qsmkmpc0e146f1o1am.png