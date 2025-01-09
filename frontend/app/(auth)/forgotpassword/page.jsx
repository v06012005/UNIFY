import Logo from "@/public/images/unify_1.svg";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import GoogleLogo from "@/public/images/GoogleLogo.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ForgotPasswordPage = () => {
  return (
    <div className={`w-full h-screen grid place-content-center`}>
      <div align={"center"}>
        <div className={`grid gap-5`}>
          <div>
            <Image
              src={Logo}
              alt={"Logo"}
              width={200}
              height={200}
              className={`mr-7`}
            />
          </div>
          <Input
            placeholder={"Username, phone or email"}
            className={`w-[400px] h-12`}
          />
              <div className={`flex items-center gap-1 m-auto`}>
            <span>Remembered your password.</span>
            <Link href={"/login"} className={`text-[#0F00E1]`}>
              Go back
            </Link>
          </div>
          <Button className={`text-2xl mt-3 p-5`}>Send OTP</Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
