import React from "react";
import TableBody from "./tableBody";
import TableHeader from "./tableHeade";

function Table({ columns, sortColumn, onSort, moviesPaginate }) {
  return (
    <table className="table">
      <TableHeader columns={columns} sortColumn={sortColumn} onSort={onSort} />
      <TableBody data={moviesPaginate} columns={columns} />
    </table>
  );
}

export default Table;
