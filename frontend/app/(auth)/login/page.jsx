"use client";

import FullUnifyLogoIcon from "@/components/global/FullUnifyLogoIcon_Auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import GoogleLogo from "@/public/images/GoogleLogo.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        await fetch("/api/set-cookie", {
          method: "POST",
          body: JSON.stringify({ token: result.token }),
        });
        router.push("/");
      } else {
        alert(result.message || "Login failed");
      }
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
      <div align={"center"}>
        <div className={`grid gap-5`}>
          <div>
            <FullUnifyLogoIcon className="mr-7 w-60" />
          </div>
          <Input
            name="email"
            type="email"
            placeholder="Email"
            className="w-[400px] h-12"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            className="w-[400px] h-12"
            value={formData.password}
            onChange={handleChange}
          />
          <Link href="/password/reset">Forgot password?</Link>
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
          <Button className="text-2xl mt-3 p-5" onClick={handleLogin}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
