import React from "react";
import DeleteBtn from "../DeleteBtn/DeleteBtn";

export interface postinterface {
  body: string;
  title: string;
  userId: number;
  id: number;
}

const ShowPost = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    cache: "no-store",
  });
  const data = await res.json();
  //   console.log(data);
  return (
    <>
      <div>
        {data.map((post: postinterface) => (
          <div key={post.id} className="border p-3 rounded-2xl mb-4 bg-gray-50">
            <p>{post.title}</p> <DeleteBtn id={post.id} />
          </div>
        ))}
      </div>
    </>
  );
};

export default ShowPost;
