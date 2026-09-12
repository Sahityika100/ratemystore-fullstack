import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./user.css";
import api from "../api";

const UserDashboard = () => {

    const navigate = useNavigate();

    const [stores, setStores] = useState([]);
    const [ratings, setRatings] = useState([]);

    const [stats, setStats] = useState({
        stores: 0,
        ratings: 0
    });

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedRating, setSelectedRating] = useState(0);
    const [ratingLoading, setRatingLoading] = useState(false);

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };


    const getDashboardData = async () => {

        try {

            setLoading(true);

            const [
                storesResponse,
                ratingsResponse,
                statsResponse
            ] = await Promise.all([
                api.get("/user/stores"),
                api.get("/user/ratings"),
                api.get("/user/stats")
            ]);


            setStores(storesResponse.data);

            setRatings(ratingsResponse.data);

            setStats(statsResponse.data);


        } catch (error) {

            console.error(error);

            if (error.response?.status === 401) {

                alert("Session expired. Please login again.");

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/login");
            }

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        getDashboardData();

    }, []);


    const searchStores = async () => {

        try {

            const response = await api.get(
                `/user/stores/search?name=${encodeURIComponent(search)}`
            );

            setStores(response.data);

        } catch (error) {

            console.error(error);

        }
    };


    const handleSearchKeyDown = (e) => {

        if (e.key === "Enter") {

            searchStores();

        }

    };



    const openRating = (store) => {

        setSelectedStore(store);

        setSelectedRating(0);

    };


    const cancelRating = () => {

        setSelectedStore(null);

        setSelectedRating(0);

    };



    const submitRating = async () => {

        if (!selectedStore) {

            return;

        }


        if (selectedRating === 0) {

            alert("Please select a rating.");

            return;

        }


        try {

            setRatingLoading(true);


            const response = await api.post(
                "/user/ratings",
                {
                    store_id: selectedStore.id,
                    rating: selectedRating
                }
            );


            alert(response.data.message);

            setSelectedStore(null);

            setSelectedRating(0);


            const [
                ratingsResponse,
                statsResponse
            ] = await Promise.all([
                api.get("/user/ratings"),
                api.get("/user/stats")
            ]);


            setRatings(ratingsResponse.data);

            setStats(statsResponse.data);


        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to submit rating"
            );

        } finally {

            setRatingLoading(false);

        }

    };


    return (

        <div className="user-dashboard">


            <div className="nav">

                <h1>
                    RateMyStore
                </h1>


                <button onClick={logout}>
                    Logout
                </button>

            </div>


            <main className="user-container">

                <section className="user-welcome">

                    <div>

                        <h2>
                            User Dashboard
                        </h2>

                        <p>
                            Find stores, view ratings, and share
                            your experience.
                        </p>

                    </div>

                </section>


                <section className="user-stats">


                    {/* Stores */}

                    <div className="user-stat-card">

                        <div className="user-stat-icon">
                            🏪
                        </div>

                        <div>

                            <p>
                                Stores
                            </p>

                            <h3>
                                {stats.stores}
                            </h3>

                        </div>

                    </div>


                    <div className="user-stat-card">

                        <div className="user-stat-icon">
                            ⭐
                        </div>

                        <div>

                            <p>
                                My Ratings
                            </p>

                            <h3>
                                {stats.ratings}
                            </h3>

                        </div>

                    </div>


                    <div className="user-stat-card">

                        <div className="user-stat-icon">
                            👤
                        </div>

                        <div>

                            <p>
                                Account
                            </p>

                            <h3>
                                Active
                            </h3>

                        </div>

                    </div>


                </section>


                <section className="user-card">


                    <div className="user-card-header">

                        <div>

                            <h2>
                                Find a Store
                            </h2>

                            <p>
                                Search for stores and submit your rating.
                            </p>

                        </div>

                    </div>


                    <div className="store-search">


                        <input
                            type="text"
                            placeholder="Search store by name..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            onKeyDown={handleSearchKeyDown}
                        />


                        <button onClick={searchStores}>
                            Search
                        </button>


                    </div>


                </section>

                <section className="user-card">


                    <div className="user-card-header">

                        <div>

                            <h2>
                                Available Stores
                            </h2>

                            <p>
                                Stores registered on RateMyStore.
                            </p>

                        </div>

                    </div>



                    {loading ? (

                        <div className="user-empty">

                            <div className="empty-icon">
                                ⏳
                            </div>

                            <h3>
                                Loading stores...
                            </h3>

                        </div>


                    ) : stores.length === 0 ? (


                        /* NO STORES */

                        <div className="user-empty">

                            <div className="empty-icon">
                                🏪
                            </div>

                            <h3>
                                No stores found
                            </h3>

                            <p>
                                Try searching for another store.
                            </p>

                        </div>


                    ) : (


                        <div className="user-store-list">


                            {stores.map((store) => (

                                <div
                                    className="user-store-card"
                                    key={store.id}
                                >


                                    <div className="user-store-info">

                                        <h3>
                                            {store.name}
                                        </h3>

                                        <p>
                                            📧 {store.email}
                                        </p>

                                        <p>
                                            📍 {store.address}
                                        </p>

                                    </div>



                                    <div className="user-store-action">

                                        <button
                                            onClick={() =>
                                                openRating(store)
                                            }
                                        >
                                            ⭐ Rate Store
                                        </button>

                                    </div>



                                    {selectedStore?.id === store.id && (

                                        <div className="rating-box">


                                            <h4>
                                                Rate {store.name}
                                            </h4>

                                            <div className="rating-stars">

                                                {[1, 2, 3, 4, 5].map(
                                                    (star) => (

                                                        <button
                                                            key={star}
                                                            type="button"
                                                            className={
                                                                star <= selectedRating
                                                                    ? "star selected"
                                                                    : "star"
                                                            }
                                                            onClick={() =>
                                                                setSelectedRating(star)
                                                            }
                                                        >
                                                            ★
                                                        </button>

                                                    )
                                                )}

                                            </div>



                                            <p>

                                                {selectedRating > 0
                                                    ? `${selectedRating} / 5`
                                                    : "Select your rating"
                                                }

                                            </p>

                                            <div className="rating-actions">


                                                <button
                                                    type="button"
                                                    onClick={submitRating}
                                                    disabled={
                                                        selectedRating === 0 ||
                                                        ratingLoading
                                                    }
                                                >

                                                    {ratingLoading
                                                        ? "Submitting..."
                                                        : "Submit Rating"
                                                    }

                                                </button>


                                                <button
                                                    type="button"
                                                    onClick={cancelRating}
                                                >
                                                    Cancel
                                                </button>


                                            </div>


                                        </div>

                                    )}


                                </div>

                            ))}


                        </div>

                    )}


                </section>



                <section className="user-card">


                    <div className="user-card-header">

                        <div>

                            <h2>
                                My Ratings
                            </h2>

                            <p>
                                Stores you have rated.
                            </p>

                        </div>

                    </div>


                    {ratings.length === 0 ? (


                        <div className="user-empty">

                            <div className="empty-icon">
                                ⭐
                            </div>

                            <h3>
                                No ratings yet
                            </h3>

                            <p>
                                Your ratings will appear here.
                            </p>

                        </div>


                    ) : (


                        <div className="user-rating-list">


                            {ratings.map((rating) => (

                                <div
                                    className="user-rating-item"
                                    key={rating.id}
                                >


                                    <div>

                                        <h3>
                                            {rating.store_name}
                                        </h3>

                                        <small>
                                            {rating.created_at}
                                        </small>

                                    </div>


                                    <div className="user-rating-stars">

                                        {"⭐".repeat(
                                            Number(rating.rating)
                                        )}

                                    </div>


                                </div>

                            ))}


                        </div>

                    )}


                </section>


            </main>


        </div>

    );

};


export default UserDashboard;