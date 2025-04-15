import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ExperienceForm from "@/components/experience/experience-form";
import { prisma } from "@/lib/prisma";

export default async function ExperiencePage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  const experiences = await prisma.experience.findMany({
    where: {
      profile: {
        userId: session.user.id
      }
    },
    orderBy: {
      startDate: 'desc'
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">Work Experience</h1>
            {experiences.length > 0 ? (
              <div className="space-y-6">
                {experiences.map((experience) => (
                  <div key={experience.id} className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <ExperienceForm 
                      initialData={{
                        ...experience,
                        current: !experience.endDate,
                        startDate: experience.startDate.toISOString().split('T')[0],
                        endDate: experience.endDate?.toISOString().split('T')[0] || '',
                        description: experience.description || ''
                      }} 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <ExperienceForm />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 