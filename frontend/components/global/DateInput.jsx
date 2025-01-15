"use client"

import {useEffect, useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

const DateSelector = ({day, month, year}) => {

    const [date, setDate] = useState({
       day: day,
       month: month,
       year: year,
    });

    const [days, setDays] = useState(Array.from({length: 31}, (_, i) => i + 1));
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const currentYear = new Date().getFullYear();
    const years = Array.from({length: 101}, (_, i) => currentYear - i);
    const getDaysInMonth = (month, year) => {
        if(month === undefined || !year) return [];
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return Array.from({length: daysInMonth}, (_, i) => i + 1);
    }

    const handleChange = (name, value) => {
        setDate((prevDate) => ({
            ...prevDate,
            [name]: value,
        }));
    }

    useEffect(() => {
        if(date.month && date.year){
            const monthIndex = months.indexOf(date.month);
            console.log(getDaysInMonth(monthIndex, date.year));
            setDays(getDaysInMonth(monthIndex, date.year));
        }
    }, [date.month, date.year]);

    return (
        <div className={`flex gap-4`}>
            <Select value={date.month}
                    onValueChange={(value) => handleChange("month", value)}>
                <SelectTrigger>
                    <SelectValue placeholder={'mm/'} />
                </SelectTrigger>
                <SelectContent>
                    {
                        months.map(month => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>
            <Select value={date.day}
                    onValueChange={(value) => handleChange("day", value)}>
                <SelectTrigger>
                    <SelectValue placeholder={'dd/'} />
                </SelectTrigger>
                <SelectContent>
                    {
                        days.map(day => (
                            <SelectItem key={day} value={String(day)}>{day}</SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>
            <Select value={date.year}
                    onValueChange={(value) => handleChange("year", value)}>
                <SelectTrigger>
                    <SelectValue placeholder={'yyyy/'} />
                </SelectTrigger>
                <SelectContent>
                    {
                        years.map(year => (
                            <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>
        </div>
    )
}

export default DateSelector;