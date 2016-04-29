from django.shortcuts import render
from django.shortcuts import render_to_response
from django.template import RequestContext
from api.models import Point
from api.models import Word
# Create your views here.

def frontpage(request):

    #Get all locations from database
    points = Point.objects.all()

    return render_to_response("index.html", locals(), context_instance=RequestContext(request))

#TODO: Display GoogleMaps with points