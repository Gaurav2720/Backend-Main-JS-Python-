# todo/views.py
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_POST
from .models import Task


def task_list(request):
    """Read tasks from newest to oldest and pass them to the template."""
    tasks = Task.objects.all().order_by('-created_at')
    return render(request, 'todo/task_list.html', {'tasks': tasks})


def add_task(request):
    """Only create a task when the form is submitted with POST."""
    if request.method == 'POST':
        title = request.POST.get('title', '').strip()
        # Ignore empty or whitespace-only titles
        if title:
            Task.objects.create(title=title)
        # Redirect after processing the form to avoid accidental resubmission
        return redirect('task_list')
    # GET requests display the blank form
    return render(request, 'todo/add_task.html')


@require_POST
def toggle_task(request, task_id):
    """Safely toggle task completed state via POST."""
    task = get_object_or_404(Task, pk=task_id)
    task.completed = not task.completed
    task.save(update_fields=['completed'])
    return redirect('task_list')


@require_POST
def delete_task(request, task_id):
    """Safely delete a task via POST."""
    task = get_object_or_404(Task, pk=task_id)
    task.delete()
    return redirect('task_list')
