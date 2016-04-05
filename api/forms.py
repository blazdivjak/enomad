# -*- coding: utf-8 -*-
__author__ = 'blaz'

import django_filters

from api.models import Point
from api.models import Word

class PointFilter(django_filters.FilterSet):

    class Meta:
        model = Point
        fields = ('id', 'name', 'description', 'poet')

class WordFilter(django_filters.FilterSet):

    class Meta:
        model = Word
        fields = ('id', 'word', 'point__description', 'point__id')