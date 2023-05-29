import { BrowserRouter } from "react-router-dom";
import PollkemonRoutes from "./PollkemonRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <PollkemonRoutes />
      </div>
    </BrowserRouter>
  );
}
