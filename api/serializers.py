# -*- coding: utf-8 -*-
__author__ = 'blaz'

from rest_framework import serializers
from api.models import Point
from api.models import Word
from forms import PointFilter
from forms import WordFilter

class PointSerializer(serializers.ModelSerializer):

    class Meta:
        model = Point
        #fields = ('id', 'name', 'org_id', 'url', )
        read_only_fields = ('created_at','updated_at')

class WordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        #fields = ('id', 'name', 'org_id', 'url', )
        read_only_fields = ('created_at', 'updated_at')