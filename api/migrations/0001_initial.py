# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-05 08:24
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Point',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('description', models.CharField(max_length=255, unique=True)),
                ('poet', models.CharField(max_length=255)),
                ('address', models.CharField(max_length=255)),
                ('image', models.ImageField(blank=True, null=True, upload_to='image')),
                ('qrcode', models.ImageField(blank=True, null=True, upload_to='qrcode')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Word',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('word', models.CharField(max_length=255)),
                ('frequency', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('point', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Point')),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='word',
            unique_together=set([('point', 'word')]),
        ),
    ]