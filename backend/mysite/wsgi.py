import os
import django
from django.core.management import call_command
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
django.setup()

# try:
#     call_command('makemigrations', interactive=False)
#     call_command('migrate', interactive=False)
# except Exception as e:
#     print(f"Migration error: {e}")

application = get_wsgi_application()


app = application
