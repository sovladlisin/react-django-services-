# Generated by Django 3.0.3 on 2020-10-02 10:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('think_bank', '0003_post_user_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='owner_img_link',
            field=models.CharField(default='Не указано', max_length=1000),
        ),
        migrations.AddField(
            model_name='post',
            name='owner_name',
            field=models.CharField(default='Не указано', max_length=1000),
        ),
    ]
