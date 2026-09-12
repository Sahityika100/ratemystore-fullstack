
const express = require("express");
const router = express.Router();

const pool = require("../db");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

router.get(
    "/stores",
    authMiddleware,
    authorizeRole("USER"),
    async (req, res) => {

        try {

            const result = await pool.query(
                `SELECT
                    id,
                    name,
                    email,
                    address,
                    created_at
                 FROM stores
                 ORDER BY name ASC`
            );

            res.status(200).json(result.rows);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to fetch stores"
            });

        }
    }
);


router.get(
    "/stores/search",
    authMiddleware,
    authorizeRole("USER"),
    async (req, res) => {

        try {

            const { name } = req.query;

            const result = await pool.query(
                `SELECT
                    id,
                    name,
                    email,
                    address,
                    created_at
                 FROM stores
                 WHERE LOWER(name) LIKE LOWER($1)
                 ORDER BY name ASC`,
                [`%${name || ""}%`]
            );

            res.status(200).json(result.rows);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to search stores"
            });

        }
    }
);


router.get(
    "/ratings",
    authMiddleware,
    authorizeRole("USER"),
    async (req, res) => {

        try {

            const userId = req.user.id;

            const result = await pool.query(
                `SELECT
                    r.id,
                    r.rating,
                    r.created_at,
                    s.id AS store_id,
                    s.name AS store_name
                 FROM ratings r
                 JOIN stores s
                   ON r.store_id = s.id
                 WHERE r.user_id = $1
                 ORDER BY r.created_at DESC`,
                [userId]
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


router.get(
    "/stats",
    authMiddleware,
    authorizeRole("USER"),
    async (req, res) => {

        try {

            const userId = req.user.id;

            const storesResult = await pool.query(
                `SELECT COUNT(*) AS count
                 FROM stores`
            );

            const ratingsResult = await pool.query(
                `SELECT COUNT(*) AS count
                 FROM ratings
                 WHERE user_id = $1`,
                [userId]
            );

            res.status(200).json({
                stores: Number(storesResult.rows[0].count),
                ratings: Number(ratingsResult.rows[0].count)
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to fetch statistics"
            });

        }
    }
);


router.post(
    "/ratings",
    authMiddleware,
    authorizeRole("USER"),
    async (req, res) => {

        try {

            const userId = req.user.id;

            const {
                store_id,
                rating
            } = req.body;

            if (!store_id || !rating) {

                return res.status(400).json({
                    message: "Store and rating are required"
                });

            }

        const numericRating = Number(rating);

          if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
              return res.status(400).json({
          message: "Rating must be an integer between 1 and 5"
          });
         }


            const storeResult = await pool.query(
                `SELECT id
                 FROM stores
                 WHERE id = $1`,
                [store_id]
            );

            if (storeResult.rows.length === 0) {

                return res.status(404).json({
                    message: "Store not found"
                });

            }


            const existingRating = await pool.query(
                `SELECT id
                 FROM ratings
                 WHERE user_id = $1
                 AND store_id = $2`,
                [
                    userId,
                    store_id
                ]
            );


            if (existingRating.rows.length > 0) {

                const result = await pool.query(
                    `UPDATE ratings
                     SET
                        rating = $1,
                        updated_at = CURRENT_TIMESTAMP
                     WHERE user_id = $2
                     AND store_id = $3
                     RETURNING *`,
                    [
                        rating,
                        userId,
                        store_id
                    ]
                );

                return res.status(200).json({
                    message: "Rating updated successfully",
                    rating: result.rows[0]
                });

            }


            const result = await pool.query(
                `INSERT INTO ratings
                 (user_id, store_id, rating)
                 VALUES ($1, $2, $3)
                 RETURNING *`,
                [
                    userId,
                    store_id,
                    rating
                ]
            );


            res.status(201).json({
                message: "Rating submitted successfully",
                rating: result.rows[0]
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to submit rating"
            });

        }
    }
);


module.exports = router;
