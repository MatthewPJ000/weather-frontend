import { BrowserRouter, Route, Routes, Router } from "react-router-dom";
import Map from "./page/Main/Map"
import LoginPage from "./page/login/login";
import SignUpPage from "./page/login/signup";
import './configs/firebaseConfig'
import ProtectRoute from "./routes/protectRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route element={<ProtectRoute />}>
          <Route path="/" element={<Map />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default App;
