import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href={`/${locale}/profile`} className="block">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                  <h2 className="text-lg font-semibold mb-2">Profile</h2>
                  <p className="text-gray-600 dark:text-gray-300">Manage your professional profile</p>
                </div>
              </Link>
              <Link href={`/${locale}/experience`} className="block">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                  <h2 className="text-lg font-semibold mb-2">Experience</h2>
                  <p className="text-gray-600 dark:text-gray-300">Add and edit your work experience</p>
                </div>
              </Link>
              <Link href={`/${locale}/education`} className="block">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                  <h2 className="text-lg font-semibold mb-2">Education</h2>
                  <p className="text-gray-600 dark:text-gray-300">Manage your educational background</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 