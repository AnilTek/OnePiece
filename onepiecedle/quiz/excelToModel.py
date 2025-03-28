from .models import Character,Fruit
import pandas as pd

def save_excel_to_model():
    df = pd.read_excel("one_piece_characters.xlsx")

    characters = [] 

    for _, row in df.iterrows(): 
        character = Character(
            name=row["Name"],
            image_name=row["Image"],  
            gender=row["Gender"],
            age=row["Age"] if pd.notna(row["Age"]) else None,  
            devil_fruit=row["Devil Fruit"] if pd.notna(row["Devil Fruit"]) else None,
            last_bounty=row["Last Bounty"] if pd.notna(row["Last Bounty"]) else None,
            debut_arc=row["Debut Arc"],
            haki=row["Haki"],
            affiliation=row["Affiliation"],
            episode=row["Episode"] if pd.notna(row["Episode"]) else None,
            debut_arc_index=row["Arc Index"] if pd.notna(row["Arc Index"]) else None,  
        )
        characters.append(character)

    Character.objects.bulk_create(characters)  
    print(f"{len(characters)} karakter başarıyla eklendi!")


def save_fruit_to_model():
    df = pd.read_excel("one_piece_fruits.xlsx")
    fruits = []

    for _, row in df.iterrows():
        fruit = Fruit( 
            fruit_name = row["Name"],
            translation = row["Translation"],
            type = row["Type"],
            user = row["User"],
            usage = row["Usage"],
            image_name = row["Image"],
        )
        fruits.append(fruit)

    Fruit.objects.bulk_create(fruits)
    print(f"{len(fruits)} karakter başarıyla eklendi!")




