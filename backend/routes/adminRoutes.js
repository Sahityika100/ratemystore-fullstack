
const express = require("express");
const router = express.Router();

const pool = require("../db");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");


router.get(
    "/users",
    authMiddleware,
    authorizeRole("ADMIN"),
    async (req, res) => {

        try {

            const result = await pool.query(
                `SELECT
                    id,
                    name,
                    email,
                    address,
                    role,
                    created_at,
                    updated_at
                 FROM users
                 ORDER BY id DESC`
            );

            res.status(200).json(result.rows);

        } catch (error) {

            console.error("GET USERS ERROR:", error);

            res.status(500).json({
                message: "Failed to fetch users"
            });

        }

    }
);


router.get(
    "/users/search",
    authMiddleware,
    authorizeRole("ADMIN"),
    async (req, res) => {

        try {

            const { name } = req.query;

            const result = await pool.query(
                `SELECT
                    id,
                    name,
                    email,
                    address,
                    role,
                    created_at,
                    updated_at
                 FROM users
                 WHERE LOWER(name) LIKE LOWER($1)
                 ORDER BY id DESC`,
                [`%${name || ""}%`]
            );

            res.status(200).json(result.rows);

        } catch (error) {

            console.error("SEARCH USERS ERROR:", error);

            res.status(500).json({
                message: "Failed to search users"
            });

        }

    }
);


router.delete(
    "/users/:id",
    authMiddleware,
    authorizeRole("ADMIN"),
    async (req, res) => {

        const client = await pool.connect();

        try {

            const userId = Number(req.params.id);

            // Check valid ID
            if (!Number.isInteger(userId)) {

                return res.status(400).json({
                    message: "Invalid user ID"
                });

            }


            // Admin cannot delete himself
            if (userId === Number(req.user.id)) {

                return res.status(400).json({
                    message: "Admin cannot delete himself"
                });

            }


            await client.query("BEGIN");

            const userResult = await client.query(
                `SELECT
                    id,
                    name,
                    email,
                    role
                 FROM users
                 WHERE id = $1`,
                [userId]
            );


            if (userResult.rows.length === 0) {

                await client.query("ROLLBACK");

                return res.status(404).json({
                    message: "User not found"
                });

            }


            await client.query(
                `DELETE FROM ratings
                 WHERE user_id = $1`,
                [userId]
            );

            const storesResult = await client.query(
                `SELECT id
                 FROM stores
                 WHERE owner_id = $1`,
                [userId]
            );


            for (const store of storesResult.rows) {

                await client.query(
                    `DELETE FROM ratings
                     WHERE store_id = $1`,
                    [store.id]
                );

            }



            await client.query(
                `DELETE FROM stores
                 WHERE owner_id = $1`,
                [userId]
            );

            const deleteResult = await client.query(
                `DELETE FROM users
                 WHERE id = $1
                 RETURNING id, name, email, role`,
                [userId]
            );


            await client.query("COMMIT");


            res.status(200).json({

                message: "User deleted successfully",

                user: deleteResult.rows[0]

            });


        } catch (error) {

            await client.query("ROLLBACK");

            console.error("DELETE USER ERROR:", error);

            res.status(500).json({

                message: "Failed to delete user",

                error: error.message

            });

        } finally {

            client.release();

        }

    }
);



router.get(
    "/stores",
    authMiddleware,
    authorizeRole("ADMIN"),
    async (req, res) => {

        try {

            const result = await pool.query(
                `SELECT
                    s.id,
                    s.name,
                    s.email,
                    s.address,
                    s.owner_id,
                    u.name AS owner_name,
                    u.email AS owner_email,
                    s.created_at,
                    s.updated_at
                 FROM stores s
                 LEFT JOIN users u
                    ON s.owner_id = u.id
                 ORDER BY s.id DESC`
            );

            res.status(200).json(result.rows);

        } catch (error) {

            console.error("GET STORES ERROR:", error);

            res.status(500).json({
                message: "Failed to fetch stores"
            });

        }

    }
);


router.delete(
    "/stores/:id",
    authMiddleware,
    authorizeRole("ADMIN"),
    async (req, res) => {

        const client = await pool.connect();

        try {

            const storeId = Number(req.params.id);


            // Check valid ID
            if (!Number.isInteger(storeId)) {

                return res.status(400).json({
                    message: "Invalid store ID"
                });

            }


            await client.query("BEGIN");


            // Check store exists
            const storeResult = await client.query(
                `SELECT *
                 FROM stores
                 WHERE id = $1`,
                [storeId]
            );


            if (storeResult.rows.length === 0) {

                await client.query("ROLLBACK");

                return res.status(404).json({
                    message: "Store not found"
                });

            }



            await client.query(
                `DELETE FROM ratings
                 WHERE store_id = $1`,
                [storeId]
            );


            const deleteResult = await client.query(
                `DELETE FROM stores
                 WHERE id = $1
                 RETURNING *`,
                [storeId]
            );


            await client.query("COMMIT");


            res.status(200).json({

                message: "Store deleted successfully",

                store: deleteResult.rows[0]

            });


        } catch (error) {

            await client.query("ROLLBACK");

            console.error("DELETE STORE ERROR:", error);

            res.status(500).json({

                message: "Failed to delete store",

                error: error.message

            });

        } finally {

            client.release();

        }

    }
);


router.get(
    "/ratings",
    authMiddleware,
    authorizeRole("ADMIN"),
    async (req, res) => {

        try {

            const result = await pool.query(
                `SELECT
                    r.id,
                    r.rating,
                    r.created_at,
                    r.updated_at,

                    u.id AS user_id,
                    u.name AS user_name,
                    u.email AS user_email,

                    s.id AS store_id,
                    s.name AS store_name

                 FROM ratings r

                 JOIN users u
                    ON r.user_id = u.id

                 JOIN stores s
                    ON r.store_id = s.id

                 ORDER BY r.created_at DESC`
            );


            res.status(200).json(result.rows);

        } catch (error) {

            console.error("GET RATINGS ERROR:", error);

            res.status(500).json({
                message: "Failed to fetch ratings"
            });

        }

    }
);


router.get(
    "/stats",
    authMiddleware,
    authorizeRole("ADMIN"),
    async (req, res) => {

        try {

            const usersResult = await pool.query(
                `SELECT COUNT(*) AS count
                 FROM users`
            );


            const storesResult = await pool.query(
                `SELECT COUNT(*) AS count
                 FROM stores`
            );


            const ratingsResult = await pool.query(
                `SELECT COUNT(*) AS count
                 FROM ratings`
            );


            res.status(200).json({

                users: Number(
                    usersResult.rows[0].count
                ),

                stores: Number(
                    storesResult.rows[0].count
                ),

                ratings: Number(
                    ratingsResult.rows[0].count
                )

            });

        } catch (error) {

            console.error("GET STATS ERROR:", error);

            res.status(500).json({
                message: "Failed to fetch statistics"
            });

        }

    }
);


module.exports = router;
