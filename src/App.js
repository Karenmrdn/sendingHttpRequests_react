import React, { useState, useCallback, useEffect } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesJHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://sendinghttprequests-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) {
        throw new Error(`Error ${response.status} occurred! Custom error`);
      }

      const data = await response.json();

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesJHandler();
  }, [fetchMoviesJHandler]);

  const addMovieHandler = async (movie) => {
    const response = await fetch(
      "https://sendinghttprequests-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    console.log(data);
  };

  let content = <h2>Found no movies</h2>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  } else {
    content = <h2>Found no movies</h2>;
  }
  if (error) {
    content = <h2 style={{ color: "red" }}>{error}</h2>;
  }
  if (isLoading) {
    content = <h2>Loading...</h2>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesJHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
