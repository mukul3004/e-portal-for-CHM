import hashlib
import os
from typing import Dict, Any, Optional
from backend.app.patterns.singleton import JudicialVaultSingleton

def get_vault() -> JudicialVaultSingleton:
    """Returns the process-wide thread-safe Judicial Vault Singleton instance."""
    return JudicialVaultSingleton.get_instance()

def compute_sha256(data: bytes) -> str:
    """Compute 64-character SHA-256 cryptographic digest using the Singleton Vault."""
    return get_vault().compute_sha256(data)

def verify_file_integrity(file_bytes: bytes, expected_hash: str) -> bool:
    """Validate that the uploaded binary matches the recorded SHA-256 checksum."""
    return compute_sha256(file_bytes).lower() == expected_hash.lower()

def register_certified_document(
    document_id: str,
    case_id: str,
    document_type: str,
    raw_bytes: bytes,
    signatory_id: str
) -> Dict[str, Any]:
    """Registers an immutable cryptographic seal in the Judicial Vault Singleton."""
    return get_vault().register_certified_document(
        document_id=document_id,
        case_id=case_id,
        document_type=document_type,
        raw_bytes=raw_bytes,
        signatory_bar_or_judge_id=signatory_id
    )
