# -*- coding: utf-8 -*-
__author__ = 'blaz'

from django.shortcuts import render_to_response
from django.template import RequestContext
from django.shortcuts import redirect
from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.contrib.auth import logout
from django.contrib import messages
from web.forms.points import PointForm
from api.models import Point
from django.contrib.auth.models import User
import base64

import logging
logger = logging.getLogger('webpage')

def edit_point(request,point_id=None):

    try:

        if request.method == "GET":

            form = PointForm()

            if point_id!=None:
                point = Point.objects.get(id=point_id)

                form.fields['name'].initial=point.name
                form.fields['poet'].initial=point.poet
                form.fields['description'].initial=point.description
                form.fields['address'].initial=point.address
                form.fields['image'].initial = point.image

        elif request.method == "POST":

            form = PointForm(request.POST, request.FILES)

            if point_id != None:
                point = Point.objects.get(id=point_id)
            else:
                point = Point()

            if form.is_valid():

                form_data = form.cleaned_data

                if form['image'] != None:
                    logo = base64.b64encode(form_data['image'].read())
                    point.image = "data:image/png;base64,%s" % (logo)

                point.name = form_data['name']
                point.poet = form_data['poet']
                point.description = form_data['description']
                point.address = form_data['address']
                point.save()

                gui_msg = "Lokacija %s za avtorja %s je bila uspesno shranjena." %(point.address, point.poet)
                messages.success(request, gui_msg)
                return redirect('edit_point', point_id=point.id)

            else:
                forms = [form]
                gui_msg="Nekatera polja niso pravilno izpolnjena."
                request.session['form']=form.data
                messages.error(request, gui_msg, extra_tags="form_error")

    except Exception as detail:
        logger.error("Exception with registration. Details: %s" % detail)

    return render_to_response("point.html", locals(), context_instance=RequestContext(request))