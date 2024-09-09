import numpy as np
from utils import convertHoursToSeconds, filterData

class UserStatistics:
    def __init__(self, data):
        self.data = data

    def calculate_average_spent_time_ranking(self):
        """
        Calcule le temps moyen passé par jour pour chaque utilisateur.
        """
        filter_per_user = self._get_filtered_data_by_column("Utilisateur")
        average_times = {}

        for user, df in filter_per_user.items():
            active_periods = []
            nb_jours = 0
            days = filterData("Date", df)
            for _, day_df in days.items():
                active_periods.append(
                    self._time_spent_per_day(np.array(day_df["Heure"].tolist())))
                nb_jours += 1

            average_times[user] = np.mean(
                active_periods) / nb_jours if nb_jours > 0 else 0

        return self._get_ranking(average_times, True)

    def calculate_max_signin_days_ranking(self):
        """
        Calcule le nombre maximum de jours consécutifs où chaque utilisateur s'est connecté.
        """
        filter_per_user = self._get_filtered_data_by_column("Utilisateur")
        consecutive_days_results = {}

        for user, df in filter_per_user.items():
            list_dates = sorted(df["Date"].unique())
            consecutive_streak = self._calculate_consecutive_days(list_dates)
            consecutive_days_results[user] = consecutive_streak

        return self._get_ranking(consecutive_days_results, True)


    def calculate_count_replied_msg_per_person_ranking(self):
        """
        Compte combien de fois chaque utilisateur a répondu à un message.
        """
        key_message = "Répondre à un message"
        return self._calculate_count_per_person_ranking(key_message, exact_match=True)


    def calculate_count_files_per_person_ranking(self):
        """
        Compte combien de fichiers chaque utilisateur a partagés.
        """
        keyword = "fileUpload"
        return self._calculate_count_per_person_ranking(keyword, exact_match=False)

    def calculate_global_ranking(self):
        """
        Calcule le classement final de chaque utilisateur en fonction de plusieurs critères.
        """
        max_signin = self.calculate_max_signin_days_ranking()
        average_spent = self.calculate_average_spent_time_ranking()
        count_messages_replied = self.calculate_count_replied_msg_per_person_ranking()
        count_files = self.calculate_count_files_per_person_ranking()

        scores = {}
        for user in max_signin.keys():
            scores[user] = (
                max_signin[user]["classement"]
                + average_spent[user]["classement"]
                + count_messages_replied[user]["classement"]
                + count_files[user]["classement"]
            )

        return self._get_ranking(scores, False)
    
    
    
    
    
    def _calculate_count_per_person_ranking(self, keyword, exact_match=True):
        """
        Compte combien de fois chaque utilisateur a un titre correspondant au mot-clé.
        """
        filter_per_user = self._get_filtered_data_by_column("Utilisateur")
        results = {}

        for user, df in filter_per_user.items():
            if exact_match:
                count = sum(
                    1 for titre in df["Titre"].tolist() if titre == keyword)
            else:
                count = sum(
                    1 for titre in df["Titre"].tolist() if keyword in titre)
            results[user] = count

        return self._get_ranking(results, True)

    def _get_filtered_data_by_column(self, column_name):
        """
        Retourne un dictionnaire contenant les données filtrées par utilisateur en fonction d'une colonne.
        """
        return filterData(column_name, self.data)

    def _get_ranking(self, data, reverse):
        """
        Calcule le classement et le score pour chaque utilisateur basé sur un type de métrique.
        """
        sorted_values = sorted(
            data.items(), key=lambda x: x[1], reverse=reverse)
        return {user: {"classement": index + 1, "score": value} for index, (user, value) in enumerate(sorted_values)}

    def _time_spent_per_day(self, time_array):
        """
        Calcule le temps actif par jour pour un utilisateur donné (en secondes).
        """
        time_in_seconds = np.array(
            [convertHoursToSeconds(t.split()[2]) for t in time_array])
        time_in_seconds.sort()

        total_time = 0
        threshold = 20 * 60  # Seuil d'activité (20 minutes)

        active_periods = np.diff(time_in_seconds)
        total_time = np.sum(active_periods[active_periods < threshold])

        return total_time

    def _calculate_consecutive_days(self, dates):
        """
        Calcule le nombre de jours consécutifs pour une liste de dates.
        """
        consecutive_streak = 0
        current_streak = 0

        for i in range(1, len(dates)):
            if (dates[i] - dates[i - 1]).days == 1:
                current_streak += 1
            else:
                current_streak = 0
            consecutive_streak = max(consecutive_streak, current_streak)

        return consecutive_streak + 1
        

