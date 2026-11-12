# todo_project/urls.py
# Project-level URL configuration (the "root" URL router of the website).

from django.contrib import admin
from django.urls import path, include  # include() lets us attach an app's urls.py

urlpatterns = [
    path('admin/', admin.site.urls),   # Django admin panel at /admin/
    path('', include('todo.urls')),    # All URLs from todo/urls.py start at the site root
]

# NOTE: static CSS/JS files do NOT need a manual URL here.
# Because 'django.contrib.staticfiles' is in INSTALLED_APPS and DEBUG = True,
# Django's development server automatically serves files from STATICFILES_DIRS.
