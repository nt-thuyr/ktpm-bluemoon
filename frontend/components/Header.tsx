'use client'
import { faArrowLeft, faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="w-full px-6 py-3 rounded-md" style={{ backgroundColor: '#012F45' }}>
            <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                {/* NAV */}
                <nav>
                    <ul className="flex items-center gap-8 text-white text-base">
                        <li>
                            <Link href="/" className="inline-flex items-center gap-2">
                                <span className="font-medium text-yellow-400">Trang chủ</span>
                                {/* mảnh underline dưới text */}
                                <span
                                    className="block h-[2px] w-8 rounded-full mt-1"
                                    style={{ backgroundColor: '#FFC300' }}
                                />
                            </Link>
                        </li>

                        <li>
                            <Link href="/apartments" className="inline-flex items-center gap-2 text-white/90 hover:text-white transition">
                                {/* icon nhỏ — dùng class để scale */}
                                <FontAwesomeIcon icon={faHome} className="text-sm" />
                                <span>Căn hộ</span>
                            </Link>
                        </li>

                        <li>
                            <Link href="/residents" className="text-white/90 hover:text-white transition">Cư dân</Link>
                        </li>

                        <li>
                            <Link href="#" className="text-white/90 hover:text-white transition">Khoản thu</Link>
                        </li>

                        <li>
                            <Link href="#" className="text-white/90 hover:text-white transition">Thống kê</Link>
                        </li>

                        <li>
                            <Link href="#" className="text-white/90 hover:text-white transition">Cài đặt</Link>
                        </li>
                    </ul>
                </nav>

                {/* SEARCH */}
                <form
                    className="flex items-center gap-3 px-3 py-1.5 rounded-md"
                    style={{ backgroundColor: '#075A8F' }}
                    onSubmit={(e) => e.preventDefault()}
                >
                    {/* mấy icon nhỏ, opacity nhẹ */}
                    <FontAwesomeIcon icon={faArrowLeft} className="text-[14px] text-white/90" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm"
                        className="bg-transparent outline-none text-sm text-white placeholder-white/80"
                        aria-label="Tìm kiếm"
                    />
                    <FontAwesomeIcon icon={faSearch} className="text-[14px] text-white/90" />
                    <button
                        type="button"
                        className="ml-1 text-white/90 text-sm font-medium hover:text-white"
                        aria-label="Đóng tìm kiếm"
                    >
                        X
                    </button>
                </form>
            </div>
        </header>
    );
}
