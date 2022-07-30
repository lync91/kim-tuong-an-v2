import React from "react";

export default function CmndPage({ data }) {
  const { img1, img2 } = data;
  return (
    <>
      <div>
        <div>
          <img style={{width: 400}} src={img1} alt="Cmnd1" />
        </div>
      </div>
      <div>
        <img src={img2} alt="Cmnd2" />
      </div>
    </>
  );
}
