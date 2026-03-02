"use client";
import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import ProfileSidebar from '@/components/organisms/ProfileSidebar';
import SubmissionHeatmap from '@/components/molecules/SubmissionHeatmap';
import RecentActivity from '@/components/molecules/RecentActivity';
import BadgesSection from '@/components/molecules/BadgesSection';
import SubmissionStats from '@/components/molecules/SubmissionStats';
import GridHighlights from '@/components/atoms/GridHighlights';
import { axiosInstanceSubmissionService, axiosInstanceProblemService } from '@/lib/axios';

const ProfileView = () => {
    const { authUser } = useAuthStore();
    const [stats, setStats] = React.useState({
        solved: { total: 0, easy: 0, medium: 0, hard: 0 },
        totalQuestions: { total: 0, easy: 0, medium: 0, hard: 0 },
        percentage: 0
    });
    const [activityData, setActivityData] = React.useState(Array.from({ length: 365 }, () => 0));
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const [statsRes, heatmapRes, totalQuestionsRes] = await Promise.all([
                    axiosInstanceSubmissionService.get('/submission/profile/stats'),
                    axiosInstanceSubmissionService.get('/submission/profile/heatmap'),
                    axiosInstanceProblemService.get('/problem/stats')
                ]);

                let solved = { total: 0, easy: 0, medium: 0, hard: 0 };
                let totalQuestions = { total: 0, easy: 0, medium: 0, hard: 0 };

                if (statsRes.data.success) {
                    solved = statsRes.data.stats.solved;
                }

                if (totalQuestionsRes.data.success) {
                    totalQuestions = totalQuestionsRes.data.stats;
                }

                setStats({
                    solved,
                    totalQuestions,
                    percentage: totalQuestions.total > 0
                        ? ((solved.total / totalQuestions.total) * 100).toFixed(1)
                        : 0
                });

                if (heatmapRes.data.success) {
                    const heatmap = heatmapRes.data.heatmap;
                    const today = new Date();
                    const dataArr = Array.from({ length: 371 }, (_, i) => {
                        const date = new Date(today);
                        date.setDate(today.getDate() - (370 - i));
                        const dateString = date.toISOString().split('T')[0];
                        return heatmap[dateString] || 0;
                    });
                    setActivityData(dataArr);
                }
            } catch (error) {
                console.error("Failed to fetch profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

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

export default ProfileView;
