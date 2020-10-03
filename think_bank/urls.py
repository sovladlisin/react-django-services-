from rest_framework import routers
from .api import PostViewSet, PostByUser, getPermissions, VkUserViewSet, addUser, VkUserPermissionsViewSet
from django.urls import path

router = routers.DefaultRouter()
router.register('api/posts', PostViewSet, 'posts')
router.register('api/userPosts', PostByUser, 'userPosts')
router.register('api/vkUsers', VkUserViewSet, 'vkusers')
router.register('api/vkPermissions', VkUserPermissionsViewSet, 'vkPermissions')

urlpatterns = router.urls + [path(
    'api/vkUserPermissions', getPermissions, name='vkUserPermissions'),
    path('api/addUser', addUser, name='addUser')
]
