import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CreditCard, Users } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-primary">
        Tổng quan tháng 11/2024
      </h2>

      {/* 3 cái thẻ Card thống kê nhanh */}
      <div className="grid gap-6 md:grid-cols-3">

        {/* CARD 1: Doanh thu */}
        <Card className="shadow-md border-slate-100 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng doanh thu
            </CardTitle>
            {/* Icon tiền tệ */}
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {/* Dùng text-primary (xanh đen) hoặc text-blue-600 nếu muốn nổi hẳn */}
            <div className="text-2xl font-bold text-primary">150.000.000 đ</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-600 font-medium">+20.1%</span> so với tháng trước
            </p>
          </CardContent>
        </Card>

        {/* CARD 2: Cảnh báo đóng phí */}
        <Card className="shadow-md border-slate-100 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Căn hộ chưa đóng phí
            </CardTitle>
            {/* Icon cảnh báo màu đỏ */}
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">12 Căn</div>
            <p className="text-xs text-muted-foreground mt-1">
              Cần nhắc nhở ngay
            </p>
          </CardContent>
        </Card>

        {/* CARD 3: Cư dân */}
        <Card className="shadow-md border-slate-100 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng cư dân
            </CardTitle>
            {/* Icon người */}
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">450</div>
            <p className="text-xs text-muted-foreground mt-1">
              Người đang sinh sống
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}