// Setup
import { useState, useEffect } from "react";
import "./App.css";

import { database } from "./services/firebase.service.js";
import {
  collection,
  getDocs,
  doc,
  Timestamp,
  query,
  where,
  limit,
} from "firebase/firestore";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import Linkify from "linkify-react";

// Database
const previsionsCollection = collection(database, "previsions");

const announcementsCollection = collection(database, "announcements");
const announcementsData = getDocs(announcementsCollection);

// Variables
const DATE_FORMAT_CONFIG = {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
};

const data = [
  // {
  //   day: "2",
  //   "Mínima": 6,
  //   "Máxima": 13,
  //   // amt: 2210,
  // },
  // {
  //   day: "3",
  //   "Mínima": 14,
  //   "Máxima": 21,
  //   // amt: 2290,
  // },
  // {
  //   day: "4",
  //   "Mínima": 11,
  //   "Máxima": 19,
  //   // amt: 2000,
  // },
  // {
  //   day: "5",
  //   "Mínima": 8,
  //   "Máxima": 17,
  //   // amt: 2181,
  // },
  // {
  //   day: "6",
  //   "Mínima": 5,
  //   "Máxima": 13,
  //   // amt: 2500,
  // },
  // {
  //   day: "7",
  //   "Mínima": 1,
  //   "Máxima": 9,
  //   // amt: 2100,
  // },
];

(() => {
  for (let i = 1; i <= 31; i++) {
    data.push({
      day: i,
      Máxima:
        Math.floor(Math.random() * (Math.ceil(30) - Math.floor(15) + 1)) + 15,
      Mínima:
        Math.floor(Math.random() * (Math.ceil(15) - Math.floor(0) + 1)) + 0,
      // amt: 2400,
    });
  }
})();

///////////////////
// Utils Functions
function cleanAndConvertToNumber(value) {
  let cleanedValue = 0;

  if (value) cleanedValue = value.replace(/[^\d.-]/g, "");

  return parseFloat(cleanedValue);
}

///////////////////

