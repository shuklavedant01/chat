# accounts/models.py

import base64
from django.conf import settings
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from utils.custom_utils import encrypt_data, decrypt_data, encrypt_hash, decrypt_hash

class UserManager(BaseUserManager):
    def _create_user(self, plain_username, plain_email, password=None, **extra_fields):
        if not plain_username or not plain_email:
            raise ValueError("Username and email are required")
        # 1) Hash & encrypt for storage
        username_hash = encrypt_hash(plain_username)
        email_hash    = encrypt_hash(plain_email)
        username_enc  = encrypt_data(plain_username)
        email_enc     = encrypt_data(plain_email)

        user = self.model(
            username_hash=username_hash,
            email_hash=email_hash,
            username_encrypted=username_enc['data'],
            username_iv=username_enc['iv'],
            email_encrypted=email_enc['data'],
            email_iv=email_enc['iv'],
            **extra_fields
        )
        user.set_password(password)  # this hashes password into user.password
        user.save(using=self._db)
        return user

    def create_user(self, plain_username, plain_email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(plain_username, plain_email, password, **extra_fields)

    def create_superuser(self, plain_username, plain_email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(plain_username, plain_email, password, **extra_fields)



# Import RBAC models
from .rbac_models import Role, Department, Designation

class User(AbstractUser):
    # override the default username field
    username = None
    email    = None

    # 1) Password stays as Django’s hashed password (no reversible encryption)
    #    field `password` is inherited from AbstractUser and uses Django’s hasher.

    # 2) Username & email: both hashed (for lookup) and AES-encrypted (for display)
    username_hash      = models.CharField(max_length=128, unique=True)
    username_encrypted = models.TextField()  # AES-GCM ciphertext+tag
    username_iv        = models.CharField(max_length=32)  # AES-GCM IV

    email_hash         = models.CharField(max_length=128, unique=True)
    email_encrypted    = models.TextField()
    email_iv           = models.CharField(max_length=32)

    # 3) Other PII: phone number, address (same pattern)
    phone_hash         = models.CharField(max_length=128, blank=True, null=True)
    phone_encrypted    = models.TextField(blank=True, null=True)
    phone_iv           = models.CharField(max_length=32, blank=True, null=True)

    address_hash       = models.CharField(max_length=128, blank=True, null=True)
    address_encrypted  = models.TextField(blank=True, null=True)
    address_iv         = models.CharField(max_length=32, blank=True, null=True)

    # RBAC fields
    role         = models.ForeignKey(Role, null=True, blank=True, on_delete=models.SET_NULL)
    department   = models.ForeignKey(Department, null=True, blank=True, on_delete=models.SET_NULL)
    designation  = models.ForeignKey(Designation, null=True, blank=True, on_delete=models.SET_NULL)

    objects = UserManager()

    USERNAME_FIELD = 'username_hash'
    REQUIRED_FIELDS = ['email_hash']

    def get_username(self) -> str:
        """Decrypt and return the plaintext username."""
        return decrypt_data({'iv': self.username_iv, 'data': self.username_encrypted})

    def get_email(self) -> str:
        """Decrypt and return the plaintext email."""
        return decrypt_data({'iv': self.email_iv, 'data': self.email_encrypted})

    def check_username(self, plain_username: str) -> bool:
        """Verify a submitted username against the stored hash."""
        return decrypt_hash(plain_username, self.username_hash)

    def check_email(self, plain_email: str) -> bool:
        """Verify a submitted email against the stored hash."""
        return decrypt_hash(plain_email, self.email_hash)

    def __str__(self):
        return self.get_username()
