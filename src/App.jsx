import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Search from "./pages/search";
import Category from "./pages/category";
import Wallpaper from "./pages/wallpaper";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/category/:category" element={<Category />} />
        <Route path="/wallpaper/:slug" element={<Wallpaper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
