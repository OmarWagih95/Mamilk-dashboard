import { ConnectDB } from "@/config/db";
import HeroCarouselModel from "@/app/models/heroCarouselModel";
import { NextResponse } from "next/server";

const loadDB = async () => {
    await ConnectDB();
};

loadDB();

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const newItem = await HeroCarouselModel.create(data);
        return NextResponse.json({ data: newItem }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const isActive = searchParams.get("isActive");
        
        let query = {};
        if (isActive !== null) {
            query = { isActive: isActive === "true" };
        }

        const items = await HeroCarouselModel.find(query).sort({ order: 1, createdAt: -1 });
        return NextResponse.json({ data: items }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }
        const data = await req.json();
        const updatedItem = await HeroCarouselModel.findByIdAndUpdate(id, data, { new: true });
        return NextResponse.json({ data: updatedItem }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }
        await HeroCarouselModel.findByIdAndDelete(id);
        return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
