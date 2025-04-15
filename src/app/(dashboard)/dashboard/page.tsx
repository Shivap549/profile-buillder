import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {session?.user?.name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Start building your professional profile by adding your information in the
          sections below.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/dashboard/profile"
          className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-medium text-gray-900">Profile</h2>
          <p className="mt-2 text-sm text-gray-600">
            Add your personal information and professional summary.
          </p>
        </Link>

        <Link
          href="/dashboard/education"
          className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-medium text-gray-900">Education</h2>
          <p className="mt-2 text-sm text-gray-600">
            Add your educational background and qualifications.
          </p>
        </Link>

        <Link
          href="/dashboard/experience"
          className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-medium text-gray-900">Experience</h2>
          <p className="mt-2 text-sm text-gray-600">
            Add your work experience and professional history.
          </p>
        </Link>

        <Link
          href="/dashboard/skills"
          className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-medium text-gray-900">Skills</h2>
          <p className="mt-2 text-sm text-gray-600">
            Add your professional skills and expertise.
          </p>
        </Link>
      </div>
    </div>
  );
} 