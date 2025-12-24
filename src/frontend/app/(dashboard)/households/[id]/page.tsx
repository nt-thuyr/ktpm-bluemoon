"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    IconArrowLeft,
    IconCalendar,
    IconHome,
    IconUsers,
} from "@tabler/icons-react";

export default function HouseholdsDetailPage() {



    return (
        <div className="flex flex-col gap-6 py-6 px-12">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-foreground"
                >
                    <IconArrowLeft className="h-4 w-4" />
                    Back to Apartments
                </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>Apartment Name</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {apartment.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <IconHome className="size-5" />
                            <span>ID: {apartment.id}</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>Area</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {apartment.area} m²
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <span>Usable area</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>Residents</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {apartment.residentCount}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <IconUsers className="size-5" />
                            <span>Current residents</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>Created Date</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {format(new Date(apartment.date_created), "dd/MM/yyyy")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <IconCalendar className="size-5" />
                            <span>Date added to system</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <h2 className="text-xl font-semibold mt-4 mb-2 flex items-center gap-2">
                <IconUsers className="h-5 w-5 text-primary" />
                Residents in this Apartment
            </h2>
            <ResidentsTable
                residents={residents}
                onCreate={handleCreateResident}
                onEdit={handleEditResident}
                onDelete={handleDeleteResident}
                apartmentId={apartment?.id}
            />
        </div>
    );
}