import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WebRouter } from "./Router";

const RouterWeb = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<WebRouter />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterWeb;
