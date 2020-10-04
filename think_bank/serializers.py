from rest_framework import serializers
from think_bank.models import Post, VkUser, VkUserPermissions, Comment


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'


class VkUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = VkUser
        fields = '__all__'


class VkUserPermissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = VkUserPermissions
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
