import React, { useEffect, useState } from "react";
import "../pages/store.css";
import api from "../api";
import { useNavigate } from "react-router-dom";

const StoreDashboard = () => {

  const [store, setStore] = useState([]);
  const [ratings, setRatings] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    getStoreData();
  }, []);

  const getStoreData = async () => {
    try {
      const storeResponse = await api.get("/store");

      setStore(storeResponse.data);
      const ratingsResponse = await api.get("/store/ratings");

      setRatings(ratingsResponse.data);

    } catch (error) {
      console.error(error);
    }
  };

  const averageRating =
    ratings.length > 0
      ? (
          ratings.reduce(
            (total, item) => total + Number(item.rating),
            0
          ) / ratings.length
        ).toFixed(1)
      : "0.0";

  const deleteStore = async (storeId) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this store?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      await api.delete(`/store/${storeId}`);

      alert("Store deleted successfully");

      setStore((previousStores) =>
        previousStores.filter(
          (s) => s.id !== storeId
        )
      );

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to delete store"
      );
    }
  };

  const editStore = (storeId) => {

    navigate(`/store/edit/${storeId}`);

  };


  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
  };


  return (
    <div className="store-page">

      {/* Navbar */}
      <div className="nav">

        <h1>RateMyStore</h1>

        <button onClick={logout}>
          Logout
        </button>

      </div>

      <main className="store-container">

        <section className="welcome">

          <div>

            <h2>
              Store Owner Dashboard
            </h2>

            <p>
              Manage your stores and monitor customer ratings.
            </p>

          </div>

        </section>


        <section className="stats">

          <div className="stat-card">

            <span className="stat-icon">
              ⭐
            </span>

            <div>

              <p>
                Average Rating
              </p>

              <h3>
                {averageRating}
              </h3>

            </div>

          </div>


          <div className="stat-card">

            <span className="stat-icon">
              👥
            </span>

            <div>

              <p>
                Total Ratings
              </p>

              <h3>
                {ratings.length}
              </h3>

            </div>

          </div>


          <div className="stat-card">

            <span className="stat-icon">
              🏪
            </span>

            <div>

              <p>
                Total Stores
              </p>

              <h3>
                {store.length}
              </h3>

            </div>

          </div>

        </section>

        <section className="card">

          <div className="card-header">

            <div>

              <h2>
                Store Details
              </h2>

              <p>
                Information about your stores
              </p>

            </div>


            <button onClick={() => navigate("/store/create")} className="edit-btn">
              Create Store
            </button>

          </div>

          <div className="store-details">

            {store.length === 0 ? (

              <p>
                No stores found.
              </p>

            ) : (

              store.map((s) => (

                <div
                  className="store-card"
                  key={s.id}
                >

                  <div className="store-info">

                    <p>
                      <strong>
                        Store Name:
                      </strong>{" "}
                      {s.name}
                    </p>


                    <p>
                      <strong>
                        Email:
                      </strong>{" "}
                      {s.email}
                    </p>


                    <p>
                      <strong>
                        Address:
                      </strong>{" "}
                      {s.address}
                    </p>

                  </div>


                  <div className="store-actions">

                    <button
                      className="edit-store-btn"
                      onClick={() =>
                        editStore(s.id)
                      }
                    >
                      Edit
                    </button>


                    <button
                      className="delete-store-btn"
                      onClick={() =>
                        deleteStore(s.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))

            )}

          </div>

        </section>

        <section className="card">

          <div className="card-header">

            <div>

              <h2>
                Customer Ratings
              </h2>

              <p>
                See what customers think about your stores
              </p>

            </div>

          </div>


          {ratings.length === 0 ? (

            <div className="empty">

              <div>
                ⭐
              </div>

              <h3>
                No ratings yet
              </h3>

              <p>
                Customer ratings will appear here.
              </p>

            </div>

          ) : (

            <div className="ratings-list">

              {ratings.map((rating) => (

                <div
                  className="rating-item"
                  key={rating.id}
                >

                  <div className="customer">

                    <div className="avatar">

                      {rating.user_name?.charAt(0)}

                    </div>


                    <div>

                      <strong>
                        {rating.user_name}
                      </strong>

                      <small>
                        {rating.created_at}
                      </small>

                    </div>

                  </div>


                  <div className="rating">

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

export default StoreDashboard;