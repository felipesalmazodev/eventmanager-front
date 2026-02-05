"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
	const pathname = usePathname();
	const router = useRouter();
	const { isAuthenticated, logout } = useAuth();

	if (pathname === "/login" || pathname === "/auth/callback") return null;

	if (!isAuthenticated) return null;

	function handleLogout() {
		logout();
		router.replace("/login");
	}

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom">
			<div className="container-fluid">
				<span
					className="navbar-brand fw-bold"
					style={{ cursor: "pointer" }}
					onClick={() => router.push("/")}
				>
					<img style={{ height: "50px", width: "50px" }} src={"./icon.png"} />
				</span>

				<div className="d-flex">
					<button className="btn btn-outline-danger" onClick={handleLogout}>
						Logout
					</button>
				</div>
			</div>
		</nav>
	);
}