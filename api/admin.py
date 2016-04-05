from django.contrib import admin
from api.models import Point
from api.models import Word
# Register your models here.

class PointAdmin(admin.ModelAdmin):
    search_fields = ['name', 'id', 'description']
    list_filter = ['poet']

class WordAdmin(admin.ModelAdmin):
    search_fields = ['point__name', 'point__id', 'id']
    list_filter = ['point__poet']

admin.site.register(Point, PointAdmin)
admin.site.register(Word, WordAdmin)
