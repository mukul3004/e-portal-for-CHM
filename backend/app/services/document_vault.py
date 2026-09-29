import hashlib
import os

def compute_sha256(data: bytes) -> str:
    """Compute 64-character SHA-256 cryptographic digest of document bytes."""
    hasher = hashlib.sha256()
    hasher.update(data)
    return hasher.hexdigest()

def verify_file_integrity(file_bytes: bytes, expected_hash: str) -> bool:
    """Validate that the uploaded binary matches the recorded SHA-256 checksum."""
    return compute_sha256(file_bytes).lower() == expected_hash.lower()
