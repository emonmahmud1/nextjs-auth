'use client';

import React, { Suspense } from "react";
import Loading from "@/components/Loading/Loading";
import ShowPost from "./_components/ShowPost/ShowPost";
import ShowPostClient from "./_components/ShowPostClient/ShowPostClient";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <>
      {/* Authentication Status Display */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            {isAuthenticated ? (
              <>
                <h2 className="text-xl font-semibold text-gray-800">
                  Welcome, {user?.name}! 👋
                </h2>
                <p className="text-sm text-gray-600">Email: {user?.email}</p>
              </>
            ) : (
              <h2 className="text-xl font-semibold text-gray-800">
                Not logged in
              </h2>
            )}
          </div>
          {isAuthenticated && (
            <Button onClick={logout} variant="destructive">
              Logout
            </Button>
          )}
        </div>
      </div>

      <h1 className="mb-4 text-center text-2xl font-semibold">
        The post data is here
      </h1>
      <Suspense
        fallback={
          <div className="flex justify-center">
            <Loading />
          </div>
        }
      >
        <ShowPost />
      </Suspense>
      <h1 className="mt-10 p-3 text-2xl font-semibold text-center text-red-200">
        use client show post
      </h1>
    </>
  );
};

export default HomePage;
