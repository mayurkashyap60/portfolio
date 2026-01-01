import type { Route } from "./+types/home";
import Hero from "~/components/Hero/Hero";

export function meta({}: Route.MetaArgs) {
  return [
    { charset: "utf-8" },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0",
    },
    { title: "Mayur Kashyap | Senior Software Engineer & Front-End Developer" },
    {
      name: "description",
      content:
        "I’m a Senior Software Engineer with extensive experience in Front-End Development, UI/UX Design, and Digital Product Development. I’m passionate about creating seamless, high-performing web applications that transform ideas into meaningful, interactive user experiences and drive real business impact.",
    },
    {
      name: "keywords",
      content:
        "Front-End Developer, Software Enginner, WordPress Development, UI/UX Designer India, Developer, Mayur Kashyap",
    },
    { name: "author", content: "Mayur Kashyap" },
  ];
}

export default function Home() {
  return <Hero />;
}
