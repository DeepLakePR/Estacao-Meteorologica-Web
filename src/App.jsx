// Setup
import { useState, useEffect } from "react";
import "./App.css";

import { database } from "./services/firebase.service.js";
import { collection, getDocs } from "firebase/firestore";

import { ResponsiveLine } from "@nivo/line";

// Database
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
  {
    id: "japan",
    data: [
      {
        x: "plane",
        y: 6,
      },
      {
        x: "helicopter",
        y: 259,
      },
      {
        x: "boat",
        y: 84,
      },
      {
        x: "train",
        y: 94,
      },
      {
        x: "subway",
        y: 258,
      },
      {
        x: "bus",
        y: 214,
      },
      {
        x: "car",
        y: 237,
      },
      {
        x: "moto",
        y: 148,
      },
      {
        x: "bicycle",
        y: 274,
      },
      {
        x: "horse",
        y: 136,
      },
      {
        x: "skateboard",
        y: 101,
      },
      {
        x: "others",
        y: 275,
      },
    ],
  },
  {
    id: "france",
    data: [
      {
        x: "plane",
        y: 125,
      },
      {
        x: "helicopter",
        y: 55,
      },
      {
        x: "boat",
        y: 233,
      },
      {
        x: "train",
        y: 132,
      },
      {
        x: "subway",
        y: 60,
      },
      {
        x: "bus",
        y: 131,
      },
      {
        x: "car",
        y: 7,
      },
      {
        x: "moto",
        y: 69,
      },
      {
        x: "bicycle",
        y: 294,
      },
      {
        x: "horse",
        y: 255,
      },
      {
        x: "skateboard",
        y: 151,
      },
      {
        x: "others",
        y: 50,
      },
    ],
  },
  {
    id: "us",
    data: [
      {
        x: "plane",
        y: 5,
      },
      {
        x: "helicopter",
        y: 34,
      },
      {
        x: "boat",
        y: 200,
      },
      {
        x: "train",
        y: 251,
      },
      {
        x: "subway",
        y: 13,
      },
      {
        x: "bus",
        y: 140,
      },
      {
        x: "car",
        y: 248,
      },
      {
        x: "moto",
        y: 210,
      },
      {
        x: "bicycle",
        y: 141,
      },
      {
        x: "horse",
        y: 23,
      },
      {
        x: "skateboard",
        y: 6,
      },
      {
        x: "others",
        y: 267,
      },
    ],
  },
  {
    id: "germany",
    data: [
      {
        x: "plane",
        y: 181,
      },
      {
        x: "helicopter",
        y: 270,
      },
      {
        x: "boat",
        y: 63,
      },
      {
        x: "train",
        y: 190,
      },
      {
        x: "subway",
        y: 146,
      },
      {
        x: "bus",
        y: 61,
      },
      {
        x: "car",
        y: 27,
      },
      {
        x: "moto",
        y: 93,
      },
      {
        x: "bicycle",
        y: 76,
      },
      {
        x: "horse",
        y: 166,
      },
      {
        x: "skateboard",
        y: 209,
      },
      {
        x: "others",
        y: 156,
      },
    ],
  },
  {
    id: "norway",
    data: [
      {
        x: "plane",
        y: 2,
      },
      {
        x: "helicopter",
        y: 66,
      },
      {
        x: "boat",
        y: 171,
      },
      {
        x: "train",
        y: 297,
      },
      {
        x: "subway",
        y: 91,
      },
      {
        x: "bus",
        y: 142,
      },
      {
        x: "car",
        y: 34,
      },
      {
        x: "moto",
        y: 90,
      },
      {
        x: "bicycle",
        y: 98,
      },
      {
        x: "horse",
        y: 50,
      },
      {
        x: "skateboard",
        y: 211,
      },
      {
        x: "others",
        y: 152,
      },
    ],
  },
];

// App
function App() {
  const [announcements, setAnnouncements] = useState([]);

  async function getData() {
    const get_announcementsData = await announcementsData;

    setAnnouncements(get_announcementsData.docs);
  }

  useEffect(() => {
    getData();
  }, []);

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
          justify-content-between"
        >
          <a
            href="/"
            className="fs-3 fw-lighter text-decoration-none text-white"
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
        <section className="py-5">
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
                      <p className="card-text">{message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Weather Graphics */}
        <section className="py-5">
          <div className="container">
            <h2 className="section-title">Dados do Mês</h2>

            <div id="weatherGraph" /*height="120"*/>
              <ResponsiveLine
                data={data}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                yScale={{
                  type: "linear",
                  min: "auto",
                  max: "auto",
                  stacked: true,
                  reverse: false,
                }}
                axisBottom={{ legend: "transportation", legendOffset: 36 }}
                axisLeft={{ legend: "count", legendOffset: -40 }}
                pointSize={10}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "seriesColor" }}
                pointLabelYOffset={-12}
                enableTouchCrosshair={true}
                useMesh={true}
                legends={[
                  {
                    anchor: "bottom-right",
                    direction: "column",
                    translateX: 100,
                    itemWidth: 80,
                    itemHeight: 22,
                    symbolShape: "circle",
                  },
                ]}
              />
            </div>

            <div id="weatherData" className="mt-4 text-center fs-5"></div>
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
