import { Provider } from "react-redux"
import store from "./store/store" // ← This is where you import the store
import  ToDoWrapper from "./ToDoWrapper"
import "./App.css"

function App() {
    return (
        <Provider store={store}>
            {" "}
            {/* ← Pass the store to Provider */}
            <div className="App">
                <ToDoWrapper />
            </div>
        </Provider>
    )
}

export default App
