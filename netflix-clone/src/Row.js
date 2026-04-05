import React, { useState, useEffect, useRef } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";


const base_url= "https://image.tmdb.org/t/p/original"

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  const rowRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);
   
  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      
      // Calculate how far to scroll (one full screen width)
      const scrollTo = direction === "left" 
        ? scrollLeft - clientWidth 
        : scrollLeft + clientWidth;
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const opts = {
    height: "500",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

const handleClick = async (movie) => {
  if (trailerUrl) {
    setTrailerUrl("");
  } else {
    try {
      const contentType = movie?.first_air_date ? "tv" : "movie";

      const response = await axios.get(
        `/${contentType}/${movie.id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
      );

      const trailer = response.data.results.find(
        (vid) =>
          vid.site === "YouTube" &&
          (vid.type === "Trailer" || vid.type === "Teaser")
      );

      if (trailer) {
        setTrailerUrl(trailer.key);
      } else {
        alert("Official trailer not found on TMDB for this title.");
      }
    } catch (error) {
      console.error("Error fetching trailer from TMDB:", error);
      alert("Could not load trailer.");
    }
  }
};

 return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__wrapper">
        <div className="row__arrow left" onClick={() => scroll("left")}>
          <span>{"<"}</span>
        </div>

        <div className="row__posters" ref={rowRef}>
          {movies.map((movie) => (
            <div key={movie.id} className="row__posterContainer" onClick={() => handleClick(movie)}>
              <img
                className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                alt={movie?.name || movie?.title}
              />
              <div className="row__posterOverlay">
                <h4 className="row__posterTitle">
                  {movie?.title || movie?.name || movie?.original_name}
                </h4>
              </div>
            </div>
          ))}
        </div>

        <div className="row__arrow right" onClick={() => scroll("right")}>
          <span>{">"}</span>
        </div>
      </div>

      {trailerUrl && (
        <div className="row__trailer">
          <YouTube videoId={trailerUrl} opts={opts} />
        </div>
      )}
    </div>
  );
}

export default Row;