
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";
import api from "../api";

const AdminDashboard = () => {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [ratings, setRatings] = useState([]);

    const [stats, setStats] = useState({
        users: 0,
        stores: 0,
        ratings: 0
    });

    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };


    const getAdminData = async () => {

        try {

            setLoading(true);

            const [
                usersResponse,
                storesResponse,
                ratingsResponse,
                statsResponse
            ] = await Promise.all([
                api.get("/admin/users"),
                api.get("/admin/stores"),
                api.get("/admin/ratings"),
                api.get("/admin/stats")
            ]);

            setUsers(usersResponse.data);
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

        getAdminData();

    }, []);


    const searchUsers = async () => {

        try {

            const response = await api.get(
                `/admin/users/search?name=${encodeURIComponent(search)}`
            );

            setUsers(response.data);

        } catch (error) {

            console.error(error);

        }
    };


    const deleteUser = async (userId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(`/admin/users/${userId}`);

            alert("User deleted successfully");

            getAdminData();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete user"
            );
        }
    };


    const deleteStore = async (storeId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this store?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(`/admin/stores/${storeId}`);

            alert("Store deleted successfully");

            getAdminData();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete store"
            );
        }
    };


    return (

        <div className="admin-dashboard">


            {/* NAVBAR */}

            <div className="nav">

                <h1>
                    RateMyStore
                </h1>

                <div className="admin-nav-right">

                    <span>
                        👑 Admin
                    </span>

                    <button onClick={logout}>
                        Logout
                    </button>

                </div>

            </div>


            <main className="admin-container">


                <section className="admin-welcome">

                    <h2>
                        Admin Dashboard
                    </h2>

                    <p>
                        Manage users, stores, and ratings.
                    </p>

                </section>


                <section className="admin-stats">


                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">
                            👥
                        </div>

                        <div>

                            <p>
                                Total Users
                            </p>

                            <h3>
                                {stats.users}
                            </h3>

                        </div>

                    </div>


                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">
                            🏪
                        </div>

                        <div>

                            <p>
                                Total Stores
                            </p>

                            <h3>
                                {stats.stores}
                            </h3>

                        </div>

                    </div>


                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">
                            ⭐
                        </div>

                        <div>

                            <p>
                                Total Ratings
                            </p>

                            <h3>
                                {stats.ratings}
                            </h3>

                        </div>

                    </div>


                </section>


                {/* USERS */}

                <section className="admin-card">

                    <div className="admin-card-header">

                        <div>

                            <h2>
                                Manage Users
                            </h2>

                            <p>
                                View and manage registered users.
                            </p>

                        </div>

                    </div>


                    <div className="admin-search">

                        <input
                            type="text"
                            placeholder="Search user by name..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            onKeyDown={(e) => {

                                if (e.key === "Enter") {
                                    searchUsers();
                                }

                            }}
                        />

                        <button onClick={searchUsers}>
                            Search
                        </button>

                    </div>


                    {loading ? (

                        <div className="admin-empty">
                            <h3>
                                Loading users...
                            </h3>
                        </div>

                    ) : users.length === 0 ? (

                        <div className="admin-empty">

                            <div className="admin-empty-icon">
                                👥
                            </div>

                            <h3>
                                No users found
                            </h3>

                        </div>

                    ) : (

                        <div className="admin-table-wrapper">

                            <table className="admin-table">

                                <thead>

                                    <tr>

                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Address</th>
                                        <th>Action</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {users.map((user) => (

                                        <tr key={user.id}>

                                            <td>
                                                {user.id}
                                            </td>

                                            <td>
                                                {user.name}
                                            </td>

                                            <td>
                                                {user.email}
                                            </td>

                                            <td>

                                                <span
                                                    className={`role-badge ${user.role?.toLowerCase()}`}
                                                >
                                                    {user.role}
                                                </span>

                                            </td>

                                            <td>
                                                {user.address}
                                            </td>

                                            <td>

                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        deleteUser(user.id)
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>


                {/* STORES */}

                <section className="admin-card">

                    <div className="admin-card-header">

                        <div>

                            <h2>
                                Manage Stores
                            </h2>

                            <p>
                                View and manage registered stores.
                            </p>

                        </div>

                    </div>


                    {loading ? (

                        <div className="admin-empty">

                            <h3>
                                Loading stores...
                            </h3>

                        </div>

                    ) : stores.length === 0 ? (

                        <div className="admin-empty">

                            <div className="admin-empty-icon">
                                🏪
                            </div>

                            <h3>
                                No stores found
                            </h3>

                        </div>

                    ) : (

                        <div className="admin-table-wrapper">

                            <table className="admin-table">

                                <thead>

                                    <tr>

                                        <th>ID</th>
                                        <th>Store Name</th>
                                        <th>Email</th>
                                        <th>Address</th>
                                        <th>Owner ID</th>
                                        <th>Action</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {stores.map((store) => (

                                        <tr key={store.id}>

                                            <td>
                                                {store.id}
                                            </td>

                                            <td>
                                                {store.name}
                                            </td>

                                            <td>
                                                {store.email}
                                            </td>

                                            <td>
                                                {store.address}
                                            </td>

                                            <td>
                                                {store.owner_id}
                                            </td>

                                            <td>

                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        deleteStore(store.id)
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>


                {/* RATINGS */}

                <section className="admin-card">

                    <div className="admin-card-header">

                        <div>

                            <h2>
                                All Ratings
                            </h2>

                            <p>
                                View ratings submitted by users.
                            </p>

                        </div>

                    </div>


                    {loading ? (

                        <div className="admin-empty">

                            <h3>
                                Loading ratings...
                            </h3>

                        </div>

                    ) : ratings.length === 0 ? (

                        <div className="admin-empty">

                            <div className="admin-empty-icon">
                                ⭐
                            </div>

                            <h3>
                                No ratings found
                            </h3>

                        </div>

                    ) : (

                        <div className="admin-table-wrapper">

                            <table className="admin-table">

                                <thead>

                                    <tr>

                                        <th>ID</th>
                                        <th>User</th>
                                        <th>Store</th>
                                        <th>Rating</th>
                                        <th>Date</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {ratings.map((rating) => (

                                        <tr key={rating.id}>

                                            <td>
                                                {rating.id}
                                            </td>

                                            <td>
                                                {rating.user_name}
                                            </td>

                                            <td>
                                                {rating.store_name}
                                            </td>

                                            <td>

                                                <span className="rating-display">

                                                    {"⭐".repeat(
                                                        Number(rating.rating)
                                                    )}

                                                </span>

                                                <span className="rating-number">
                                                    ({rating.rating}/5)
                                                </span>

                                            </td>

                                            <td>
                                                {rating.created_at}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>


            </main>

        </div>

    );
};

export default AdminDashboard;
