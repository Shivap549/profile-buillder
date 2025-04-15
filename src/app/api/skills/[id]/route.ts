import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      console.log("No session or email found");
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, level } = await request.json();

    console.log("Updating skill for user:", session.user.email);

    const skill = await prisma.skill.update({
      where: {
        id: params.id,
        profile: {
          user: {
            email: session.user.email,
          },
        },
      },
      data: {
        name,
        level,
      },
    });

    console.log("Skill updated:", skill);

    return NextResponse.json(skill);
  } catch (error) {
    console.error("Skill update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      console.log("No session or email found");
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Deleting skill for user:", session.user.email);

    await prisma.skill.delete({
      where: {
        id: params.id,
        profile: {
          user: {
            email: session.user.email,
          },
        },
      },
    });

    console.log("Skill deleted successfully");

    return NextResponse.json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Skill deletion error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 