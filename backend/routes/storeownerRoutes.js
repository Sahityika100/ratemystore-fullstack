const express = require("express");

const pool = require("../db");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

router.get(
    "/",
    authMiddleware,
    authorizeRole("STORE_OWNER"),
    async (req, res) => {
      try {

            const ownerId = req.user.id;

            const result = await pool.query(
                "SELECT * FROM stores WHERE owner_id = $1",
                [ownerId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: "Store not found"
                });
            }

            res.status(200).json(result.rows);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to fetch store"
            });
        }

    }
);

router.get(
    "/ratings",
    authMiddleware,
    authorizeRole("STORE_OWNER"),
    async (req, res) => {
        try {
            const ownerId = req.user.id;

            const result = await pool.query(
                `SELECT 
                    r.id,
                    r.rating,
                    r.created_at,
                    u.name AS user_name,
                    s.name AS store_name
                 FROM ratings r
                 JOIN users u ON r.user_id = u.id
                 JOIN stores s ON r.store_id = s.id
                 WHERE s.owner_id = $1
                 ORDER BY r.created_at DESC`,
                [ownerId]
            );

            res.status(200).json(result.rows);

        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Failed to fetch ratings"
            });
        }
    }
);

router.delete(
    "/:id",
    authMiddleware,
    authorizeRole("STORE_OWNER"),
    async (req, res) => {

        try {

            const storeId = req.params.id;
            const ownerId = req.user.id;

            const result = await pool.query(
                `DELETE FROM stores
                 WHERE id = $1
                 AND owner_id = $2
                 RETURNING *`,
                [storeId, ownerId]
            );

            if (result.rows.length === 0) {

                return res.status(404).json({
                    message: "Store not found or you are not the owner"
                });

            }

            res.status(200).json({
                message: "Store deleted successfully",
                store: result.rows[0]
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to delete store"
            });

        }
    }
);

router.get(
    "/:id",
    authMiddleware,
    authorizeRole("STORE_OWNER"),
    async (req, res) => {

        try {

            const storeId = req.params.id;
            const ownerId = req.user.id;

            const result = await pool.query(
                `SELECT *
                 FROM stores
                 WHERE id = $1
                 AND owner_id = $2`,
                [storeId, ownerId]
            );

            if (result.rows.length === 0) {

                return res.status(404).json({
                    message: "Store not found"
                });

            }

            res.status(200).json(result.rows[0]);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to fetch store"
            });

        }

    }
);

router.put(
    "/:id",
    authMiddleware,
    authorizeRole("STORE_OWNER"),
    async (req, res) => {

        try {

            const storeId = req.params.id;
            const ownerId = req.user.id;

            const {
                name,
                email,
                address
            } = req.body;


            const result = await pool.query(
                `UPDATE stores
                 SET
                    name = $1,
                    email = $2,
                    address = $3,
                    updated_at = CURRENT_TIMESTAMP
                 WHERE id = $4
                 AND owner_id = $5
                 RETURNING *`,
                [
                    name,
                    email,
                    address,
                    storeId,
                    ownerId
                ]
            );


            if (result.rows.length === 0) {

                return res.status(404).json({
                    message: "Store not found"
                });

            }


            res.status(200).json({
                message: "Store updated successfully",
                store: result.rows[0]
            });


        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to update store"
            });

        }

    }
);

router.post(
    "/",
    authMiddleware,
    authorizeRole("STORE_OWNER"),
    async (req, res) => {

        try {

            const ownerId = req.user.id;

            const {
                name,
                email,
                address
            } = req.body;

            const result = await pool.query(
                `INSERT INTO stores
                 (name, email, address, owner_id)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`,
                [
                    name,
                    email,
                    address,
                    ownerId
                ]
            );

            res.status(201).json({
                message: "Store created successfully",
                store: result.rows[0]
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to create store"
            });

        }
    }
);
module.exports = router;