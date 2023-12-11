import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import "./Banner.css";
import axios from "../../axios";
import requests from "../../Requests";
//@ts-ignore
import movieTrailer from "movie-trailer";
import { useHistory } from "react-router";

interface BannerProps {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  setModalMovie: Dispatch<SetStateAction<any>>;
  setRelated: Dispatch<SetStateAction<any>>;
}

function Banner({ setOpenModal, setModalMovie, setRelated }: BannerProps) {
  const history = useHistory();

  const [movie, setMovie] = useState<any | null>(null);

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchNetflixOriginals);

      let moviesArray: any[] = [];

      const results = request.data.results;

      for (const movie of results) {
        const urlRes = await movieTrailer(`${movie.name || movie.title}`);
        if (urlRes) {
          const index = urlRes.lastIndexOf("v=");
          const trailerUrl = urlRes.slice(index + 2, urlRes.length);
          moviesArray.push({ ...movie, trailerUrl });
        }
      }

      setRelated([...moviesArray]);
      setMovie(moviesArray[Math.floor(Math.random() * moviesArray.length - 1)]);
      return request;
    }
    fetchData();
  }, []);

  function truncate(string: string, n: number) {
    return string?.length > n ? string.substr(0, n - 1) + "..." : string;
  }

  const handlePlayMovie = () => {
    setModalMovie(movie);

    setOpenModal(true);
  };

  return (
    <header
      className="banner"
      style={{
        backgroundPosition: "center center",
        backgroundSize: "cover",
        backgroundImage: `url('https://image.tmdb.org/t/p/original/${movie?.backdrop_path}')`,
      }}
    >
      <div className="banner__contents">
        <h1 className="banner__title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        <div className="banner__buttons">
          <button className="banner__button" onClick={handlePlayMovie}>
            Play
          </button>
          <button
            onClick={() => history.push("/my-list")}
            className="banner__button"
          >
            My List
          </button>
        </div>
        <h1 className="banner__description">
          {truncate(movie?.overview, 150)}
        </h1>
      </div>

      <div className="banner--fadeButton" />
    </header>
  );
}

export default Banner;
