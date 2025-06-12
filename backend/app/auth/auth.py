from jose import JWTError, jwt
from datetime import datetime, timedelta

SECRET_KEY = "kqUTHpTd8bRp9ulg5es00_9MyRT8ZQEHemN93EA6OKiRHMto8Z4dJbWOQJ4kjfY9ipPbr_RYltcu7j9gzi_zHA"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise credentials_exception