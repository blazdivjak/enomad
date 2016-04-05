from django.shortcuts import render
from django.shortcuts import render_to_response
from django.template import RequestContext
# Create your views here.

def frontpage(request):

    return render_to_response("index.html", locals(),context_instance=RequestContext(request))