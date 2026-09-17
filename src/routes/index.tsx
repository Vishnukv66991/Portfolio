import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { portfolio } from "@/data";
import pixelai from "@/assets/pixelai.jpg";
import taskManager from "@/assets/task-manager.jpg";
import vagibiom from "@/assets/vagibiom.jpg";
import resumeAsset from "@/assets/Vishnu_KV_Resume.pdf.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vishnu K V — Software Developer" },
      { name: "description", content: "Portfolio of Vishnu K V, a software developer building scalable web products and AI-powered experiences." },
      { property: "og:title", content: "Vishnu K V — Software Developer" },
      { property: "og:description", content: "Selected software, AI, and web development work by Vishnu K V." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortfolioPage,
});

const projectImages = { pixelai, taskManager, vagibiom };

function SplitHeadline({ children, className = "", as = "h2" }: { children: string; className?: string; as?: "h1" | "h2" | "h3" }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    let cleanup = () => {};
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, scrollModule]) => {
      const gsap = gsapModule.default;
      const ScrollTrigger = scrollModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      if (!ref.current) return;
      const ctx = gsap.context(() => {
        gsap.fromTo(ref.current?.querySelectorAll(".split-word") ?? [], { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.045, ease: "power4.out", scrollTrigger: { trigger: ref.current, start: "top 88%", once: true } });
      }, ref);
      cleanup = () => ctx.revert();
    });
    return () => cleanup();
  }, []);
  const Tag = as;
  return <Tag ref={ref} className={className} aria-label={children}>{children.split(" ").map((word, index) => <span className="split-mask" key={`${word}-${index}`}><span className="split-word">{word}</span></span>)}</Tag>;
}

function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18 });
  const springY = useSpring(y, { stiffness: 220, damping: 18 });
  const move = (event: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((event.clientX - rect.left - rect.width / 2) * 0.22);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.22);
  };
  return <motion.div ref={ref} style={{ x: springX, y: springY }} onMouseMove={move} onMouseLeave={() => { x.set(0); y.set(0); }}>{children}</motion.div>;
}

function Preloader() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const next = Math.min(100, Math.floor(((now - started) / 1600) * 100));
      setProgress(next);
      if (next < 100) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
  return <AnimatePresence>{progress < 100 && <motion.div className="preloader" exit={{ y: "-100%" }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}><div className="preloader-name">VISHNU K V</div><div className="preloader-count">{progress.toString().padStart(3, "0")}</div><div className="preloader-line"><motion.span animate={{ scaleX: progress / 100 }} /></div></motion.div>}</AnimatePresence>;
}

