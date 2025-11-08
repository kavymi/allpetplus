import { createRootRoute, Outlet } from '@tanstack/react-router';
import React from 'react';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent(): React.ReactElement {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Get your pet licensed quickly and easily" />
        <title>Pet Licensing - All Pet Plus</title>
      </head>
      <body>
        <Outlet />
      </body>
    </html>
  );
}

