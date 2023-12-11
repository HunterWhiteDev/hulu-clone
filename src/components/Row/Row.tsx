import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import "./Row.css";
import axios from "../../axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
//@ts-ignore
import movieTrailer from "movie-trailer";

interface RowProps {
  title: string;
  fetchUrl: string;
  isLargeRow?: boolean;
  setMovie: Dispatch<SetStateAction<any>>;
  setRelated: Dispatch<SetStateAction<any>>;
  setOpenModal: Dispatch<SetStateAction<any>>;
}

function Row({
  title,
  fetchUrl,
  isLargeRow = false,
  setMovie,
  setRelated,
  setOpenModal,
}: RowProps) {
  const [movies, setMovies] = useState<any[]>([]);

  const base_url = "https://image.tmdb.org/t/p/original/";

  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);

      const results = request.data.results;

      let moviesArray: any[] = [];

      for (const movie of results) {
        const urlRes = await movieTrailer(`${movie.title || movie.name}`);

        if (urlRes) {
          const index = urlRes.lastIndexOf("v=");
          const trailerUrl = urlRes.slice(index + 2, urlRes.length);
          console.log({ urlRes, trailerUrl });
          moviesArray.push({ ...movie, trailerUrl });
        }
      }

      setMovies([...moviesArray]);
    }

    fetchData();
  }, [fetchUrl]);

  function handleLeftClick(e: React.MouseEvent<HTMLSpanElement>) {
    if (rowRef.current) rowRef.current.scrollLeft -= 1500;
  }

  function handleRightClick(e: React.MouseEvent<HTMLSpanElement>) {
    if (rowRef.current) rowRef.current.scrollLeft += 1500;
  }

  const handleClick = (movie: any) => {
    setRelated(movies);
    setMovie(movie);
    setOpenModal(true);
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__arrows">
        <span
          style={isLargeRow ? { top: "135px" } : {}}
          className="row__arrowsLeft"
          onClick={(e) => handleLeftClick(e)}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </span>
        <span
          style={isLargeRow ? { top: "135px" } : {}}
          className="row__arrowsRight"
          onClick={(e) => handleRightClick(e)}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </span>
      </div>

      <div className="row__posters" ref={rowRef}>
        {movies.map((movie) => (
          <img
            key={movie.id}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt=""
            onClick={() => handleClick(movie)}
          />
        ))}
      </div>
    </div>
  );
}

export default Row;
