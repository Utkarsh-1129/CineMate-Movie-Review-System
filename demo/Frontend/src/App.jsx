import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Movies from "./Components/Movies";
import MovieDetail from "./Components/MovieDetail";

const App = () => {
	const user = JSON.parse(localStorage.getItem("Movie Review User"));

	return (
		<div>
			<Routes>
				<Route
					path="/"
					element={user ? <Navigate to="/movies" /> : <Home />}
				/>
				<Route
					path="/login"
					element={user ? <Navigate to="/movies" /> : <Login />}
				/>
				<Route
					path="/movies"
					element={user ? <Movies /> : <Navigate to="/" />}
				/>
				<Route
					path="/movie/:imdbId"
					element={user ? <MovieDetail /> : <Navigate to="/" />}
				/>
			</Routes>
		</div>
	);
};

export default App;
