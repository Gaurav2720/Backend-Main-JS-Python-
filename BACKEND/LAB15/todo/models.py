# todo/models.py
# A "model" is a Python class that represents one table in the database.
# Django reads this class and creates the table for us (via migrations).

from django.db import models


class Task(models.Model):
    """One row = one to-do task."""

    title = models.CharField(max_length=200)       # Short text, max 200 characters
    completed = models.BooleanField(default=False)  # True = done, False = pending
    created_at = models.DateTimeField(auto_now_add=True)  # Filled automatically when the row is first saved

    def __str__(self):
        # Human-readable name shown in the admin panel and shell
        return self.title
