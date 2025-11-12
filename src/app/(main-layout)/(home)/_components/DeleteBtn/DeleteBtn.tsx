"use client";
import React from "react";

interface DeleteBtnProps {
  id: number;
}

const DeleteBtn: React.FC<DeleteBtnProps> = ({ id }) => {
  console.log(id, "id is.............");

  const deletePost = async () => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      {
        method: "delete",
      }
    );
    // const data = await res.json()
    if (res.ok) {
      console.log("deleted succesfully.......");
    }
  };
  return (
    <div>
      <button onClick={deletePost}>Delete</button>
    </div>
  );
};

export default DeleteBtn;