// App
function App() {
  const [announcements, setAnnouncements] = useState([]);

  const [dateToShow, setDateToShow] = useState(new Date());
  const [noData, setNoData] = useState(false);
  const [isPreviousMonth, setIsPreviousMonth] = useState(false);

  const [monthlyAverageData, setMonthlyAverageData] = useState({
    temperaturaSeco: "N/A",
    temperaturaUmido: "N/A",

    urTabela: "N/A",

    temperaturaMin: "N/A",
    temperaturaMax: "N/A",

    precipitacao: "N/A",
    ceuWeWe: "N/A",
    solo0900: "N/A",
    pressao: "N/A",

    velocidadeKm: "N/A",
  });

  async function setMonthDataToShow() {
    setDateToShow((previousDate) => {
      const updatedDate = new Date(previousDate);

      if (updatedDate.getDate() <= 7) {
        // If Month Start, Set Previous Month Data To Show
        setIsPreviousMonth(true);
        updatedDate.setMonth(updatedDate.getMonth() - 1);
      }

      updatedDate.setDate(1);

      return updatedDate;
    });
  }

  async function getWeatherData() {
    const get_announcementsData = await announcementsData;

    setAnnouncements(get_announcementsData.docs);

    const startDate = new Date(dateToShow);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(dateToShow);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);
    endDate.setHours(23, 59, 59, 999);

    let querySnapshot = await getDocs(
      query(
        previsionsCollection,
        where("createdAt", ">=", Timestamp.fromDate(startDate)),
        where("createdAt", "<=", Timestamp.fromDate(endDate)),
        limit(1)
      )
    );
    
    if (querySnapshot.empty) {
      setNoData(true);
      return;
    }

    let sumAverage = {
      temperaturaSeco: 0,
      temperaturaUmido: 0,

      urTabela: 0,

      temperaturaMin: 0,
      temperaturaMax: 0,

      precipitacao: 0,
      ceuWeWe: 0,
      solo0900: 0,
      pressao: 0,

      velocidadeKm: 0,
    };

    const previsionAnotationsRef = collection(doc(previsionsCollection, querySnapshot.docs[0].id), "previsionAnotations");
    const previsionAnotations = await getDocs(previsionAnotationsRef);

    previsionAnotations.forEach((anotationDoc) => {

      // Set Average Variable
      Object.keys(sumAverage).forEach((value) => {
        sumAverage[value] += cleanAndConvertToNumber(
          anotationDoc.data()[value]
        );
      });

    });

    const anotationsLength = previsionAnotations.docs.length;

    // Calc Average
    Object.entries(sumAverage).map((keyValue) => {
      let sumResult = Math.round(
        isNaN(keyValue[1] / anotationsLength)
          ? 0
          : keyValue[1] / anotationsLength
      );

      setMonthlyAverageData((old) => ({
        ...old,
        [keyValue[0]]: sumResult,
      }));
    });
  }

  useEffect(() => {
    setMonthDataToShow();
  }, []);

  useEffect(() => {
    getWeatherData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateToShow]);

  return (
    <>
      <div className="App main container">
        {/* Header */}
        <header
          className="
          container
          py-4
          d-flex
          flex-wrap
          align-items-center
          justify-content-center
          justify-content-sm-between
          text-center"
        >
          <a
            href="/"
            className="fs-3 fw-lighter text-decoration-none text-white mx-3"
          >
            Projeto <strong className="fw-bold">EMEDE</strong>
          </a>

          <a
            href="https://api.whatsapp.com/send/?phone=%2B5541996954380&text=Ol%C3%A1,%20gostaria%20de%20saber%20mais%20sobre%20o%20Projeto%20EMEDE...&type=phone_number&app_absent=0"
            className="fs-4 fw-lighter text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Conheça Mais Sobre o Projeto
          </a>
        </header>

        {/* Banner */}
        <section className="main-section">
          <div className="position-absolute bg-overlay">
            <img src="/banner-background.jpeg" />

            <div className="overlay"></div>
          </div>

          <div className="container text-white text-center py-5">
            <h1 className="display-3">Estação Meteorológica</h1>

            <p className="lead">Colégio Estadual Professor Júlio Szymanski</p>
          </div>
        </section>

        {/* Announcements */}
        <section className="announcements py-5">
          <div className="container">
            <h2 className="section-title">Comunicados</h2>

            <div
              id="announcements"
              className="justify-content-center row gap-2"
            >
              {announcements.map((announcement) => {
                const { author, message, date } = announcement.data();

                return (
                  <div className="card col-md-5" key={announcement.id}>
                    <div className="card-body">
                      <h5 className="card-title">{author}</h5>
                      <h6 className="card-subtitle mb-2 text-body-secondary">
                        {date
                          .toDate()
                          .toLocaleString("pt-BR", DATE_FORMAT_CONFIG)}
                      </h6>
                      <p className="card-text">
                        <Linkify options={{ target: "_blank" }}>
                          {message}
                        </Linkify>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Weather Graphics */}
        <section className="weather py-5">
          <div className="container text-center">
            <h2 className="section-title">
              Dados do Mês {!isPreviousMonth ? "Atual" : "Passado"}
            </h2>

            {isPreviousMonth && (
              <p className="text-secondary">
                Por ser o início do mês (Dia {new Date().getDate()}), ainda não
                existem dados o suficiente para mostrar uma prévia do clima do
                mês atual, por isso será exibido os dados do mês passado até que
                sejam coletados dados o suficiente do mês atual.
              </p>
            )}

            {noData && (
              <p className="text-secondary">
                😕 Oopss!?!
                <br />
                Não foi encontrado nenhum dado meteorológico que possa ser
                mostrado no momento atual.
              </p>
            )}

            {!noData && (
              <>
                <div id="weatherGraph">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      width={500}
                      height={300}
                      data={data}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="5 5" />
                      <XAxis dataKey="day" />
                      <YAxis
                        tickFormatter={(value) => value + " ºC"}
                        tickCount={4}
                      />
                      <Tooltip labelFormatter={(value) => "Dia " + value} formatter={(value) => value + "ºC"} />
                      <Legend formatter={(value) => "Temperatura " + value} />
                      <Line
                        type="monotone"
                        dataKey="Máxima"
                        stroke="#e8591c"
                        activeDot={{ r: 7 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Mínima"
                        stroke="#89b3e0"
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div
                  id="weatherData"
                  className="prevision-monthly-average d-flex flex-wrap mt-4 text-center"
                >
                  <p className="prevision-monthly-average-title col-12">
                    Médias Mensais:
                  </p>

                  <p className="prevision-monthly-average-text col-md-6">
                    Temperatura Seco:
                    <span className="prevision-monthly-average-text-bold">
                      {monthlyAverageData.temperaturaSeco}ºC
                    </span>
                  </p>
                  <p className="prevision-monthly-average-text col-md-6">
                    Temperatura Úmido:
                    <span className="prevision-monthly-average-text-bold">
                      {monthlyAverageData.temperaturaUmido}ºC
                    </span>
                  </p>

                  <p className="prevision-monthly-average-text col-md-12">
                    UR:
                    <span className="prevision-monthly-average-text-bold">
                      {monthlyAverageData.urTabela}
                    </span>
                  </p>

                  <p className="prevision-monthly-average-text col-md-6">
                    Temperatura Mínima:
                    <span className="prevision-monthly-average-text-bold">
                      {monthlyAverageData.temperaturaMin}ºC
                    </span>
                  </p>
                  <p className="prevision-monthly-average-text col-md-6">
                    Temperatura Máxima:
                    <span className="prevision-monthly-average-text-bold">
                      {monthlyAverageData.temperaturaMax}ºC
                    </span>
                  </p>

                  <p className="prevision-monthly-average-text col-md-6">
                    Precipitação:
                    <span className="prevision-monthly-average-text-bold">
                      {monthlyAverageData.precipitacao}mm
                    </span>
                  </p>

                  <p className="prevision-monthly-average-text col-md-6">
                    Ceu WeWe:
                    <span className="prevision-monthly-average-text-bold">
                      {monthlyAverageData.ceuWeWe}
                    </span>
                  </p>

                  <p className="prevision-monthly-average-text col-md-6">
                    Solo 0900:
                    <span className="prevision-monthly-average-text-bold">
                      {monthlyAverageData.solo0900}
                    </span>
                  </p>

                  <p className="prevision-monthly-average-text col-md-6">
                    Pressão:
                    <span className="prevision-monthly-average-text-bold">
                      {monthlyAverageData.pressao}hPa
                    </span>
                  </p>

                  <p className="prevision-monthly-average-text col-md-12">
                    Velocidade Vento Km/h:
                    <span className="prevision-monthly-average-text-bold">
                      {monthlyAverageData.velocidadeKm}Km/h
                    </span>
                  </p>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer
          className="
        text-center
        d-flex flex-column align-items-center justify-content-center"
        >
          <p className="text-body-secondary mb-2">
            © 2025 Projeto EMEDE. Todos os direitos reservados.
          </p>

          <p className="text-body-secondary">
            © Site desenvolvido por{" "}
            <a
              href="https://guifm.dev/"
              className="fw-bold text-dark"
              target="_blank"
              rel="noopener noreferrer"
            >
              Gui FM
            </a>
            .
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;
