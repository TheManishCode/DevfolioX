import { Marquee } from "@/components/ui/marquee";
import {
    SiTailwindcss,
    SiNextdotjs,
    SiReact,
    SiTypescript,
    SiVercel,
    SiGithub,
    SiSwiper,
} from 'react-icons/si';
import { TbBrandFramerMotion } from "react-icons/tb";
import { Database, Shield } from "lucide-react";
import { SectionTitle } from "@/components/ui/Typography";

interface TechStackItem {
    iconKey: string;
    label: string;
    desc: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
    nextjs: <SiNextdotjs className="dark:text-white text-black" />,
    react: <SiReact color="#61DBFB" />,
    typescript: <SiTypescript color="#3178C6" />,
    tailwind: <SiTailwindcss color="#06B6D4" />,
    lenis: <TbBrandFramerMotion className="dark:text-white text-black" />,
    swr: <Database className="text-[#33E092]" size={24} />,
    nextauth: <Shield className="text-[#33E092]" size={24} />,
    swiper: <SiSwiper color="#6332F6" />,
    vercel: <SiVercel className="dark:text-white text-black" />,
    github: <SiGithub className="dark:text-white text-black" />,
};

const TechCard = ({ tech }: { tech: { icon: React.ReactNode; label: string; desc: string } }) => (
    <div className="flex items-center space-x-3 px-4 py-2 min-w-[150px]">
        <div className="text-2xl flex-shrink-0">{tech.icon}</div>
        <div>
            <p className="text-sm font-semibold dark:text-white text-zinc-900">{tech.label}</p>
            <p className="text-xs dark:text-zinc-500 text-zinc-500">{tech.desc}</p>
        </div>
    </div>
);

const TechStacks = ({ stack }: { stack: TechStackItem[] }) => {
    const techStack = stack.map(item => ({
        icon: ICON_MAP[item.iconKey] ?? <span>{item.label}</span>,
        label: item.label,
        desc: item.desc,
    }));

    // Split tech stack into two rows
    const firstRow = techStack.slice(0, 5);
    const secondRow = techStack.slice(5);

    return (
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">

            <SectionTitle className="mb-8 self-start">
                Powered by
            </SectionTitle>

            <Marquee pauseOnHover className="[--duration:30s] [--gap:1rem]">
                {firstRow.map((tech) => (
                    <TechCard key={`first-${tech.label}`} tech={tech} />
                ))}
            </Marquee>
            <div className="mt-4">
                <Marquee reverse pauseOnHover className="[--duration:30s] [--gap:1rem]">
                    {secondRow.map((tech) => (
                        <TechCard key={`second-${tech.label}`} tech={tech} />
                    ))}
                </Marquee>
            </div>
        </div>
    );
};

export default TechStacks;

