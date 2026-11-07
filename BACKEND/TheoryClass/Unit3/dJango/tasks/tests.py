import json
from django.core.cache import cache
from django.test import TestCase


class TaskApiTests(TestCase):
    def setUp(self):
        cache.clear()

    def test_create_and_cache_tasks(self):
        res = self.client.post(
            "/api/tasks/",
            data=json.dumps({"title": "Learn Django Middleware"}),
            content_type="application/json",
        )
        self.assertEqual(res.status_code, 201)
        self.assertIn("X-Process-Time-Ms", res.headers)

        first_get = self.client.get("/api/tasks/")
        self.assertEqual(first_get.json()["source"], "database")
        self.assertEqual(len(first_get.json()["tasks"]), 1)

        second_get = self.client.get("/api/tasks/")
        self.assertEqual(second_get.json()["source"], "cache")

    def test_validation_and_not_found(self):
        bad_res = self.client.post(
            "/api/tasks/",
            data=json.dumps({"title": "   "}),
            content_type="application/json",
        )
        self.assertEqual(bad_res.status_code, 400)

        missing_res = self.client.get("/api/tasks/999/")
        self.assertEqual(missing_res.status_code, 404)
