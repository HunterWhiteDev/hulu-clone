import React, { useEffect, useRef, useState } from "react";
import Banner from "../../components/Banner/Banner";
import Modal from "../../components/Modal/Modal";
import Nav from "../../components/Nav/Nav";
import requests from "../../Requests";
import Row from "../../components/Row/Row";
import "./HomeScreen.css";

function HomeScreen() {
  const base_url = "https://image.tmdb.org/t/p/original/";

  const [movie, setMovie] = useState({
    adult: false,
    backdrop_path: "/tcZ3DKwK7U3F1zTK5JWfBcmw11l.jpg",
    genre_ids: [99],
    id: 1147203,
    original_language: "en",
    original_title: "Billion Dollar Heist",
    overview:
      "Global, dynamic, and eye-opening, this is story of the most daring cyber heist of all time, the Bangladeshi Central Bank theft, tracing the origins of cyber-crime from basic credit card fraud to the wildly complex criminal organisations in existence today, supported by commentary and fascinating insight from highly regarded cyber security experts.",
    popularity: 115.552,
    poster_path: "/7QGQWVvIRwP1tLaSzQoRUZVp7HA.jpg",
    release_date: "2023-08-05",
    title: "Billion Dollar Heist",
    video: false,
    vote_average: 6,
    vote_count: 3,
  });

  const [related, setRelated] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const html = document.getElementsByTagName("html");

    if (openModal) {
      html[0].style.overflowY = "hidden";
    } else {
      html[0].style.overflowY = "scroll";
    }
  }, [openModal]);

  return (
    <div className="HomeScreen">
      <Modal
        base_url={base_url}
        openModal={openModal}
        related={related}
        movie={movie}
        setMovie={setMovie}
        setOpenModal={setOpenModal}
      />

      {/* Nav */}
      <Nav />
      <Banner
        setModalMovie={setMovie}
        setOpenModal={setOpenModal}
        setRelated={setRelated}
      />
      {/* <Row
        setOpenModal={setOpenModal}
        setMovie={setMovie}
        setRelated={setRelated}
        title="Netflix Originals"
        fetchUrl={requests.fetchNetflixOriginals}
        isLargeRow
      /> */}
      <Row
        setOpenModal={setOpenModal}
        setMovie={setMovie}
        setRelated={setRelated}
        title="Trending Now"
        fetchUrl={requests.fetchTrending}
        isLargeRow
      />
      <Row
        setOpenModal={setOpenModal}
        setMovie={setMovie}
        setRelated={setRelated}
        title="Top Rated"
        fetchUrl={requests.fetchTopRated}
      />
      <Row
        setOpenModal={setOpenModal}
        setMovie={setMovie}
        setRelated={setRelated}
        title="Action Films"
        fetchUrl={requests.fetchActionMovies}
      />
      <Row
        setOpenModal={setOpenModal}
        setMovie={setMovie}
        setRelated={setRelated}
        title="Comedies"
        fetchUrl={requests.fetchComedyMovies}
      />
      <Row
        setOpenModal={setOpenModal}
        setMovie={setMovie}
        setRelated={setRelated}
        title="Horror Movies"
        fetchUrl={requests.fetchHorrorMovies}
      />
      <Row
        setOpenModal={setOpenModal}
        setMovie={setMovie}
        setRelated={setRelated}
        title="Romance Movies"
        fetchUrl={requests.fetchRomanceMovies}
      />
      <Row
        setOpenModal={setOpenModal}
        setMovie={setMovie}
        setRelated={setRelated}
        title="Documentaries"
        fetchUrl={requests.fetchDocumentiaries}
      />
    </div>
  );
}

export default HomeScreen;
