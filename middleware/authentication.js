import jwt, { decode } from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log("req.cookies", req.cookies);
  console.log("*********************");
  console.log("req.cookies.token", req.cookies.token);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

// Check Role
export const checkRole = (roles) => {
  return (req, res, next) => {
    try {
      if (roles.includes(req.user.role)) {
        next();
      } else {
        return res
          .status(500)
          .send("Access denied. You have no permission to do that!");
      }
    } catch {
      return res.status(404).json({
        error: 404,
        message: "Not authorized",
      });
    }
  };
};

// login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "all fields are required" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role, email, name: user.name },
      process.env.SECRET_TOKEN,
      {
        expiresIn: "24h",
      }
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .status(200)
      .json({ message: "Login successful", data: user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// loggedInUser
export const loggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate([
      "cityId",
      "categoryId",
      "platforms.platformId",
    ]);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user }).status(200);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  }
};

export const logOut = (req, res) => {
  console.log("helloooo");
  return res
    .clearCookie("token")
    .status(200)
    .json({ message: "Successfully Logged Out!" });
};

// Login/Signup with google

export const addUserWithGoogle = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign(
        { _id: user._id, role: user.role },
        process.env.SECRET_TOKEN,
        {
          expiresIn: "24h",
        }
      );
      return res
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
        })
        .status(200)
        .json({ message: "Login successfully", data: user, token: token });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
      });
      await newUser.save();
      const token = jwt.sign(
        { _id: newUser._id, role: newUser.role },
        process.env.SECRET_TOKEN,
        {
          expiresIn: "24h",
        }
      );
      return res
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
        })
        .status(200)
        .json({ message: "sign up successful", data: newUser, token });
    }
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "User Not Found" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN, {
      expiresIn: "24h",
    });

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rachwan.harb2023@gmail.com",
        pass: "lbxf bgue xdir smsw",
      },
    });

    // Construct email options
    const mailOptions = {
      from: "rachwan.harb2023@gmail.com",
      to: user.email,
      subject: "Reset your password",
      text: `Click the following link to reset your password: http://localhost:3000/reset-password/${user._id}/${token}`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.response);
    return res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { id, token } = req.query;
    const { password } = req.body;
    console.log(id, token, password);
    console.log("helloooo");

    if (password && (typeof password !== "string" || password.length === 0)) {
      return res
        .status(400)
        .json({ message: "Invalid password in the request body" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    jwt.verify(token, process.env.SECRET_TOKEN, async (err) => {
      if (err) {
        return res.status(500).json({ message: "Error with the token!", err });
      } else {
        const hashedPassword = password
          ? await bcrypt.hash(password, 10)
          : undefined;

        const updatedUser = await User.findByIdAndUpdate(
          id,
          {
            ...(hashedPassword && { password: hashedPassword }),
          },
          {
            new: true,
          }
        );
        if (updatedUser) {
          return res.status(200).json({ message: "Updated" });
        } else {
          return res.status(500).json({ message: "error Updated" });
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
