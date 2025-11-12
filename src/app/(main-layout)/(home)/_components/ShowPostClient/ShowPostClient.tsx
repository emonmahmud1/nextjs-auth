"use client";
import React, { useEffect, useState } from "react";

const ShowPostClient = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      const data = await res.json();
      setData(data);
    };
    fetchData();
  }, []);
  return (
    <div>
      {data.map((post: any) => (
        <p key={post.id} className="border mb-3 bg-green-200 p-4 rounded-md">
          {post.title}
        </p>
      ))}
    </div>
  );
};

export default ShowPostClient;
