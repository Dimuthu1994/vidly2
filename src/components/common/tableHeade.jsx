import React from "react";

function TableHeader({ sortColumn, onSort, columns }) {
  const raiseSort = (path) => {
    const sortColumnClone = { ...sortColumn };
    if (sortColumnClone.path === path)
      sortColumnClone.order = sortColumnClone.order === "asc" ? "desc" : "asc";
    // first it check the order- if asc make to desc if desc make to asc
    else {
      sortColumnClone.path = path;
      sortColumnClone.order = "asc";
    }
    onSort(() => sortColumnClone);
  };

  const renderSortIcon = (column) => {
    if (column.path !== sortColumn.path) return null;
    if (sortColumn.order === "asc") return <i className="fa fa-sort-asc"></i>;
    return <i className="fa fa-sort-desc"></i>;
  };
  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th
            className="clickable"
            key={column.path || column.key}
            onClick={() => raiseSort(column.path)}
          >
            {column.label} {renderSortIcon(column)}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default TableHeader;
