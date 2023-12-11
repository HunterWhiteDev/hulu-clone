import React, { useEffect } from "react";
import "./MyList.css";
import Nav from "../../components/Nav/Nav";
import { useSelector } from "react-redux";
import { selectUser } from "../../slices/userSlice";
import { collection, getDocs } from "firebase/firestore";
import db from "../../firebase";
import { useState } from "react";
import Modal from "../../components/Modal/Modal";
function MyList() {
  const user = useSelector(selectUser);
  const [movies, setMovies] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const base_url = "https://image.tmdb.org/t/p/original/";

  const getList = async () => {
    const listRef = collection(db, `users/${user.uid}/videoList`);
    const moviesRes = await getDocs(listRef);
    const moviesArr: any[] = [];

    moviesRes.forEach((movie) => {
      moviesArr.push(movie.data());
    });

    setMovies(moviesArr);
  };

  useEffect(() => {
    getList();
  }, []);

  const handleClick = (movie: any) => {
    setSelectedMovie(movie);
    setOpenModal(true);
  };

  return (
    <div className="myList">
      <Nav />

      <Modal
        base_url={base_url}
        openModal={openModal}
        related={movies}
        movie={selectedMovie}
        setMovie={setSelectedMovie}
        setOpenModal={setOpenModal}
        getList={getList}
      />

      <h1>My List</h1>

      <div className="myList__container">
        {movies.length < 1 ? (
          <h2>You do not have any titles added in your list.</h2>
        ) : (
          movies.map((movie) => (
            <div className="myList__movie">
              <img
                onClick={() => handleClick(movie)}
                alt="movie"
                src={`${base_url}${movie?.backdrop_path}`}
              />
              <div className="myList__movieFooter">
                <h2>{movie?.title}</h2>
                <p>{movie?.overview.slice(0, 175) + "..."}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyList;
