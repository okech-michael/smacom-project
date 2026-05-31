import { DashboardShell, NavItem } from "@/components/smacom/DashboardShell";
import { CourseCard } from "@/components/smacom/CourseCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BookOpen, GraduationCap, Award, LifeBuoy, Play, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { API_BASE_URL, getRoleLabel } from "@/lib/api";
import { useDashboardAuth } from "@/hooks/useDashboardAuth";
import { Logo } from "@/components/smacom/Logo";
import { COURSES } from "@/lib/mock-data";

interface Course {
  id?: string;
  title: string;
  instructor: string;
  duration: string;
  fee: string;
  youtube_channel?: string;
  youtube_url?: string;
}

const NAV: NavItem[] = [
  { label: "Catalogue", to: "/dashboard/learner", icon: BookOpen },
  { label: "My Courses", to: "/dashboard/learner?tab=mine", icon: GraduationCap },
  { label: "Certificates", to: "/dashboard/learner?tab=certs", icon: Award },
  { label: "Support", to: "/dashboard/learner?tab=support", icon: LifeBuoy },
];

export default function LearnerDashboard() {
  const { user, loading: authLoading } = useDashboardAuth("learner");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course>(COURSES[0]);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/learning/courses`);
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = (await res.json()) as { data?: Course[] };
        setCourses(data.data ?? []);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardShell role="learner" roleLabel={getRoleLabel(user.role)} userName={user.full_name || user.email} nav={NAV}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Learning platform</h1>
          <p className="text-sm text-muted-foreground">Build your waste-management expertise and earn certificates.</p>
        </div>

        <Tabs defaultValue="catalogue">
          <TabsList>
            <TabsTrigger value="catalogue">Catalogue</TabsTrigger>
            <TabsTrigger value="mine">My Courses</TabsTrigger>
            <TabsTrigger value="player">Course Player</TabsTrigger>
            <TabsTrigger value="certs">Certificates</TabsTrigger>
          </TabsList>

          <TabsContent value="catalogue" className="mt-6">
            {loading ? (
              <div>Loading courses...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="grid md:grid-cols-3 gap-5">
                {courses.map((c) => (
                  <CourseCard key={c.id || c.title} {...c} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="mine" className="mt-6">
            <div className="grid md:grid-cols-3 gap-5">
              {courses.slice(0, 3).map((c, i) => (
                <CourseCard key={c.id || c.title} {...c} ctaLabel="Access course" progress={i === 0 ? 45 : i === 1 ? 80 : 20} />
              ))}
            </div>
          </TabsContent>

          {/* The rest of the tabs remain unchanged */}
          <TabsContent value="player" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 space-y-3">
                {selectedCourse?.youtube_url ? (
                  <div className="aspect-video rounded-md bg-black overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={selectedCourse.youtube_url}
                      title={selectedCourse.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="aspect-video rounded-md bg-foreground/90 flex items-center justify-center">
                    <div className="inline-flex h-16 w-16 rounded-full bg-primary text-primary-foreground items-center justify-center">
                      <Play className="h-7 w-7 ml-1" />
                    </div>
                  </div>
                )}
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Module 3 of 8</p>
                  <h2 className="font-semibold mt-0.5">{selectedCourse?.title || "Carbon-to-Nitrogen ratios in active piles"}</h2>
                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Course progress</span><span className="font-medium">45%</span></div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: "45%" }} /></div>
                  </div>
                </Card>
              </div>
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Available Courses</h3>
                <div className="space-y-2">
                  {COURSES.map((course, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedCourse(course)}
                      className={`w-full text-left rounded-md px-3 py-2 text-sm transition ${
                        selectedCourse?.title === course.title
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-secondary"
                      }`}
                    >
                      <p className="font-medium">{course.title}</p>
                      <p className="text-xs opacity-75">{course.instructor}</p>
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="certs" className="mt-6">
            <div className="grid md:grid-cols-2 gap-5">
              <Card className="p-8 border-2 border-primary/30 bg-gradient-to-br from-accent/40 to-card">
                <div className="flex items-center justify-between"><Logo /><Award className="h-7 w-7 text-primary" /></div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mt-6">Certificate of completion</p>
                <p className="text-2xl font-bold mt-1">Brian Mutua</p>
                <p className="text-sm text-muted-foreground mt-1">has successfully completed</p>
                <p className="font-semibold mt-2">Anaerobic Digestion 101</p>
                <div className="flex justify-between text-xs text-muted-foreground mt-8 pt-4 border-t border-border">
                  <span>Issued: 28 Apr 2026</span>
                  <span>Cert · SMC-AD-1042</span>
                </div>
              </Card>
              <Card className="p-8 flex flex-col items-center justify-center text-center text-muted-foreground">
                <Award className="h-10 w-10 mb-3" />
                <p className="font-medium">Complete a course to earn your next certificate</p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
