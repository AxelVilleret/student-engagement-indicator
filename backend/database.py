import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()

# Récupérer les variables d'environnement
username = os.getenv('DB_USERNAME')
password = os.getenv('DB_PASSWORD')
database_name = os.getenv('DB_NAME')

engine = create_engine(f'mysql+pymysql://{username}:{password}@localhost:3306/{database_name}')


def get_data_from_db():
    """
    Récupère les données des tables 'transition' et 'userfiles' et les fusionne.
    """
    query_transition = "SELECT Utilisateur, Titre, Date, Heure FROM transition"
    query_file = "SELECT User, Filenameo, Dateupload, Timeupload FROM userfiles"

    transition_data = pd.read_sql(query_transition, engine)
    file_data = pd.read_sql(query_file, engine)
    file_data["Filenameo"] = file_data["Filenameo"].apply(
        lambda filename: "fileUpload: " + filename)

    # Renommer les colonnes pour correspondre à celles de transition_data
    file_data.columns = transition_data.columns

    # Fusionner les deux DataFrames
    data = pd.concat([transition_data, file_data])

    # Convertir l'heure en chaîne de caractères
    data["Heure"] = data["Heure"].apply(str)

    return data
