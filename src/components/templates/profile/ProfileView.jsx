"use client";
import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import GridHighlights from '@/components/atoms/GridHighlights';
import Skeleton from '@/components/atoms/Skeleton';
import { axiosInstanceSubmissionService, axiosInstanceProblemService } from '@/lib/axios';

const ProfileSidebar = React.lazy(() => import('@/components/organisms/ProfileSidebar'));
const SubmissionHeatmap = React.lazy(() => import('@/components/molecules/SubmissionHeatmap'));
const RecentActivity = React.lazy(() => import('@/components/molecules/RecentActivity'));
const BadgesSection = React.lazy(() => import('@/components/molecules/BadgesSection'));
const SubmissionStats = React.lazy(() => import('@/components/molecules/SubmissionStats'));

const ProfileView = () => {
    const { authUser } = useAuthStore();
    const [stats, setStats] = React.useState({
        solved: { total: 0, easy: 0, medium: 0, hard: 0 },
        totalQuestions: { total: 0, easy: 0, medium: 0, hard: 0 },
        totalSubmissions: 0,
        percentage: 0
    });
    const [activityData, setActivityData] = React.useState(Array.from({ length: 365 }, () => 0));
    const [activities, setActivities] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const [statsRes, heatmapRes, totalQuestionsRes, activitiesRes] = await Promise.all([
                    axiosInstanceSubmissionService.get('/submission/profile/stats'),
                    axiosInstanceSubmissionService.get('/submission/profile/heatmap'),
                    axiosInstanceProblemService.get('/problem/stats'),
                    axiosInstanceSubmissionService.get('/submission/all')
                ]);

                let solved = { total: 0, easy: 0, medium: 0, hard: 0 };
                let totalQuestions = { total: 0, easy: 0, medium: 0, hard: 0 };
                let totalSubmissions = 0;

                if (statsRes.data.success) {
                    solved = statsRes.data.stats.solved;
                    totalSubmissions = statsRes.data.stats.totalSubmissions;
                }

                if (totalQuestionsRes.data.success) {
                    totalQuestions = totalQuestionsRes.data.stats;
                }

                setStats({
                    solved,
                    totalQuestions,
                    totalSubmissions,
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

                if (activitiesRes.data.success) {
                    const mappedActivities = (activitiesRes.data.submissions || []).slice(0, 10).map(s => ({
                        id: s.id,
                        title: s.problemTitle || `Problem ${s.problemId}`,
                        status: s.status === 'Accepted' ? 'AC' : 'WA',
                        time: new Date(s.createdAt).toLocaleDateString()
                    }));
                    setActivities(mappedActivities);
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
                        <React.Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
                            {loading ? <Skeleton className="h-[600px] w-full" /> : <ProfileSidebar user={authUser} stats={stats} />}
                        </React.Suspense>
                    </aside>

                    <main className="lg:col-span-3 space-y-8">
                        <React.Suspense fallback={<Skeleton className="h-40 w-full" />}>
                            {loading ? <Skeleton className="h-40 w-full" /> : <SubmissionStats stats={stats} />}
                        </React.Suspense>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <React.Suspense fallback={<Skeleton className="h-80 w-full" />}>
                                {loading ? <Skeleton className="h-80 w-full" /> : <BadgesSection />}
                            </React.Suspense>
                            <React.Suspense fallback={<Skeleton className="h-80 w-full" />}>
                                {loading ? <Skeleton className="h-80 w-full" /> : <RecentActivity activities={activities} />}
                            </React.Suspense>
                        </div>

                        <React.Suspense fallback={<Skeleton className="h-64 w-full" />}>
                            {loading ? <Skeleton className="h-64 w-full" /> : <SubmissionHeatmap data={activityData} />}
                        </React.Suspense>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
