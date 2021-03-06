"""
Django settings for enomad project.

Generated by 'django-admin startproject' using Django 1.9.5.

For more information on this file, see
https://docs.djangoproject.com/en/1.9/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.9/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.9/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'g$fe!@ab_0tyk!ai30mp27^(hqh%av^0&ot!w9-+yj)z85)owt'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'api',
    'web'
]

MIDDLEWARE_CLASSES = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

TEMPLATE_CONTEXT_PROCESSORS = (

    'django.core.context_processors.media',
    'django.core.context_processors.static',
    #'django.contrib.auth.context_processors.auth',
    'django.contrib.messages.context_processors.messages',
)

ROOT_URLCONF = 'enomad.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')]
        ,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'enomad.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.9/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/1.9/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/1.9/topics/i18n/

LANGUAGE_CODE = 'sl-si'

TIME_ZONE = 'Europe/Ljubljana'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.9/howto/static-files/

STATIC_ROOT = '/opt/django/static/enomad/'
STATIC_URL = '/static/'
STATICFILES_DIRS = (
    'static/',
    'bower_components/',
)

#######################################################
#Django REST framework configuration
#######################################################

REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    ],
}

#######################################################
#Django REST framework configuration
#######################################################

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(funcName)s %(process)d %(thread)d %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'filters': {
         'require_debug_false': {
             '()': 'django.utils.log.RequireDebugFalse',
         }
    },
    'handlers': {
        'logfile' : {
            'class': 'logging.handlers.WatchedFileHandler',
            'filename': '/var/log/enomad/django.log',
             'formatter': 'verbose',
        },
        'sqlfile': {
            'class': 'logging.handlers.WatchedFileHandler',
            'filename': '/var/log/enomad/sql.log',
            'formatter': 'simple',
        },
        'webpage': {
            'class': 'logging.handlers.WatchedFileHandler',
            'filename': '/var/log/enomad/webpage.log',
            'formatter': 'verbose',
        },
        'api' : {
            'class': 'logging.handlers.WatchedFileHandler',
            'filename': '/var/log/enomad/api.log',
             'formatter': 'verbose',
        },
        'apache_log': {
            'class': 'logging.StreamHandler',
            'level': 'ERROR',
            'formatter': 'verbose',
        },
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler',
            'include_html': True,
        }
    },
    'loggers': {
        'django': {
            'handlers': ['logfile', 'apache_log'],
            'propagate': False,
            'level': 'INFO',
        },
        'django.db': {
            'handlers': ['sqlfile'],
            'propagate': False,
                'level': 'INFO',
        },
        'webpage': {
            'handlers': ['webpage'],
            'propagate': False,
                'level': 'DEBUG',
        },
        'api': {
            'handlers': ['api'],
            'propagate': False,
                'level': 'DEBUG',
        },
        'django.request': {
            'handlers': ['webpage', 'mail_admins'],
            'level': 'ERROR',
            'propagate': False,
        },
    }
}