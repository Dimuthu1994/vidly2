import React from "react";
import { Link } from "react-router-dom";
import Like from "./common/like";
import Table from "./common/table";
import auth from "../services/authService";

function MoviesTable({ moviesPaginate, onLike, onDelete, onSort, sortColumn }) {
  let columns = [
    {
      path: "title",
      label: "Title",
      content: (movie) => (
        <Link to={`/movies/${movie._id}`}>{movie.title}</Link>
      ),
    },
    { path: "genre.name", label: "Genre" },
    { path: "numberInStock", label: "Stock" },
    { path: "dailyRentalRate", label: "Rate" },
    {
      key: "like",
      content: (movie) => (
        <Like liked={movie.liked} onClick={() => onLike(movie)} />
      ),
    },
  ];

  const user = auth.getCurrentUser();
  if (user && user.isAdmin)
    columns.push({
      key: "Delete",
      content: (movie) => (
        <button
          onClick={() => onDelete(movie)}
          className="btn btn-danger btn-sm"
        >
          Delete
        </button>
      ),
    });

  return (
    <Table
      columns={columns}
      sortColumn={sortColumn}
      onSort={onSort}
      moviesPaginate={moviesPaginate}
    />
  );
}

export default MoviesTable;
