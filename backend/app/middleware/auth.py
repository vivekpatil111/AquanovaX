from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.config import get_settings

security = HTTPBearer()
settings = get_settings()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Validates the Supabase JWT token and returns the user payload.
    Requires setting JWT_SECRET in .env matching your Supabase project.
    """
    token = credentials.credentials
    try:
        # Supabase JWTs use 'authenticated' as the audience by default
        # If you haven't set JWT_SECRET, this will fail.
        payload = jwt.decode(
            token, 
            settings.jwt_secret, 
            algorithms=[settings.jwt_algorithm],
            options={"verify_aud": False} # Disable audience verification for simplicity in dev
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
        
        return {"id": user_id, "email": payload.get("email")}
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
