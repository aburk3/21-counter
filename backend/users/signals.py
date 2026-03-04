from __future__ import annotations

from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from users.models import UserProfile, UserSettings

User = get_user_model()


@receiver(post_save, sender=User)
def create_related_models(sender, instance, created, **kwargs):
    if not created:
        return
    UserProfile.objects.create(user=instance)
    UserSettings.objects.create(user=instance)
