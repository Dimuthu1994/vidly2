import React from "react";
import { useState, useEffect } from "react";
import { paginate } from "../utils/paginate";
import MoviesTable from "./moviesTable";
import SearchBox from "./common/searchBox";
import Pagination from "./common/pagination";
import PropTypes from "prop-types";
import ListGroup from "./common/listGroup";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import _ from "lodash";
import { getGenres } from "../services/genreService";
import { getMovies, deleteMovie } from "../services/movieService";

function Movies(props) {
  const { user } = props;
  useEffect(() => {
    async function getDatFromDB() {
      const { data } = await getGenres();
      const result = [{ _id: "", name: "All Genres" }, ...data];
      setGenres(result);
      const { data: movies } = await getMovies();
      setMovies(movies);
    }

    getDatFromDB();
  }, []);

  let [movies, setMovies] = useState([]);
  let [genres, setGenres] = useState([]);
  let [pageSize, setPageSize] = useState(4);
  let [currentPage, setCurrentPage] = useState(1);
  let [selectedGenre, setSelectedGenre] = useState(null);
  let [sortColumn, setSortColumn] = useState({ path: "title", order: "asc" });
  let [searchQuery, setSearchQuery] = useState("");

  if (movies.length === 0) return <p>There are no movies in the database</p>;

  const handleDelete = async (movie) => {
    const originalMovies = movies;
    setMovies(originalMovies.filter((m) => m._id !== movie._id));
    try {
      await deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This movie has already been deleted");
      setMovies(originalMovies);
    }
  };

  const handleLike = (movie) => {
    const moviesLike = [...movies];
    const index = moviesLike.indexOf(movie);
    moviesLike[index] = { ...movies[index] };
    moviesLike[index].liked = !moviesLike[index].liked;
    setMovies(moviesLike);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
    setSearchQuery("");
  };

  const handleSearch = (query) => {
    setSelectedGenre(null);
    setCurrentPage(1);
    setSearchQuery(query);
  };

  const handleSort = (sortColumnClone) => {
    setSortColumn(sortColumnClone);
  };

  const getPagedData = () => {
    let filteredMovies = movies;
    if (searchQuery)
      filteredMovies = movies.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filteredMovies = movies.filter((m) => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(
      filteredMovies,
      [sortColumn.path],
      [sortColumn.order]
    );
    const moviesPaginate = paginate(sorted, currentPage, pageSize);
    return { filteredMovies, moviesPaginate };
  };

  const { filteredMovies, moviesPaginate } = getPagedData();

  return (
    <div className="row">
      <div className="col-3">
        <ListGroup
          items={genres}
          onItemSelect={handleGenreSelect}
          selectedItem={selectedGenre}
        />
      </div>
      <div className="col">
        {user && (
          <Link
            to="/movies/new"
            style={{ marginBottom: 20 }}
            className="button btn btn-primary"
          >
            New Movie
          </Link>
        )}
        <p>Showing {filteredMovies.length} movies in the Database.</p>
        <SearchBox value={searchQuery} onChange={handleSearch} />
        <MoviesTable
          moviesPaginate={moviesPaginate}
          onLike={handleLike}
          onDelete={handleDelete}
          onSort={handleSort}
          sortColumn={sortColumn}
          user={user}
        />
        <Pagination
          itemsCount={filteredMovies.length}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}
// when using reusable components good practise to put propTypes
Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
};
export default Movies;
