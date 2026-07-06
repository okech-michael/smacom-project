import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  Video,
  Award,
  ClipboardCheck,
  Users,
  UserCheck,
  Briefcase,
  Layers,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { CtaBanner } from "@/components/cta-banner";
import learning from "@/assets/learning.jpg";
import farmers from "@/assets/farmers.jpg";

export const Route = createFileRoute("/learning")({
  head: () => ({
    meta: [
      { title: "Learning Hub | SMACOM Solutions" },
      {
        name: "description",
        content:
          "The SMACOM Learning Hub offers accredited courses, video learning, quizzes, and community for the circular economy workforce.",
      },
      { property: "og:title", content: "SMACOM Learning Hub" },
      {
        property: "og:description",
        content:
          "Grow the skills that grow the circular economy.",
      },
    ],
  }),
  component: Learning,
});

const FEATURES = [
  { icon: BookOpen, title: "Structured Courses", desc: "Sequenced modules from foundations to advanced operator certifications." },
  { icon: Video, title: "Video Learning", desc: "Hundreds of production-quality videos filmed inside real facilities and farms." },
  { icon: Award, title: "Certificates", desc: "Recognized certifications on completion, verifiable via the SMACOM registry." },
  { icon: ClipboardCheck, title: "Quizzes & Assessments", desc: "Practical assessments and field assignments graded by qualified reviewers." },
  { icon: UserCheck, title: "Expert Instructors", desc: "Practitioners from processing facilities, cooperatives, and research institutes." },
  { icon: Users, title: "Community", desc: "Peer learning groups where operators and farmers exchange field-tested know-how." },
  { icon: Briefcase, title: "Professional Development", desc: "CPD pathways for waste operators, agronomists, and sustainability leads." },
  { icon: Layers, title: "Training Programs", desc: "Multi-organization cohorts commissioned by municipalities and enterprises." },
];

const COURSES = [
  { title: "Foundations of Organic Waste Management", level: "Beginner", duration: "6 weeks" },
  { title: "Composting Science and Operations", level: "Intermediate", duration: "8 weeks" },
  { title: "Regenerative Agriculture with Bio-Inputs", level: "Intermediate", duration: "10 weeks" },
  { title: "IoT for Circular Facilities", level: "Advanced", duration: "6 weeks" },
  { title: "Carbon Accounting for Waste Programs", level: "Advanced", duration: "8 weeks" },
  { title: "Community Collection Program Design", level: "Applied", duration: "4 weeks" },
];

function Learning() {
  return (
    <>
      <PageHero
        eyebrow="Learning Hub"
        title={<>Grow the people who grow the future.</>}
        description="The SMACOM Learning Hub equips operators, farmers, students, and professionals with practical, accredited skills to build and run circular waste systems."
        image={learning}
        imageAlt="Learners in a SMACOM training program"
      />

      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-spring">
              What&apos;s included
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900 font-display text-balance">
              A full learning environment, built for the field.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="p-6 rounded-3xl bg-slate-50 ring-1 ring-slate-200 hover:bg-white hover:ring-forest/25 hover:shadow-lg transition-all"
                >
                  <div className="grid size-11 place-items-center rounded-xl bg-white ring-1 ring-slate-200 text-forest">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-5 font-bold text-slate-900">{f.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-spring">
              Featured courses
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900 font-display text-balance">
              Start where you are.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.map((c) => (
              <article
                key={c.title}
                className="group p-8 rounded-3xl bg-white ring-1 ring-slate-200 hover:ring-forest/25 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
                  <span className="text-spring">{c.level}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-slate-500">{c.duration}</span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-slate-900 font-display leading-snug">
                  {c.title}
                </h3>
                <button className="mt-6 text-forest font-semibold hover:underline">
                  View syllabus &rarr;
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 rounded-[36px] overflow-hidden">
          <img
            src={farmers}
            alt="Field training with farmers"
            loading="lazy"
            className="w-full aspect-[21/9] object-cover rounded-[36px]"
          />
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
