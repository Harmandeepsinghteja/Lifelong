import "./App.css";
import About from "./pages/About";
import Landing from "./pages/Landing";
import Chat from "./components/chat";
import SignUp from "./pages/SignUp";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Bio from "./pages/Bio";
import AdminLanding from "./pages/AdminLanding";

function App() {
  return (
    <div className="AppWrapper  w-full flex flex-col flex-1 ">
      <div className="sticky top-0">
        <Navbar />
      </div>
      <div className="RouteWrapper bg-zinc-950 flex flex-col w-full mr-0 flex-1 ">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<AdminLanding />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/bio" element={<Bio />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
