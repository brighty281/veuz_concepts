# Generated by Django 5.1.2 on 2024-11-03 18:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employee_app', '0002_userprofile_designation_userprofile_experience_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='qualification',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]