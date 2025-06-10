# app/auth/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Fake users DB
fake_users_db = {
    "admin": User(username="admin", role="admin"),
    "viewer": User(username="viewer", role="viewer"),
}

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    user = fake_users_db.get(token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return user

def require_role(*roles):
    def role_checker(user: User = Depends(get_current_user)):
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="Insufficient role")
        return user
    return role_checker