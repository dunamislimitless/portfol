"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { profile, projects, skills, type Kind, type Project } from "@/data/portfolio";

type Filter = "All" | Kind;

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  fork: boolean;
};

const filters: Filter[] = ["All", "Mobile", "Cloud"];

const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function Portfolio() {
  const [filter, setFilter] = useState<Filter>("All");
  const [selected, setSelected] = useState<Project>(projects[0]);
  const [query, setQuery] = useState("");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [repoState, setRepoState] = useState<"loading" | "ready" | "error">("loading");
  const [copied, setCopied] = useState(false);

  const visible = projects.filter((project) => filter === "All" || project.kind === filter);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`https://api.github.com/users/${profile.login}/repos?per_page=100&sort=updated`, {
      signal: controller.signal,
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error("GitHub request failed");
        return response.json() as Promise<Repo[]>;
      })
      .then((data) => {
        setRepos(data);
        setRepoState("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setRepoState("error");
      });
    return () => controller.abort();
  }, []);

  const shownRepos = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return repos
      .filter((repo) => !repo.fork)
      .filter((repo) => {
        if (!needle) return true;
        return (
          repo.name.toLowerCase().includes(needle) ||
          (repo.description ?? "").toLowerCase().includes(needle)
        );
      })
      .slice(0, 6);
  }, [query, repos]);

  function chooseFilter(next: Filter) {
    setFilter(next);
    const match = projects.find((project) => next === "All" || project.kind === next);
    if (match) setSelected(match);
  }

  async function copyIntro() {
    const text = `I'm ${profile.name} (${profile.also}), a Flutter and Dart developer in ${profile.place}. Public work: ${profile.github}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="shell">
      <motion.header className="top" initial="hidden" animate="show" variants={rise}>
        <div className="mark">{profile.also}</div>
        <a href={profile.github}>{profile.github.replace("https://", "")}</a>
      </motion.header>

      <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
        {profile.name}
      </motion.h1>
      <motion.p className="lede" initial="hidden" animate="show" variants={rise}>
        I build mobile apps with Flutter and Dart. Filter the work below, open a project, and search the live list of public repositories on GitHub.
      </motion.p>

      <motion.section
        className="facts"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      >
        {[
          ["Name", `${profile.name} (${profile.also})`],
          ["Gender", profile.gender],
          ["Date", profile.date],
        ].map(([label, value]) => (
          <motion.div className="fact" key={label} variants={rise}>
            <span>{label}</span>
            <strong>{value}</strong>
          </motion.div>
        ))}
      </motion.section>

      <div className="layout">
        <motion.section className="about" initial="hidden" whileInView="show" viewport={{ once: true }} variants={rise}>
          <h2>About</h2>
          <p>
            Most of my practice is mobile. Flutter and Dart apps on{" "}
            <a href={profile.github}>{profile.github.replace("https://", "")}</a> cover chat, shopping, and simple banking.
            Alongside that I built a two-tier network in eu-north-1: a bastion in a public subnet and a private instance reached with ProxyJump.
          </p>
          <button className="copy" type="button" onClick={copyIntro}>
            {copied ? "Copied" : "Copy a short intro"}
          </button>
        </motion.section>

        <section className="work">
          <h2>Selected work</h2>
          <div className="filters" role="tablist" aria-label="Project type">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                className={item === filter ? "active" : undefined}
                onClick={() => chooseFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="grid">
            <AnimatePresence mode="popLayout">
              {visible.map((project) => (
                <motion.button
                  className={project.title === selected.title ? "card selected" : "card"}
                  key={project.title}
                  type="button"
                  onClick={() => setSelected(project)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ y: -3 }}
                >
                  <div className="meta">
                    <span>{project.kind}</span>
                    <span>{project.stack[0]}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            <motion.article
              key={selected.title}
              className="detail"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <p className="kicker">{selected.kind}</p>
              <h3>{selected.title}</h3>
              <p>{selected.detail}</p>
              <div className="stack">
                {selected.stack.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              {selected.href ? <a href={selected.href}>View on GitHub</a> : <p>Built in AWS. The private key never left my Mac.</p>}
            </motion.article>
          </AnimatePresence>
        </section>
      </div>

      <motion.div className="skills" initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.04 } } }}>
        {skills.map((skill) => (
          <motion.span key={skill} variants={rise}>
            {skill}
          </motion.span>
        ))}
      </motion.div>

      <section className="browser">
        <h2>Public repositories</h2>
        <p className="lede">This list is loaded from GitHub when the page opens. Type to narrow it.</p>
        <input
          className="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search repositories"
          aria-label="Search repositories"
        />
        {repoState === "loading" && <p className="status">Loading repositories…</p>}
        {repoState === "error" && <p className="status">GitHub did not respond. The project links above still open.</p>}
        {repoState === "ready" && (
          <div className="repos">
            <AnimatePresence mode="popLayout">
              {shownRepos.map((repo) => (
                <motion.article key={repo.id} className="repo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h3>{repo.name}</h3>
                  <p>{repo.description || repo.language || "Public repository"}</p>
                  <a href={repo.html_url}>Open repository</a>
                </motion.article>
              ))}
            </AnimatePresence>
            {shownRepos.length === 0 && <p className="status">No repository matches that search.</p>}
          </div>
        )}
      </section>

      <footer>
        <span>{profile.place}</span>
        <a href={profile.github}>More work on GitHub</a>
      </footer>
    </main>
  );
}
