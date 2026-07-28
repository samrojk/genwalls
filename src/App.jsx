import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Search from "./pages/search";
import Category from "./pages/category";
import Wallpaper from "./pages/wallpaper";
import Listings from "./pages/listings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        {/* Listings */}
        <Route path="/trending" element={<Listings />} />
        <Route path="/featured" element={<Listings />} />
        <Route path="/latest" element={<Listings />} />
        {/* Category */}
        <Route path="/category" element={<Category />} />
        <Route path="/category/:slug" element={<Category />} />
        <Route path="/wallpaper/:slug" element={<Wallpaper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
