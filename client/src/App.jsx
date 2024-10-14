import "./App.css";
import About from "./pages/About";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import SignUp from "./pages/SignUp";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Bio from "./pages/Bio";

function App() {
  return (
    <div className="AppWrapper  w-full flex flex-col flex-1 ">
      <div className="sticky top-0">
        <Navbar />
      </div>
      <div className="RouteWrapper bg-zinc-950 flex flex-col w-full mr-0 flex-1 ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/bio" element={<Bio />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
