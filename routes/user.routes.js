import { Router } from "express";
import User from "../models/user.model.js"; // Import the User model

const userRouter = Router();

// Get all users
userRouter.get("/", async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json({ message: "Users fetched successfully", users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

// Get a single user by ID
userRouter.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Find user by ID
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User fetched successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
});

// Create a new user
userRouter.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create a new user
    const user = new User({ name, email, password });
    await user.save(); // Save the user to the database

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});

// Update a user by ID
userRouter.put("/:id", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Find the user by ID and update their details
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, password },
      { new: true } // Return the updated user
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
});

// Delete a user by ID
userRouter.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id); // Find and delete the user
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});

export default userRouter;