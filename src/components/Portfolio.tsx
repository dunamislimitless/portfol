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
      <header className="top">
        <div className="mark">{profile.appName}</div>
        <a href={profile.github}>{profile.github.replace("https://", "")}</a>
      </header>

      <h1>{profile.name}</h1>
      <p className="lede">
        I build mobile apps with Flutter and Dart. Filter the work below, open a project, and search the live list of public repositories on GitHub.
      </p>

      <section className="facts">
        {[
          ["Name", `${profile.name} (${profile.also})`],
          ["Gender", profile.gender],
          ["Date", profile.date],
        ].map(([label, value]) => (
          <div className="fact" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </section>

      <div className="layout">
        <aside className="side">
          <div className="identity">
            <div className="avatar" aria-hidden="true">SO</div>
            <div>
              <strong>{profile.appName}</strong>
              <p>Flutter and Dart · {profile.place}</p>
            </div>
          </div>

          <section className="about">
            <h2>About</h2>
            <p>
              Most of my practice is mobile. Flutter and Dart apps on{" "}
              <a href={profile.github}>{profile.github.replace("https://", "")}</a> cover chat, shopping, and simple banking.
              Alongside that I built a two-tier network in eu-north-1: a bastion in a public subnet and a private instance reached with ProxyJump.
            </p>
            <button className="copy" type="button" onClick={copyIntro}>
              {copied ? "Copied" : "Copy a short intro"}
            </button>
          </section>

          <div className="counts">
            <div>
              <strong>{projects.filter((project) => project.kind === "Mobile").length}</strong>
              <span>Mobile apps</span>
            </div>
            <div>
              <strong>{projects.filter((project) => project.kind === "Cloud").length}</strong>
              <span>Cloud pieces</span>
            </div>
          </div>

          <nav className="side-nav" aria-label="On this page">
            <a href="#work">Selected work</a>
            <a href="#repos">Repositories</a>
            <a href={profile.github}>GitHub profile</a>
          </nav>

          <div className="skills">
            {skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </aside>

        <section className="work" id="work">
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
                  initial={false}
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
              initial={false}
              exit={{ opacity: 0 }}
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

      <section className="browser" id="repos">
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
                <motion.article key={repo.id} className="repo" initial={false} exit={{ opacity: 0 }}>
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
