import ReactDOM from "react-dom";
import { LogProvider } from "./context/LogContext";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
    <LogProvider>
      <App />
    </LogProvider>,
    rootElement
  );
