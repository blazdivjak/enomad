__author__ = 'blaz'

from webpage.views.login import saml2_get_attributes
from webpage.views.login import ArnesAAILoginException
from webpage.views.login import django_user_logout
from django.shortcuts import render_to_response, redirect
from django.conf import settings
from api.authentication_backend import AuthBackend
from api.authentication_backend import AuthenticationException


import logging
logger = logging.getLogger('webpage')

def check_if_user_is_authenticated(view_func):

    """
    Check if user is authenticated
    """

    def _decorated(request, *args, **kwargs):

        if not request.user.is_authenticated():
            return redirect('frontpage')

        return view_func(request,*args, **kwargs)

    return _decorated

def check_user_is_staff(view_func):

    """
    Check if user is administrator
    """

    def _decorated(request, *args, **kwargs):

        try:

            if not request.user.is_staff:
                raise Exception("User: %s is not administrator and is not entitled to access this content." % request.user.username)

        except Exception as detail:
            logger.error(detail)
            return redirect ('frontpage')

        return view_func(request,*args, **kwargs)

    return _decorated