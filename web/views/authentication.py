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
from web.forms.authentication import LoginForm
from web.forms.authentication import RegistrationForm
from django.contrib.auth.models import User
# Create your views here.

import logging
logger = logging.getLogger('webpage')

def register_user(request):

    try:

        if request.user.is_authenticated():
            return redirect('frontpage')

        if request.method == "GET":

            form = RegistrationForm()

        elif request.method == "POST":

            form = RegistrationForm(request.POST)

            if form.is_valid():
                user = form.cleaned_data

                if user['password'] == user['repeat_password']:
                    u = User(username=user['username'],
                             first_name=user['first_name'],
                             last_name=user['last_name'])
                    u.set_password(user['password'])
                    u.save()
                    gui_msg = "Registracija uporabnika %s je bila uspesna. Sedaj se lahko prijavite." % (u.username)
                    messages.success(request, gui_msg)
                    return redirect('frontpage')
                else:
                    forms = [form]
                    logger.debug("Passwords dont match")
                    gui_msg = "Gesli se ne ujemata"
                    log_msg = "Passwords don't match"
                    messages.error(request, gui_msg, extra_tags="form_error")
                    logging.error(log_msg)

            else:
                forms = [form]
                gui_msg = "Napačno uporabniško ime ali geslo"
                log_msg = "Invalid username or password"
                messages.error(request, gui_msg, extra_tags="form_error")
                logger.error(log_msg)

    except Exception as detail:
        logger.error("Exception with registration. Details: %s" % detail)

    return render_to_response("register.html", locals(), context_instance=RequestContext(request))

def login_user(request):

        """
        Login using django local users
        """

        try:

            if request.user.is_authenticated():
                return redirect('frontpage')

            if request.method == "GET":

                form = LoginForm()

                forms = [form]

            elif request.method == "POST":
                form = LoginForm(request.POST)

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
                    log_msg = "Invalid username or password"
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