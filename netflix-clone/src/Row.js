import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";


const base_url= "https://image.tmdb.org/t/p/original"

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

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
      // Determine if it's a TV show or Movie to use the correct API path
      const isTV = movie?.first_air_date ? "tv" : "movie";
      
      // Fetch video data from TMDB using the movie/show ID
      const response = await axios.get(
        `${isTV}/${movie.id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
      );

      // Find a YouTube video that is a "Trailer"
      const trailer = response.data.results.find(
        (vid) => vid.site === "YouTube" && (vid.type === "Trailer" || vid.type === "Teaser")
      );

      if (trailer) {
        setTrailerUrl(trailer.key); // The 'key' is the YouTube ID (e.g., 'ndlPuyH279Y')
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
      <div className="row__posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
            alt={movie.name}
          />
        ))}
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