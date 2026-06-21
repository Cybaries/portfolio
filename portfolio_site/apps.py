"""
Custom AppConfig classes for Django contrib apps when running on MongoDB.

MongoDB documents use ObjectId as their primary key. Django's contrib apps
(admin, auth, contenttypes) default to BigAutoField, so when running on
MongoDB they need their own AppConfig pointing at ObjectIdAutoField instead.

These are only used when MONGO_URI is set (see settings.py INSTALLED_APPS).
"""
from django.contrib.admin.apps import AdminConfig
from django.contrib.auth.apps import AuthConfig
from django.contrib.contenttypes.apps import ContentTypesConfig


class MongoAdminConfig(AdminConfig):
    default_auto_field = "django_mongodb_backend.fields.ObjectIdAutoField"


class MongoAuthConfig(AuthConfig):
    default_auto_field = "django_mongodb_backend.fields.ObjectIdAutoField"


class MongoContentTypesConfig(ContentTypesConfig):
    default_auto_field = "django_mongodb_backend.fields.ObjectIdAutoField"
