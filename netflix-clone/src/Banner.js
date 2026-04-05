import React, { useState, useEffect } from 'react';
import axios from './axios';
import requests from './requests';
import './Banner.css';
import YouTube from "react-youtube";


function Banner() {
  const [movie, setMovie] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);


 
const fetchRandomMovie = async () => {
  const request = await axios.get(requests.fetchNetflixOriginals);
  setMovie(
    request.data.results[Math.floor(Math.random() * request.data.results.length)]
  );
};

useEffect(() => {
  fetchRandomMovie(); 
}, []);

useEffect(() => {
  let interval = null;
  if (!showTrailer) {
    interval = setInterval(() => {
      fetchRandomMovie();
    }, 5000);
  }
  return () => clearInterval(interval);
}, [showTrailer]); // Re-runs/clears when you play or close a trailer


 const handleClick = async (movie) => {
    if (showTrailer) {
      setShowTrailer(false);
      setTrailerUrl("");
    } else {
      try {
        const type = movie?.first_air_date ? "tv" : "movie";
        const response = await axios.get(
          `/${type}/${movie.id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
        );
        const trailer = response.data.results.find(
          (vid) => vid.site === "YouTube" && (vid.type === "Trailer" || vid.type === "Teaser")
        );
        if (trailer) {
          setTrailerUrl(trailer.key);
          setShowTrailer(true);
        } else {
          alert("Trailer not found.");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  return (
    <header className="banner"
      style={{
        backgroundSize: "cover",
        backgroundImage: showTrailer ? "none" : `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
        backgroundPosition: "center center",
        backgroundColor: "black"
      }}
    >
      {showTrailer ? (
        <div className="banner__video">
          <YouTube 
            videoId={trailerUrl} 
            opts={{ height: "100%", width: "100%", playerVars: { autoplay: 1 } }} 
            onEnd={() => setShowTrailer(false)}
          />
          <button className="banner__closeButton" onClick={() => setShowTrailer(false)}>Close X</button>
        </div>
      ) : (
        <div className="banner__contents">
          <h1 className="banner__title">{movie?.title || movie?.name || movie?.original_name}</h1>
          <div className="banner__buttons">
            <button className="banner__button" onClick={() => handleClick(movie)}>Play</button>
            <button className="banner__button">My List</button>
          </div>
          <h1 className="banner__description">{truncate(movie?.overview, 150)}</h1>
        </div>
      )}
      <div className="banner__fadeBottom" />
    </header>
  );
}

export default Banner;