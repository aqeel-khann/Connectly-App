import { Route, Routes } from "react-router-dom";
import { Login, SignUp, Home, Layout, Post } from "../Components";

export const Routers = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="post" element={<Post/>} />
    </Route>
  </Routes>
);
