from django.http import StreamingHttpResponse, HttpResponseRedirect, HttpResponse
from django.db.models import Q
from think_bank.models import Post, VkUserPermissions, VkUser, Comment
from rest_framework import viewsets, permissions
from .serializers import PostSerializer, VkUserPermissionsSerializer, VkUserSerializer, CommentSerializer
from rest_framework import generics
from rest_framework.views import APIView, Response
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from django.http import JsonResponse
from django.core import serializers
from django.forms.models import model_to_dict
import json
# perm = permissions.IsAuthenticated
perm = permissions.AllowAny


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    permission_classes = [
        perm
    ]

    serializer_class = PostSerializer


class VkUserViewSet(viewsets.ModelViewSet):
    queryset = VkUser.objects.all()
    permission_classes = [
        perm
    ]

    serializer_class = VkUserSerializer


class VkUserPermissionsViewSet(viewsets.ModelViewSet):
    queryset = VkUserPermissions.objects.all()
    permission_classes = [
        perm
    ]

    serializer_class = VkUserPermissionsSerializer


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    permission_classes = [
        perm
    ]

    serializer_class = CommentSerializer


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


@csrf_exempt
def getPermissions(request):
    if request.method == 'GET':
        id = request.headers.get('id', None)
        if id is not None:
            owners = []
            viewers = []
            users = VkUser.objects.all()
            perms = VkUserPermissions.objects.all().filter(Q(owner_id=id) | Q(viewer_id=id))
            for entry in perms:
                if entry.owner_id == int(id):
                    viewer = users.filter(user_id=entry.viewer_id).first()
                    viewers.append(
                        {'id': entry.pk, 'user_name': viewer.user_name, 'user_id': viewer.user_id, 'user_img': viewer.user_img})
                if entry.viewer_id == int(id):
                    owner = users.filter(user_id=entry.owner_id).first()
                    owners.append(
                        {'id': entry.pk, 'user_name': owner.user_name, 'user_id': owner.user_id, 'user_img': owner.user_img})

            print(owners, viewers)
            return JsonResponse({'owners': owners, 'viewers': viewers}, safe=False)
    return HttpResponse('Wrong type')


@csrf_exempt
def addUser(request):
    if request.method == 'POST':
        user = json.loads(request.body.decode('utf-8'))
        if user is not None:
            users = VkUser.objects.all().filter(user_id=user['user_id'])
            if not users:
                new_user = VkUser(
                    user_id=user['user_id'], user_img=user['user_img'], user_name=user['user_name'])
                new_user.save()
                return HttpResponse('Success')
            else:
                return HttpResponse('Already exists')
    return HttpResponse('Wrong request')


@csrf_exempt
def getPostById(request):
    if request.method == 'GET':
        id = request.headers.get('id', None)
        if id is not None:
            post = Post.objects.get(pk=id)
            dict_obj = model_to_dict(post)
            return JsonResponse(dict_obj, safe=False)
        return HttpResponse('404')
    return HttpResponse('Wrong request')


@csrf_exempt
def getUserByVkId(request):
    if request.method == 'GET':
        id = request.headers.get('id', None)
        if id is not None:
            user = VkUser.objects.filter(user_id=id).first()
            dict_obj = model_to_dict(user)
            return JsonResponse(dict_obj, safe=False)
        return HttpResponse('404')
    return HttpResponse('Wrong request')


def getPostComments(request):
    if request.method == 'GET':
        id = request.headers.get('id', None)
        if id is not None:
            result = []
            comments = Comment.objects.all().filter(post_id=id)
            for comment in comments:
                user = VkUser.objects.all().filter(user_id=comment.user_id).first()
                temp = {'id': comment.pk, 'post_id': comment.post_id, 'user_id': comment.user_id,
                        'user_img': user.user_img, 'user_name': user.user_name, 'comment': comment.comment}
                result.append(temp)
            return JsonResponse(result, safe=False)
        return HttpResponse('404')
    return HttpResponse('Wrong request')
