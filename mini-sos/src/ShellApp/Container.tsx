import React from "react";
import { useRoutes } from "./hooks";

export const Container = (props) => {
  const [current, routes] = useRoutes();
  console.log(current, routes);

  // 1. caching routes
  // 2. rendering current route
  return routes.map((route) => {
    if (route.path === current) {
      return <div key={route.path}>{route.element}</div>;
    } else {
      return null;
    }
  });
};
