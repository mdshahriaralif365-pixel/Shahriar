import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Skills } from "@/components/skills";
import { Projects } from "@/components/projects";
import { Experience } from "@/components/experience";
import { Education } from "@/components/education";
import { Testimonials } from "@/components/testimonials";
import { Contact } from "@/components/contact";

// ক্যাশিং কন্ট্রোল করার জন্য (যেহেতু ডাটাবেস আপডেট হতে পারে)
export const revalidate = 60; // প্রতি 60 সেকেন্ডে পেজ রিভ্যালিডেট হবে

export default async function Home() {
  // ডাটাবেস থেকে ডাইনামিকভাবে সেকশনের ডাটা ফেচ করা হচ্ছে
  const dbProjects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  const dbExperiences = await prisma.experience.findMany({ orderBy: { order: 'asc' } });
  const dbEducations = await prisma.education.findMany();
  const dbSkills = await prisma.skill.findMany();
  const dbContact = await prisma.contactInfo.findUnique({ where: { id: "1" } });
  const dbAbout = await prisma.about.findUnique({ where: { id: "1" } });
  const dbSocials = await prisma.socialLinks.findUnique({ where: { id: "1" } });
  const dbTestimonials = await prisma.testimonial.findMany();
  const dbHero = await prisma.hero.findUnique({ where: { id: "1" } });
  const visibility = await prisma.sectionVisibility.findUnique({ where: { id: "1" } });

  // Default visibility if not set
  const show = visibility || {
    showAbout: true,
    showProject: true,
    showExp: true,
    showEdu: true,
    showSkill: true,
    showTesti: true,
    showContact: true
  };

  // Convert techStack string to array
  const projects = dbProjects.map((p) => ({
    ...p,
    techStack: p.techStack ? p.techStack.split(",").map((t) => t.trim()) : [],
  }));

  // Transform education data to match component expectations
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const educations = dbEducations.map((edu: any) => ({
    id: edu.id,
    degree: edu.degree,
    institution: edu.institute || edu.institution || "",
    startDate: edu.year || edu.startDate || "",
    endDate: edu.endDate || "",
    description: edu.description || "",
  }));

  // Transform testimonials data to match component expectations
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const testimonials = dbTestimonials.map((testi: any) => ({
    id: testi.id,
    name: testi.name || "",
    role: testi.position || "",
    content: testi.text || "",
    avatar: testi.link || null,
  }));

  // Skills কে ক্যাটাগরি অনুযায়ী গ্রুপ করছি
  interface SkillCategory {
    title: string;
    skills: string[];
  }

  const skillCategories = dbSkills.reduce<SkillCategory[]>((acc, skill) => {
    const categoryName = skill.category || "Other";
    const category = acc.find(c => c.title === categoryName);
    if (category) {
      category.skills.push(skill.name);
    } else {
      acc.push({ title: categoryName, skills: [skill.name] });
    }
    return acc;
  }, []);

  return (
    <div className="flex flex-col">
      <Hero socialLinks={dbSocials || undefined} heroData={dbHero || undefined} />
      {show.showAbout && <About data={dbAbout || undefined} />}
      {show.showSkill && <Skills data={skillCategories.length > 0 ? skillCategories : undefined} />}
      
      {/* ডাটাবেসের ডাটা প্রপস হিসেবে কম্পোনেন্টে পাঠানো হচ্ছে */}
      {show.showProject && <Projects data={projects} />}
      {show.showExp && <Experience data={dbExperiences} />}
      {show.showEdu && <Education data={educations} />}
      
      {show.showTesti && <Testimonials data={testimonials} />}
      {show.showContact && <Contact data={dbContact || undefined} />}
    </div>
  );
}
