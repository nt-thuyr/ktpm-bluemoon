"use client";
import LoginForm from "@/components/login-form";
import { Building2, GalleryVerticalEnd } from "lucide-react";
import { useEffect, useState } from "react";

const images = ["/apartment1.jpg", "/apartment2.jpg", "/apartment3.jpg"];

export default function AuthPage() {
    const [current, setCurrent] = useState(0);
    const [fade, setFade] = useState(true);
    // Logic chuyển ảnh (Fade out -> Đổi ảnh -> Fade in)
    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrent((prev) => (prev + 1) % images.length);
                setFade(true);
            }, 500);
        }, 8000); //8s doi anh 1 lan
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            {/* CỘT TRÁI: FORM */}
            <div className="flex flex-col gap-4 p-6 md:p-10 bg-muted/30">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-bold text-primary">
                        <div className="bg-primary text-white flex size-8 items-center justify-center rounded-md shadow-sm">
                            <GalleryVerticalEnd className="size-5" />
                        </div>
                        Group 4 Inc.
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-l">
                        <LoginForm />
                    </div>
                </div>
            </div>

            {/* CỘT PHẢI: ẢNH SLIDER */}
            <div className="relative hidden lg:block bg-primary/10 overflow-hidden">
                <img
                    src={images[current]}
                    alt="Chung cư cao cấp"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'
                        }`}
                />
                {/* Lớp phủ màu đen mờ để ảnh nhìn "xịn" hơn */}
                <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
                {/* Text chạy trên ảnh */}
                <div className="absolute bottom-10 left-10 z-20 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-6 w-6 text-blue-400" />
                        <span className="font-semibold text-blue-100">Smart Building</span>
                    </div>
                    <h2 className="text-3xl font-bold leading-tight">
                        Kiến tạo không gian sống <br /> Đẳng cấp & Tiện nghi
                    </h2>
                </div>
            </div>
        </div>
    );
}