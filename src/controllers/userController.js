import User from "../models/User.js";

export const createUser = async (req, res) => {
    try {
        const { username, email } = req.body;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: "Username is required.",
            });
        }

        const searchConditions = [{ username }];

        if (email) {
            searchConditions.push({ email });
        }

        const existingUser = await User.findOne({
            $or: searchConditions,
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists.",
            });
        }

        const user = await User.create({
            username,
            email,
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully.",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();

        return res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};