import { useNavigate } from "react-router-dom";
import { RESTAURANT_LOGO, RESTAURANT_BACKGROUND } from "../constants/constants";
import "@fontsource/playfair-display"; // Import Playfair Display for headings
import "@fontsource/poppins"; // Import Poppins for body text

const Home = () => {
    const navigate = useNavigate();

    return (
        <div
            className="relative h-[100dvh] bg-cover bg-center flex flex-col justify-end p-6 pb-[env(safe-area-inset-bottom)]"
            style={{
                backgroundImage: `url(${RESTAURANT_BACKGROUND})`, // Replace with actual restaurant image URL
            }}
        >
            {/* Full-Screen Dark Overlay */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            {/* Darker Bottom Overlay */}
            <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-black via-black/100     to-transparent"></div>

            {/* Content */}
            <div className="relative text-white w-full">
                {/* Logo */}
                <div className="flex items-center space-x-2 mb-4">
                    <img
                        src={RESTAURANT_LOGO}
                        alt="Restaurant Logo"
                        className="w-10 h-10 rounded-full bg-white p-1"
                    />
                    <h1 className="text-3xl font-bold font-playfair-display">Lafayette</h1>
                </div>

                {/* Tagline */}
                <p className="text-lg mb-6 font-poppins">Chennai’s only dreamy cafe</p>

                {/* View Menu Button */}
                <button
                    className=" mb-12 mt-4 w-full bg-pink-600 text-white text-lg font-semibold py-3 rounded-lg shadow-md hover:bg-pink-700 transition"
                    onClick={() => navigate("/food-preference")}
                >
                    View menu
                </button>
            </div>
        </div>
    );
};

export default Home;
