import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Movies = () => {
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [activeCategory, setActiveCategory] = useState("All");
	const [sortBy, setSortBy] = useState("title"); // title, releaseDate
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [dropdown, setDropdown] = useState(false);
	const [data, setData] = useState(
		JSON.parse(localStorage.getItem("Movie Review User"))
	);
	const navigate = useNavigate();

	const categories = [
		"All",
		"Action",
		"Drama",
		"Comedy",
		"Sci-Fi",
		"Horror",
		"Romance",
	];

	// Fetch movies from API
	useEffect(() => {
		const fetchMovies = async () => {
			try {
				setLoading(true);
				const response = await fetch(
					"http://localhost:8080/api/movies/"
				);

				if (!response.ok) {
					throw new Error("Failed to fetch movies");
				}

				const data = await response.json();
				setMovies(data);
			} catch (err) {
				setError(err.message);
				console.error("Error fetching movies:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchMovies();
	}, []);

	// Filter movies based on search query and active category
	const filteredMovies = movies.filter((movie) => {
		const matchesSearch = movie.title
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		const matchesCategory =
			activeCategory === "All" ||
			(movie.genres && movie.genres.includes(activeCategory));
		return matchesSearch && matchesCategory;
	});

	// Sort movies based on selected sort option
	const sortedMovies = [...filteredMovies].sort((a, b) => {
		if (sortBy === "title") {
			return a.title.localeCompare(b.title);
		} else if (sortBy === "releaseDate") {
			return new Date(b.releaseDate) - new Date(a.releaseDate);
		}
		return 0;
	});

	// Handle movie click to view details
	const handleMovieClick = (imdbId) => {
		navigate(`/movie/${imdbId}`);
	};

	const logout = async () => {
		try {
			const res = fetch("http://localhost:8080/api/User/logout",{
				credentials: "include",
				method:"GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!res.ok) {
				throw new Error("Failed to logout");
			}

			const data = await res.json();
			console.log("Logout successful:", data);

			localStorage.removeItem("Movie Review User");
			setData(null);
			navigate("/");
		} catch (err) {
			console.error("Error logging out:", err);
			setError("Failed to logout. Please try again.");
		} finally {
			setDropdown(false);
			setIsMenuOpen(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#0a141f] to-[#162536]">
			{/* Navigation */}
			<nav className="bg-[#0a141f]/95 sticky top-0 z-50 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						{/* Logo and Brand */}
						<div className="flex-shrink-0 flex items-center">
							<div className="transform hover:rotate-180 transition-transform duration-500">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-8 w-8 text-[#7cc36e]"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M7 4v16M17 4v16M3 8h18M3 16h18"
									/>
								</svg>
							</div>
							<span className="ml-2 text-white text-xl font-bold">
								MovieReviews
							</span>
						</div>

						{/* Desktop Navigation */}
						<div className="hidden md:block">
							<div className="ml-10 flex items-center space-x-4">
								<button
									onClick={() => setDropdown(!dropdown)}
									className="flex items-center text-amber-50"
								>
									{data.name}
								</button>
							</div>
							<div
								className={`${
									dropdown ? "block" : "hidden"
								} absolute right-25 mt-5 w-48 h-10 bg-[#ba5d67] rounded-md shadow-lg z-50 flex justify-center items-center`}
							>
								<button
									onClick={() => logout()}
									className="flex justify-center items-center w-full h-full text-white text-sm font-medium hover:bg-[#a14c5a] rounded-md transition-colors duration-200"
								>
									Logout
								</button>
							</div>
						</div>

						{/* Mobile menu button */}
						<div className="md:hidden">
							<button
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#1c2e3e] focus:outline-none"
							>
								<span className="sr-only">Open main menu</span>
								{isMenuOpen ? (
									<svg
										className="block h-6 w-6"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								) : (
									<svg
										className="block h-6 w-6"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M4 6h16M4 12h16M4 18h16"
										/>
									</svg>
								)}
							</button>
						</div>
					</div>
				</div>

				{/* Mobile Menu */}
				{isMenuOpen && (
					<div className="md:hidden">
						<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#ba5d67] rounded-md shadow-lg hover:bg-[#a14c5a]">
							<button
								onClick={() => logout()}
								className="flex justify-center items-center w-full h-full text-white text-sm font-medium hover:bg-[#a14c5a] rounded-md transition-colors duration-200"
							>
								Logout
							</button>
						</div>
					</div>
				)}
			</nav>

			{/* Hero Section */}
			<div className="relative py-16 bg-[#0a141f] overflow-hidden">
				<div className="absolute inset-0">
					<div className="absolute inset-0 bg-gradient-to-r from-[#0a141f] to-transparent"></div>
					<div className="absolute right-0 top-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1925&q=80')] bg-cover bg-center opacity-25"></div>
				</div>
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
					<h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
						Explore Our Movie Collection
					</h1>
					<p className="mt-6 text-xl text-gray-300 max-w-3xl">
						Discover the latest blockbusters, timeless classics, and
						hidden gems in our extensive movie library.
					</p>

					{/* Search and filter controls */}
					<div className="mt-10 sm:flex items-center space-y-4 sm:space-y-0 sm:space-x-4">
						<div className="relative rounded-md shadow-sm flex-grow max-w-lg">
							<input
								type="text"
								className="block w-full pl-4 pr-10 py-3 border-0 text-gray-300 bg-[#1c2e3e]/80 backdrop-blur-sm rounded-lg focus:ring-2 focus:ring-[#7cc36e] focus:outline-none"
								placeholder="Search for movies..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
							<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
								<svg
									className="h-5 w-5 text-gray-400"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						</div>

						<div className="relative inline-block text-left">
							<select
								className="block w-full pl-3 pr-10 py-3 text-base border-0 focus:outline-none focus:ring-2 focus:ring-[#7cc36e] sm:text-sm rounded-lg bg-[#1c2e3e]/80 text-gray-300"
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
							>
								<option value="title">Sort by Title</option>
								<option value="releaseDate">
									Sort by Release Date
								</option>
							</select>
						</div>
					</div>
				</div>
			</div>

			{/* Category filters */}
			<div className="bg-[#0f1923] py-4 sticky top-16 z-40 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center space-x-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#2a3e52] scrollbar-track-transparent">
						{categories.map((category) => (
							<button
								key={category}
								onClick={() => setActiveCategory(category)}
								className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
									activeCategory === category
										? "bg-[#7cc36e] text-white"
										: "bg-[#1c2e3e] text-gray-300 hover:bg-[#263a4c]"
								}`}
							>
								{category}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Movies Grid */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{loading ? (
					<div className="flex items-center justify-center h-64">
						<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#7cc36e]"></div>
					</div>
				) : error ? (
					<div className="text-center py-12">
						<div className="text-red-500 text-xl">{error}</div>
						<button
							onClick={() => window.location.reload()}
							className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7cc36e] hover:bg-[#6aad5d]"
						>
							Try Again
						</button>
					</div>
				) : sortedMovies.length === 0 ? (
					<div className="text-center py-12">
						<h3 className="text-xl text-gray-300">
							No movies found matching your criteria
						</h3>
						<p className="mt-2 text-gray-400">
							Try adjusting your search or filters
						</p>
					</div>
				) : (
					<div>
						<h2 className="text-2xl font-bold text-white mb-6">
							{sortedMovies.length}{" "}
							{sortedMovies.length === 1 ? "Movie" : "Movies"}{" "}
							Found
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
							{sortedMovies.map((movie) => (
								<div
									key={movie.imdbId}
									className="bg-[#1c2e3e] rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
									onClick={() =>
										handleMovieClick(movie.imdbId)
									}
								>
									<div className="relative pb-[150%]">
										<img
											className="absolute h-full w-full object-cover"
											src={
												movie.poster ||
												"https://via.placeholder.com/300x450?text=No+Poster"
											}
											alt={movie.title}
											loading="lazy"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
											<div className="flex flex-wrap gap-2 mb-2">
												{movie.genres &&
													movie.genres
														.slice(0, 3)
														.map((genre) => (
															<span
																key={genre}
																className="px-2 py-1 bg-[#7cc36e]/20 text-[#7cc36e] rounded text-xs"
															>
																{genre}
															</span>
														))}
											</div>
											<p className="text-gray-300 text-sm">
												{movie.releaseDate
													? new Date(
															movie.releaseDate
													  ).getFullYear()
													: "N/A"}
											</p>
										</div>
									</div>
									<div className="p-4">
										<h3 className="font-bold text-white text-lg truncate">
											{movie.title}
										</h3>
										<div className="flex items-center mt-2">
											<svg
												className="w-5 h-5 text-yellow-500"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
											</svg>
											<span className="text-gray-300 ml-1">
												{movie.reviewIds &&
												movie.reviewIds.length > 0
													? `${movie.reviewIds.length} reviews`
													: "No reviews yet"}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Footer */}
			<footer className="bg-[#0a141f] py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div className="md:col-span-2">
							<div className="flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-8 w-8 text-[#7cc36e]"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M7 4v16M17 4v16M3 8h18M3 16h18"
									/>
								</svg>
								<span className="ml-2 text-white text-xl font-bold">
									MovieReviews
								</span>
							</div>
							<p className="mt-4 text-gray-400 max-w-md">
								Your ultimate destination for discovering,
								reviewing, and discussing the latest movies and
								timeless classics.
							</p>
						</div>
						<div>
							<h3 className="text-white font-semibold mb-4">
								Quick Links
							</h3>
							<ul className="space-y-2">
								<li>
									<a
										href="/"
										className="text-gray-400 hover:text-[#7cc36e]"
									>
										Home
									</a>
								</li>
								<li>
									<a
										href="/movies"
										className="text-gray-400 hover:text-[#7cc36e]"
									>
										Movies
									</a>
								</li>
								<li>
									<a
										href="/login"
										className="text-gray-400 hover:text-[#7cc36e]"
									>
										Login
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-white font-semibold mb-4">
								Legal
							</h3>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-[#7cc36e]"
									>
										Privacy Policy
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-[#7cc36e]"
									>
										Terms of Service
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-gray-400 hover:text-[#7cc36e]"
									>
										Cookie Policy
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div className="mt-12 pt-8 border-t border-[#2a3e52] text-center text-gray-400 text-sm">
						&copy; {new Date().getFullYear()} MovieReviews. All
						rights reserved.
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Movies;
