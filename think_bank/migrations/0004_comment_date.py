# Generated by Django 3.0.3 on 2020-10-14 14:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('think_bank', '0003_auto_20201013_1535'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='date',
            field=models.CharField(default='', max_length=200),
        ),
    ]