function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const smoothX = useSpring(x, { stiffness: 500, damping: 38 });
  const smoothY = useSpring(y, { stiffness: 500, damping: 38 });
  const [viewing, setViewing] = useState(false);
  useEffect(() => {
    const move = (event: globalThis.MouseEvent) => { x.set(event.clientX); y.set(event.clientY); setViewing(Boolean((event.target as HTMLElement).closest("[data-project]"))); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);
  return <motion.div className="custom-cursor" style={{ x: smoothX, y: smoothY }} animate={{ width: viewing ? 72 : 12, height: viewing ? 72 : 12 }}><span>{viewing ? "VIEW" : ""}</span></motion.div>;
}

function PortfolioPage() {
  const [navCompact, setNavCompact] = useState(false);
  const workRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const blobX = useMotionValue(0);
  const blobY = useMotionValue(0);
  const blobSmoothX = useSpring(blobX, { stiffness: 45, damping: 18 });
  const blobSmoothY = useSpring(blobY, { stiffness: 45, damping: 18 });
  const blobTransformX = useTransform(blobSmoothX, (v) => v - 260);
  const blobTransformY = useTransform(blobSmoothY, (v) => v - 260);

  useEffect(() => {
    const onScroll = () => setNavCompact(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let lenis: { raf: (time: number) => void; destroy: () => void } | undefined;
    let frame = 0;
    void import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      const raf = (time: number) => { lenis?.raf(time); frame = requestAnimationFrame(raf); };
      frame = requestAnimationFrame(raf);
    });
    return () => { cancelAnimationFrame(frame); lenis?.destroy(); };
  }, []);

  useEffect(() => {
    let cleanup = () => {};
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, scrollModule]) => {
      const gsap = gsapModule.default;
      const ScrollTrigger = scrollModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        if (progressRef.current) gsap.to(progressRef.current, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.2 } });
        const title = workRef.current?.querySelector(".work-sticky");
        const list = workRef.current?.querySelector(".project-list");
        if (title && list && window.innerWidth >= 1024) ScrollTrigger.create({ trigger: title, endTrigger: list, start: "top 110px", end: "bottom bottom-=80", pin: true, pinSpacing: false });
        gsap.utils.toArray<HTMLElement>(".project-image img").forEach((image) => gsap.fromTo(image, { yPercent: -8, scale: 1.08 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: image.closest(".project-image"), start: "top bottom", end: "bottom top", scrub: true } }));
        gsap.fromTo(".timeline-draw", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".experience-grid", start: "top 70%", end: "bottom 70%", scrub: true } });
      });
      ScrollTrigger.refresh();
      cleanup = () => ctx.revert();
    });
    return () => cleanup();
  }, []);

  const fade = { initial: { opacity: 0, y: 60, filter: "blur(10px)" }, whileInView: { opacity: 1, y: 0, filter: "blur(0px)" }, viewport: { once: true, amount: 0.16 }, transition: { duration: 0.8 } } as const;

  return <main onMouseMove={(event) => { blobX.set(event.clientX); blobY.set(event.clientY); }}>
    <Preloader />
    <CustomCursor />
    <div ref={progressRef} className="scroll-progress" />
    <motion.nav className="floating-nav" animate={{ width: navCompact ? "min(560px, calc(100% - 32px))" : "min(700px, calc(100% - 32px))", y: navCompact ? 4 : 0 }} transition={{ duration: 0.35 }} aria-label="Main navigation">
      <a href="#top" className="nav-name">{portfolio.name}</a>
      <div className="nav-links">
        <a className="nav-email" href={`mailto:${portfolio.email}`}>{portfolio.email}</a>
        <a href={portfolio.links.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a>
        <a href={portfolio.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a>
      </div>
    </motion.nav>

    <section id="top" className="hero-section">
      <div className="hero-grid" />
      <motion.div className="cursor-blob" style={{ x: blobTransformX, y: blobTransformY }} />
      <div className="hero-inner">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.5 }} className="hero-meta"><span>{portfolio.location}</span><span className="availability"><i />{portfolio.availability}</span></motion.div>
        <SplitHeadline as="h1" className="hero-name">{portfolio.name}</SplitHeadline>
        <SplitHeadline as="h2" className="hero-role">{portfolio.role}</SplitHeadline>
        <motion.div className="hero-bottom" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.15, duration: 0.8 }}>
          <p>{portfolio.tagline}</p>
          <div className="hero-actions">
            <Magnetic><Button asChild size="lg" className="rounded-full"><a href="#work">View projects <ArrowDownRight size={18} /></a></Button></Magnetic>
            <Magnetic><Button asChild size="lg" variant="outline" className="rounded-full"><a href={resumeAsset.url} download>Download resume <ArrowUpRight size={18} /></a></Button></Magnetic>
          </div>
        </motion.div>
      </div>
    </section>

    <section className="marquee" aria-label="Technical skills"><div className="marquee-track">{[...portfolio.skills, ...portfolio.skills].map((skill, index) => <span className="skill-item" key={`${skill}-${index}`}><b>{skill}</b><i>✦</i></span>)}</div></section>

    <section id="work" ref={workRef} className="section-shell work-section">
      <div className="work-layout">
        <div className="work-sticky"><span className="eyebrow">Selected work / 2024—26</span><SplitHeadline className="section-title">Work that earns attention.</SplitHeadline></div>
        <div className="project-list">
          {portfolio.projects.map((project) => <motion.article data-project className="project-card" key={project.name} {...fade}>
            <div className="project-head"><span>{project.number}</span><span>{project.type}</span></div>
            <div className="project-image"><img src={projectImages[project.image]} alt={`${project.name} interface preview`} loading="lazy" width={1600} height={1000} /></div>
            <div className="project-copy"><div><h3>{project.name}</h3><p className="project-impact">{project.impact}</p></div><p>{project.description}</p></div>
            <div className="project-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
          </motion.article>)}
        </div>
      </div>
    </section>

    <section className="section-shell experience-section">
      <div className="experience-grid">
        <div><span className="eyebrow">Professional story</span><SplitHeadline className="section-title">Experience</SplitHeadline></div>
        <div className="timeline"><span className="timeline-base" /><span className="timeline-draw" />{portfolio.experience.map((job) => <motion.article className="timeline-entry" key={job.company} {...fade}><span className="timeline-dot" /><div className="job-top"><div><h3>{job.role}</h3><p>{job.company} · {job.location}</p></div><span>{job.period}</span></div><p className="job-summary">{job.summary}</p><ul>{job.achievements.map((item) => <li key={item}>{item}</li>)}</ul></motion.article>)}</div>
      </div>
    </section>

    <section className="section-shell about-section">
      <span className="eyebrow">Beyond the code</span><SplitHeadline className="about-title">Curious by nature. Precise by practice.</SplitHeadline>
      <div className="about-grid"><div className="about-number">01<span>year building<br />for production</span></div><motion.div className="about-copy" {...fade}>{portfolio.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</motion.div></div>
      <div className="education-grid"><h3>Education</h3><div>{portfolio.education.map((item) => <div className="education-row" key={item.degree}><div><strong>{item.degree}</strong><span>{item.school}</span></div><div><span>{item.period}</span><span>{item.detail}</span></div></div>)}</div></div>
    </section>

    <footer className="contact-section">
      <div className="section-shell"><span className="eyebrow">Have a project in mind?</span><SplitHeadline className="contact-title">LET’S TALK</SplitHeadline>
        <div className="contact-grid"><div><a className="contact-email" href={`mailto:${portfolio.email}`}>{portfolio.email}<ArrowUpRight /></a><div className="social-row"><a href={portfolio.links.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={portfolio.links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></div></div>
          <form action={`mailto:${portfolio.email}`} method="post" encType="text/plain"><label>Name<input name="name" required placeholder="Your name" /></label><label>Email<input type="email" name="email" required placeholder="you@company.com" /></label><label>Tell me about it<textarea name="message" required placeholder="A little about your project..." rows={3} /></label><Button type="submit" size="lg" className="w-full rounded-full">Start a conversation <Mail size={17} /></Button></form>
        </div><div className="footer-line"><span>© 2026 {portfolio.name}</span><span>Designed with intent. Built with care.</span></div>
      </div>
    </footer>
  </main>;
}
