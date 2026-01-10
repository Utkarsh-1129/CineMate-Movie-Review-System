import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [featuredMovies, setFeaturedMovies] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [activeCategory, setActiveCategory] = useState("All");

	const nav = useNavigate();

	const categories = [
		"All",
		"Action",
		"Drama",
		"Comedy",
		"Sci-Fi",
		"Horror",
		"Romance",
	];

	const fetchFeaturedMovies = async () => {
		try {
			const response = await fetch("http://localhost:8080/api/movies/");
			const data = await response.json();
			setFeaturedMovies(data);
			console.log("Featured Movies:", data);
		} catch (error) {
			console.error("Error fetching featured movies:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchFeaturedMovies();
	}, []);

	// Filter movies based on search query and active category
	const filteredMovies = featuredMovies.filter((movie) => {
		const matchesSearch = movie.title
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		const matchesCategory =
			activeCategory === "All" ||
			(movie.genres && movie.genres.includes(activeCategory));
		return matchesSearch && matchesCategory;
	});

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#0a141f] to-[#162536] text-white">
			{/* Navigation Bar */}
			<nav className="bg-[#14202c] shadow-lg sticky top-0 z-10">
				<div className="container mx-auto px-4 py-3 flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<motion.div
							whileHover={{ rotate: 180 }}
							transition={{ duration: 0.5 }}
						>
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
						</motion.div>
						<h1 className="text-2xl font-bold text-white">
							MovieReviews
						</h1>
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="text-white focus:outline-none"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								{isMenuOpen ? (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								) : (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								)}
							</svg>
						</button>
					</div>

					<div className="hidden md:flex items-center space-x-6">
						<a
							href="#featured"
							className="hover:text-[#7cc36e] transition duration-200"
						>
							Featured
						</a>
						<a
							href="#trending"
							className="hover:text-[#7cc36e] transition duration-200"
						>
							Trending
						</a>
						<a
							href="#categories"
							className="hover:text-[#7cc36e] transition duration-200"
						>
							Categories
						</a>
					</div>

					<div className="hidden md:flex items-center space-x-4">
						{isSearchOpen ? (
							<div className="relative">
								<input
									type="text"
									placeholder="Search movies..."
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
									className="bg-[#1c2e3e] text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#7cc36e] w-64"
								/>
								<button
									onClick={() => {
										setIsSearchOpen(false);
										setSearchQuery("");
									}}
									className="absolute right-3 top-2.5"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-gray-400 hover:text-white"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>
						) : (
							<button
								onClick={() => setIsSearchOpen(true)}
								className="text-gray-300 hover:text-white"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</button>
						)}

						{JSON.parse(localStorage.getItem("Movie Review User"))
							 ? (
							<h1 className="text-white font-medium">{JSON.parse(localStorage.getItem("Movie Review User")).name}</h1>
						) : (
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="bg-[#7cc36e] hover:bg-[#6aad5d] text-white px-5 py-2 rounded-full font-medium transition duration-300 shadow-md hover:shadow-lg"
								onClick={() => nav("/login")}
							>
								"Sign In"
							</motion.button>
						)}
					</div>
				</div>

				{/* Mobile menu */}
				{isMenuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="md:hidden bg-[#1c2e3e] px-4 py-2"
					>
						<div className="flex flex-col space-y-3 pb-3">
							<a
								href="#featured"
								className="text-white hover:text-[#7cc36e]"
							>
								Featured
							</a>
							<a
								href="#trending"
								className="text-white hover:text-[#7cc36e]"
							>
								Trending
							</a>
							<a
								href="#categories"
								className="text-white hover:text-[#7cc36e]"
							>
								Categories
							</a>
							<div className="pt-2">
								<input
									type="text"
									placeholder="Search movies..."
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
									className="bg-[#14202c] text-white px-4 py-2 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-[#7cc36e]"
								/>
							</div>
							{localStorage.getItem("Movie Review User") ? null:
							<button
							className="bg-[#7cc36e] text-white py-2 rounded-full font-medium"
							onClick={() => {
								nav("/login");
							}}
							>
								Sign In
							</button>
							}
						</div>
					</motion.div>
				)}
			</nav>

			{/* Hero Section */}
			<div className="relative">
				<div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-80"></div>
				<div className="container mx-auto px-4 py-24 relative z-10 flex flex-col md:flex-row items-center justify-between">
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						className="md:w-1/2 mb-10 md:mb-0"
					>
						<h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
							Discover and Review{" "}
							<span className="text-[#7cc36e]">Movies</span> You
							Love
						</h1>
						<p className="text-lg text-gray-300 mb-8 md:pr-10">
							Join our community to explore thousands of movies,
							share your thoughts, and find your next favorite
							film based on authentic reviews.
						</p>
						<div className="flex space-x-4">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="bg-[#7cc36e] hover:bg-[#6aad5d] text-white px-6 py-3 rounded-full font-medium transition duration-300 shadow-lg hover:shadow-xl"
								onClick={() => nav("/login")}
							>
								Get Started
							</motion.button>
							<motion.button
								whileHover={{
									scale: 1.05,
									borderColor: "#7cc36e",
									color: "#7cc36e",
								}}
								whileTap={{ scale: 0.95 }}
								className="border-2 border-white hover:border-[#7cc36e] hover:text-[#7cc36e] px-6 py-3 rounded-full font-medium transition duration-300"
								onClick={() => {
									nav("/login");
								}}
							>
								Learn More
							</motion.button>
						</div>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="md:w-1/2 flex justify-center"
					>
						<motion.div
							whileHover={{ rotate: 0 }}
							className="relative w-72 h-96 md:w-80 md:h-112 bg-[#14202c] rounded-lg shadow-2xl overflow-hidden transform rotate-3 transition-transform duration-300"
						>
							<div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
							{loading ? (
								<div className="w-full h-full flex items-center justify-center bg-[#14202c]">
									<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#7cc36e]"></div>
								</div>
							) : (
								<img
									src={
										featuredMovies.length > 0
											? featuredMovies[0].poster
											: "https://via.placeholder.com/300x450"
									}
									alt="Featured Movie"
									className="w-full h-full object-cover"
								/>
							)}
							<div className="absolute bottom-0 left-0 right-0 p-6">
								<div className="flex items-center space-x-2 mb-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-yellow-400"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
									<span className="text-yellow-400 font-bold">
										4.9/5.0
									</span>
								</div>
								<h3 className="text-xl font-bold">
									{featuredMovies.length > 0
										? featuredMovies[0].title
										: "Featured Movie"}
								</h3>
								<p className="text-gray-400">
									{featuredMovies.length > 0 &&
									featuredMovies[0].genres
										? featuredMovies[0].genres.join(", ")
										: "A thrilling adventure awaits you in this epic movie."}
								</p>
							</div>
						</motion.div>
					</motion.div>
				</div>
			</div>

			{/* Category Filter Section */}
			<section className="py-8 bg-[#0e1b29]">
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-center flex-wrap gap-3">
						{categories.map((category) => (
							<motion.button
								key={category}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setActiveCategory(category)}
								className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
									activeCategory === category
										? "bg-[#7cc36e] text-white"
										: "bg-[#1c2e3e] text-gray-300 hover:bg-[#263a4c]"
								}`}
							>
								{category}
							</motion.button>
						))}
					</div>
				</div>
			</section>

			{/* Featured Movies Section */}
			<section id="featured" className="py-16 bg-[#14202c]/50">
				<div className="container mx-auto px-4">
					<div className="flex justify-between items-center mb-10">
						<h2 className="text-3xl font-bold">
							{searchQuery ? "Search Results" : "Featured Movies"}
							{searchQuery && (
								<span className="text-[#7cc36e] text-xl ml-2">
									"{searchQuery}"
								</span>
							)}
						</h2>
						<button
							className="text-[#7cc36e] hover:underline flex items-center"
							onClick={() => {
								nav("/login");
							}}
						>
							View All
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 ml-1"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>
					</div>

					{loading ? (
						<div className="flex justify-center items-center h-64">
							<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7cc36e]"></div>
						</div>
					) : filteredMovies.length === 0 ? (
						<div className="bg-[#1c2e3e] rounded-lg p-8 text-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-16 w-16 mx-auto text-gray-500 mb-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<h3 className="text-xl font-semibold mb-2">
								No movies found
							</h3>
							<p className="text-gray-400">
								Try a different search term or category
							</p>
						</div>
					) : (
						<div className="overflow-x-auto pb-4">
							<div className="flex space-x-4 w-max">
								{filteredMovies.map((movie, index) => (
									<motion.div
										key={movie.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											duration: 0.5,
											delay: index * 0.1,
										}}
										className="bg-[#1c2e3e] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 w-64 flex-shrink-0"
									>
										<div className="relative group">
											<img
												src={
													movie.poster ||
													"https://via.placeholder.com/300x450?text=No+Image"
												}
												alt={movie.title}
												className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-[#00000062] via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
												<button className="bg-[#7cc36e] text-white py-2 rounded-full w-full">
													View Details
												</button>
											</div>
										</div>
										<div className="p-4">
											<h3 className="text-lg font-semibold mb-1 line-clamp-1">
												{movie.title}
											</h3>
											<div className="flex justify-between items-center">
												<span className="text-gray-400 text-sm line-clamp-1">
													{movie.genres &&
														movie.genres.join(", ")}
												</span>
												<button className="text-[#7cc36e] group">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-6 w-6 transform transition-transform duration-300 group-hover:rotate-90"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
														/>
													</svg>
												</button>
											</div>
										</div>
									</motion.div>
								))}
							</div>
						</div>
					)}
				</div>
			</section>

			{/* Call to Action */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<motion.div
						whileInView={{ scale: [0.9, 1] }}
						transition={{ duration: 0.5 }}
						className="bg-gradient-to-r from-[#14202c] to-[#1c2e3e] rounded-2xl p-10 shadow-xl relative overflow-hidden"
					>
						{/* Background patterns */}
						<div className="absolute top-0 right-0 w-64 h-64 bg-[#7cc36e]/10 rounded-full -mr-32 -mt-32"></div>
						<div className="absolute bottom-0 left-0 w-80 h-80 bg-[#7cc36e]/5 rounded-full -ml-40 -mb-40"></div>

						<div className="text-center max-w-3xl mx-auto relative z-10">
							<h2 className="text-3xl md:text-4xl font-bold mb-6">
								Ready to share your movie thoughts?
							</h2>
							<p className="text-gray-300 text-lg mb-8">
								Join thousands of movie enthusiasts who are
								creating and exploring reviews every day.
							</p>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="bg-[#7cc36e] hover:bg-[#6aad5d] text-white px-8 py-4 rounded-full font-bold text-lg transition duration-300 shadow-lg hover:shadow-xl"
								onClick={() => {
									nav("/login");
								}}
							>
								Create Your Account
							</motion.button>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-[#0a141f] py-12">
				<div className="container mx-auto px-4">
					<div className="flex flex-col md:flex-row justify-between">
						<div className="mb-8 md:mb-0">
							<div className="flex items-center space-x-2 mb-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-7 w-7 text-[#7cc36e]"
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
								<h2 className="text-xl font-bold">
									MovieReviews
								</h2>
							</div>
							<p className="text-gray-400 max-w-md">
								The ultimate platform to discover, review and
								discuss your favorite movies with a community of
								film enthusiasts.
							</p>
							{/* <div className="mt-4">
								<button className="bg-[#7cc36e]/10 hover:bg-[#7cc36e]/20 text-[#7cc36e] px-4 py-2 rounded-full text-sm font-medium mt-4 transition-all duration-300">
									Download Our Mobile App
								</button>
							</div> */}
						</div>

						<div className="grid grid-cols-2 md:grid-cols-3 gap-8">
							<div>
								<h3 className="text-lg font-semibold mb-4">
									Navigation
								</h3>
								<ul className="space-y-2 text-gray-400">
									<li>
										<a
											href="#"
											className="hover:text-[#7cc36e] transition-colors duration-200 flex items-center"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-3 w-3 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5l7 7-7 7"
												/>
											</svg>
											Home
										</a>
									</li>
									<li>
										<a
											href="#"
											className="hover:text-[#7cc36e] transition-colors duration-200 flex items-center"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-3 w-3 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5l7 7-7 7"
												/>
											</svg>
											Movies
										</a>
									</li>
									<li>
										<a
											href="#"
											className="hover:text-[#7cc36e] transition-colors duration-200 flex items-center"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-3 w-3 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5l7 7-7 7"
												/>
											</svg>
											Reviews
										</a>
									</li>
									<li>
										<a
											href="#"
											className="hover:text-[#7cc36e] transition-colors duration-200 flex items-center"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-3 w-3 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5l7 7-7 7"
												/>
											</svg>
											Categories
										</a>
									</li>
								</ul>
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-4">
									Legal
								</h3>
								<ul className="space-y-2 text-gray-400">
									<li>
										<a
											href="#"
											className="hover:text-[#7cc36e] transition-colors duration-200 flex items-center"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-3 w-3 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5l7 7-7 7"
												/>
											</svg>
											Terms of Service
										</a>
									</li>
									<li>
										<a
											href="#"
											className="hover:text-[#7cc36e] transition-colors duration-200 flex items-center"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-3 w-3 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5l7 7-7 7"
												/>
											</svg>
											Privacy Policy
										</a>
									</li>
									<li>
										<a
											href="#"
											className="hover:text-[#7cc36e] transition-colors duration-200 flex items-center"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-3 w-3 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5l7 7-7 7"
												/>
											</svg>
											Cookie Policy
										</a>
									</li>
								</ul>
							</div>
							<div className="col-span-2 md:col-span-1">
								<h3 className="text-lg font-semibold mb-4">
									Connect With Us
								</h3>
								<div className="flex space-x-4">
									<motion.a
										whileHover={{ y: -3, color: "#1DA1F2" }}
										href="#"
										className="text-gray-400 hover:text-[#7cc36e] transition-colors duration-300"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753C20.18 7.773 21.692 5.25 22 4.009z" />
										</svg>
									</motion.a>
									<motion.a
										whileHover={{ y: -3, color: "#E1306C" }}
										href="#"
										className="text-gray-400 hover:text-[#7cc36e] transition-colors duration-300"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M16.5 6.5h-2.67a.28.28 0 0 0-.28.28v2.72a.28.28 0 0 0 .28.28h2.67a.28.28 0 0 0 .28-.28V6.78a.28.28 0 0 0-.28-.28zM12 8.93a3.07 3.07 0 1 0 3.07 3.07A3.07 3.07 0 0 0 12 8.93zm0 5.08a2 2 0 1 1 2-2 2 2 0 0 1-2 2zM18 5H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1zm0 12.91H6V8.08h12z" />
										</svg>
									</motion.a>
									<motion.a
										whileHover={{ y: -3, color: "#1877F2" }}
										href="#"
										className="text-gray-400 hover:text-[#7cc36e] transition-colors duration-300"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
										</svg>
									</motion.a>
								</div>
								<div className="mt-6">
									<h4 className="text-sm font-semibold text-gray-300 mb-3">
										Subscribe to our newsletter
									</h4>
									<div className="flex">
										<input
											type="email"
											placeholder="Your email"
											className="bg-[#14202c] text-white px-4 py-2 rounded-l-full focus:outline-none focus:ring-1 focus:ring-[#7cc36e] w-full"
										/>
										<button className="bg-[#7cc36e] hover:bg-[#6aad5d] text-white px-4 rounded-r-full transition duration-300">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M14 5l7 7m0 0l-7 7m7-7H3"
												/>
											</svg>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
						<p>
							&copy; {new Date().getFullYear()} MovieReviews. All
							rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Home;
