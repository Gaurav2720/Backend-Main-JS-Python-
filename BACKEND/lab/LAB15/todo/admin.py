# todo/admin.py
from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    # Show these fields as columns on the task listing page
    list_display = ('title', 'completed', 'created_at')
    # Add a sidebar filter for the completion state
    list_filter = ('completed',)
    # Allow staff to search task titles
    search_fields = ('title',)
    # Make the completion field editable directly in the list
    list_editable = ('completed',)
