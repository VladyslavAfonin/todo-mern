import Layout from "./components/Layout";
import { GlobalProvider } from "./context/GlobalContext";
import "./main.scss";

function App() {
  return (
    <GlobalProvider>
      <Layout />
    </GlobalProvider>
  );
}

export default App;
