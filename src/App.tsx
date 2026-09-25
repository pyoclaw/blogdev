import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NavProvider } from "./lib/navigation";
import Layout from "./components/Layout";

const Home = lazy(() => import("./pages/Home"));
const PostList = lazy(() => import("./pages/PostList"));
const PostPage = lazy(() => import("./pages/PostPage"));
const TagsIndex = lazy(() => import("./pages/TagsIndex"));
const TagPage = lazy(() => import("./pages/TagPage"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));

function normalizeBasename(base: string) {
  if (!base || base === "/") return "/";
  return `/${base.replace(/^\/+|\/+$/g, "")}`;
}

function withRouteSuspense(element: JSX.Element) {
  return (
    <Suspense
      fallback={
        <div className="wrap section-pad route-pending" role="status" aria-live="polite">
          Loading slide…
        </div>
      }
    >
      {element}
    </Suspense>
  );
}

const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        { path: "/", element: withRouteSuspense(<Home />) },
        { path: "/posts", element: withRouteSuspense(<PostList />) },
        { path: "/posts/:slug", element: withRouteSuspense(<PostPage />) },
        { path: "/tags", element: withRouteSuspense(<TagsIndex />) },
        { path: "/tags/:tag", element: withRouteSuspense(<TagPage />) },
        { path: "/about", element: withRouteSuspense(<About />) },
        { path: "*", element: withRouteSuspense(<NotFound />) },
      ],
    },
  ],
  { basename: normalizeBasename(import.meta.env.BASE_URL) },
);

export default function App() {
  return (
    <NavProvider>
      <RouterProvider router={router} />
    </NavProvider>
  );
}
