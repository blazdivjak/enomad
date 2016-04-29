# -*- coding: utf-8 -*-
__author__ = 'blaz'

from django.shortcuts import render
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.shortcuts import redirect
from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.contrib.auth import logout
from django.contrib import messages
from web.forms.authentication import Login
from web.forms.authentication import Registration
from django.contrib.auth.models import User
# Create your views here.

import logging
logger = logging.getLogger('webpage')

def register_user(request):

    #TODO: create user

    try:

        if request.user.is_authenticated():
            return redirect('frontpage')

        if request.method == "GET":

            #TODO: Create form
            form = Registration()

            pass

        elif request.method == "POST":

            form = Registration(request.POST)

            if form.is_valid():
                user = form.cleaned_data

                logger.debug("Adding user maki")

                if user['password'] == user['repeat_password']:
                    logger.debug("Saving user maki")
                    u = User(username=user['username'],
                             first_name=user['first_name'],
                             last_name=user['last_name'])
                    u.set_password(user['password'])
                    u.save()
                    return redirect('frontpage')
                else:
                    logger.debug("Passwords dont match")
                    gui_msg = "Gesli se ne ujemata"
                    log_msg = "Passwords don't match"
                    messages.error(request, gui_msg)
                    logging.error(log_msg)

            else:
                gui_msg = "Napačno uporabniško ime ali geslo"
                log_msg = "Invalid username or password" % (request.user.username)
                messages.error(request, gui_msg)
                logger.error(log_msg)

    except Exception as detail:
        logger.error("Exception with registration. Details: %s" % detail)

    return render_to_response("register.html", locals(), context_instance=RequestContext(request))

#TODO: Login Error handling and displaying to user
def login_user(request):

        """
        Login using django local users
        """

        try:

            if request.user.is_authenticated():
                return redirect('frontpage')

            if request.method == "GET":

                form = Login()

                forms = [form]

            elif request.method == "POST":
                form = Login(request.POST)

                if form.is_valid():
                    user = form.cleaned_data

                    # Try authenticating user
                    user = authenticate(username=user['username'], password=user['password'])

                    if user is not None:
                        if user.is_active:
                            login(request, user)
                            return redirect('frontpage')
                else:
                    gui_msg = "Napačno uporabniško ime ali geslo"
                    log_msg = "Invalid username or password" % (request.user.username)
                    messages.error(request, gui_msg)
                    logging.error(log_msg)

        except Exception as detail:
            logging.error("Exception with authentication. Details: %s" % detail)

        return render_to_response("login.html", locals(), context_instance=RequestContext(request))

def logout_user(request):

    """
    Destroy django session
    """

    try:
        user = request.user
        #user.backend = 'django.contrib.auth.backends.ModelBackend'

        if user.is_authenticated():
            logout(request)

    except Exception as detail:
        logger.error("Error occurred deauthenticating user. Details: %s" % detail)

    return redirect('frontpage')