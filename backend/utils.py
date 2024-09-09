def convertHoursToSeconds(heure: str) -> int:
    """
    Convertit une heure au format 'hh:mm:ss' en secondes.
    """
    h, m, s = map(int, heure.split(':'))
    return h * 3600 + m * 60 + s


def filterData(column: str, df):
    """
    Filtre un DataFrame en fonction d'une colonne spécifique et retourne un dictionnaire
    avec des sous-DataFrames.
    """
    unique_values = df[column].unique()
    return {value: df[df[column] == value] for value in unique_values}


