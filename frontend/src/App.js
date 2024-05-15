import { useEffect } from "react";
import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
} from "react-router-dom";
import Homeselection from "./pages/Homeselection";
import SelectionOne from "./pages/SelectionOne";
import TempData from "./pages/TempData";
import SelectionTwo from "./pages/SelectionTwo";
import SatData from "./pages/SatData";
import SelectionThree from "./pages/SelectionThree";

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "";
        metaDescription = "";
        break;
      case "/selectionone":
        title = "";
        metaDescription = "";
        break;
      case "/temp-data":
        title = "";
        metaDescription = "";
        break;
      case "/selectiontwo":
        title = "";
        metaDescription = "";
        break;
      case "/saturation-data":
        title = "";
        metaDescription = "";
        break;
      case "/selectionthree":
        title = "";
        metaDescription = "";
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<Homeselection />} />
      <Route path="/selectionone" element={<SelectionOne />} />
      <Route path="/temp-data" element={<TempData />} />
      <Route path="/selectiontwo" element={<SelectionTwo />} />
      <Route path="/sat-data" element={<SatData />} />
      <Route path="/selectionthree" element={<SelectionThree />} />
    </Routes>
  );
}
export default App;
