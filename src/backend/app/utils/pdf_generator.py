import os
from fpdf import FPDF
from num2words import num2words
from datetime import datetime

FONT_PATH = os.path.join(os.path.dirname(__file__), '../static/fonts/times.ttf')


class ReceiptPDF(FPDF):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if os.path.exists(FONT_PATH):
            self.add_font('FreeSerif', '', FONT_PATH)
            self.set_font('FreeSerif', '', 12)
        else:
            self.set_font('Arial', '', 12)


def create_receipt_pdf(data: dict) -> bytes:
    pdf = ReceiptPDF()
    pdf.add_page()

    # --- PHẦN 1: QUỐC HIỆU TIÊU NGỮ ---
    pdf.set_font_size(11)
    pdf.cell(0, 5, 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', align='C', new_x="LMARGIN", new_y="NEXT")

    pdf.set_font_size(12)  # Đậm hơn hoặc to hơn chút
    # Vẽ gạch chân bên dưới Độc lập tự do hạnh phúc
    pdf.cell(0, 6, 'Độc lập - Tự do - Hạnh phúc', align='C', new_x="LMARGIN", new_y="NEXT")

    # Vẽ đường kẻ nhỏ dưới tiêu ngữ
    line_width = 40
    x_center = pdf.w / 2
    y_line = pdf.get_y()
    pdf.line(x_center - line_width / 2, y_line, x_center + line_width / 2, y_line)

    pdf.ln(10)

    # --- PHẦN 2: TÊN GIẤY ---
    pdf.set_font_size(16)
    pdf.cell(0, 10, 'GIẤY BIÊN NHẬN TIỀN', align='C', new_x="LMARGIN", new_y="NEXT")
    pdf.set_font_size(10)
    pdf.cell(0, 5, f"(Mã phiếu: #{data['ma_bien_lai']})", align='C', new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)

    # --- PHẦN 3: NỘI DUNG CHÍNH ---
    pdf.set_font_size(12)
    line_height = 8

    # Hàm hỗ trợ in dòng có chấm chấm
    def print_line(label, content):
        # In nhãn
        pdf.write(line_height, label)
        # In nội dung (Đậm hơn một chút nếu muốn, ở đây giữ nguyên)
        pdf.write(line_height, f" {content}")
        pdf.ln(line_height)

    # 1. Tên tôi là
    # Ở đây mặc định là Ban quản lý hoặc Kế toán viên
    print_line("Tên tôi là:", "Ban Quản Lý Chung Cư BlueMoon")

    # 2. Đơn vị công tác
    print_line("Đơn vị công tác:", "Phòng Kế Toán - BQL BlueMoon")

    # 3. Có nhận của ông bà
    print_line("Có nhận của ông bà:", str(data['nguoi_nop']))

    # 4. Số CMND (CCCD)
    print_line("Số CMND/CCCD:", str(data['cccd']))

    # 5. Số tiền (Số)
    so_tien_format = "{:,.0f} VNĐ".format(data['so_tien'])
    print_line("Số tiền:", so_tien_format)

    # 6. Bằng chữ
    # Sử dụng thư viện num2words để chuyển số thành chữ
    try:
        tien_chu = num2words(data['so_tien'], lang='vi').capitalize() + " đồng chẵn."
    except:
        tien_chu = "................................................................"

    print_line("Bằng chữ:", tien_chu)

    # 7. Về việc (Lý do nộp)
    # Ghép địa chỉ vào lý do cho rõ ràng
    ly_do = f"Nộp {data['ten_khoan_thu']}"
    print_line("Về việc:", ly_do)

    pdf.ln(10)

    # --- PHẦN 4: NGÀY THÁNG VÀ CHỮ KÝ ---

    # Lấy ngày nộp hoặc ngày hiện tại
    ngay_nop = data.get('ngay_nop')
    if not ngay_nop:
        ngay_nop = datetime.now()

    # Định dạng ngày tháng kiểu "... ngày ... tháng ... năm ..."
    ngay_thang_str = f"Hà Nội, ngày {ngay_nop.day} tháng {ngay_nop.month} năm {ngay_nop.year}"

    # Căn phải ngày tháng
    pdf.cell(0, 6, ngay_thang_str, align='R', new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)

    # Khu vực chữ ký (Chia làm 2 cột)
    y_sig = pdf.get_y()

    # Cột trái: Người nộp tiền
    pdf.cell(90, 6, "Người nộp tiền", align='C')

    # Cột phải: Người nhận tiền
    pdf.cell(0, 6, "Người nhận tiền", align='C', new_x="LMARGIN", new_y="NEXT")

    pdf.set_font_size(10)
    pdf.cell(90, 5, "(Ký, ghi rõ họ tên)", align='C')
    pdf.cell(0, 5, "(Ký, ghi rõ họ tên)", align='C', new_x="LMARGIN", new_y="NEXT")

    # Chừa chỗ ký
    pdf.ln(25)

    pdf.set_font_size(12)
    # Tên người nộp bên trái
    pdf.cell(90, 6, str(data['nguoi_nop']), align='C')

    # Tên người thu bên phải
    pdf.cell(0, 6, "BQL BlueMoon", align='C', new_x="LMARGIN", new_y="NEXT")

    return pdf.output()