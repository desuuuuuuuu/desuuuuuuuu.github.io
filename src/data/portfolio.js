export const portfolioData = {
  brand: "Desu Wannabisaya",
  tagline: "Full-Stack Web and Mobile Developer & IT Specialist",
  availability: "Open to work",
  highlights: ["BSIT Graduate", "Full-Stack Developer", "Mobile Developer", "IT Specialist"],
  email: "santostsoggy@gmail.com",

  // Discord: username is displayed; userId (numeric snowflake) enables the
  // live presence card via Lanyard — join discord.gg/lanyard for it to work.
  discord: {
    username: "blesseddesu",
    userId: "1342873323784372254"
  },
  profileImage: "https://i.pinimg.com/vwebp/736x/9a/b9/ce/9ab9ce093485b19c9040746d4d1e0f13.webp",

  socials: [
    {
      name: "GitHub",
      url: "https://github.com/desuuuuuuuu",
      icon: "FaGithub"
    }
  ],

  navLinks: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" }
  ],

  bio: `I'm a BSIT graduate with a passion for web and mobile development. I specialize in building websites, web applications, and mobile applications that are visually appealing, functional, and user-friendly.

I have experience in HTML, CSS, and JavaScript, allowing me to create responsive websites, interactive user interfaces, and engaging web experiences. I enjoy designing clean layouts and implementing smooth animations that enhance usability.

As a developer, I am committed to continuously learning new technologies, improving my skills, and building high-quality digital experiences that make a lasting impact.`,

  services: [
    {
      title: "Full-Stack Web Development",
      subtitle: "Traditional, modern and advanced",
      icon: "FaCode",
      description: "Custom websites and web applications built for speed, security, and scalability. I transform ideas into responsive, high-performance digital solutions.",
      features: [
        "Responsive Frontend Development",
        "Backend Development",
        "REST API Integration & Development"
      ]
    },
    {
      title: "UI/UX Design",
      subtitle: "Figma, Canva and more",
      icon: "FaPaintBrush",
      description: "User-centered designs that are clean, intuitive, and visually engaging. I create interfaces that deliver seamless user experiences from concept to implementation.",
      features: [
        "User Research & Wireframing",
        "Interactive Prototyping",
        "UI Design with Figma & Canva"
      ]
    },
    {
      title: "Web Application Development",
      subtitle: "",
      icon: "FaLaptopCode",
      description: "Modern web applications and dashboards designed to streamline workflows and improve productivity.",
      features: [
        "Dashboard Development",
        "Real-Time Data Processing",
        "Database Integration"
      ]
    },
    {
      title: "Mobile Application Development",
      subtitle: "",
      icon: "FaMobileAlt",
      description: "High-performance mobile applications built for Android using modern development frameworks. I focus on responsive design, reliable functionality, and seamless user experiences.",
      features: [
        "Native & Cross-Platform Mobile Development",
        "Google Play Store Deployment",
        "API & Firebase Integration",
        "Performance Optimization"
      ]
    },
    {
      title: "Database Management",
      subtitle: "",
      icon: "FaDatabase",
      description: "Secure, scalable, and optimized database solutions that ensure efficient data storage and reliable application performance.",
      features: [
        "MySQL Database Design & Optimization",
        "Secure Data Migration",
        "Database Performance Tuning"
      ]
    },
    {
      title: "Desktop Application Development",
      subtitle: "",
      icon: "FaDesktop",
      description: "Powerful desktop applications built for performance, security, and reliability across modern operating systems.",
      features: [
        "Cross-Platform Development (.NET & Electron)",
        "Performance-Driven Architecture",
        "Secure Standalone Applications"
      ]
    }
  ],

  projects: [
    {
      title: "AirHealth",
      description: "A mobile application successfully deployed to Google Play for real-time air quality monitoring.",
      images: [
        "https://www.image2url.com/r2/default/images/1784789291286-63e88f2d-0183-4491-b1b6-fe75035cdbb5.png",
        "https://www.image2url.com/r2/default/images/1784789350602-5e510455-e07e-4ee6-ab7e-6a3da6737621.png"
      ],
      techStack: ["React Native", "Expo", "TypeScript", "Firebase", "Google Maps"],
      features: [
        "Real-time AQI monitoring with GPS",
        "Community posts with comments & likes",
        "1-on-1 chat system",
        "AI chatbot with health context",
        "Health tools & symptom checker",
        "Google Play Store deployed"
      ]
    },
    {
      title: "Funeral Web Showcase",
      description: "A modern funeral service website with animated floating navbar, service gallery, and auth system.",
      images: [
        "https://www.image2url.com/r2/default/images/1784789395613-097a2c7e-36c1-42b3-8584-b4c6c122195c.png"
      ],
      techStack: ["Next.js 16", "TypeScript", "Supabase", "Tailwind CSS 4", "Prisma", "Framer Motion"],
      features: [
        "Animated CardNav with hamburger menu",
        "Auth system with role-based access",
        "Service gallery with image carousel",
        "Google Maps integration",
        "Dark/Light mode toggle",
        "7 public pages"
      ]
    },
    {
      title: "Funeral Casket Manufacturing",
      description: "A full-featured casket manufacturing website with public showcase and comprehensive admin panel.",
      images: [
        "https://www.image2url.com/r2/default/images/1784789471468-e12cd921-4ce6-4e9f-85bc-a7aaa4534c1e.png"
      ],
      techStack: ["Next.js 14", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS"],
      features: [
        "Product catalog with category filtering",
        "Inventory CRUD with image upload",
        "Staff management & reports",
        "SEO optimized with sitemap & OG tags",
        "Mobile-first responsive design",
        "Dynamic auto-populating categories"
      ]
    }
  ],

  skills: [
    { name: "HTML", icon: "SiHtml5", description: "Structuring modern, semantic, and accessible web pages." },
    { name: "CSS", icon: "SiCss", description: "Styling websites with layouts, animations, and responsive design." },
    { name: "JavaScript", icon: "SiJavascript", description: "Creating interactive interfaces, DOM manipulation, and animations." },
    { name: "Tailwind CSS", icon: "SiTailwindcss", description: "Fast UI development with utility-first CSS framework." },
    { name: "C#", icon: "SiSharp", description: "Building robust, scalable backend applications with the .NET framework." },
    { name: "Python", icon: "SiPython", description: "Scripting, automation, and backend development with Python." },
    { name: "Node.js", icon: "SiNodedotjs", description: "Server-side JavaScript runtime for building scalable network applications." },
    { name: "React", icon: "SiReact", description: "Building dynamic user interfaces with component-based architecture." }
  ]
};