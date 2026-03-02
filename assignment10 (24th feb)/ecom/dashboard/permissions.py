from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow standard users/managers to read,
    but requires Admin role to create, edit, or delete.
    """
    def has_permission(self, request, view):
        # Allow GET, HEAD, or OPTIONS requests
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Check if user has a profile and is an admin
        return hasattr(request.user, 'profile') and request.user.profile.role == 'admin'