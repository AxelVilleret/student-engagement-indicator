import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import TableComponent from './components/TableComponent';
import ApexChartComponent from './components/ApexChartComponent';
import BarChartComponent from './components/BarChartComponent';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

const descriptions = ["On visualise ici un score moyen d'activité de chaque utilisateur sur le forum prenant en compte 4 critères: Le nombre moyen de secondes passées sur la plateforme par jour, le nombre maximum de jours de connexion d'affilées, le nombre de messages répondus et le nombre de fichiers envoyés.",
  "On peut voir ici pour chaque utilisateur le temps moyen de connexion par jour en secondes.",
  "On peut voir ici pour chaque utilisateur le nombre maximum de jours de connexion d'affilées.",
  "On peut voir ici pour chaque utilisateur le nombre de messages répondus.",
  "On peut voir ici pour chaque utilisateur le nombre de fichiers envoyés."
]

function App() {
  const [data, setData] = useState([]);
  const [description, setDescription] = useState(descriptions[0]);

  // Compute scores and labels directly from data
  const scores = useMemo(() => data.map((value) => value.score), [data]);
  const labels = useMemo(() => data.map((value) => value.cle), [data]);

  function setResponse(response) {
    console.log(response.data);
    const datas = Object.entries(response.data)
      .map(([cle, valeur]) => ({
      cle, ...valeur,
    }))
      .sort((a, b) => a.classement - b.classement)
      .slice(0, 10);
    setData(datas);
  }

  function fetchAPI(endpoint) {
    axios.get(`http://127.0.0.1:8000/${endpoint}`).then(setResponse);
  }

  useEffect(() => {
    fetchAPI('ranking');
  }, []);

  function selectOnclick(event) {
    const { value } = event.target;
    const endpointMap = {
      'Ranking': 'ranking',
      'Spent Time Per Day For All Users': 'spentTimePerDay',
      'Max Signin Days For All Users': 'maxSigninDays',
      'Replied messages For All Users': 'repliedMessages',
      'File shared Per Personn': 'filePerPerson',
    };
    const descriptionMap = {
      'Ranking': descriptions[0],
      'Spent Time Per Day For All Users': descriptions[1],
      'Max Signin Days For All Users': descriptions[2],
      'Replied messages For All Users': descriptions[3],
      'File shared Per Personn': descriptions[4],
    };

    fetchAPI(endpointMap[value]);
    setDescription(descriptionMap[value]);
  }

  return (
    <div className="App flex items-center justify-center">
      <div className="flex items-center gap-3 w-9/12 border-3 p-3 m-3 bg-indigo-100">
        <div className="flex flex-col items-center w-1/3 gap-3">
          <h1>Statistiques</h1>
          <Form.Select
            onChange={selectOnclick}
          >
            <option value="Ranking">Classement général</option>
            <option value="Max Signin Days For All Users">Nombre maximum de jours de connexion d'affilées</option>
            <option value="Replied messages For All Users">Nombre de messages répondus</option>
            <option value="Spent Time Per Day For All Users">Temps moyen de connexion par jour en secondes</option>
            <option value="File shared Per Personn">Nombre de fichiers envoyés</option>
          </Form.Select>

          <div className="border-2 w-full bg-white text-left p-2">
            <p>{description}</p>
          </div>

          <div className="border-2 w-full flex items-center bg-white">
            <TableComponent data={data} />
          </div>
        </div>

        <div className="flex flex-col items-center w-2/3 gap-3">
          <div className="border-2 w-full flex items-center bg-white">
            <BarChartComponent datas={scores} labels={labels} />
          </div>

          <div className="border-2 w-full flex items-center bg-white">
            <div className="grow">
              <ApexChartComponent datas={scores} labels={labels} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
