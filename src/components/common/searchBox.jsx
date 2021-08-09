import React from "react";

function SearchBox({ value, onChange }) {
  return (
    <input
      type="text"
      name="query"
      className="form-control my-3"
      placeholder="Search.."
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)} //pass value via props
    />
  );
}

export default SearchBox;
