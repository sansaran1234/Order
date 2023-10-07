import logo from './logo.svg';
import './styles/App.css';
import OrderSearch from './components/OrderSearch'
import OrderDetail from './components/OrderDetail'
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

	return (
        <div className="app">
            <Router>
                <Routes>
                    <Route path='/' element={<OrderSearch />} /> 
                    <Route path='/detail/:id' element={<OrderDetail />} /> 
                </Routes>
            </Router>
        </div>
	);
}

export default App;
