import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Contracts route working" });
});

router.post("/create", (req, res) => {
  res.json({ message: "Contract created (demo)" });
});

export default router;