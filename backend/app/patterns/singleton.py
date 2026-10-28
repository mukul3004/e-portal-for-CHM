"""
=============================================================================
GANG OF FOUR (GoF) CREATIONAL PATTERN: SINGLETON
Project: Case Management Hearing e-Portal (Order XV-A CPC)
Module: backend.app.patterns.singleton
=============================================================================
Ensures a class has only one instance and provides a global point of access to it.
Thread-safe implementation with double-checked locking for high-concurrency ASGI workers.
"""

import threading
import hashlib
import time
from typing import Optional, Dict, Any
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from backend.app.config import settings


class JudicialVaultSingleton:
    """
    GoF Singleton Pattern: Thread-Safe Judicial Cryptographic Vault.
    Guarantees a single authority across the entire judicial e-portal for:
      - SHA-256 digital docket verification
      - Tamper-evident ledger integrity checks
      - Immutable audit logging of judicial decrees and pleadings
    """
    _instance: Optional["JudicialVaultSingleton"] = None
    _lock: threading.Lock = threading.Lock()

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(JudicialVaultSingleton, cls).__new__(cls)
                    cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if getattr(self, "_initialized", False):
            return
        with self._lock:
            if getattr(self, "_initialized", False):
                return
            self._vault_id: str = f"VAULT-SVVV-{int(time.time())}"
            self._tamper_records: Dict[str, Dict[str, Any]] = {}
            self._hash_algorithm: str = "SHA-256"
            self._verification_count: int = 0
            self._initialized: True = True

    @classmethod
    def get_instance(cls) -> "JudicialVaultSingleton":
        """Explicit GoF accessor method."""
        return cls()

    @classmethod
    def reset_instance(cls) -> None:
        """Utility for test isolation."""
        with cls._lock:
            cls._instance = None

    def compute_sha256(self, payload: bytes) -> str:
        """Computes the 64-character hexadecimal SHA-256 cryptographic digest."""
        hasher = hashlib.sha256()
        hasher.update(payload)
        return hasher.hexdigest()

    def register_certified_document(
        self,
        document_id: str,
        case_id: str,
        document_type: str,
        raw_bytes: bytes,
        signatory_bar_or_judge_id: str
    ) -> Dict[str, Any]:
        """
        Registers an immutable cryptographic seal for an uploaded pleading or court decree.
        """
        with self._lock:
            digest = self.compute_sha256(raw_bytes)
            timestamp = time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
            record = {
                "document_id": document_id,
                "case_id": case_id,
                "document_type": document_type,
                "sha256_digest": digest,
                "signatory": signatory_bar_or_judge_id,
                "timestamp": timestamp,
                "bytes_len": len(raw_bytes),
                "is_valid": True,
            }
            self._tamper_records[document_id] = record
            self._verification_count += 1
            return record

    def verify_document_integrity(self, document_id: str, current_bytes: bytes) -> Dict[str, Any]:
        """
        Validates whether file bytes match the original tamper-proof seal in the vault.
        """
        current_hash = self.compute_sha256(current_bytes)
        record = self._tamper_records.get(document_id)

        if not record:
            return {
                "verified": False,
                "reason": "DOCUMENT_NOT_FOUND_IN_VAULT",
                "current_hash": current_hash,
                "expected_hash": None,
            }

        is_match = (current_hash.lower() == record["sha256_digest"].lower())
        return {
            "verified": is_match,
            "document_id": document_id,
            "current_hash": current_hash,
            "expected_hash": record["sha256_digest"],
            "tampered": not is_match,
            "signatory": record["signatory"],
            "timestamp": record["timestamp"],
        }

    @property
    def vault_id(self) -> str:
        return self._vault_id

    @property
    def hash_algorithm(self) -> str:
        return self._hash_algorithm

    @property
    def tamper_records(self) -> Dict[str, Dict[str, Any]]:
        return self._tamper_records

    @property
    def total_verifications(self) -> int:
        return self._verification_count


class DatabaseConnectionPoolSingleton:
    """
    GoF Singleton Pattern: Thread-Safe Database Connection Pool Manager.
    Ensures a single SQLAlchemy Engine and SessionLocal factory are shared across
    all request threads to avoid thread leaks and pool exhaustion.
    """
    _instance: Optional["DatabaseConnectionPoolSingleton"] = None
    _lock: threading.Lock = threading.Lock()

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(DatabaseConnectionPoolSingleton, cls).__new__(cls)
                    cls._instance._initialized = False
        return cls._instance

    def __init__(self, database_url: Optional[str] = None):
        if getattr(self, "_initialized", False):
            return
        with self._lock:
            if getattr(self, "_initialized", False):
                return
            self._database_url = database_url or settings.DATABASE_URL
            connect_args = {"check_same_thread": False} if self._database_url.startswith("sqlite") else {}
            
            self._engine = create_engine(
                self._database_url,
                connect_args=connect_args,
                pool_pre_ping=True,
                echo=False
            )
            self._session_factory = sessionmaker(
                autocommit=False,
                autoflush=False,
                bind=self._engine
            )
            self._initialized = True

    @classmethod
    def get_instance(cls, database_url: Optional[str] = None) -> "DatabaseConnectionPoolSingleton":
        """Explicit GoF accessor."""
        return cls(database_url)

    @classmethod
    def reset_instance(cls) -> None:
        """Utility for test isolation."""
        with cls._lock:
            if cls._instance and hasattr(cls._instance, "_engine"):
                try:
                    cls._instance._engine.dispose()
                except Exception:
                    pass
            cls._instance = None

    def get_session(self) -> Session:
        """Yields a new transactional database session from the singleton factory."""
        return self._session_factory()

    @property
    def engine(self):
        return self._engine
