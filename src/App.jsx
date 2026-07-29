import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollBehaviour from "./components/scrollbehaviour";
import Layout from "./components/layout";
import Home from "./pages/home";
import Search from "./pages/search";
import Category from "./pages/category";
import Wallpaper from "./pages/wallpaper";
import Listings from "./pages/listings";

function App() {
  return (
    <BrowserRouter>
      <ScrollBehaviour />
      <Routes>
        <Route element={<Layout />}>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Search */}
          <Route path="/search" element={<Search />} />

          {/* Listings */}
          <Route path="/trending" element={<Listings />} />
          <Route path="/featured" element={<Listings />} />
          <Route path="/latest" element={<Listings />} />

          {/* Category */}
          <Route path="/category" element={<Category />} />
          <Route path="/category/:slug" element={<Category />} />

          {/* Wallpaper */}
          <Route path="/wallpaper/:slug" element={<Wallpaper />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
