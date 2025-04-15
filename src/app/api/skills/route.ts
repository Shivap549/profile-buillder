import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      console.log("No session or email found");
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Fetching skills for user:", session.user.email);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profile: {
          include: {
            skills: true,
          },
        },
      },
    });

    if (!user?.profile) {
      return NextResponse.json([]);
    }

    return NextResponse.json(user.profile.skills);
  } catch (error) {
    console.error("Skills fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    console.log("Adding skill for user:", session.user.email);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profile: true,
      },
    });

    if (!user) {
      console.log("User not found:", session.user.email);
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    let profile = user.profile;

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId: user.id,
        },
      });
    }

    const skill = await prisma.skill.create({
      data: {
        profileId: profile.id,
        name,
        level: level || 1,
      },
    });

    console.log("Skill created:", skill);

    return NextResponse.json(skill);
  } catch (error) {
    console.error("Skill creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 