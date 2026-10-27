from django.test import TestCase
from django.urls import reverse
from .models import Task


class TaskModelAndViewsTest(TestCase):
    def setUp(self):
        self.task = Task.objects.create(title="Sample Task", completed=False)

    def test_task_str_representation(self):
        self.assertEqual(str(self.task), "Sample Task")

    def test_task_list_view(self):
        response = self.client.get(reverse('task_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Sample Task")
        self.assertTemplateUsed(response, 'todo/task_list.html')
        self.assertTemplateUsed(response, 'todo/base.html')
        self.assertTemplateUsed(response, 'todo/header.html')
        self.assertTemplateUsed(response, 'todo/footer.html')

    def test_add_task_get(self):
        response = self.client.get(reverse('add_task'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'todo/add_task.html')

    def test_add_task_post(self):
        response = self.client.post(reverse('add_task'), {'title': 'New Test Task'})
        self.assertRedirects(response, reverse('task_list'))
        self.assertTrue(Task.objects.filter(title='New Test Task').exists())

    def test_toggle_task_post(self):
        # Toggling incomplete task should mark it complete
        response = self.client.post(reverse('toggle_task', args=[self.task.id]))
        self.assertRedirects(response, reverse('task_list'))
        self.task.refresh_from_db()
        self.assertTrue(self.task.completed)

        # Toggling again should mark it incomplete
        self.client.post(reverse('toggle_task', args=[self.task.id]))
        self.task.refresh_from_db()
        self.assertFalse(self.task.completed)

    def test_toggle_task_get_rejected(self):
        # Security: GET request should be rejected with 405 Method Not Allowed
        response = self.client.get(reverse('toggle_task', args=[self.task.id]))
        self.assertEqual(response.status_code, 405)

    def test_delete_task_post(self):
        response = self.client.post(reverse('delete_task', args=[self.task.id]))
        self.assertRedirects(response, reverse('task_list'))
        self.assertFalse(Task.objects.filter(id=self.task.id).exists())

    def test_delete_task_get_rejected(self):
        # Security: GET request should be rejected with 405 Method Not Allowed
        response = self.client.get(reverse('delete_task', args=[self.task.id]))
        self.assertEqual(response.status_code, 405)
