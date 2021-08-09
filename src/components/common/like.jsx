import React from "react";

function Like({ liked, onClick }) {
  let classes = "fa fa-heart";
  if (!liked) classes += "-o";
  return (
    <i
      style={{ cursor: "pointer" }}
      onClick={onClick}
      className={classes}
      aria-hidden="true"
    />
  );
}

export default Like;
