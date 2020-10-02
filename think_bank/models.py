from django.db import models

# Create your models here.


class Post(models.Model):
    # владелец поста в банке креативов
    user_id = models.IntegerField(default=0)
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
