// lib/adminGuard.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Verifies the request is from an authenticated admin user.
 * Returns { session, user } on success, or a NextResponse on failure.
 *
 * Usage:
 *   const guard = await requireAdmin();
 *   if (guard instanceof NextResponse) return guard;
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true, email: true },
  });

  if (!user || user.role !== "admin") {
    return NextResponse.json(
      { success: false, error: "Admin access required" },
      { status: 403 }
    );
  }

  return { session, user };
}
