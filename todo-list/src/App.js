import { Provider } from "react-redux"
import  store  from "./store/store"
import ToDoWrapper from "./ToDoWrapper"
import "./App.css"

function App() {
    return (
        <Provider store={store}>
            <div className="App">
                <ToDoWrapper />
            </div>
        </Provider>
    )
}

export default App
