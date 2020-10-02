from rest_framework import routers
from .api import PostViewSet, PostByUser
from django.urls import path

router = routers.DefaultRouter()
router.register('api/posts', PostViewSet, 'posts')
router.register('api/userPosts', PostByUser, 'userPosts')

urlpatterns = router.urls
