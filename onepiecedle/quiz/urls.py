from django.contrib import admin
from django.urls import include, path
from . import views

urlpatterns = [
    path('',views.classic,name='classic'),
    path('fruit/',views.fruit,name='fruit'),

    path('api/character-list/', views.character_list_api, name='character-list'),
    path('fruit/api/fruit-list/', views.fruit_character_api, name='fruit-list'), 
    
]