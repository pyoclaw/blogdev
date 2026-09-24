import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NavProvider } from "./lib/navigation";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import PostList from "./pages/PostList";
import PostPage from "./pages/PostPage";
import TagsIndex from "./pages/TagsIndex";
import TagPage from "./pages/TagPage";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/posts", element: <PostList /> },
      { path: "/posts/:slug", element: <PostPage /> },
      { path: "/tags", element: <TagsIndex /> },
      { path: "/tags/:tag", element: <TagPage /> },
      { path: "/about", element: <About /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return (
    <NavProvider>
      <RouterProvider router={router} />
    </NavProvider>
  );
}
