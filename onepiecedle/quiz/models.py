from django.db import models

# Create your models here.

class Character(models.Model):
    name = models.CharField(max_length=255)
    image_name = models.CharField(max_length=255, blank=True, null=True)  # Görsel adı için
    gender = models.CharField(max_length=20, blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    devil_fruit = models.CharField(max_length=255, blank=True, null=True)
    last_bounty = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
    debut_arc = models.CharField(max_length=255, blank=True, null=True)
    haki = models.CharField(max_length=255, blank=True, null=True)
    affiliation = models.CharField(max_length=255, blank=True, null=True)
    episode = models.CharField(max_length=255, blank=True, null=True)
    debut_arc_index = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.name
    
    def get_image_url(self):
        """Görselin tam URL'sini döndürür"""
        if self.image_name:
            return f"/media/OnePiece/{self.image_name}"
        return None
    
class Fruit(models.Model):

    fruit_name = models.CharField(max_length=255)
    translation = models.CharField(max_length=200,blank=True,null=True)
    type = models.CharField(max_length=200,blank=True,null=True)
    user = models.CharField(max_length=200,blank=True,null=True)
    usage = models.CharField(max_length=200,blank=True,null=True)
    image_name = models.CharField(max_length=200,blank=True,null=True)

    def __str__(self):
        return self.user
    
    def get_image_url(self):
        """Görselin tam URL'sini döndürür"""
        if self.image_name:
            return f"/media/OnePiece/{self.image_name}"
        return None

