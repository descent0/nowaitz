import { useNavigate } from "react-router-dom";
import { AppRouter} from "./route";
import { Provider } from "react-redux";
import store from "./store/store";


function App() {
  return(
  <Provider store={store}>
    <AppRouter/>
 </Provider>
  );
}

export default App;
