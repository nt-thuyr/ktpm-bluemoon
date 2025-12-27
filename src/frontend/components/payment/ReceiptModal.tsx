import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { PaymentReceipt } from "@/lib/types/models/payment";
import { Printer } from "lucide-react";
import { useRef } from "react";

interface ReceiptModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: PaymentReceipt | null;
    isLoading: boolean;
}

export function ReceiptModal({
    open,
    onOpenChange,
    data,
    isLoading,
}: ReceiptModalProps) {
    const printRef = useRef<HTMLDivElement>(null);

    // Hàm format tiền tệ
    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    // Hàm xử lý in
    const handlePrint = () => {
        if (!printRef.current) return;

        const content = printRef.current.innerHTML;
        const printWindow = window.open("", "", "height=600,width=800");

        if (printWindow) {
            printWindow.document.write("<html><head><title>In Hóa Đơn</title>");
            // CSS dành riêng cho lúc in -> copy y hệt style của Preview
            printWindow.document.write(`
        <style>
          @page { size: A5 landscape; margin: 0; }
          body { font-family: 'Times New Roman', serif; margin: 0; padding: 20px; display: flex; justify-content: center; }
          .receipt-wrapper { width: 100%; max-width: 700px; }
          
          /* Các class CSS tái sử dụng từ Tailwind để đảm bảo in ra giống hệt preview */
          .border-double { border: 4px double #000; }
          .p-8 { padding: 32px; }
          .text-center { text-align: center; }
          .uppercase { text-transform: uppercase; }
          .font-bold { font-weight: bold; }
          .text-2xl { font-size: 24px; }
          .mb-1 { margin-bottom: 4px; }
          .mb-6 { margin-bottom: 24px; }
          .italic { font-style: italic; }
          .text-sm { font-size: 14px; }
          .flex { display: flex; }
          .justify-between { justify-content: space-between; }
          .items-end { align-items: flex-end; }
          .w-32 { width: 128px; }
          .flex-1 { flex: 1; }
          .border-b { border-bottom: 1px dotted #333; } /* Đổi solid thành dotted cho dòng kẻ */
          .mt-1 { margin-top: 4px; }
          .mt-8 { margin-top: 32px; }
          .h-24 { height: 96px; }
          .gap-1 { gap: 4px; }
        </style>
      `);
            printWindow.document.write("</head><body>");
            printWindow.document.write(`<div class="receipt-wrapper">${content}</div>`);
            printWindow.document.write("</body></html>");
            printWindow.document.close();

            // Đợi load style xong mới in
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        }
    };

    // Component dòng thông tin (để code gọn hơn)
    const ReceiptRow = ({ label, value }: { label: string; value: string }) => (
        <div className="flex items-end mb-2">
            <span className="font-bold min-w-[130px] text-base">{label}</span>
            <div className="flex-1 border-b border-dotted border-gray-400 pl-2 pb-1 text-base text-gray-800">
                {value}
            </div>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl bg-gray-50">
                <DialogHeader>
                    <DialogTitle>Xem trước Hóa Đơn</DialogTitle>
                </DialogHeader>

                {isLoading || !data ? (
                    <div className="h-64 flex items-center justify-center">
                        <p className="text-muted-foreground animate-pulse">
                            Đang tạo mẫu hóa đơn...
                        </p>
                    </div>
                ) : (
                    /* VÙNG PREVIEW */
                    /* Dùng font-serif để ép về Times New Roman */
                    <div className="flex justify-center py-4">
                        <div
                            ref={printRef}
                            className="bg-white text-black font-serif w-full max-w-[700px] border-4 border-double border-gray-800 p-8 shadow-sm"
                            style={{ fontFamily: '"Times New Roman", Times, serif' }} // Ép cứng font inline để chắc chắn
                        >
                            {/* Header */}
                            <div className="text-center mb-6">
                                <p className="font-bold text-xs uppercase tracking-wider mb-1">
                                    UBND Phường X - Tổ Dân Phố Y
                                </p>
                                <h1 className="text-3xl font-bold uppercase mt-3 mb-2 tracking-wide">
                                    Biên Lai Thu Tiền
                                </h1>
                                <div className="flex justify-center gap-4 italic text-sm text-gray-600">
                                    <span>Mã số: <b>#{data.maBienLai}</b></span>
                                    <span>-</span>
                                    <span>Ngày lập: {data.ngayNop}</span>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="space-y-1">
                                <ReceiptRow label="Họ và tên:" value={data.nguoiNop} />
                                <ReceiptRow label="CCCD/CMND:" value={data.cccd || "...................................."} />
                                <ReceiptRow label="Địa chỉ:" value={data.diaChi || "...................................."} />
                                <ReceiptRow label="Nội dung thu:" value={data.tenKhoanThu} />

                                {/* Dòng tiền đặc biệt hơn chút */}
                                <div className="flex items-end mt-4">
                                    <span className="font-bold min-w-[130px] text-base">Số tiền nộp:</span>
                                    <div className="flex-1 border-b border-dotted border-gray-400 pl-2 pb-1 text-xl font-bold">
                                        {formatMoney(data.soTien)}
                                    </div>
                                </div>

                                <p className="italic text-sm text-right mt-2 text-gray-500">
                                    (Bằng chữ: ..........................................................................................)
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between mt-10 text-center">
                                <div className="w-1/2">
                                    <p className="font-bold text-base uppercase">Người nộp tiền</p>
                                    <p className="italic text-sm text-gray-500">(Ký, ghi rõ họ tên)</p>
                                    <div className="h-24"></div> {/* Khoảng trống để ký */}
                                </div>
                                <div className="w-1/2">
                                    <p className="font-bold text-base uppercase">Người thu tiền</p>
                                    <p className="italic text-sm text-gray-500">(Ký, ghi rõ họ tên)</p>
                                    <div className="h-24"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter className="sm:justify-between">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                    >
                        Đóng
                    </Button>
                    <Button type="button" onClick={handlePrint} disabled={isLoading || !data}>
                        <Printer className="mr-2 h-4 w-4" />
                        In hóa đơn
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}