from fastapi import FastAPI
from database import get_data_from_db
from calculations import UserStatistics
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/average-time-per-day")
def get_average_spent_time_ranking():
    """
    Retourne le classement des utilisateurs basé sur le temps moyen passé par jour.
    """
    data = get_data_from_db()
    stats = UserStatistics(data)
    return stats.calculate_average_spent_time_ranking()


@app.get("/max-consecutive-signin-days")
def get_max_signin_days_ranking():
    """
    Retourne le classement des utilisateurs basé sur le nombre maximum de jours consécutifs de connexion.
    """
    data = get_data_from_db()
    stats = UserStatistics(data)
    return stats.calculate_max_signin_days_ranking()


@app.get("/message-replies-per-person")
def get_count_replied_msg_per_person_ranking():
    """
    Retourne le classement des utilisateurs basé sur le nombre de messages auxquels chaque utilisateur a répondu.
    """
    data = get_data_from_db()
    stats = UserStatistics(data)
    return stats.calculate_count_replied_msg_per_person_ranking()


@app.get("/file-uploads-per-person")
def get_count_files_per_person_ranking():
    """
    Retourne le classement des utilisateurs basé sur le nombre de fichiers partagés par chaque utilisateur.
    """
    data = get_data_from_db()
    stats = UserStatistics(data)
    return stats.calculate_count_files_per_person_ranking()


@app.get("/global-ranking")
def get_global_ranking():
    """
    Retourne le classement global des utilisateurs en fonction de plusieurs critères combinés (temps moyen, connexions, messages, fichiers).
    """
    data = get_data_from_db()
    stats = UserStatistics(data)
    return stats.calculate_global_ranking()
