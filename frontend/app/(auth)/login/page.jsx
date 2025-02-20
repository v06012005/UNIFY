"use client";

import FullUnifyLogoIcon from "@/components/global/FullUnifyLogoIcon_Auth";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import GoogleLogo from "@/public/images/GoogleLogo.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useApp } from "@/components/provider/AppProvider";

const LoginPage = () => {
  const { loginUser } = useApp();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
  };

  const handleLogin = async () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Invalid password";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await loginUser(formData.email, formData.password);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const loginWithGoogle = () => {
    signIn("google", {
      callbackUrl: "http://localhost:3000/user-profile",
    }).then((r) => console.log(r));
  };

  return (
    <div className={`w-full h-screen grid place-content-center`}>
      <div>
        <div className={`grid gap-5`}>
          <div align={"center"}>
            <FullUnifyLogoIcon className="mr-7 w-60" />
          </div>
          <div className="basis-1/2">
            <Input
              name="email"
              type="email"
              placeholder="Email"
              className="w-[400px] h-12"
              value={formData.email}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleLogin();
                }
              }}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="basis-1/2">
            <Input
              name="password"
              type="password"
              placeholder="Password"
              className="w-[400px] h-12"
              value={formData.password}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleLogin();
                }
              }}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <Link href="/password/reset" className="place-self-center">
            Forgot password?
          </Link>
          <div className="flex items-center gap-2 m-auto">
            <div className="w-10 h-[1px] bg-[#767676]"></div>
            <span className="text-[#767676] mb-1">or</span>
            <div className="w-10 h-[1px] bg-[#767676]"></div>
          </div>
          <div
            className="flex items-center gap-2 m-auto"
            onClick={loginWithGoogle}
          >
            <Image src={GoogleLogo} alt="GoogleLogo" width={30} height={30} />
            <span className="hover:underline cursor-pointer">
              Continue with Google?
            </span>
          </div>
          <div className="flex items-center gap-1 m-auto">
            <span>Don't have an account yet?</span>
            <Link href="/register" className="text-[#0F00E1]">
              Sign up
            </Link>
          </div>
          {errors.server && (
            <p className="text-red-500 text-sm">{errors.server}</p>
          )}
          <Button className="text-2xl mt-3 p-5" onClick={handleLogin}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
