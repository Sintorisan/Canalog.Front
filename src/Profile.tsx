import { useAuthenticatedUser } from "./hooks/useAuthenticatedUser";
const Profile = () => {
    const { user, accessToken, isLoading } = useAuthenticatedUser();

    if (isLoading) return <div>Loading...</div>;

    const callProtectedApi = async () => {
        try {
            await fetch("http://localhost:5073/api/users/sync", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } catch (error) {
            console.error("API call failed:", error);
        }
    };

    return (
        <div>
            <h1>Welcome, {user?.name}</h1>
            <p>Access Token: {accessToken}</p>
            <button onClick={callProtectedApi}>button</button>
        </div>
    );
};
export default Profile;
