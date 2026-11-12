# todo/middleware.py
"""
Simple, syllabus-compliant Django Middleware.
Demonstrates the standard Django request/response cycle hooks.
"""


class RequestLoggingMiddleware:
    """
    A standard callable middleware that intercepts each HTTP request
    and response, printing the request info to the console and attaching
    a confirmation header to the response.
    """

    def __init__(self, get_response):
        # One-time configuration and initialization when Django starts
        self.get_response = get_response

    def __call__(self, request):
        # 1. Logic executed BEFORE the view is called:
        # Log the HTTP method and requested path
        print(f"[Middleware] Incoming: {request.method} {request.path}")

        # 2. Hand off request to the next middleware or view
        response = self.get_response(request)

        # 3. Logic executed AFTER the view is called:
        # Attach a custom response header for verification
        response['X-Middleware-Applied'] = 'RequestLoggingMiddleware'

        return response
