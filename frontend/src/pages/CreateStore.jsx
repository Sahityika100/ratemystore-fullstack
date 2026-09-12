
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const CreateStore = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await api.post("/store", formData);

            alert("Store created successfully");

            navigate("/store");

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to create store"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="store-page">

            <div className="nav">

                <h1>RateMyStore</h1>

                <button onClick={() => navigate("/store")}>
                    Back
                </button>

            </div>


            <main className="store-container">

                <section className="card">

                    <div className="card-header">

                        <div>

                            <h2>Create Store</h2>

                            <p>
                                Add a new store to your account
                            </p>

                        </div>

                    </div>


                    <form
                        className="store-form"
                        onSubmit={handleSubmit}
                    >

                        {/* Store Name */}

                        <div className="form-group">

                            <label>
                                Store Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter store name"
                                required
                            />

                        </div>


                        {/* Email */}

                        <div className="form-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter store email"
                                required
                            />

                        </div>


                        {/* Address */}

                        <div className="form-group">

                            <label>
                                Address
                            </label>

                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter store address"
                                required
                            />

                        </div>


                        {/* Buttons */}

                        <div className="form-actions">

                            <button
                                type="button"
                                onClick={() => navigate("/store")}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create Store"
                                }
                            </button>

                        </div>

                    </form>

                </section>

            </main>

        </div>
    );
};

export default CreateStore;