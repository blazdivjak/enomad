"""enomad URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.conf.urls import include
from django.contrib import admin
from api.urls import router
from rest_framework.authtoken.views import obtain_auth_token
from web.views.website import frontpage
from web.views.authentication import login_user
from web.views.authentication import logout_user
from web.views.authentication import register_user

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/v1/token/', obtain_auth_token, name='api-token'),
    url(r'^api/v1/', include(router.urls)),
    url(r'^$', frontpage, name='frontpage'),
    url(r'^registracija$', register_user, name='register'),
    url(r'^prijava$', login_user, name='login'),
    url(r'^odjava$', logout_user, name='logout'),
]
