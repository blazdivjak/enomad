E-Nomad project for Interactivity and information vizualization

**Create a virtual environment based on latest python (2.7.11)**
pip install virtualenv
mkdir /opt/virtual_environments/
cd /opt/virtual_environments/
virtualenv -p /usr/bin/python2.7 enomad 

**Move to project folder**
cd /opt/django/enomad

**Activate virtual environment**
source /opt/virtual_environments/enomad/bin/activate

**Install js dependencies with bower**
bower install

**Install python dependencies**
pip install -r requirements.txt


