import ordersModel from "@/app/models/ordersModel";
import productsModel from "@/app/models/productsModel";
import { ConnectDB } from "@/config/db";
import { NextResponse } from "next/server";

const loadDB = async () => {
    await ConnectDB();
};

loadDB();
export async function POST (req: Request, res: Response){
    console.log('working');
    try {
        const data = await req.json();
        console.log(data)
        const newProduct = await productsModel.create(data);
        return NextResponse.json({ data: newProduct }, { status: 200 });
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
export async function DELETE(request:Request){
    console.log('working');
    const req=await request.json()
    console.log(req)
    
    console.log('working');
    try {
        const res= await productsModel.findByIdAndDelete(req.productID)
        console.log(res);

     return new Response(JSON.stringify(res),{
            headers: { 'Content-Type': 'application/json' },
                status:200
            }
        )
   
    }
    catch(error:any){

        //  return NextResponse.json({msg:'error'}),
        //  {status:500}
        return Response.json({ error: error.message }, { status: 500 });
     }
   

}
export async function PUT(request:Request){
    const { searchParams } = new URL(request.url);
    const productID = searchParams.get("productID") 
    console.log('working');
    const req=await request.json()
    console.log(req)
    
    console.log('working');
    try {
        const res = await productsModel.findByIdAndUpdate(productID, req, { new: true, runValidators: true });
        return NextResponse.json({data:res},{status:200})
    }
    catch(error:any){
        console.log(error.message)
        return Response.json({ error: error.message }, { status: 500 });
     
    }
}
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const search = searchParams.get("search") || "";
    const all = searchParams.get("all") === "true";
    const limit = all ? 0 : 10; // If all is true, don't limit the results
    const skip = all ? 0 : (page - 1) * limit;

    try {
        // Create search query
        const searchQuery = search 
            ? { title: { $regex: search, $options: 'i' } }
            : {};

        // First get total count with search filter
        const totalProducts = await productsModel.countDocuments(searchQuery);
        
        // Then get products with search filter and proper sorting
        const products = await productsModel.find(searchQuery)
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        return NextResponse.json({
            data: products,
            total: totalProducts,
            currentPage: page,
            totalPages: all ? 1 : Math.ceil(totalProducts / limit),
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}
