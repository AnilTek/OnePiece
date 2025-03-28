from django.shortcuts import render
from django.http import JsonResponse
import json
from .models import Character,Fruit
from decimal import Decimal
import random
import math

arc_dict ={
    'Romance Dawn': 0,
    'Orange Town': 1,
    'Syrup Village': 2,
    'Baratie': 3,
    'Arlong Park': 4,
    'Loguetown': 5,
    'Reverse Mountain': 6,
    'Whiskey Peak': 7,
    'Little Garden': 8,
    'Drum Island': 9,
    'Alabasta': 10,
    'Jaya': 11,
    'Skypiea': 12,
    'Long Ring Long Land': 13,
    'Water 7': 14,
    'Enies Lobby': 15,
    'Thriller Bark': 16,
    'Sabaody Archipelago': 17,
    'Amazon Lily': 18,
    'Impel Down': 19,
    'Marineford': 20,
    'Post-War': 21,
    'Return To Sabaody': 22,
    'Fishman Island': 23,
    'Punk Hazard': 24,
    'Dressrosa': 25,
    'Zou': 26,
    'Whole Cake Island': 27,
    'Reverie': 28,
    'Wano': 29,
    'Egghead': 30
}

# Create your views here.
def decimal_to_float(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError



arc_dict = {
    'Romance Dawn': 0,
    'Orange Town': 1,
    'Syrup Village': 2,
    'Baratie': 3,
    'Arlong Park': 4,
    'Loguetown': 5,
    'Reverse Mountain': 6,
    'Whiskey Peak': 7,
    'Little Garden': 8,
    'Drum Island': 9,
    'Alabasta': 10,
    'Jaya': 11,
    'Skypiea': 12,
    'Long Ring Long Land': 13,
    'Water 7': 14,
    'Enies Lobby': 15,
    'Thriller Bark': 16,
    'Sabaody Archipelago': 17,
    'Amazon Lily': 18,
    'Impel Down': 19,
    'Marineford': 20,
    'Post-War': 21,
    'Return To Sabaody': 22,
    'Fishman Island': 23,
    'Punk Hazard': 24,
    'Dressrosa': 25,
    'Zou': 26,
    'Whole Cake Island': 27,
    'Reverie': 28,
    'Wano': 29,
    'Egghead': 30
}

def character_list_api(request):
    if request.headers.get("X-Requested-With") == "XMLHttpRequest":
        index_name = request.GET.get("index")
        print("GELEN INDEX:", index_name)

        if not index_name or index_name not in arc_dict:
            return JsonResponse({"error": "Geçersiz veya eksik arc adı"}, status=400)

        arc_index = arc_dict[index_name]
        print("EŞLEŞEN NUMARA:", arc_index)

        chars = list(Character.objects.values(
            "name", "image_name", "gender", "age", 
            "devil_fruit", "last_bounty", "debut_arc",
            "haki", "affiliation", "episode", "debut_arc_index"
        ))

        chars_copy = []
        for char in chars:
            try:
                if int(char["debut_arc_index"]) <= arc_index:
                    chars_copy.append(char)
            except (TypeError, ValueError):
                continue  

        random_char = random.choice(chars_copy) if chars_copy else None

        return JsonResponse({
            "characters": chars_copy,
            "random_character": random_char
        }, safe=False)

    return JsonResponse({"error": "Unauthorized"}, status=403)





def fruit_character_api(request):
    if request.headers.get("X-Requested-With") == "XMLHttpRequest":
        chars = list(Fruit.objects.values("fruit_name", "translation", "type","user","usage","image_name"))

        if chars:  
            random_char = random.choice(chars)
        else:
            random_char = None  
        
        response_data = {
            "characters": chars,  
            "random_character": random_char  
        }



        return JsonResponse(response_data, safe=False)

    return JsonResponse({"error": "Unauthorized"}, status=403)





def classic(request):

    chars = Character.objects.all().values("name","image_name","gender","age","devil_fruit","last_bounty","debut_arc","haki","affiliation","episode","debut_arc_index")
    context = {
        'chars':chars,
        'arc_dict':arc_dict,
    }

    return render(request,'classic.html',context=context)


def fruit(request):

    
    return render(request,'fruit.html')