# Generated by Django 3.0.3 on 2020-10-13 08:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('think_bank', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Test',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('post', models.CharField(max_length=1)),
            ],
        ),
    ]
