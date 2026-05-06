import { DashboardShell, NavItem } from "@/components/smacom/DashboardShell";
import { CourseCard } from "@/components/smacom/CourseCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BookOpen, GraduationCap, Award, LifeBuoy, Play, Check } from "lucide-react";
import { COURSES } from "@/lib/mock-data";
import { Logo } from "@/components/smacom/Logo";

const NAV: NavItem[] = [
  { label: "Catalogue", to: "/dashboard/learner", icon: BookOpen },
  { label: "My Courses", to: "/dashboard/learner?tab=mine", icon: GraduationCap },
  { label: "Certificates", to: "/dashboard/learner?tab=certs", icon: Award },
  { label: "Support", to: "/dashboard/learner?tab=support", icon: LifeBuoy },
];

export default function LearnerDashboard() {
  return (
    <DashboardShell role="learner" roleLabel="Learner" userName="Brian Mutua" nav={NAV}>
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
            <div className="grid md:grid-cols-3 gap-5">
              {COURSES.map((c) => (<CourseCard key={c.title} {...c} />))}
            </div>
          </TabsContent>

          <TabsContent value="mine" className="mt-6">
            <div className="grid md:grid-cols-3 gap-5">
              <CourseCard {...COURSES[0]} ctaLabel="Access course" progress={45} />
              <CourseCard {...COURSES[1]} ctaLabel="Access course" progress={80} />
              <CourseCard {...COURSES[2]} ctaLabel="Access course" progress={20} />
            </div>
          </TabsContent>

          <TabsContent value="player" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 space-y-3">
                <div className="aspect-video rounded-md bg-foreground/90 flex items-center justify-center">
                  <div className="inline-flex h-16 w-16 rounded-full bg-primary text-primary-foreground items-center justify-center">
                    <Play className="h-7 w-7 ml-1" />
                  </div>
                </div>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Module 3 of 8</p>
                  <h2 className="font-semibold mt-0.5">Carbon-to-Nitrogen ratios in active piles</h2>
                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Course progress</span><span className="font-medium">45%</span></div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: "45%" }} /></div>
                  </div>
                </Card>
              </div>
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Modules</h3>
                <ul className="space-y-1.5">
                  {[
                    ["Intro to organic decomposition", true],
                    ["Pile structure & aeration", true],
                    ["C:N ratios in active piles", false],
                    ["Moisture and temperature control", false],
                    ["Maturation and curing", false],
                    ["Quality testing", false],
                    ["Storage & packaging", false],
                    ["Final assessment", false],
                  ].map(([t, done], i) => (
                    <li key={i} className={`flex items-center gap-2 rounded-md px-2.5 py-2 text-sm ${i === 2 ? "bg-accent text-accent-foreground" : ""}`}>
                      <span className={`h-5 w-5 rounded-full inline-flex items-center justify-center text-xs shrink-0 ${done ? "bg-primary text-primary-foreground" : "border border-border"}`}>
                        {done ? <Check className="h-3 w-3" /> : i + 1}
                      </span>
                      <span className={done ? "text-muted-foreground line-through" : ""}>{t as string}</span>
                    </li>
                  ))}
                </ul>
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
