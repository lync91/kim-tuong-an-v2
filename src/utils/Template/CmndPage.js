import React from "react";

export default function CmndPage({ data }) {
  const { img1, img2 } = data;
  return (
    <>
      <div style={{display: "flex"}}>
        <div>
          <img style={{ width: 320 }} src={img1} alt="Cmnd1" />
        </div>
        <div>
          <img style={{ width: 320 }} src={img2} alt="Cmnd2" />
        </div>
      </div>
    </>
  );
}
