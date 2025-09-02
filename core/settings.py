import os
import sys
import logging
import base64
from pathlib import Path

from django.core.exceptions import ImproperlyConfigured
from cryptography.fernet import Fernet, InvalidToken

# AUTH MODEL
AUTH_USER_MODEL = 'accounts.User'

# BASE PATHS
BASE_DIR = Path(__file__).resolve().parent.parent
DB_CONFIG_DIR = BASE_DIR / "configs"
KEY_PATH = DB_CONFIG_DIR / ".db_key"
ENV_PATH = DB_CONFIG_DIR / "db_config.env"

logger = logging.getLogger(__name__)

def load_db_config():
    if not KEY_PATH.exists():
        raise ImproperlyConfigured(f"Encryption key not found at {KEY_PATH}. Run `manage.py db_config`.")
    if not ENV_PATH.exists():
        raise ImproperlyConfigured(f"Encrypted DB config not found at {ENV_PATH}. Run `manage.py db_config`.")
    try:
        key = KEY_PATH.read_bytes()
        cipher = Fernet(key)
        token = ENV_PATH.read_bytes()
        plaintext = cipher.decrypt(token).decode().splitlines()
    except InvalidToken:
        raise ImproperlyConfigured("Failed to decrypt DB configuration. Key may be invalid.")
    except Exception as e:
        raise ImproperlyConfigured(f"Unexpected error loading DB config: {e}")
    try:
        cfg = dict(line.split("=", 1) for line in plaintext)
    except Exception as e:
        raise ImproperlyConfigured(f"Malformed DB config file: {e}")
    return cfg

# --- Load or fallback ---
try:
    db_cfg = load_db_config()
    engine_key = db_cfg['ENGINE'].lower()
    if engine_key in ('mssql', 'sqlserver'):
        engine_str = 'mssql'
    else:
        engine_str = f"django.db.backends.{engine_key}"

    DATABASES = {
        "default": {
            "ENGINE": engine_str,
            "NAME": db_cfg["NAME"],
            "USER": db_cfg["USER"],
            "PASSWORD": db_cfg["PASSWORD"],
            "HOST": db_cfg["HOST"],
            "PORT": db_cfg.get("PORT", ""),
            'OPTIONS': {
                'driver': db_cfg.get('DRIVER', 'ODBC Driver 17 for SQL Server'),
            }
        }
    }
    logger.info("Loaded database configuration from encrypted file.")
except ImproperlyConfigured as e:
    print(f"[DB CONFIG WARNING] {e}", file=sys.stderr)
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }
    logger.warning("Falling back to SQLite3 database.")

# SECRET KEY AND DEBUG
SECRET_KEY = 'django-insecure-d^u0#wctb%2o-44g8v%1=&066vi4$i*ii%da8bcp@2jp8h(z@@'
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# INSTALLED APPS
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework.authtoken',
    'rest_framework',
    # Custom
    'corsheaders',
    'accounts',
    'frontend',
    'chat',

    # WebSocket support
    'channels',
]

# Celery Configuration
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'

# Redis Configuration
REDIS_URL = 'redis://localhost:6379/1'

# Channels Configuration (using Redis)
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)],
        },
    },
}

# MIDDLEWARE
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'accounts.middleware.RBACPermissionMiddleware',
]

# CORS CONFIG
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
]
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = ['http://localhost:5173']




# ROOT URL
ROOT_URLCONF = 'core.urls'

# TEMPLATES
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'client')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI and ASGI
WSGI_APPLICATION = 'core.wsgi.application'
ASGI_APPLICATION = 'core.asgi.application'  # ✅ Needed for Channels/WebSocket

# PASSWORD VALIDATION
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# LANGUAGE AND TIMEZONE
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# STATIC FILES
STATIC_URL = '/assets/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'client/assets')]

# AUTO FIELD
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# AES SECRET KEY
AES_BASE64_KEY = 'OSVY99SFMghecXnyHZU72HYkqEAaM2dvgtvB7Mxt7QQ='
AES_SECRET_KEY = base64.b64decode(AES_BASE64_KEY)


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
}