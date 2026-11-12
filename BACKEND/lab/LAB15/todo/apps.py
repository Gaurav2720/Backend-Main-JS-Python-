from django.apps import AppConfig


class TodoConfig(AppConfig):
    # Use an integer primary key type for model IDs by default
    default_auto_field = 'django.db.models.BigAutoField'
    # The Python package name of this app
    name = 'todo'
    # Human-readable label used in places such as the admin site
    verbose_name = 'To-Do Tasks'
