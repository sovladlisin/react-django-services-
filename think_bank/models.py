from django.db import models

# Create your models here.


class VkUser(models.Model):
    user_id = models.IntegerField(default=0)
    user_img = models.CharField(default='Не указано', max_length=300)
    user_name = models.CharField(default='Не указано', max_length=300)
    token = models.CharField(default='', max_length=300)


class Post(models.Model):
    # владелец поста в банке креативов
    user = models.ForeignKey(
        VkUser, blank=False, null=False, related_name='vkuser_id', on_delete=models.CASCADE)
    post_id = models.IntegerField(default=0)
    owner_id = models.IntegerField(default=0)
    owner_name = models.CharField(default='Не указано', max_length=1000)
    owner_img_link = models.CharField(default='Не указано', max_length=1000)
    from_id = models.IntegerField(default=0)
    date = models.CharField(default='Не указано', max_length=300)
    text = models.CharField(default='Не указано', max_length=30000)
    comments_count = models.IntegerField(default=0)
    likes_count = models.IntegerField(default=0)
    reposts_count = models.IntegerField(default=0)
    views_count = models.IntegerField(default=0)
    attachments = models.CharField(default='Не указано', max_length=30000)


class VkUserPermissions(models.Model):
    owner = models.ForeignKey(
        VkUser, blank=False, null=False, related_name='owner', on_delete=models.CASCADE)
    viewer = models.ForeignKey(
        VkUser, blank=False, null=False, related_name='viewer', on_delete=models.CASCADE)


class Comment(models.Model):
    post = models.ForeignKey(
        Post, blank=False, null=False, related_name='comment_post', on_delete=models.CASCADE)
    user = models.ForeignKey(
        VkUser, blank=False, null=False, related_name='comment_owner', on_delete=models.CASCADE)
    comment = models.CharField(default='', max_length=300)


class Test(models.Model):
    post = models.CharField(max_length=1)
