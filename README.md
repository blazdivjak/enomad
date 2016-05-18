E-Nomad project for Interactivity and information vizualization
==========

Docs
====
**Dependencies**
```bash
httpd-devel
mysql
mysql-devel
htop
mod_wsgi
libjpeg-turbo-devel
mod_ssl
npm
bower
```

**Create a virtual environment based on latest python (2.7.11)**
```bash
pip install virtualenv
mkdir /opt/virtual_environments/
cd /opt/virtual_environments/
virtualenv -p /usr/bin/python2.7 enomad 
```

**Install and configure Apache**
```bash
mkdir /opt/django
cd /opt/django/
git clone https://github.com/blazdivjak/enomad.git
mkdir -r /opt/static/enomad
ln -s /opt/django/enomad/enomad/vhost/black2.fri.uni-lj.si.conf black2.fri.uni-lj.si.conf
mkdir /var/log/enomad/
touch /var/log/enomad/api.log
chown -R apache:apache /var/log/enomad/
```

**Install and configure Apache**
Get SSL certificate.

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
**Move to project folder**
```bash
cd /opt/django/enomad
```

**Start the service**
```bash
service httpd restart
```
