import { DashboardShell, NavItem } from "@/components/smacom/DashboardShell";
import { CourseCard } from "@/components/smacom/CourseCard";
import { VideoModal } from "@/components/smacom/VideoModal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BookOpen, GraduationCap, Award, LifeBuoy, Play, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { getCourses, getRoleLabel, Course } from "@/lib/api";
import { useDashboardAuth } from "@/hooks/useDashboardAuth";
import { Logo } from "@/components/smacom/Logo";
import { extractYouTubeVideoId, recordVideoStart, getCourseProgressById, getEstimatedProgress } from "@/lib/video-utils";

const NAV: NavItem[] = [
  { label: "Catalogue", to: "/dashboard/learner", icon: BookOpen },
  { label: "My Courses", to: "/dashboard/learner?tab=mine", icon: GraduationCap },
  { label: "Certificates", to: "/dashboard/learner?tab=certs", icon: Award },
  { label: "Support", to: "/dashboard/learner?tab=support", icon: LifeBuoy },
];

export default function LearnerDashboard() {
  const { user, loading: authLoading, error: authError } = useDashboardAuth("learner");
  const [courses, setCourses] = useState<Course[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [courseProgress, setCourseProgress] = useState<number>(0);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      setError(null);
      try {
        const fetchedCourses = await getCourses(localStorage.getItem('access_token') || undefined);
        setCourses(fetchedCourses);
        setMyCourses(fetchedCourses.slice(0, 3)); // Demo: first 3 courses as "my courses"
        if (fetchedCourses.length > 0) {
          setSelectedCourse(fetchedCourses[0]);
          // Get progress for first course
          const progress = getEstimatedProgress(fetchedCourses[0].id || fetchedCourses[0].title);
          setCourseProgress(progress);
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    const progress = getEstimatedProgress(course.id || course.title);
    setCourseProgress(progress);
  };

  const handlePlayVideo = () => {
    if (selectedCourse && selectedCourse.id) {
      const videoId = extractYouTubeVideoId(selectedCourse.youtube_url || "");
      if (videoId) {
        recordVideoStart(selectedCourse.id, videoId, selectedCourse.title);
        setIsVideoOpen(true);
        // Update progress display
        const progress = getEstimatedProgress(selectedCourse.id);
        setCourseProgress(progress);
      }
    }
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  if (authError || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
        <div className="max-w-md w-full space-y-4 text-center">
          <div className="text-5xl">⚠️</div>
          <h1 className="text-2xl font-bold">Unable to Load Dashboard</h1>
          <p className="text-muted-foreground">
            {authError || "Failed to load your profile. Please try again or log in."}
          </p>
          <div className="pt-4 space-y-2">
            <Button 
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Retry
            </Button>
            <Button 
              onClick={() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
              variant="outline"
              className="w-full"
            >
              Log In Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const selectedVideoId = selectedCourse?.youtube_url ? extractYouTubeVideoId(selectedCourse.youtube_url) : null;

  return (
    <DashboardShell role="learner" roleLabel={getRoleLabel(user.role)} userName={user.full_name || user.email} nav={NAV}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Learning platform</h1>
          <p className="text-sm text-muted-foreground">Build your waste-management expertise and earn certificates.</p>
        </div>

        <Tabs defaultValue="catalogue">
          <TabsList>
            <TabsTrigger value="catalogue">Catalogue ({courses.length})</TabsTrigger>
            <TabsTrigger value="mine">My Courses ({myCourses.length})</TabsTrigger>
            <TabsTrigger value="player">Course Player</TabsTrigger>
            <TabsTrigger value="certs">Certificates</TabsTrigger>
          </TabsList>

          <TabsContent value="catalogue" className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : error ? (
              <div className="p-4 bg-destructive/10 text-destructive rounded-md">{error}</div>
            ) : courses.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">No courses available</div>
            ) : (
              <div className="grid md:grid-cols-3 gap-5">
                {courses.map((c) => (
                  <CourseCard key={c.id || c.title} {...c} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="mine" className="mt-6">
            {myCourses.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">You haven't enrolled in any courses yet</div>
            ) : (
              <div className="grid md:grid-cols-3 gap-5">
                {myCourses.map((c, i) => (
                  <CourseCard key={c.id || c.title} {...c} ctaLabel="Access course" progress={i === 0 ? 45 : i === 1 ? 80 : 20} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="player" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 space-y-3">
                {selectedVideoId ? (
                  <div className="aspect-video rounded-md bg-black overflow-hidden relative group">
                    <img
                      src={`https://img.youtube.com/vi/${selectedVideoId}/hqdefault.jpg`}
                      alt={selectedCourse?.title}
                      className="w-full h-full object-cover group-hover:brightness-75 transition-all"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <button
                      onClick={handlePlayVideo}
                      className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all"
                      title="Play video"
                    >
                      <div className="inline-flex h-16 w-16 rounded-full bg-white/90 items-center justify-center group-hover:bg-white transition-colors shadow-lg">
                        <Play className="h-7 w-7 ml-1 fill-current text-black" />
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="aspect-video rounded-md bg-foreground/90 flex items-center justify-center">
                    <div className="inline-flex h-16 w-16 rounded-full bg-primary text-primary-foreground items-center justify-center">
                      <Play className="h-7 w-7 ml-1" />
                    </div>
                  </div>
                )}
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Module {Math.floor(courseProgress / 20) + 1} of {selectedCourse?.modules || 5}</p>
                  <h2 className="font-semibold mt-0.5">{selectedCourse?.title || "Select a course to begin"}</h2>
                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Course progress</span><span className="font-medium">{courseProgress}%</span></div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary transition-all" style={{ width: `${courseProgress}%` }} /></div>
                  </div>
                </Card>
              </div>
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Available Courses</h3>
                <div className="space-y-2">
                  {courses.slice(0, 5).map((course) => (
                    <button
                      key={course.id || course.title}
                      onClick={() => handleSelectCourse(course)}
                      className={`w-full text-left rounded-md px-3 py-2 text-sm transition ${
                        selectedCourse?.id === course.id
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-secondary"
                      }`}
                    >
                      <p className="font-medium text-xs leading-tight">{course.title}</p>
                      <p className="text-xs opacity-75">{course.instructor}</p>
                    </button>
                  ))}
                  {courses.length > 5 && (
                    <p className="text-xs text-muted-foreground text-center py-2">... and {courses.length - 5} more</p>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="certs" className="mt-6">
            <div className="grid md:grid-cols-2 gap-5">
              <Card className="p-8 border-2 border-primary/30 bg-gradient-to-br from-accent/40 to-card">
                <div className="flex items-center justify-between"><Logo /><Award className="h-7 w-7 text-primary" /></div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mt-6">Certificate of completion</p>
                <p className="text-2xl font-bold mt-1">{user.full_name || "Learner"}</p>
                <p className="text-sm text-muted-foreground mt-1">has successfully completed</p>
                <p className="font-semibold mt-2">{selectedCourse?.title || "Composting Fundamentals"}</p>
                <div className="flex justify-between text-xs text-muted-foreground mt-8 pt-4 border-t border-border">
                  <span>Issued: {new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  <span>Cert · SMC-{Math.random().toString(36).substring(7).toUpperCase()}</span>
                </div>
              </Card>
              <Card className="p-8 flex flex-col items-center justify-center text-center text-muted-foreground">
                <Award className="h-10 w-10 mb-3" />
                <p className="font-medium">Complete a course to earn your next certificate</p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Video Modal for course player */}
        {selectedVideoId && selectedCourse && (
          <VideoModal
            isOpen={isVideoOpen}
            onClose={() => setIsVideoOpen(false)}
            videoId={selectedVideoId}
            title={selectedCourse.title}
            onPlayStart={() => {
              if (selectedCourse.id) {
                recordVideoStart(selectedCourse.id, selectedVideoId, selectedCourse.title);
              }
            }}
          />
        )}
      </div>
    </DashboardShell>
  );
}
