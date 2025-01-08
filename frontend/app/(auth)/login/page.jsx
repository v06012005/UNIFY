import Logo from "@/public/images/unify_1.svg"
import Image from "next/image";
import {Input} from "@/components/ui/input";
import GoogleLogo from "@/public/images/GoogleLogo.png"
import Link from "next/link";
import {Button} from "@/components/ui/button";

const LoginPage = () => {
    return (
        <div className={`w-full h-screen grid place-content-center`}>
            <div align={'center'}>
                <div className={`grid gap-5`}>
                    <div>
                        <Image src={Logo} alt={"Logo"} width={200} height={200} className={`mr-7`}/>
                    </div>
                    <Input placeholder={'Username, phone or email'} className={`w-[400px] h-12`} />
                    <Input placeholder={'Password'} className={`w-[400px] h-12`} />
                    <span>Forgot password?</span>
                    <div className={`flex items-center gap-2 m-auto`}>
                        <div className={`w-10 h-[1px] bg-[#767676]`}></div>
                        <span className={`text-[#767676] mb-1`}>or</span>
                        <div className={`w-10 h-[1px] bg-[#767676]`}></div>
                    </div>
                    <div className={`flex items-center gap-2 m-auto`}>
                        <Image src={GoogleLogo} alt={"GoogleLogo"} width={30} height={30}/>
                        <span>Continue with Google ?</span>
                    </div>
                    <div className={`flex items-center gap-1 m-auto`}>
                        <span>Don't have an account yet?</span>
                        <Link href={"/"} className={`text-[#0F00E1]`}>Sign up</Link>
                    </div>
                    <Button className={`text-2xl mt-3 p-5`}>Login</Button>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;