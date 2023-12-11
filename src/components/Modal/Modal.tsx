import React, { Dispatch, SetStateAction } from "react";
import "./Modal.css";
import YouTube from "react-youtube";
import { useEffect } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { selectUser } from "../../slices/userSlice";
import { useState } from "react";
import db from "../../firebase";
import toast from "react-hot-toast";

interface ModalProps {
  openModal: boolean;
  movie: any;
  related: any[];
  setMovie: Dispatch<SetStateAction<any>>;
  base_url: string;
  setOpenModal: Dispatch<SetStateAction<any>>;
  getList?: Function | null;
}

function Modal({
  openModal,
  movie,
  related,
  setMovie,
  base_url,
  setOpenModal,
  getList = null,
}: ModalProps) {
  const user = useSelector(selectUser);
  //State for if the current movie in the modal is in the users list
  const [inList, setInList] = useState<boolean>(false);
  const [listDocId, setListDocId] = useState<boolean | string>("");

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      setOpenModal(false);
    }
  };

  useEffect(() => {
    const getMovieFromList = async () => {
      const plansRef = collection(db, `users/${user.uid}/videoList`);
      const q = query(plansRef, where("id", "==", movie?.id));
      const results = await getDocs(q);
      results.docs.forEach((doc) => {
        setListDocId(doc.id);
        setInList(true);
      });
    };
    getMovieFromList();
  }, [movie]);

  const addToList = async () => {
    try {
      const listRef = collection(db, `users/${user.uid}/videoList`);
      const doc = await addDoc(listRef, movie);
      setInList(true);
      setListDocId(doc.id);
      toast.success(`${movie.title} has been added to your list.`, {
        style: { backgroundColor: "black", color: "white" },
      });
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  const removeFromList = async () => {
    try {
      const docRef = doc(db, `users/${user.uid}/videoList/${listDocId}`);
      const docRes = await deleteDoc(docRef);
      setInList(false);
      setListDocId("");
      toast.success(`${movie.title} has been removed from your list.`, {
        style: { backgroundColor: "black", color: "white" },
      });
      if (getList) getList();
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (!openModal) {
      setInList(false);
      setListDocId(false);
    }
  }, [openModal]);

  return openModal ? (
    <div className="row__modalWrapper" onClick={handleClose}>
      <div className="row__modal">
        <YouTube
          opts={{
            playerVars: {
              autoplay: 1,
            },
          }}
          videoId={movie.trailerUrl}
          className="row__modalTrailer"
        />

        <div className="row__modalBannerActions">
          <h2>{movie.name || movie.title}</h2>
          <div className="modal__ModalTopBtnContainer">
            {inList ? (
              <button className="modal__addToList" onClick={removeFromList}>
                X Remove From List
              </button>
            ) : (
              <button className="modal__addToList" onClick={addToList}>
                + Add To My List
              </button>
            )}
          </div>
        </div>

        <div className="row__modalBottom">
          <p>{movie.overview}</p>
          {getList ? (
            <h3>
              {related.length > 1 ? (
                "My List"
              ) : (
                <span style={{ color: "gray" }}>
                  No other movies found in your list
                </span>
              )}
            </h3>
          ) : (
            <h3>Related Movies</h3>
          )}

          <div className="modal__relatedMoviesWrapper">
            {related.map(
              (item) =>
                item.id !== movie.id && (
                  <div
                    onClick={() => setMovie(item)}
                    className="modal__relatedMovie"
                    key={item.id}
                  >
                    <img src={base_url + item.backdrop_path} alt={item.name} />
                    <div className="modal__relatedMovieDesc">
                      <h3>{item.name || item.title}</h3>
                      <p>
                        {item.overview.slice(0, 150)}
                        {item.overview.length > 250 && "..."}
                      </p>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

export default Modal;
