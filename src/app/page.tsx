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

  // Project এর টেক স্ট্যাক কমা (,) দিয়ে আলাদা করা আছে, সেটাকে অ্যারেতে কনভার্ট করছি
  const projects = dbProjects.map(p => ({
    ...p,
    techStack: p.techStack ? p.techStack.split(",").map(t => t.trim()) : [],
  }));

  // Skills কে ক্যাটাগরি অনুযায়ী গ্রুপ করছি
  const skillCategories = dbSkills.reduce((acc: any[], skill) => {
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
      <Hero />
      <About />
      <Skills data={skillCategories.length > 0 ? skillCategories : undefined} />
      
      {/* ডাটাবেসের ডাটা প্রপস হিসেবে কম্পোনেন্টে পাঠানো হচ্ছে */}
      <Projects data={projects} />
      <Experience data={dbExperiences} />
      <Education data={dbEducations} />
      
      <Testimonials />
      <Contact />
    </div>
  );
}
