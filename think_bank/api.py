from django.db.models import Q
from think_bank.models import Post
from rest_framework import viewsets, permissions
from .serializers import PostSerializer
from rest_framework import generics
from rest_framework.views import APIView, Response

# perm = permissions.IsAuthenticated
perm = permissions.AllowAny


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    permission_classes = [
        perm
    ]

    serializer_class = PostSerializer


# class PostByUser(generics.ListAPIView):
#     serializer_class = PostSerializer

#     def get_queryset(self):

#         queryset = Post.objects.all()
#         id = self.request.query_params.get('user_id', None)
#         print(self.request.data)
#         if id is not None:
#             queryset = queryset.filter(user_id=id)
#         return queryset


class PostByUser(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get_queryset(self):
        queryset = Post.objects.all()
        # id = request.q.get('user_id', None)
        id = self.request.query_params.get('user_id', None)
        if id is not None:
            queryset = queryset.filter(user_id=id)
        return queryset
