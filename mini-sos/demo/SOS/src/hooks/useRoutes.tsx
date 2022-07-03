import React from 'react';
import { Link } from 'react-router-dom';

export const useRoutes = () => {
 // return current route and all routes
  return [
    '/demo',
    [
      {
        path: '/demo',
        element: <Link to='demo2'>Demo</Link>,
      },
      {
        path: '/demo2',
        element: <Link to='demo'>Demo 2</Link>,
      },
    ]
  ]
}
