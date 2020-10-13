import requests
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
            queryset = queryset.filter(user=id)
        return queryset


@csrf_exempt
def getPermissions(request):
    if request.method == 'GET':
        id = request.headers.get('id', None)
        if id is not None:
            temp_user = VkUser.objects.get(pk=id)
            owners = []
            viewers = []
            users = VkUser.objects.all()
            perms = VkUserPermissions.objects.all().filter(
                Q(owner=temp_user) | Q(viewer=temp_user))
            for entry in perms:
                if entry.owner == temp_user:
                    viewer = users.get(pk=entry.viewer.pk)
                    viewers.append(
                        {'id': entry.pk, 'user_name': viewer.user_name, 'user_id': viewer.pk, 'user_img': viewer.user_img})
                if entry.viewer == temp_user:
                    owner = users.get(pk=entry.owner.pk)
                    owners.append(
                        {'id': entry.pk, 'user_name': owner.user_name, 'user_id': owner.pk, 'user_img': owner.user_img})

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
                    user_id=user['user_id'], user_img=user['user_img'], user_name=user['user_name'], token=user['token'])
                new_user.save()
                return JsonResponse(model_to_dict(new_user), safe=False)
            else:
                old_user = users.first()
                old_user.token = user['token']
                old_user.save()
                return JsonResponse(model_to_dict(old_user), safe=False)
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
            post = Post.objects.get(pk=id)
            comments = Comment.objects.all().filter(post=post)
            for comment in comments:
                user = comment.user
                temp = {'id': comment.pk, 'post': post.pk, 'user': user.pk,
                        'user_img': user.user_img, 'user_name': user.user_name, 'comment': comment.comment}
                result.append(temp)
            return JsonResponse(result, safe=False)
        return HttpResponse('404')
    return HttpResponse('Wrong request')


@csrf_exempt
def addPost(request):
    if request.method == 'POST':
        user = json.loads(request.body.decode('utf-8'))
        post_link = user.get('post_link', None)
        user_id = user.get('user_id', None)
        new_post = add_post_to_db(False, post_link, user_id, None)
        return JsonResponse(model_to_dict(new_post), safe=False)
    return HttpResponse('Wrong request')


def vk_request(type, name, params, token):
    params['access_token'] = token
    params['v'] = '5.122'

    if type == 'get':
        r = requests.get('https://api.vk.com/method/' + name, params)
        result = json.loads(r.content.decode('utf-8'))
        return result


def add_post_to_db(id_check, post_link, user_id, comment):
    if id_check:
        post_id = post_link
    else:
        if 'wall' in post_link:
            if '-' in post_link:
                splitted = post_link.split('-')
                post_id = splitted[1]
                post_id = "-" + post_id
            else:
                splitted = post_link.split('wall')[1]
                post_id = splitted.split('?')[0]
        else:
            return {'error': 'not a link'}

    user = VkUser.objects.all().get(pk=user_id)

    wall_data = vk_request('get', 'wall.getById', {
                           'posts': post_id}, user.token)['response'][0]
    if post_id[0] == '-':
        owner = vk_request('get', 'groups.getById', {
                           'group_ids': int(wall_data['owner_id']) * -1}, user.token)['response'][0]
        owner_name = owner['name']
        owner_photo = owner['photo_50']
    else:
        owner = vk_request('get', 'users.get', {
                           'user_ids': wall_data['owner_id'], 'fields': 'photo_50'}, user.token)['response'][0]
        owner_name = owner['first_name'] + owner['last_name']
        owner_photo = owner['photo_50']

    new_post = Post(user=user,
                    post_id=post_id,
                    owner_id=wall_data['owner_id'],
                    owner_name=owner_name,
                    owner_img_link=owner_photo,
                    from_id=wall_data['from_id'],
                    date=wall_data['date'],
                    text=wall_data['text'],
                    comments_count=wall_data.get(
                        'comments', {'count': 0})['count'],
                    likes_count=wall_data.get(
                        'likes', {'count': 0})['count'],
                    reposts_count=wall_data.get(
                        'reposts', {'count': 0})['count'],
                    views_count=wall_data.get(
                        'views', {'count': 0})['count'],
                    attachments=json.dumps(wall_data.get('attachments', [])))
    print(model_to_dict(new_post))
    new_post.save()
    if comment is not None and comment.len() > 0:
        new_comment = Comment(user=user, comment=comment, post=new_post)
        new_comment.save()
    return new_post
