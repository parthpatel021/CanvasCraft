import React from "react";
import Draw from "./pages/Draw";
import { Route, Routes } from "react-router-dom";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Draw />} />
      </Routes>
    </>
  );
}

export default App;
