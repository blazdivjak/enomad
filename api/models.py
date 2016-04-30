# -*- coding: utf-8 -*-
from __future__ import unicode_literals

__author__ = 'blaz'

from django.contrib.auth.models import User
from django.core import serializers
from django.core.exceptions import ValidationError
import json
from django.db import models
import qrcode
import StringIO
import base64
from lib.utils import read_image_to_base64
from django.core.files.uploadedfile import InMemoryUploadedFile

"""
#TODO: users
mysql> describe users;
+--------------+-------------+------+-----+---------+-------+
| Field        | Type        | Null | Key | Default | Extra |
+--------------+-------------+------+-----+---------+-------+
| username     | varchar(20) | NO   | PRI |         |       |
| password     | varchar(20) | YES  |     | NULL    |       |
| name         | varchar(50) | YES  |     | NULL    |       |
| surname      | varchar(50) | YES  |     | NULL    |       |
| sex          | varchar(1)  | YES  |     | NULL    |       |
| email        | varchar(30) | YES  |     | NULL    |       |
| place        | varchar(30) | YES  |     | NULL    |       |
| type_of_user | int(5)      | NO   |     | NULL    |       |
| status       | int(2)      | NO   |     | NULL    |       |
| token        | int(20)     | YES  |     | NULL    |       |
+--------------+-------------+------+-----+---------+-------+

TODO: Point
mysql> describe point;
+------------------+---------------+------+-----+---------+----------------+
| Field            | Type          | Null | Key | Default | Extra          |
+------------------+---------------+------+-----+---------+----------------+
| ID_point         | int(11)       | NO   | PRI | NULL    | auto_increment |
| namePoint        | varchar(50)   | NO   |     | NULL    |                |
| descriptionPoint | varchar(1000) | NO   |     | NULL    |                |
| poet             | varchar(255)  | YES  |     | NULL    |                |
| poetAddress      | varchar(255)  | YES  |     | NULL    |                |
| path             | varchar(255)  | YES  |     | NULL    |                |
+------------------+---------------+------+-----+---------+----------------+

#TODO: wordpoint
mysql> describe wordpoint;
+--------------+-------------+------+-----+---------+----------------+
| Field        | Type        | Null | Key | Default | Extra          |
+--------------+-------------+------+-----+---------+----------------+
| ID_WordPoint | int(11)     | NO   | PRI | NULL    | auto_increment |
| REF_ID_Point | int(11)     | YES  | MUL | NULL    |                |
| word         | varchar(20) | YES  |     | NULL    |                |
| frequency    | int(11)     | YES  |     | NULL    |                |
| lastDate     | datetime    | YES  |     | NULL    |                |
+--------------+-------------+------+-----+---------+----------------+
"""

class Point(models.Model):

    """
    Model for point
    """

    name = models.CharField(max_length=255, unique=True)
    description = models.CharField(max_length=255, unique=True)
    poet = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    image = models.TextField(blank=True, null=True)
    qrcode = models.TextField(blank=True, null=True) #ex-path
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "%s: %s" %(self.id, self.name)

    def __unicode__(self):
        return "%s: %s" % (self.id, self.name)

    def to_dict(self):
        return json.loads(serializers.serialize('json',[self,]))[0]['fields']

    class Meta:
        app_label="api"

    def to_kml(self):

        #TODO: Implement this to export location for display on GoogleMaps

        raise NotImplementedError

    def generate_qrcode(self):

        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=6,
            border=0,
        )
        qr.add_data("%s#%s" % (self.description, str(self.id).zfill(6)))
        qr.make(fit=True)

        img = qr.make_image()
        buffer = StringIO.StringIO()

        buffer = StringIO.StringIO()
        img.save(buffer, format="PNG")
        img_str = base64.b64encode(buffer.getvalue())
        self.qrcode="data:image/png;base64,%s" % (img_str)
        #img.save(buffer)
        #print read_image_to_base64(img)


        #filename = 'events-%s.png' % (self.id)
        #filebuffer = InMemoryUploadedFile(
        #    buffer, None, filename, 'image/png', buffer.len, None)

        #print read_image_to_base64(filebuffer)

        #self.qrcode.save(filename, filebuffer)


    def clean(self):
        self.generate_qrcode()


    def save(self, *args, **kwargs):
        self.full_clean()
        super(Point, self).save(*args, **kwargs)

class Word(models.Model):

    """
    Model for selected words
    """

    point = models.ForeignKey(Point)
    word = models.CharField(max_length=255)
    frequency = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "%s: %s %s - %s" % (self.id, self.point.name, self.word, self.frequency)

    def __unicode__(self):
        return "%s: %s %s - %s" % (self.id, self.point.name, self.word, self.frequency)


    def to_dict(self):
        return json.loads(serializers.serialize('json', [self, ]))[0]['fields']

    class Meta:
        app_label = "api"
        unique_together = ('point', 'word')