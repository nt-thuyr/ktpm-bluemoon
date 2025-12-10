import { Household } from "@/lib/types/household";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, UserCheck } from "lucide-react";

interface HouseholdDetailCardProps {
    household: Household;
}

export function HouseholdDetailCard({ household }: HouseholdDetailCardProps) {
    return (
        <Card className="border-l-4 border-l-blue-600 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-2xl font-bold text-blue-900">
                            Hộ khẩu số: {household.id}
                        </CardTitle>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Quản lý thông tin cư trú
                        </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 text-sm px-3 py-1">
                        Đang hoạt động
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <UserCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Chủ hộ hiện tại</p>
                            <p className="text-lg font-semibold text-slate-800">{household.chuHo}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Địa chỉ thường trú</p>
                            <p className="text-base font-medium text-slate-800">
                                {household.soNha} {household.duong}, {household.phuong}, {household.quan}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Ngày lập sổ</p>
                            <p className="text-base font-medium text-slate-800">{household.ngayLap}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}