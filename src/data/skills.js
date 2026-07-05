import { FaReact, FaHtml5, FaCss3Alt, FaNodeJs, FaJava, FaGitAlt, FaGithub, FaFigma } from 'react-icons/fa'
import { SiTailwindcss, SiRedux, SiJavascript, SiExpress, SiSpringboot, SiMongodb, SiMysql, SiPostman, SiVercel, SiRender } from 'react-icons/si'
import { VscVscode } from 'react-icons/vsc'

export const skillsData = {
  frontend: [
    { name: 'React', icon: FaReact, level: 95 },
    { name: 'JavaScript', icon: SiJavascript, level: 92 },
    { name: 'HTML', icon: FaHtml5, level: 98 },
    { name: 'CSS', icon: FaCss3Alt, level: 96 },
    { name: 'Tailwind', icon: SiTailwindcss, level: 95 },
    { name: 'Redux', icon: SiRedux, level: 90 },
  ],
  backend: [
    { name: 'Node.js', icon: FaNodeJs, level: 90 },
    { name: 'Express', icon: SiExpress, level: 90 },
    { name: 'Spring Boot', icon: SiSpringboot, level: 75 },
    { name: 'Java', icon: FaJava, level: 92 },
    { name: 'MongoDB', icon: SiMongodb, level: 88 },
    { name: 'MySQL', icon: SiMysql, level: 80 },
    { name: 'Git', icon: FaGitAlt, level: 90 },
    { name: 'GitHub', icon: FaGithub, level: 95 },
    { name: 'REST API', level: 88 },
    { name: 'JWT', level: 85 },
  ],
  tools: [
    { name: 'VS Code', icon: VscVscode, level: 98 },
    { name: 'Postman', icon: SiPostman, level: 90 },
    { name: 'Figma', icon: FaFigma, level: 70 },
    { name: 'Vercel', icon: SiVercel, level: 85 },
    { name: 'Render', icon: SiRender, level: 80 },
  ],
}
