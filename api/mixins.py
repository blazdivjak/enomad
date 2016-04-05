# -*- coding: utf-8 -*-
__author__ = 'blaz'

from django.shortcuts import render
from rest_framework import authentication
from rest_framework import permissions
from rest_framework import viewsets
from rest_framework import filters

import logging
logger = logging.getLogger('api')

class DefaultsMixin(object):

    """
    Default settings for view authentication, permissions, filtering and pagination.
    """

    paginate_by = 1000
    paginate_by_param = 'page_size'
    max_paginate_by = 10000
    filter_backends = (
        filters.SearchFilter,
        filters.OrderingFilter,
    )

class LoggingMixin(object):

    """
    Class for request logging
    """

    def finalize_response(self, request, response, *args, **kwargs):

        logger.info("[{0}] method: {1} user: {2} data: {3}".format(self.__class__.__name__, request.method, request.user, request.data))
        return super(LoggingMixin, self).finalize_response(request, response, *args, **kwargs)