"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// --- 1. IMPORT TYPE ---
import { CreatePaymentRequest } from "@/lib/types/models/payment";
import { Household, HouseholdMember } from "@/lib/types/models/household";
import { Fee } from "@/lib/types/models/fee";

// --- 2. IMPORT SERVICES ---
import { householdApi } from "@/lib/services/households"; 
import { feeApi } from "@/lib/services/fee";

interface PaymentCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreatePaymentRequest) => Promise<void>;
  isLoading: boolean;
}

export function PaymentCreateModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: PaymentCreateModalProps) {
  
  // State data
  const [households, setHouseholds] = useState<Household[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
  const [members, setMembers] = useState<HouseholdMember[]>([]); // List thành viên để chọn người nộp

  // State hiển thị Popover
  const [openHousehold, setOpenHousehold] = useState(false);
  const [openFee, setOpenFee] = useState(false);
  const [openPayer, setOpenPayer] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    hoKhauId: 0,
    khoanThuId: 0,
    soTien: "",
    nguoiNop: "",
    ngayNop: new Date().toISOString().split("T")[0],
  });

  // --- LOAD DỮ LIỆU BAN ĐẦU ---
  useEffect(() => {
    if (open) {
      // Reset form
      setFormData({
        hoKhauId: 0,
        khoanThuId: 0,
        soTien: "",
        nguoiNop: "",
        ngayNop: new Date().toISOString().split("T")[0],
      });
      setMembers([]);

      const fetchData = async () => {
        try {
          const [hkList, feeList] = await Promise.all([
            householdApi.getHouseholds(),
            feeApi.getFees()
          ]);
          setHouseholds(hkList);
          setFees(feeList);
        } catch (error) {
          console.error("Lỗi tải dữ liệu:", error);
        }
      };
      fetchData();
    }
  }, [open]);

  // --- XỬ LÝ KHI CHỌN HỘ KHẨU ---
  const handleSelectHousehold = async (id: number) => {
    try {
        // 1. Tìm hộ khẩu trong list local (để lấy thông tin cơ bản hiển thị ngay)
        const selectedSimple = households.find(h => h.id === id);
        
        // 2. Gọi API chi tiết để lấy danh sách thành viên mới nhất
        const detail = await householdApi.getHouseholdById(id);
        
        if (detail) {
            // Cập nhật list thành viên từ field 'thanhVien' trong Model
            setMembers(detail.thanhVien || []);

            // Auto-fill tên người nộp bằng tên chủ hộ
            const tenChuHo = detail.tenChuHo || selectedSimple?.tenChuHo || "";
            
            setFormData(prev => ({
                ...prev,
                hoKhauId: id,
                nguoiNop: tenChuHo, 
            }));
        }
    } catch (e) {
        console.error("Lỗi lấy chi tiết hộ khẩu:", e);
    }
    setOpenHousehold(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      hoKhauId: formData.hoKhauId,
      khoanThuId: formData.khoanThuId,
      soTien: Number(formData.soTien),
      nguoiNop: formData.nguoiNop,
      ngayNop: formData.ngayNop,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white text-black">
        <DialogHeader>
          <DialogTitle>Ghi nhận thu phí</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          
          {/* --- 1. CHỌN HỘ KHẨU --- */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Hộ khẩu</Label>
            <div className="col-span-3">
              <Popover open={openHousehold} onOpenChange={setOpenHousehold}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox"
                    className={cn("w-full justify-between font-normal bg-white border-input hover:bg-white hover:text-black", !formData.hoKhauId && "text-muted-foreground")}>
                    {formData.hoKhauId
                      ? (() => {
                          const h = households.find((item) => item.id === formData.hoKhauId);
                          // Hiển thị: P101 - Nguyễn Văn A
                          return h ? `${h.soNha} - ${h.tenChuHo || 'Chưa có chủ hộ'}` : "Đã chọn";
                        })()
                      : "Chọn hộ khẩu..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Tìm số nhà, tên chủ hộ..." />
                    <CommandList className="max-h-[300px] overflow-y-auto">
                      <CommandEmpty>Không tìm thấy.</CommandEmpty>
                      <CommandGroup>
                        {households.map((h) => (
                          <CommandItem key={h.id}
                            // Value dùng để search: Kết hợp số nhà và tên chủ hộ
                            value={`${h.soNha} ${h.tenChuHo || ''}`} 
                            onSelect={() => handleSelectHousehold(h.id)}>
                            <Check className={cn("mr-2 h-4 w-4", formData.hoKhauId === h.id ? "opacity-100" : "opacity-0")} />
                            {h.soNha} - {h.tenChuHo || '(Trống)'}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* --- 2. CHỌN KHOẢN THU --- */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Khoản thu</Label>
            <div className="col-span-3">
              <Popover open={openFee} onOpenChange={setOpenFee}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox"
                    className={cn("w-full justify-between font-normal bg-white border-input hover:bg-white hover:text-black", !formData.khoanThuId && "text-muted-foreground")}>
                    {formData.khoanThuId
                      ? fees.find((f) => f.id === formData.khoanThuId)?.tenKhoanThu
                      : "Chọn khoản thu..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Tìm khoản thu..." />
                    <CommandList className="max-h-[300px] overflow-y-auto">
                      <CommandEmpty>Không tìm thấy.</CommandEmpty>
                      <CommandGroup>
                        {fees.map((f) => (
                          <CommandItem key={f.id} value={f.tenKhoanThu}
                            onSelect={() => {
                              setFormData(prev => ({
                                ...prev, khoanThuId: f.id,
                                soTien: f.soTien ? f.soTien.toString() : prev.soTien
                              }));
                              setOpenFee(false);
                            }}>
                            <Check className={cn("mr-2 h-4 w-4", formData.khoanThuId === f.id ? "opacity-100" : "opacity-0")} />
                            {f.tenKhoanThu}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* --- 3. SỐ TIỀN --- */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="soTien" className="text-right font-medium">Số tiền</Label>
            <Input id="soTien" type="number" className="col-span-3 bg-white" placeholder="0"
              value={formData.soTien}
              onChange={(e) => setFormData({ ...formData, soTien: e.target.value })}
            />
          </div>

          {/* --- 4. NGƯỜI NỘP --- */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Người nộp</Label>
            <div className="col-span-3">
              <Popover open={openPayer} onOpenChange={setOpenPayer}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox"
                    className={cn("w-full justify-between font-normal bg-white border-input hover:bg-white hover:text-black", !formData.nguoiNop && "text-muted-foreground")}>
                    {formData.nguoiNop || "Nhập tên người nộp..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Tìm hoặc nhập tên..." 
                       onValueChange={(val) => setFormData({...formData, nguoiNop: val})}/>
                    <CommandList className="max-h-[300px] overflow-y-auto">
                      <CommandEmpty className="py-2 px-4 text-sm text-muted-foreground">
                         Nhấn Enter để dùng tên "{formData.nguoiNop}"
                      </CommandEmpty>
                      <CommandGroup heading="Thành viên trong hộ">
                        {members.map((mem) => (
                          <CommandItem key={mem.id} value={mem.hoTen}
                            onSelect={(val) => {
                              setFormData({ ...formData, nguoiNop: val });
                              setOpenPayer(false);
                            }}>
                            <Check className={cn("mr-2 h-4 w-4", formData.nguoiNop === mem.hoTen ? "opacity-100" : "opacity-0")} />
                            {mem.hoTen} ({mem.quanHe || 'Thành viên'})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* --- 5. NGÀY NỘP --- */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ngayNop" className="text-right font-medium">Ngày nộp</Label>
            <Input id="ngayNop" type="date" className="col-span-3 bg-white"
              value={formData.ngayNop}
              onChange={(e) => setFormData({ ...formData, ngayNop: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Xác nhận thu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}