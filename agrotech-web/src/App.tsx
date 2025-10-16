import AppRoutes from "./app/routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return <AppRoutes />;
  <ToastContainer position="top-right" autoClose={3000} />;
}
