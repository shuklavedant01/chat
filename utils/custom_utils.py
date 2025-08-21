# utils/custom_utils.py
import base64
import logging
import os
from typing import Any, Dict

from cryptography.exceptions import InvalidTag
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password

logger = logging.getLogger(__name__)

class CryptoError(Exception):
    """Custom exception for encryption/decryption errors."""
    pass


def encrypt_data(plaintext: str) -> Dict[str, str]:
    """
    Symmetric encryption of plaintext using AES-GCM.
    Returns a dict with base64-encoded 'iv' and 'data' (ciphertext+tag).
    Generates a new random IV each call.

    Raises:
        CryptoError: if encryption fails.
    """
    try:
        key: bytes = settings.AES_SECRET_KEY
        if not isinstance(key, (bytes, bytearray)) or len(key) != 32:
            raise CryptoError("Invalid AES key in settings.")
        aesgcm = AESGCM(key)
        iv = os.urandom(12)  # 96-bit IV
        ciphertext = aesgcm.encrypt(iv, plaintext.encode('utf-8'), None)
        return {
            'iv': base64.b64encode(iv).decode('utf-8'),
            'data': base64.b64encode(ciphertext).decode('utf-8'),
        }
    except Exception as e:
        logger.error(f"encrypt_data failed: {e}")
        raise CryptoError("Encryption failed.") from e


def decrypt_data(enc_obj: Dict[str, Any]) -> str:
    """
    Decrypts a dict produced by encrypt_data().
    enc_obj must have base64-encoded 'iv' and 'data'.
    Returns plaintext string.

    Raises:
        CryptoError: if decryption fails or input invalid.
    """
    try:
        key: bytes = settings.AES_SECRET_KEY
        if not isinstance(key, (bytes, bytearray)) or len(key) != 32:
            raise CryptoError("Invalid AES key in settings.")
        iv_b64 = enc_obj.get('iv')
        data_b64 = enc_obj.get('data')
        if not iv_b64 or not data_b64:
            raise CryptoError("Missing iv or data for decryption.")
        iv = base64.b64decode(iv_b64)
        ct_and_tag = base64.b64decode(data_b64)
        aesgcm = AESGCM(key)
        plaintext_bytes = aesgcm.decrypt(iv, ct_and_tag, None)
        return plaintext_bytes.decode('utf-8')
    except InvalidTag:
        logger.warning("decrypt_data: invalid tag or corrupted data.")
        raise CryptoError("Invalid ciphertext or authentication failed.")
    except Exception as e:
        logger.error(f"decrypt_data failed: {e}")
        raise CryptoError("Decryption failed.") from e


def encrypt_hash(data: str) -> str:
    """
    One-way salted hash of data using Django's PASSWORD_HASHERS.

    Returns hashed string.
    Raises ValueError if input invalid.
    """
    if not isinstance(data, str):
        raise ValueError("encrypt_hash: data must be a string.")
    return make_password(data)


def decrypt_hash(plaintext: str, hashed: str) -> bool:
    """
    Verifies plaintext against hashed value.

    Returns True if match, False otherwise.
    Raises ValueError if input invalid.
    """
    if not isinstance(plaintext, str) or not isinstance(hashed, str):
        raise ValueError("decrypt_hash: both plaintext and hashed must be strings.")
    try:
        return check_password(plaintext, hashed)
    except Exception as e:
        logger.error(f"decrypt_hash failed: {e}")
        return False
