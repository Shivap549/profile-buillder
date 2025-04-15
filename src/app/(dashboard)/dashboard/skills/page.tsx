"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from 'next-intl';
import { useUIStore } from '@/store/ui-store';

interface Skill {
  id: string;
  name: string;
  level: number;
}

export default function SkillsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations('skills');
  const theme = useUIStore((state) => state.theme);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({ name: "", level: 1 });

  useEffect(() => {
    const fetchSkills = async () => {
      if (status !== "authenticated") {
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch("/api/skills");
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || t('error.fetch'));
        }
        const data = await response.json();
        setSkills(data);
      } catch (error) {
        console.error("Error fetching skills:", error);
        setError(error instanceof Error ? error.message : t('error.fetch'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, [status, t]);

  const handleAddSkill = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSkill),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || t('error.add'));
      }

      const data = await response.json();
      setSkills([...skills, data]);
      setNewSkill({ name: "", level: 1 });
      setSuccess(t('success.added'));
      setError(null);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : t('error.add'));
      setSuccess(null);
    }
  };

  const handleUpdateSkill = async (id: string, name: string, level: number) => {
    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, level }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || t('error.update'));
      }

      const data = await response.json();
      setSkills(skills.map((skill) => (skill.id === id ? data : skill)));
      setSuccess(t('success.updated'));
      setError(null);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : t('error.update'));
      setSuccess(null);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || t('error.delete'));
      }

      setSkills(skills.filter((skill) => skill.id !== id));
      setSuccess(t('success.deleted'));
      setError(null);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : t('error.delete'));
      setSuccess(null);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {t('description')}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-300 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleAddSkill} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('skillName')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newSkill.name}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="level"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('skillLevel')}
              </label>
              <input
                type="number"
                id="level"
                name="level"
                min="1"
                max="5"
                value={newSkill.level}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, level: parseInt(e.target.value) })
                }
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {t('addSkill')}
          </button>
        </form>

        <div className="space-y-4">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {skill.name}
                </h3>
                <div className="mt-1 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`h-2 w-2 rounded-full mx-1 ${
                        i < skill.level
                          ? 'bg-blue-600 dark:bg-blue-400'
                          : 'bg-gray-300 dark:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdateSkill(skill.id, skill.name, skill.level)}
                  className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  {t('edit')}
                </button>
                <button
                  onClick={() => handleDeleteSkill(skill.id)}
                  className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  {t('delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 