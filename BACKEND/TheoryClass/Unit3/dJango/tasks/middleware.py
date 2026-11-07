import logging
import time

logger = logging.getLogger("tasks.middleware")


class RequestTimingMiddleware:
    """Logs every HTTP request and attaches X-Process-Time-Ms to the response."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start = time.perf_counter()
        response = self.get_response(request)
        duration_ms = (time.perf_counter() - start) * 1000

        response["X-Process-Time-Ms"] = f"{duration_ms:.2f}"
        print(f"[Middleware] {request.method} {request.path} -> {response.status_code} ({duration_ms:.2f} ms)")
        return response
