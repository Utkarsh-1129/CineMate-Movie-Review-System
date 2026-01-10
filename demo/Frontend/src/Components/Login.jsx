import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [formData, setFormData] = useState({
		userId: "",
		email: "",
		password: "",
		name: "",
		mobile: "",
		confirmpassword: "",
	});
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

    const nav = useNavigate();

	// Clear error/success messages when switching forms
	useEffect(() => {
		setError("");
		setSuccess("");
	}, [isLogin]);

    // useEffect(() => {
    //     // Check if user is already logged in
    //     const user = localStorage.getItem("Movie Review User");
    //     if (user) {
    //         nav("/movies");
    //     }
    // },[])

	const login = async () => {
		try {
			setLoading(true);
			setError("");
			setSuccess("");

			const response = await fetch(
				"http://localhost:8080/api/User/login",
				{
					method: "POST",
					credentials: "include", // Include cookies for session management
                    headers: {
						"Content-Type": "application/json",
                        
					},
					body: JSON.stringify({
						userId: formData.userId,
						password: formData.password,
					}),
				}
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(
					data.message ||
						"Login failed. Please check your credentials."
				);
			}

			setSuccess("Login successful! Redirecting...");
			console.log("Login successful:", data);
            
            localStorage.setItem("Movie Review User", JSON.stringify(data.user));
			
            nav("/movies");

		} catch (err) {
			console.error("Login error:", err);
			setError(err.message || "Login failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const signup = async () => {
		try {
			setLoading(true);
			setError("");
			setSuccess("");

			// Validate password match
			if (formData.password !== formData.confirmpassword) {
				throw new Error("Passwords do not match");
			}

			const response = await fetch(
				"http://localhost:8080/api/User/signin",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name: formData.name,
						mobile: formData.mobile,
						email: formData.email,
						password: formData.password,
						confirmPassword: formData.confirmpassword,
					}),
				}
			);

			const data = await response.json();
			if (!response.ok) {
				throw new Error(
					data.message ||
						"Login failed. Please check your credentials."
				);
			}

			setSuccess("Account created successfully!");
			console.log("Registration successful:", data);

			// // Clear form after successful registration
			// setTimeout(() => {
			// 	setIsLogin(true);
			// 	setFormData({
			// 		userId: "",
			// 		email: "",
			// 		password: "",
			// 		name: "",
			// 		mobile: "",
			// 		confirmpassword: "",
			// 	});
			// }, 2000);

            localStorage.setItem(
				"Movie Review User",
				JSON.stringify(data.user)
			);

            nav("/movies");
			
		} catch (err) {
			console.error("Registration error:", err);
			setError(err.message || "Registration failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[id]: value,
		}));
		// Clear error when user starts typing
		if (error) setError("");
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Form submitted:", formData);

		// Basic form validation
		if (isLogin) {
			if (!formData.userId.trim()) {
				setError("User ID is required");
				return;
			}
			if (!formData.password) {
				setError("Password is required");
				return;
			}
			login();
		} else {
			if (!formData.name.trim()) {
				setError("Name is required");
				return;
			}
			if (!formData.mobile.trim()) {
				setError("Mobile number is required");
				return;
			}
			if (!formData.email.trim()) {
				setError("Email is required");
				return;
			}
			if (!formData.password) {
				setError("Password is required");
				return;
			}
			if (formData.password !== formData.confirmpassword) {
				setError("Passwords do not match");
				return;
			}
			signup();
		}
	};

	const toggleForm = () => {
		setIsLogin(!isLogin);
		// Reset form when switching between login and register
		setFormData({
			email: "",
			password: "",
			name: "",
			mobile: "",
			confirmpassword: "",
			userId: "",
		});
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#0a141f] to-[#162536] flex items-center justify-center px-4 py-12">
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute left-1/4 top-1/4 w-64 h-64 bg-[#7cc36e]/10 rounded-full blur-3xl"></div>
				<div className="absolute right-1/4 bottom-1/3 w-80 h-80 bg-[#7cc36e]/5 rounded-full blur-3xl"></div>
			</div>

			{/* Logo */}
			<div className="absolute top-8 left-8 flex items-center space-x-2">
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
				<h1 className="text-2xl font-bold text-white">MovieReviews</h1>
			</div>

			{/* Home Button */}
			<a href="/" className="absolute top-8 right-8">
				<button className="bg-[#1c2e3e] text-white px-4 py-2 rounded-full hover:bg-[#263a4c] transition duration-300 flex items-center space-x-2 hover:scale-105 active:scale-95">
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
							d="M3 12l2-2m0 0l7-7 7 7m-7-7v14"
						/>
					</svg>
					<span>Home</span>
				</button>
			</a>

			<div className="bg-[#14202c]/80 backdrop-blur-lg p-8 rounded-xl shadow-2xl w-full max-w-md relative z-10 border border-[#2a3e52] transform transition-all duration-300 ease-in-out">
				{/* Form Toggle Buttons */}
				<div className="flex bg-[#0e1b29] rounded-lg p-1 mb-8">
					<button
						onClick={() => setIsLogin(true)}
						className={`flex-1 py-2 rounded-md transition-all duration-300 ${
							isLogin
								? "bg-[#7cc36e] text-white"
								: "text-gray-400 hover:text-white"
						}`}
					>
						Login
					</button>
					<button
						onClick={() => setIsLogin(false)}
						className={`flex-1 py-2 rounded-md transition-all duration-300 ${
							!isLogin
								? "bg-[#7cc36e] text-white"
								: "text-gray-400 hover:text-white"
						}`}
					>
						Register
					</button>
				</div>

				<h2 className="text-2xl font-bold mb-6 text-white text-center">
					{isLogin ? "Welcome Back!" : "Create Account"}
				</h2>

				{/* Error and Success Messages */}
				{error && (
					<div className="mb-4 p-3 bg-red-600 text-white rounded-lg">
						{error}
					</div>
				)}
				{success && (
					<div className="mb-4 p-3 bg-green-600 text-white rounded-lg">
						{success}
					</div>
				)}

				<form onSubmit={handleSubmit}>
					{/* Name field - only shown on register */}
					{!isLogin && (
						<div>
							<div className="mb-4">
								<label
									className="block text-sm font-medium mb-2 text-gray-300"
									htmlFor="name"
								>
									Full Name
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-gray-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
											/>
										</svg>
									</div>
									<input
										type="text"
										id="name"
										value={formData.name}
										onChange={handleChange}
										className="w-full p-3 pl-10 bg-[#1c2e3e] border border-[#2a3e52] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7cc36e] focus:border-transparent transition duration-200"
										placeholder="Enter your full name"
										required={!isLogin}
									/>
								</div>
							</div>
							<div className="mb-4">
								<label
									className="block text-sm font-medium mb-2 text-gray-300"
									htmlFor="mobile"
								>
									Mobile no
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-gray-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
											/>
										</svg>
									</div>
									<input
										type="text"
										id="mobile"
										value={formData.mobile}
										onChange={handleChange}
										className="w-full p-3 pl-10 bg-[#1c2e3e] border border-[#2a3e52] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7cc36e] focus:border-transparent transition duration-200"
										placeholder="Enter your Mobile no"
										required={!isLogin}
									/>
								</div>
							</div>
							<div className="mb-4">
								<label
									className="block text-sm font-medium mb-2 text-gray-300"
									htmlFor="email"
								>
									Email
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-gray-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
											/>
										</svg>
									</div>
									<input
										type="email"
										id="email"
										value={formData.email}
										onChange={handleChange}
										className="w-full p-3 pl-10 bg-[#1c2e3e] border border-[#2a3e52] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7cc36e] focus:border-transparent transition duration-200"
										placeholder="Enter your email"
										required
									/>
								</div>
							</div>
						</div>
					)}

					{isLogin && (
						<div className="mb-4">
							<label
								className="block text-sm font-medium mb-2 text-gray-300"
								htmlFor="userId"
							>
								UserId
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-gray-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<input
									type="text"
									id="userId"
									value={formData.userId}
									onChange={handleChange}
									className="w-full p-3 pl-10 bg-[#1c2e3e] border border-[#2a3e52] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7cc36e] focus:border-transparent transition duration-200"
									placeholder="Enter your userId (Mobile no/ Email) "
									required
								/>
							</div>
						</div>
					)}

					{/* Password field */}
					<div className="mb-6">
						<label
							className="block text-sm font-medium mb-2 text-gray-300"
							htmlFor="password"
						>
							Password
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 text-gray-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
							</div>
							<input
								type={showPassword ? "text" : "password"}
								id="password"
								value={formData.password}
								onChange={handleChange}
								className="w-full p-3 pl-10 bg-[#1c2e3e] border border-[#2a3e52] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7cc36e] focus:border-transparent transition duration-200"
								placeholder="Enter your password"
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
							>
								{showPassword ? (
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
											d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
										/>
									</svg>
								) : (
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
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
										/>
									</svg>
								)}
							</button>
						</div>
					</div>

					{!isLogin && (
						<div className="mb-6">
							<label
								className="block text-sm font-medium mb-2 text-gray-300"
								htmlFor="Confirm password"
							>
								Confirm Password
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-gray-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
										/>
									</svg>
								</div>
								<input
									type={showPassword ? "text" : "password"}
									id="confirmpassword"
									value={formData.confirmpassword}
									onChange={handleChange}
									className="w-full p-3 pl-10 bg-[#1c2e3e] border border-[#2a3e52] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7cc36e] focus:border-transparent transition duration-200"
									placeholder="Confirm your password"
									required
								/>
								<button
									type="button"
									onClick={() =>
										setShowPassword(!showPassword)
									}
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
								>
									{showPassword ? (
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
												d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
											/>
										</svg>
									) : (
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
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
											/>
										</svg>
									)}
								</button>
							</div>
						</div>
					)}

					{/* Error and success messages */}
					{error && (
						<div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-100 text-sm flex items-start">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-red-400"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clipRule="evenodd"
								/>
							</svg>
							<span>{error}</span>
						</div>
					)}

					{success && (
						<div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-100 text-sm flex items-start">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-green-400"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
							<span>{success}</span>
						</div>
					)}

					{/* Submit button */}
					<button
						type="submit"
						className="w-full bg-[#7cc36e] text-white p-3 rounded-lg hover:bg-[#6aad5d] transition duration-300 font-medium shadow-lg flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
						disabled={loading}
					>
						{loading ? (
							<div className="flex items-center">
								<svg
									className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								{isLogin
									? "Signing In..."
									: "Creating Account..."}
							</div>
						) : (
							<>
								{isLogin ? "Sign In" : "Create Account"}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 ml-2"
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
							</>
						)}
					</button>
				</form>

				{/* Toggle account creation/login text */}
				<p className="mt-6 text-sm text-center text-gray-400">
					{isLogin
						? "Don't have an account?"
						: "Already have an account?"}{" "}
					<button
						onClick={toggleForm}
						className="text-[#7cc36e] hover:underline font-medium"
					>
						{isLogin ? "Create one" : "Sign in"}
					</button>
				</p>
			</div>
			{/* Footer */}
			<div className="absolute bottom-4 text-center w-full text-gray-500 text-xs">
				&copy; {new Date().getFullYear()} MovieReviews. All rights
				reserved.
			</div>
		</div>
	);
};

export default Login;
