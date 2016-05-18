E-Nomad project for Interactivity and information vizualization
==========

Docs
==========
**Create a virtual environment based on latest python (2.7.11)**
```bash
pip install virtualenv
mkdir /opt/virtual_environments/
cd /opt/virtual_environments/
virtualenv -p /usr/bin/python2.7 enomad 
```
**Move to project folder**
```bash
cd /opt/django/enomad
```
**Activate virtual environment**
```bash
source /opt/virtual_environments/enomad/bin/activate
```
**Install js dependencies with bower**
```bash
bower install
```
**Install python dependencies**
```bash
pip install -r requirements.txt
```
**Create database and initialize data from fixtures**
```bash
python manage.py migrate
python manage.py loaddata initial_users
python manage.py loaddata initial_points
python manage.py loaddata initial_words
```

Deployment on CentOS Apache
===========================
**Dependencies **
```bash
httpd-devel
mysql
mysql-devel
htop
mod_wsgi
libjpeg-turbo-devel
mod_ssl
```


**Configure **
```bash
ln -s /opt/django/enomad/enomad/vhost/black2.fri.uni-lj.si.conf black2.fri.uni-lj.si.conf
```

