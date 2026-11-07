import json
from django.core.cache import cache
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Task

TASKS_CACHE_KEY = "all_tasks_list"
CACHE_TTL_SECONDS = 30


def home(request):
    return JsonResponse(
        {
            "service": "Unit 3 Django Task Manager",
            "endpoints": {
                "list_or_create": "/api/tasks/",
                "update_or_delete": "/api/tasks/<id>/",
                "admin": "/admin/",
            },
        }
    )


# csrf_exempt is used here only for simple CLI/Postman JSON API testing in coursework.
@csrf_exempt
@require_http_methods(["GET", "POST"])
def task_list(request):
    if request.method == "GET":
        cached_tasks = cache.get(TASKS_CACHE_KEY)
        if cached_tasks is not None:
            return JsonResponse({"source": "cache", "tasks": cached_tasks})

        tasks_data = [t.to_dict() for t in Task.objects.all()]
        cache.set(TASKS_CACHE_KEY, tasks_data, timeout=CACHE_TTL_SECONDS)
        return JsonResponse({"source": "database", "tasks": tasks_data})

    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body"}, status=400)

    title = str(payload.get("title", "")).strip()
    if not title:
        return JsonResponse({"error": "title is required"}, status=400)

    task = Task.objects.create(
        title=title,
        description=str(payload.get("description", "")).strip(),
        completed=bool(payload.get("completed", False)),
    )
    cache.delete(TASKS_CACHE_KEY)
    return JsonResponse(task.to_dict(), status=201)


@csrf_exempt
@require_http_methods(["GET", "PATCH", "DELETE"])
def task_detail(request, task_id):
    try:
        task = Task.objects.get(pk=task_id)
    except Task.DoesNotExist:
        return JsonResponse({"error": "Task not found"}, status=404)

    if request.method == "GET":
        return JsonResponse(task.to_dict())

    if request.method == "DELETE":
        task.delete()
        cache.delete(TASKS_CACHE_KEY)
        return JsonResponse({"deleted": task_id})

    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body"}, status=400)

    if "title" in payload:
        new_title = str(payload["title"]).strip()
        if not new_title:
            return JsonResponse({"error": "title cannot be empty"}, status=400)
        task.title = new_title
    if "description" in payload:
        task.description = str(payload["description"]).strip()
    if "completed" in payload:
        task.completed = bool(payload["completed"])

    task.save()
    cache.delete(TASKS_CACHE_KEY)
    return JsonResponse(task.to_dict())
