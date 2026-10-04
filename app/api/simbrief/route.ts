import { NextResponse } from "next/server";

export async function GET(request: Request) {

    //testing route
    return NextResponse.json({ message: "SimBrief API route is working!" });

}
