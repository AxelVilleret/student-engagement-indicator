import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import TableComponent from './components/TableComponent';
import ApexChartComponent from './components/ApexChartComponent';
import BarChartComponent from './components/BarChartComponent';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

const RANKING = 'Ranking';
const SPENT_TIME_PER_DAY = 'Spent Time Per Day For All Users';
const MAX_SIGNIN_DAYS = 'Max Signin Days For All Users';
const REPLIED_MESSAGES = 'Replied messages For All Users';
const FILE_SHARED = 'File shared For All Users';

const metrics = {
  [RANKING]: {
    endpoint: '/global-ranking',
    description: "On visualise ici un score moyen d'activité de chaque utilisateur sur le forum prenant en compte 4 critères: Le nombre moyen de secondes passées sur la plateforme par jour, le nombre maximum de jours de connexion d'affilées, le nombre de messages répondus et le nombre de fichiers envoyés."
  },
  [SPENT_TIME_PER_DAY]: {
    endpoint: '/average-time-per-day',
    description: "On peut voir ici pour chaque utilisateur le temps moyen de connexion par jour en secondes."
  },
  [MAX_SIGNIN_DAYS]: {
    endpoint: '/max-consecutive-signin-days',
    description: "On peut voir ici pour chaque utilisateur le nombre maximum de jours de connexion d'affilées."
  },
  [REPLIED_MESSAGES]: {
    endpoint: '/message-replies-per-person',
    description: "On peut voir ici pour chaque utilisateur le nombre de messages répondus."
  },
  [FILE_SHARED]: {
    endpoint: '/file-uploads-per-person',
    description: "On peut voir ici pour chaque utilisateur le nombre de fichiers envoyés."
  }
};

function App() {
  const [data, setData] = useState([]);
  const [metric, setMetric] = useState(RANKING);

  // Compute scores and labels directly from data
  const scores = useMemo(() => data.map((value) => value.score), [data]);
  const labels = useMemo(() => data.map((value) => value.cle), [data]);
  const description = useMemo(() => metrics[metric].description, [metric]);

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

  const getData = useCallback((endpoint) => {
    axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}${endpoint}`)
      .then(setResponse)
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    getData(metrics[metric].endpoint);
  }, [getData, metric]);

  function selectOnclick(event) {
    const { value } = event.target;
    setMetric(value);
  }

  return (
    <div className="App flex items-center justify-center">
      <div className="flex items-center gap-3 w-9/12 border-3 p-3 m-3 bg-indigo-100">
        <div className="flex flex-col items-center w-1/3 gap-3">
          <h1>Statistiques</h1>
          <Form.Select onChange={selectOnclick}>
            <option value={RANKING}>Classement général</option>
            <option value={MAX_SIGNIN_DAYS}>Nombre maximum de jours de connexion d'affilées</option>
            <option value={REPLIED_MESSAGES}>Nombre de messages répondus</option>
            <option value={SPENT_TIME_PER_DAY}>Temps moyen de connexion par jour en secondes</option>
            <option value={FILE_SHARED}>Nombre de fichiers envoyés</option>
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
            <BarChartComponent data={scores} labels={labels} />
          </div>

          <div className="border-2 w-full flex items-center bg-white">
            <div className="grow">
              <ApexChartComponent data={scores} labels={labels} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
