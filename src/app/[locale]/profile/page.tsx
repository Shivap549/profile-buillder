import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/profile/profile-form";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage({
  params
}: {
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);
  const { locale } = params;

  if (!session) {
    redirect(`/${locale}/login`);
  }

  const profile = await prisma.profile.findUnique({
    where: {
      userId: session.user.id
    }
  });

  const transformedProfile = profile ? {
    name: session.user.name || '',
    email: session.user.email || '',
    bio: profile.summary || ''
  } : undefined;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">Profile</h1>
            <ProfileForm initialData={transformedProfile} />
          </div>
        </div>
      </div>
    </div>
  );
} 