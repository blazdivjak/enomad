# -*- coding: utf-8 -*-
__author__ = 'blaz'

from django.shortcuts import render
from rest_framework import authentication
from rest_framework import permissions
from rest_framework import viewsets
from rest_framework import filters
from forms import PointFilter
from forms import WordFilter
from serializers import PointSerializer
from serializers import WordSerializer
from api.models import Point
from api.models import Word
from mixins import LoggingMixin
from mixins import DefaultsMixin
from rest_framework.decorators import permission_classes

# Create your views here.
@permission_classes((permissions.DjangoModelPermissionsOrAnonReadOnly, ))
class PointViewSet(DefaultsMixin, LoggingMixin, viewsets.ModelViewSet):

    queryset = Point.objects.filter()
    serializer_class = PointSerializer
    filter_class = PointSerializer
    ordering_fields = ('updated_at', 'created_at')

@permission_classes((permissions.AllowAny, ))
class WordViewSet(DefaultsMixin, LoggingMixin, viewsets.ModelViewSet):
    queryset = Word.objects.filter()
    serializer_class = WordSerializer
    filter_class = WordSerializer
    ordering_fields = ('updated_at', 'created_at')


