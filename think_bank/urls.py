from rest_framework import routers
from .api import addPost, CommentViewSet, PostViewSet, PostByUser, getPermissions, VkUserViewSet, addUser, VkUserPermissionsViewSet, getPostById, getUserByVkId, getPostComments
from django.urls import path
from .views import Bot

router = routers.DefaultRouter()
router.register('api/posts', PostViewSet, 'posts')
router.register('api/userPosts', PostByUser, 'userPosts')
router.register('api/vkUsers', VkUserViewSet, 'vkusers')
router.register('api/vkPermissions', VkUserPermissionsViewSet, 'vkPermissions')
router.register('api/comments', CommentViewSet, 'comments')

urlpatterns = router.urls + [path(
    'api/vkUserPermissions', getPermissions, name='vkUserPermissions'),
    path('api/addUser', addUser, name='addUser'),
    path('api/getPostById', getPostById, name='getPostById'),
    path('api/getUserByVkId', getUserByVkId, name='getUserByVkId'),
    path('api/getPostComments', getPostComments, name='getPostComments'),
    path('bot/', Bot, name='bot'),
    path('api/addPost', addPost, name='addPost')
]
