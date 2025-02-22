import { useNavigate } from "react-router-dom";
import { RESTAURANT_LOGO } from "../constants/logos";
const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-6">
            <img
                src={RESTAURANT_LOGO}
                alt="Restaurant Logo"
                className="w-24 h-24 rounded-full mb-6"
            />
            <h1 className="text-2xl font-semibold mb-4">Welcome to Lafayette</h1>
            <button
                className="bg-black text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-800 transition"
                onClick={() => navigate("/food-preference")}
            >
                Explore Menu
            </button>
        </div>
    );
};

export default Home;
