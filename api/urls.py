__author__ = 'blaz'

from rest_framework.routers import DefaultRouter
from api.views import PointViewSet
from api.views import WordViewSet

#ArnesAAI website new API for v2.0
router = DefaultRouter()
router.register(r'points', PointViewSet)
router.register(r'words', WordViewSet)