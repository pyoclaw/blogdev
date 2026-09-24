import NavBar from "./NavBar";
import Footer from "./Footer";
import Stage from "./Stage";
import Spotlight from "./Spotlight";

/* The persistent chrome. NavBar + Footer live outside <Stage>, so only the
   inner page slides horizontally while the frame stays put. */
export default function Layout() {
  return (
    <div className="app-shell">
      <Spotlight />
      <NavBar />
      <Stage />
      <Footer />
    </div>
  );
}
