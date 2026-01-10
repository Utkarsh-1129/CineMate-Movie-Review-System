import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

const MovieDetail = () => {
	const { imdbId } = useParams();
	const navigate = useNavigate();
	const [movie, setMovie] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [dropdown, setDropdown] = useState(false);
	const [data, setData] = useState(
		JSON.parse(localStorage.getItem("Movie Review User"))
	);
	const [reviewText, setReviewText] = useState("");
	const [reviews, setReviews] = useState([]);
	const [reviewsLoading, setReviewsLoading] = useState(true);

	// Define fetchReviews with useCallback to avoid dependency issues
	const fetchReviews = useCallback(async () => {
		try {
			setReviewsLoading(true);
			// Use the viewreview endpoint with the imdbId
			const response = await fetch(
				"http://localhost:8080/api/review/viewreview",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ imdbId: imdbId }),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to fetch reviews");
			}

			const data = await response.json();
			setReviews(data || []);
		} catch (err) {
			console.error("Error fetching reviews:", err);
		} finally {
			setReviewsLoading(false);
		}
	}, [imdbId]);

	useEffect(() => {
		const fetchMovieDetails = async () => {
			try {
				setLoading(true);
				const response = await fetch(
					`http://localhost:8080/api/movies/imdb/${imdbId}`
				);

				if (!response.ok) {
					throw new Error("Failed to fetch movie details");
				}

				const data = await response.json();
				setMovie(data);

				// Fetch reviews
				fetchReviews();
			} catch (err) {
				setError(err.message);
				console.error("Error fetching movie details:", err);
				setReviewsLoading(false);
			} finally {
				setLoading(false);
			}
		};

		if (imdbId) {
			fetchMovieDetails();
		}
	}, [imdbId, fetchReviews]);

	const logout = () => {
		try {
			localStorage.removeItem("Movie Review User");
			setData(null);
			setDropdown(false);
			navigate("/");
		} catch (err) {
			console.error("Error logging out:", err);
		}
	};

	const submitReview = async (e) => {
		e.preventDefault();

		if (!data) {
			navigate("/login");
			return;
		}

		try {
			const response = await fetch("http://localhost:8080/api/review/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					body: reviewText,
					imdbId: imdbId,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to submit review");
			}

			// Refresh reviews
			fetchReviews();

			// Clear form
			setReviewText("");
		} catch (err) {
			console.error("Error submitting review:", err);
			setError("Failed to submit review. Please try again.");
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-[#0a141f] to-[#162536] flex items-center justify-center">
				<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#7cc36e]"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-[#0a141f] to-[#162536] flex flex-col items-center justify-center p-4">
				<div className="text-red-500 text-xl mb-4">{error}</div>
				<button
					onClick={() => navigate("/movies")}
					className="px-4 py-2 bg-[#7cc36e] text-white rounded-md hover:bg-[#6aad5d] transition-colors"
				>
					Back to Movies
				</button>
			</div>
		);
	}

	if (!movie) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-[#0a141f] to-[#162536] flex flex-col items-center justify-center p-4">
				<div className="text-white text-xl mb-4">Movie not found</div>
				<button
					onClick={() => navigate("/movies")}
					className="px-4 py-2 bg-[#7cc36e] text-white rounded-md hover:bg-[#6aad5d] transition-colors"
				>
					Back to Movies
				</button>
			</div>
		);
	}

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
								<a
									href="/movies"
									className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
								>
									Back to Movies
								</a>
								{data ? (
									<button
										onClick={() => setDropdown(!dropdown)}
										className="flex items-center text-amber-50"
									>
										{data.name}
									</button>
								) : (
									<a
										href="/login"
										className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
									>
										Login
									</a>
								)}
							</div>
							{data && (
								<div
									className={`${
										dropdown ? "block" : "hidden"
									} absolute right-25 mt-5 w-48 h-10 bg-[#ba5d67] rounded-md shadow-lg z-50 flex justify-center items-center`}
								>
									<button
										onClick={logout}
										className="flex justify-center items-center w-full h-full text-white text-sm font-medium hover:bg-[#a14c5a] rounded-md transition-colors duration-200"
									>
										Logout
									</button>
								</div>
							)}
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
						<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#0f1923]">
							<a
								href="/movies"
								className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
							>
								Back to Movies
							</a>
							{data ? (
								<button
									onClick={logout}
									className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
								>
									Logout ({data.name})
								</button>
							) : (
								<a
									href="/login"
									className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
								>
									Login
								</a>
							)}
						</div>
					</div>
				)}
			</nav>

			{/* Movie Hero Section */}
			<div className="relative">
				{/* Backdrop Image */}
				<div className="absolute inset-0 h-[500px] overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-t from-[#0a141f] via-[#0a141f]/90 to-[#0a141f]/70"></div>
					{movie.backdrops && movie.backdrops.length > 0 ? (
						<img
							src={movie.backdrops[0]}
							alt={`${movie.title} backdrop`}
							className="w-full h-full object-cover object-center opacity-30"
						/>
					) : (
						<div className="w-full h-full bg-[#1c2e3e]"></div>
					)}
				</div>

				{/* Movie Content */}
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
					<div className="flex flex-col md:flex-row">
						{/* Movie Poster */}
						<div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
							<div className="w-full max-w-[300px] mx-auto md:mx-0 rounded-lg overflow-hidden shadow-2xl">
								<img
									src={
										movie.poster ||
										"https://via.placeholder.com/300x450?text=No+Poster"
									}
									alt={`${movie.title} poster`}
									className="w-full h-auto"
								/>
							</div>
						</div>

						{/* Movie Details */}
						<div className="flex-1">
							<h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
								{movie.title}
							</h1>

							{/* Release Date */}
							<p className="text-gray-400 mb-4">
								{movie.releaseDate
									? new Date(movie.releaseDate).getFullYear()
									: "Release date unknown"}
							</p>

							{/* Genres */}
							<div className="flex flex-wrap gap-2 mb-6">
								{movie.genres &&
									movie.genres.map((genre) => (
										<span
											key={genre}
											className="px-3 py-1 bg-[#1c2e3e] text-[#7cc36e] rounded-full text-sm"
										>
											{genre}
										</span>
									))}
							</div>

							{/* Trailer */}
							{movie.trailerLink && (
								<div className="mb-6">
									<h3 className="text-white text-lg font-semibold mb-2">
										Trailer
									</h3>
									<div className="aspect-w-16 aspect-h-9 max-w-2xl">
										<iframe
											src={movie.trailerLink.replace(
												"watch?v=",
												"embed/"
											)}
											title={`${movie.title} trailer`}
											className="w-full h-56 md:h-64 lg:h-72 rounded-lg"
											frameBorder="0"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowFullScreen
										></iframe>
									</div>
								</div>
							)}

							{/* Reviews Section */}
							<div className="mt-8">
								<h3 className="text-white text-xl font-semibold mb-4">
									Reviews
								</h3>

								{/* Add Review Form */}
								{data && (
									<form
										onSubmit={submitReview}
										className="mb-8 bg-[#1c2e3e]/50 rounded-lg p-4"
									>
										<h4 className="text-white text-lg font-medium mb-3">
											Add Your Review
										</h4>

										{/* Review Text */}
										<div className="mb-4">
											<label className="block text-gray-300 text-sm font-medium mb-2">
												Your Review
											</label>
											<textarea
												value={reviewText}
												onChange={(e) =>
													setReviewText(
														e.target.value
													)
												}
												className="w-full p-3 bg-[#1c2e3e] border border-[#2a3e52] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7cc36e] focus:border-transparent transition duration-200"
												rows="4"
												placeholder="Share your thoughts about this movie..."
												required
											></textarea>
										</div>

										{/* Submit Button */}
										<button
											type="submit"
											className="px-4 py-2 bg-[#7cc36e] text-white rounded-md hover:bg-[#6aad5d] transition-colors"
										>
											Submit Review
										</button>
									</form>
								)}

								{/* Reviews List */}
								{reviewsLoading ? (
									<div className="flex items-center justify-center h-24">
										<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7cc36e]"></div>
									</div>
								) : reviews.length > 0 ? (
									<div className="space-y-4">
										{reviews.map((review) => (
											<div
												key={review._id}
												className="bg-[#1c2e3e]/30 rounded-lg p-4"
											>
												<div className="flex items-center justify-between mb-2">
													<div className="flex items-center">
														<div className="w-8 h-8 rounded-full bg-[#7cc36e] flex items-center justify-center text-white font-bold">
															{review.userName?.charAt(
																0
															) || "A"}
														</div>
														<span className="ml-2 text-white font-medium">
															{review.userName ||
																"Anonymous"}
														</span>
													</div>
												</div>
												<p className="text-gray-300">
													{review.body}
												</p>
												<p className="text-gray-500 text-sm mt-2">
													{new Date(
														review.created ||
															Date.now()
													).toLocaleDateString()}
												</p>
											</div>
										))}
									</div>
								) : (
									<div className="text-center py-8 bg-[#1c2e3e]/30 rounded-lg">
										<p className="text-gray-400">
											No reviews yet. Be the first to
											review!
										</p>
										{!data && (
											<a
												href="/login"
												className="mt-2 inline-block px-4 py-2 bg-[#7cc36e] text-white rounded-md hover:bg-[#6aad5d] transition-colors"
											>
												Login to Review
											</a>
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Footer */}
			<footer className="bg-[#0a141f] py-12 mt-16">
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

export default MovieDetail;
