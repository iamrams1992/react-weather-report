// Library
import React, { useState, useEffect, useReducer } from "react";
import Skycons from "react-skycons";
import axios from "axios";
// Style
import "./App.css";
// Components

const App = () => {
  // STATE
  // --- flag
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchShowing, setIsSearchShowing] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    id: "",
    name: "",
    lat: "",
    long: "",
  });
  // --- data
  const [resultData, setResultData] = useState("");
  const [hasError, setHasError] = useState("");
  // ---- REDUCER for Multiple Input
  const [searchInput, setSearchInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      lat: "",
      long: "",
    }
  );
  // VARIABLE
  let popularList = [
    {
      id: "new_york",
      name: "New York",
      lat: 40.73061,
      long: -73.935242,
    },
    {
      id: "london",
      name: "London",
      lat: 51.509865,
      long: -0.118092,
    },
    {
      id: "paris",
      name: "Paris",
      lat: 48.864716,
      long: 2.349014,
    },
    {
      id: "tokyo",
      name: "Tokyo",
      lat: 35.652832,
      long: 139.839478,
    },
    {
      id: "seoul",
      name: "Seoul",
      lat: 37.5326,
      long: 127.024612,
    },
    {
      id: "bangkok",
      name: "Bangkok",
      lat: 13.736717,
      long: 100.523186,
    },
  ];

  // FUNCTION
  // --- API
  async function getDataFromAPI(lat, long) {
    setIsLoading(true);

    const response = await axios
      .get(`/forecast/c21bbb47d7ddd92cb3412075a8148b07/${lat},${long}`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
      .catch((error) => {
        console.log(error);
        setHasError(error.response.data.error);
      });

    if (response) {
      let mutateData = {
        time: convertTimestampToDate(response.data.currently.time, "full"),
        icon: response.data.currently.icon.toUpperCase().split("-").join("_"),
        summary: response.data.currently.summary,
        temperature: response.data.currently.temperature.toFixed(0),
        dewPoint: response.data.currently.dewPoint,
        humidity: response.data.currently.humidity,
        windSpeed: response.data.currently.windSpeed,
        daily: response.data.daily.data.map((thing) => {
          return (thing = {
            day: convertTimestampToDate(thing.time, "day"),
            icon: thing.icon.toUpperCase().split("-").join("_"),
            temperatureMax: thing.temperatureMax.toFixed(0),
            temperatureMin: thing.temperatureMin.toFixed(0),
          });
        }),
      };

      setResultData(mutateData);
      setIsLoading(false);
    } else {
      setResultData("");
      setIsLoading(false);
    }
  }
  // --- Select Location
  async function selectLocation(locate) {
    setSelectedLocation(locate);
    await getDataFromAPI(locate.lat, locate.long);
  }
  // --- Searchbar
  function openSearchbar() {
    setIsSearchShowing(true);
  }
  function closeSearchbar() {
    setSearchInput({
      lat: "",
      long: "",
    });
    setIsSearchShowing(false);
  }
  function handleInput(evt) {
    const name = evt.target.name;
    const newValue =
      evt.target.value !== "" ? parseFloat(evt.target.value) : "";

    setSearchInput({ [name]: newValue });
  }
  function handleSearch() {
    if (searchInput.lat !== "" && searchInput.long !== "") {
      const locate = {
        id: "",
        name: "Timezone",
        lat: searchInput.lat,
        long: searchInput.long,
      };

      selectLocation(locate);
      closeSearchbar();
    } else {
      alert("Please, fill search input.");
    }
  }
  // --- Utility Function
  function convertTimestampToDate(timestamp, mode) {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const date = new Date(timestamp * 1000);
    const dateString = `${dayNames[date.getDay()]}, ${date.getDate()} ${
      monthNames[date.getMonth()]
    } ${date.getFullYear()}. ${date.toLocaleString().split(" ")[1]} ${
      date.toLocaleString().split(" ")[2]
    }.`;

    if (mode === "full") {
      return dateString;
    } else if (mode === "day") {
      return dayNames[date.getDay()];
    }
  }

  // CONDITION REDERING
  // --- NAV : Popular City
  let navList = popularList.map((locate, index) => {
    return (
      <li
        className="pop--list"
        key={index}
        onClick={() => selectLocation(locate)}
      >
        {locate.name}
      </li>
    );
  });
  // --- NAV : Search Bar
  let SearchBar;
  if (isSearchShowing) {
    SearchBar = (
      <div className="wrapper">
        <div className="search__form">
          <label>
            <strong>Find Location</strong> &nbsp; &nbsp;
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="8"
              viewBox="0 0 512 512"
            >
              <title>ionicons-v5-b</title>
              <polygon points="144 448 368 256 144 64 144 448" />
            </svg>
            &nbsp; &nbsp;
          </label>
          <input
            type="number"
            className="search__inpt--lat"
            id="latitude"
            placeholder="Latitue"
            name="lat"
            value={searchInput.lat}
            onChange={handleInput}
          />
          <label> , </label>
          <input
            type="number"
            className="search__inpt--long"
            id="longtitude"
            placeholder="Longtitue"
            name="long"
            value={searchInput.long}
            onChange={handleInput}
          />
          <button className="search__btn--find" onClick={() => handleSearch()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 512 512"
            >
              <path
                d="M221.09,64A157.09,157.09,0,1,0,378.18,221.09,157.1,157.1,0,0,0,221.09,64Z"
                style={{
                  fill: "none",
                  stroke: "#000",
                  strokeMiterlimit: "10",
                  strokeWidth: "32px",
                }}
              />
              <line
                x1="338.29"
                y1="338.29"
                x2="448"
                y2="448"
                style={{
                  fill: "none",
                  stroke: "#000",
                  strokeLinecap: "round",
                  strokeMiterlimit: "10",
                  strokeWidth: "32px",
                }}
              />
            </svg>
          </button>
          <button className="search__btn--close" onClick={closeSearchbar}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 512 512"
            >
              <line
                x1="368"
                y1="368"
                x2="144"
                y2="144"
                style={{
                  fill: "none",
                  stroke: "#000",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "32px",
                }}
              />
              <line
                x1="368"
                y1="144"
                x2="144"
                y2="368"
                style={{
                  fill: "none",
                  stroke: "#000",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "32px",
                }}
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }
  // --- Daily List
  let dailyList;
  if (resultData.daily !== undefined) {
    dailyList = resultData.daily.map((thing, index) => {
      return (
        <div className="daily--list" key={index}>
          <div className="list--day">{thing.day}</div>
          <div className="list--icon">
            <Skycons
              color="white"
              type={thing.icon}
              animate={true}
              size={50}
              resizeClear={true}
            />
          </div>
          <div className="list--temperature">
            {thing.temperatureMax} °F | {thing.temperatureMin} °F
          </div>
        </div>
      );
    });
  }
  // --- MAIN CONTENT
  let ContentRender;
  if (!isLoading && resultData !== "") {
    ContentRender = (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div className="result">
          <div className="result__inside">
            <div className="result--time">
              Current Date &nbsp;
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="8"
                viewBox="0 0 512 512"
                fill="currentColor"
              >
                <polygon points="144 448 368 256 144 64 144 448" />
              </svg>{" "}
              &nbsp;
              <span className="current--time">{resultData.time}</span>
            </div>

            <div className="result__currently">
              <div className="current--icon">
                <Skycons
                  color="white"
                  type={resultData.icon}
                  animate={true}
                  size={100}
                  resizeClear={true}
                />
              </div>

              <div className="current--temp">
                <div className="temp--sum">{resultData.summary}</div>
                <span className="temp--num">{resultData.temperature}</span>
                <span>
                  <div className="btn--degree">°F</div>
                </span>
              </div>

              <div className="current--info">
                <ul>
                  <li className="info--dew">
                    Dew Point : {resultData.dewPoint}
                  </li>
                  <li className="info--humi">
                    Humidity : {resultData.humidity}%
                  </li>
                  <li className="info--wind">
                    Wind Speed : {resultData.windSpeed} / hour
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="daily">
          <div className="daily__inside">
            {/* List */}
            {dailyList}
          </div>
        </div>
      </div>
    );
  } else if (!isLoading && resultData === "") {
    ContentRender = (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#ffffff",
          fontSize: "3rem",
        }}
      >
        <p>{hasError !== "" ? hasError : "Please, select some place.."}</p>
      </div>
    );
  } else if (isLoading) {
    ContentRender = (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={process.env.PUBLIC_URL + "/assets/img/svg/loading.svg"}
          alt="loading"
          width="50"
        />
      </div>
    );
  }

  // LIFECYCLE
  useEffect(() => {
    // console.log("DATA CHANING...");
  }, [resultData]);

  return (
    <div className="App">
      <section className="weather-report">
        <div className="container">
          <header className="header">
            <ul className="search__pop">
              <strong>
                Popular &nbsp;
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="8"
                  viewBox="0 0 512 512"
                  fill="currentColor"
                >
                  <polygon points="144 448 368 256 144 64 144 448" />
                </svg>
              </strong>
              {navList}
              <li>
                <div className="search__btn" onClick={openSearchbar}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 512 512"
                  >
                    <path
                      d="M221.09,64A157.09,157.09,0,1,0,378.18,221.09,157.1,157.1,0,0,0,221.09,64Z"
                      style={{
                        fill: "none",
                        stroke: "#000",
                        strokeMiterlimit: "10",
                        strokeWidth: "32px",
                      }}
                    />
                    <line
                      x1="338.29"
                      y1="338.29"
                      x2="448"
                      y2="448"
                      style={{
                        fill: "none",
                        stroke: "#000",
                        strokeLinecap: "round",
                        strokeMiterlimit: "10",
                        strokeWidth: "32px",
                      }}
                    />
                  </svg>
                </div>
              </li>
            </ul>

            {SearchBar}
          </header>

          <aside className="aside">
            <div
              className="aside__inside"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${`/assets/img/jpg/${
                  selectedLocation.id !== "" ? selectedLocation.id : "default"
                }.jpg`})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="aside--timezone">
                {selectedLocation.name !== ""
                  ? selectedLocation.name
                  : "Location"}
              </div>
              <div className="aside--latitude">
                Latitude :{" "}
                {selectedLocation.lat !== ""
                  ? selectedLocation.lat
                  : "----------------"}
              </div>
              <div className="aside--longtitude">
                Longtitue :{" "}
                {selectedLocation.long !== ""
                  ? selectedLocation.long
                  : "----------------"}
              </div>
            </div>
          </aside>

          {ContentRender}
        </div>
        <div className="copyright">
          <p>
            {" "}
            This is API from &nbsp;
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://darksky.net/dev"
              alt="DarkSky API"
            >
              <strong>DarkSky.net</strong>
            </a>{" "}
            |{" "}
            <span>
              Created By{" "}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://github.com/iamrams1992"
              >
                <strong>RAMS</strong>
              </a>
            </span>
          </p>
        </div>
      </section>
    </div>
  );
};

export default App;
