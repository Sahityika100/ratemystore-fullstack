
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
const StoreEdit = () => {
 const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: ""
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStore();
    }, [id]);


    const getStore = async () => {

        try {

            const response = await api.get(`/store/${id}`);

            setFormData({
                name: response.data.name,
                email: response.data.email,
                address: response.data.address
            });

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to fetch store"
            );

        } finally {

            setLoading(false);

        }
    };


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.put(`/store/${id}`, formData);

            alert("Store updated successfully");

            navigate("/store");

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to update store"
            );

        }

    };


    if (loading) {
        return <h2>Loading...</h2>;
    }


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
                            <h2>Edit Store</h2>

                            <p>
                                Update your store information
                            </p>
                        </div>

                    </div>


                    <form
                        className="store-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-group">

                            <label>
                                Store Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Address
                            </label>

                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-actions">

                            <button
                                type="button"
                                onClick={() => navigate("/store")}
                            >
                                Cancel
                            </button>


                            <button type="submit">
                                Update Store
                            </button>

                        </div>

                    </form>

                </section>

            </main>

        </div>
    );
};

export default StoreEdit
