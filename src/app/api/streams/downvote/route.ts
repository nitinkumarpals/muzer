import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if(!session?.user?.email){
    return NextResponse.json({error: "Unauthorized"}, {status: 401})
  }
}
