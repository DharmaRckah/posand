import userModel from "../models/userModel.js";
import nodemailer from "nodemailer";
import { hashPassword, comparePassword } from "../middleware/authHelper.js";

import NodeCache from "node-cache";
import JWT from "jsonwebtoken";

const node_cache = new NodeCache({ stdTTL: 120 });

export const userRegisterController = async (req, res) => {
  try {
    const {
      businessName,
      userName,
      address,
      contact,
      email,
      password,
      businessType,
    } = req.body;

    const requiredField = [
      "businessName",
      "userName",
      "address",
      "contact",
      "email",
      "password",
      "businessType",
    ];

    const missingFields = [];
    for (const field of requiredField) {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).send({
        message: "Required fields are missing",
        missingFields,
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (password.length < 6) {
      return res.send({ success: false, message: "password must be 6 digit" });
    }

    // otp

    function generateStrongOTP() {
      const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let otp = "";
      for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        otp += characters[randomIndex];
      }
      return otp;
    }

    let otp = generateStrongOTP();
    const message =
      "Your OTP for verification is " +
      otp +
      " Please use this code to complete your Registration. Do not share it. ~dharma ";
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    // check old user
    const oldUser = await userModel.findOne({ email });
    if (oldUser) {
      return res.send({ message: "user already exist" });
    }

    const subject = "OTP verification from accounting";
    let info = await transporter.sendMail({
      from: `Point Of Sale <manasvistaff.dharma@gmail.com>`,
      to: email,
      subject: subject,
      text: message,
    });

    const alldt = {
      businessName: businessName,
      userName: userName,
      address: address,
      contact: contact,
      email: email,
      password: password,
      businessType: businessType,
      otp: otp,
    };

    const cdata = node_cache.set(email, alldt);

    if (cdata) {
      return res.send({ success: true, message: "OTP sent Successfully...!" });
    }
    if (!cdata) {
      return res.send({ success: false, message: "otp not send" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "internal server  issue",
      error,
    });
  }
};


export const verificationController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!otp || !email) {
      return res.send({ message: "enter both email and otp field" });
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const exu = await userModel.findOne({ email });

    if (exu) {
      return res
        .status(200)
        .send({ success: true, message: "already verified" });
    }

    const exuser = node_cache.get(email);

    if (exuser) {
      if (exuser.otp === otp) {
        const {
          businessName,
          userName,
          address,
          contact,
          email,
          password,
          businessType,
        } = exuser;

        const hashedPwd = await hashPassword(password);
        const data = await userModel.create({
          businessName,
          userName,
          address,
          contact,
          email,
          password: hashedPwd,
          businessType,
        });
        if (data) {
          res.status(201).send({
            success: true,
            message: "User Registration Completed Successfully!",
            data,
          });
        }
      }
      if (exuser.otp !== otp) {
        return res.send({ success: false, message: "invalid otp " });
      }
    }
    if (!exuser) {
      return res.send({
        success: false,
        message: "You are not a registered user ",
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal server issue", error });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.send({
        success: false,
        message: "email and password both fields are required",
      });
    }
    const user = await userModel.findOne({ email });
    if (user) {
      const bpassword = await hashPassword(password);
      const matched = await comparePassword(password, user.password);
      const AccessToken = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "3d",
      });

      if (!matched) {
        return res.send({
          success: false,
          message: "invalide passwod please try...! Again ",
        });
      }

      return res.send({
        success: true,
        message: "Login successfully",
        user,
        AccessToken,
      });
    }
    if (!user) {
      return res.send({ success: false, message: "User Not Registered..!" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "internal server issue", error });
  }
};

export const forgetController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.send({ success: false, message: "email is required...!" });
    }
    if (email) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .send({ success: false, message: "invalid email address " });
      }

      // check in ex
      const ex = await userModel.findOne({ email });
      if (!ex) {
        return res.send({
          success: false,
          message: "You Are Not a Registered user...! ",
        });
      }
      if (ex) {
        //send otp
        function generateStrongOTP() {
          const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          let otp = "";
          for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            otp += characters[randomIndex];
          }
          return otp;
        }

        let otp = generateStrongOTP();
        const subject = "reset password otp from Point OF Sale";
        const message =
          "Your OTP for verification is " +
          otp +
          " Please use this code to complete your Registration. Do not share it. ~dharma ";
        let transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
        let info = await transporter.sendMail({
          from: `Point Of Sale <manasvistaff.dharma@gmail.com>`,
          to: email,
          subject: subject,
          text: message,
        });

        // node cache

        node_cache.set(email, otp);

        return res
          .status(200)
          .send({ success: true, message: "OTP sent Successfully", info });
      }

      return res.send({ success: true });
    }
  } catch (error) {
    console.log(error);
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;
    if (!email || !otp || !password || !confirmPassword) {
      return res.send({
        success: false,
        message:
          " 'email' , 'otp' , 'password' and 'confirmPassword'  field are required ",
      });
    }

    if (email) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .send({ success: false, message: "invalid email address " });
      }
      const exUser = await userModel.findOne({ email });
      if (!exUser) {
        return res.send({
          success: false,
          messagge: "You Are Not the Registered User ",
        });
      }

      if (password !== confirmPassword) {
        return res.send({
          success: false,
          message: "password and confirmPassword is not same ",
        });
      }
      if (password.length < 6 || confirmPassword.length < 6) {
        return res.send({
          success: false,
          message: "password and confirmPassword length must be 6 digit",
        });
      }

      const ootp = node_cache.get(email);
      if (ootp) {
        if (ootp === otp) {
          const npassword = await hashPassword(password);

          const updatedUser = await userModel.findOneAndUpdate(
            { email },
            { password: npassword },
            { new: true }
          );
          if (updatedUser) {
            node_cache.del(email);
            return res.send({ success: true, message: " ", updatedUser });
          }
          return res.send({ success: true, message: "ok" });
        }
      }
    }
    return res.send({ success: false, message: "Incorrect otp " });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "internal server issue...!" });
  }
};


