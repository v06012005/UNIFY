"use client"

import {Input} from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Image from "next/image";
import Logo from "@/public/images/unify_1.svg";
import {Button} from "@/components/ui/button";
import DateSelector from "@/components/global/DateInput";
import {useState} from "react";
import Link from "next/link";

const RegisterPage = () => {

    const [date, setDate] = useState({
       day: "",
       month: "",
       year: ""
    });

    const submit = (e) => {
        e.preventDefault();
    }


    return (
        <div className={`w-full h-screen grid place-content-center`}>
            <div align={'center'}>
                <form onSubmit={(e) => submit(e)}>
                    <div className={`grid gap-5`}>
                        <div>
                            <Image src={Logo} alt={"Logo"} width={200} height={200} className={`mr-7`}/>
                        </div>
                        <div className={`flex gap-2`}>
                            <div className={`basis-1/2`}>
                                <Input placeholder="First Name" className={`h-12`}/>
                            </div>
                            <div className={`basis-1/2`}>
                                <Input placeholder="Last Name" className={`h-12`}/>
                            </div>
                        </div>
                        <Input placeholder="User name" className={`h-12`}/>
                        <Input placeholder="Email" className={`h-12`}/>
                        <Input placeholder="Password" className={`h-12`}/>
                        <Input placeholder="Confirm Password" className={`h-12`}/>
                        <div className={`flex gap-2`}>
                            <RadioGroup className={`flex gap-2`}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="male" id="r1"/>
                                    <Label htmlFor="r1">Male</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="female" id="r2"/>
                                    <Label htmlFor="r2">Female</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <DateSelector day={date.day} month={date.month} year={date.year}/>
                        <div className={`flex items-center gap-1 m-auto`}>
                            <span>Do you have an account?</span>
                            <Link href={"/login"} className={`text-[#0F00E1]`}>Sign in</Link>
                        </div>
                        <Button className={`text-2xl p-6 mt-3`}>Sign Up</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage;