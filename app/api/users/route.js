// app/api/users/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Get the session and log it for debugging
    const session = await getServerSession(authOptions);
    console.log("Session data:", session);

    // If there's no session, return unauthorized
    if (!session) {
      console.log("No session found");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Fetch the complete user data including role
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    console.log("Current user role:", currentUser?.role);

    // Check for admin role
    if (currentUser?.role !== "admin") {
      console.log("User is not an admin");
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Fetch all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        image: true,
      },
      orderBy: {
        email: "asc",
      },
    });

    console.log(`Found ${users.length} users`);

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error in users API route:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
