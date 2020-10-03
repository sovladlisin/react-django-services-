from rest_framework import serializers
from think_bank.models import Post, VkUser, VkUserPermissions


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
