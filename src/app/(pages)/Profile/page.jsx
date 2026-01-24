"use client";
import React, { useMemo } from 'react';
import { useAuthStore } from '@/app/store/useAuthStore';
import ProfileSidebar from '@/app/components/profile/ProfileSidebar';
import SubmissionHeatmap from '@/app/components/profile/SubmissionHeatmap';
import RecentActivity from '@/app/components/profile/RecentActivity';
import BadgesSection from '@/app/components/profile/BadgesSection';
import SubmissionStats from '@/app/components/profile/SubmissionStats';
import GridHighlights from '@/app/components/GridHighlights';
import { useProfileStore } from '@/app/store/useProfileStore';
import { UserCircle } from 'lucide-react';

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const { stats, activityData, fetchProfileData, isLoadingStats } = useProfileStore();

  React.useEffect(() => {
    if (authUser?.id) {
      fetchProfileData(authUser.id);
    }
  }, [authUser, fetchProfileData]);

  return (
    <div className="min-h-screen bg-base-300 text-base-content font-sans overflow-hidden relative pb-20 ">
      {/* Global Background Grid */}
      <div className="absolute top-0 left-0 w-full h-[100vh] [mask-image:linear-gradient(to_bottom,black_40%,transparent)] pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <GridHighlights />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">


        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <ProfileSidebar user={authUser} />
          </aside>

          <main className="lg:col-span-3 space-y-8">
            <SubmissionStats stats={stats} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <BadgesSection />
              <RecentActivity />
            </div>
            <SubmissionHeatmap data={activityData} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;