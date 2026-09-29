from typing import List
from fastapi import Depends, HTTPException, status
from backend.app.models.user import User, RoleType
from backend.app.security.jwt_auth import get_current_user

def require_roles(*allowed_roles: RoleType):
    """Enforces role-based access control (RBAC) on route endpoints."""
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles and current_user.role != RoleType.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: Requires one of {[r.value for r in allowed_roles]}. Current role: {current_user.role.value}"
            )
        return current_user
    return role_checker
