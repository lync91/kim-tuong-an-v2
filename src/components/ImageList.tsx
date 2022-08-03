import React from "react";

export function ImageList(props: any) {
  const { list, selected, setSelected } = props;
  return (
    <div className="img-list">
      {list.map((e: any, i: number) => {
        const { photo_link } = e;
        return (
          <img
            className={`img-item ${selected.index === i ? "selected" : ""}`}
            src={photo_link}
            alt="thumb"
            onClick={() => setSelected({ index: i, url: photo_link })}
          />
        );
      })}
    </div>
  );
}
