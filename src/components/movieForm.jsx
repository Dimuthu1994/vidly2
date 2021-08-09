import React from "react";
import Joi from "joi-browser";
import Input from "./common/input";
import SelectGenre from "./common/selectGenre";
import useForm from "./common/useForm";

import { useState, useEffect } from "react";
import { getGenres } from "../services/genreService";
import { saveMovie, getMovie } from "../services/movieService";

function MovieForm({ match, history }) {
  const dataInit = {
    title: "",
    genreId: "",
    numberInStock: "",
    dailyRentalRate: "",
  };

  const schema = {
    _id: Joi.string(),
    title: Joi.string().required().label("Title"),
    genreId: Joi.string().required().label("Genre"),
    numberInStock: Joi.number()
      .required()
      .min(0)
      .max(100)
      .label("Number in Stock"),
    dailyRentalRate: Joi.number()
      .required()
      .min(0)
      .max(10)
      .label("Daily Rental Rate"),
  };
  const [genres, setGenres] = useState([]);

  const { handleChange, handleSubmit, validate, data, errors, setData } =
    useForm({
      schema,
      dataInit,
    });

  useEffect(() => {
    async function populateGenres() {
      const { data: genresInit } = await getGenres();
      setGenres(genresInit);
    }
    async function populateMovie() {
      const movieId = match.params.id;
      if (movieId === "new") return;
      try {
        const { data: movie } = await getMovie(movieId);
        const dataStored = mapToViewModel(movie);
        setData(dataStored);
      } catch (ex) {
        if (ex.response && ex.response.status === 404)
          history.replace("/not-found");
      }
    }
    populateGenres();
    populateMovie();
  }, []);

  const mapToViewModel = (movie) => {
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
    };
  };

  const doSubmit = async () => {
    // call the server
    console.log("AAAAA");
    await saveMovie(data);
    history.push("/movies");
  };

  return (
    <div>
      <h1>Movie Form</h1>
      <form onSubmit={handleSubmit}>
        <Input
          name="title"
          value={data.title}
          label="Title"
          onChange={handleChange}
          error={errors.title}
        />

        <SelectGenre
          name="genreId"
          value={data.genreId}
          label="Genre"
          onChange={handleChange}
          options={genres}
          error={errors.genreId}
        />
        <Input
          name="numberInStock"
          value={data.numberInStock}
          label="Number In Stock"
          onChange={handleChange}
          error={errors.numberInStock}
          type="number"
        />
        <Input
          name="dailyRentalRate"
          value={data.dailyRentalRate}
          label="Rate"
          onChange={handleChange}
          error={errors.dailyRentalRate}
          type="number"
        />
        <button
          className="btn btn-primary"
          onClick={doSubmit}
          disabled={validate()}
        >
          Save
        </button>
      </form>
    </div>
  );
}

export default MovieForm;
