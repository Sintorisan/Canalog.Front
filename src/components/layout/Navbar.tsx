import { Link } from "@tanstack/react-router";
import { useAuthenticatedUser } from "../../hooks/useAuthenticatedUser";

export default function Navbar() {
    const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuthenticatedUser();

    return (
        <nav
            style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.75rem 1rem",
                borderBottom: "1px solid #eee",
            }}
        >
            <Link to="/">Today</Link>
            <Link to="/week">Week</Link>

            <div style={{ marginLeft: "auto", display: "flex", gap: "0.75rem" }}>
                {isLoading && <span>Loading...</span>}

                {!isLoading && !isAuthenticated && (
                    <button onClick={() => loginWithRedirect()}>Login</button>
                )}

                {!isLoading && isAuthenticated && (
                    <>
                        <span>{user?.name}</span>
                        <button
                            onClick={() =>
                                logout({
                                    logoutParams: { returnTo: window.location.origin },
                                })
                            }
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}
