// lib/content.js
import fs from "fs";
import path from "path";

/* ======================
   RUTAS BASE
====================== */
const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const CREATORS_DIR = path.join(CONTENT_DIR, "creators");
const ORPHANS_DIR = path.join(CONTENT_DIR, "orphans");
const FORMS_DIR = path.join(CONTENT_DIR, "forms");
const FEATURED_FILE = path.join(ROOT, "featured.json");

/* ======================
   HELPERS
====================== */
const readJSON = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
export const ytThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

function safeSlug(str = "") {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseYouTubeId(maybeUrl) {
  try {
    let url = String(maybeUrl).trim();
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1);
    }
    if (u.searchParams.has("v")) {
      return u.searchParams.get("v");
    }
    // /embed/<id> o /v/<id>
    const parts = u.pathname.split("/");
    const maybe = parts.pop() || parts.pop();
    return maybe || null;
  } catch {
    // por si no es URL, quizá ya es un ID
    return /^[A-Za-z0-9_-]{8,}$/.test(maybeUrl) ? maybeUrl : null;
  }
}

/* ======================
   PARSER DE FORMULARIOS .TXT
====================== */
/**
 * Formato esperado (ver plantilla):
 * - Encabezado: TIENE CREADOR, CREADOR, REDES, FINANCIACION
 * - Luego bloques "obra" separados por líneas de guiones
 */
function loadFormsCreatorsAndWorks() {
  if (!fs.existsSync(FORMS_DIR)) return { creators: [], works: [] };
  const files = fs.readdirSync(FORMS_DIR).filter((f) => f.endsWith(".txt"));
  const creators = [];
  const works = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(FORMS_DIR, file), "utf8");
    const lines = raw.split(/\r?\n/).map((l) => l.trim());
    if (lines.length === 0) continue;

    // Lee encabezado
    let hasCreator = null;
    let creatorSlug = "";
    const socials = [];
    const support = [];

    let i = 0;
    // Cabecera
    for (; i < lines.length; i++) {
      const ln = lines[i];
      if (!ln) continue;
      if (/^-{5,}$/.test(ln)) break; // llegó a obras

      if (ln.toLowerCase().startsWith("tiene creador")) {
        hasCreator = /si/i.test(ln.split(":")[1] || "");
      } else if (ln.toLowerCase().startsWith("creador")) {
        creatorSlug = safeSlug((ln.split(":")[1] || "").trim());
      } else if (ln.toLowerCase().startsWith("redes")) {
        // leer líneas con prefijo "- "
        i++;
        while (i < lines.length && lines[i].startsWith("-")) {
          const url = lines[i].slice(1).trim();
          if (url) socials.push({ label: "Link", href: url });
          i++;
        }
        i--; // retrocede uno porque el for lo incrementa
      } else if (ln.toLowerCase().startsWith("financiacion") || ln.toLowerCase().startsWith("financiación")) {
        i++;
        while (i < lines.length && lines[i].startsWith("-")) {
          const url = lines[i].slice(1).trim();
          if (url) support.push({ label: "Apóyame", href: url });
          i++;
        }
        i--;
      }
    }

    // Si hay creador
    if (hasCreator && creatorSlug) {
      creators.push({
        slug: creatorSlug,
        name: creatorSlug, // si quieres nombre “bonito”, puedes admitir CREATOR_NAME en el futuro
        socials,
        support,
      });
    }

    // Lee bloques de obras
    while (i < lines.length) {
      // saltar separadores vacíos
      while (i < lines.length && (!lines[i] || /^-+$/.test(lines[i]))) i++;
      if (i >= lines.length) break;

      // bloque obra
      let tipo = "", nombre = "", medio = "", genero = "", descripcion = "";
      const videos = [];

      for (; i < lines.length; i++) {
        const ln = lines[i];
        if (/^-{5,}$/.test(ln)) break; // siguiente obra

        if (!ln) continue;

        const lower = ln.toLowerCase();
        if (lower.startsWith("tipo")) {
          tipo = (ln.split(":")[1] || "").trim();
        } else if (lower.startsWith("nombre")) {
          nombre = (ln.split(":")[1] || "").trim();
        } else if (lower.startsWith("medio")) {
          medio = (ln.split(":")[1] || "").trim();
        } else if (lower.startsWith("genero") || lower.startsWith("género")) {
          genero = (ln.split(":")[1] || "").trim();
        } else if (lower.startsWith("descripcion") || lower.startsWith("descripción")) {
          descripcion = (ln.split(":")[1] || "").trim().replace(/^"|"$/g, "");
        } else if (lower.startsWith("videos")) {
          // leer lista de - ...
          i++;
          while (i < lines.length && lines[i].startsWith("-")) {
            let item = lines[i].slice(1).trim();
            if (item) {
              // soporta "title=... | url=..."
              let title = "";
              let url = "";
              if (/title\s*=/.test(item) && /url\s*=/.test(item)) {
                const parts = item.split("|").map((p) => p.trim());
                for (const p of parts) {
                  const [k, v = ""] = p.split("=").map((s) => s.trim());
                  if (/^title$/i.test(k)) title = v;
                  if (/^url$/i.test(k)) url = v;
                }
              } else {
                url = item;
              }
              const id = parseYouTubeId(url);
              if (id) {
                videos.push({
                  id: safeSlug(title || `video-${videos.length + 1}`) || `video-${videos.length + 1}`,
                  title: title || `Video ${videos.length + 1}`,
                  youtubeId: id,
                });
              }
            }
            i++;
          }
          i--;
        }
      }

      if (!nombre || videos.length === 0) {
        continue; // obra inválida, la saltamos
      }

      const work = {
        slug: safeSlug(nombre),
        title: nombre,
        type: (tipo || "Serie").trim(),
        medium: (medio || "").trim() || undefined,
        genres: genero ? genero.split(",").map((g) => g.trim()).filter(Boolean) : [],
        description: descripcion || "",
        episodes: videos,
      };

      // Si tiene creador y lo declararon al inicio
      if (hasCreator && creatorSlug) {
        work.creatorSlug = creatorSlug;
      }

      works.push(work);
    }
  }

  // Deduplicar creadores por slug (si hay más .txt del mismo creador)
  const creatorMap = new Map();
  for (const c of creators) {
    if (!creatorMap.has(c.slug)) creatorMap.set(c.slug, c);
    else {
      // merge muy simple de arrays
      const prev = creatorMap.get(c.slug);
      const merged = {
        ...prev,
        socials: [...(prev.socials || []), ...(c.socials || [])],
        support: [...(prev.support || []), ...(c.support || [])],
      };
      creatorMap.set(c.slug, merged);
    }
  }

  return { creators: Array.from(creatorMap.values()), works };
}

/* ======================
   LECTURA DE JSON ANTIGUOS (opcional)
====================== */
function loadAllCreatorsJSON() {
  if (!fs.existsSync(CREATORS_DIR)) return [];
  const dirs = fs.readdirSync(CREATORS_DIR).filter((d) =>
    fs.statSync(path.join(CREATORS_DIR, d)).isDirectory()
  );

  return dirs.map((dir) => {
    const creatorPath = path.join(CREATORS_DIR, dir, "creator.json");
    if (fs.existsSync(creatorPath)) return readJSON(creatorPath);
    return null;
  }).filter(Boolean);
}

function loadAllWorksJSON() {
  const works = [];
  if (fs.existsSync(CREATORS_DIR)) {
    const creatorDirs = fs.readdirSync(CREATORS_DIR).filter((d) =>
      fs.statSync(path.join(CREATORS_DIR, d)).isDirectory()
    );
    for (const cdir of creatorDirs) {
      const dirPath = path.join(CREATORS_DIR, cdir);
      const files = fs
        .readdirSync(dirPath)
        .filter((f) => f !== "creator.json" && f.endsWith(".json"));
      for (const f of files) {
        const w = readJSON(path.join(dirPath, f));
        // inyecta creatorSlug si hay creator.json
        if (fs.existsSync(path.join(dirPath, "creator.json"))) {
          w.creatorSlug = w.creatorSlug || cdir;
        }
        works.push(w);
      }
    }
  }
  if (fs.existsSync(ORPHANS_DIR)) {
    const orphanFiles = fs.readdirSync(ORPHANS_DIR).filter((f) => f.endsWith(".json"));
    for (const f of orphanFiles) {
      works.push(readJSON(path.join(ORPHANS_DIR, f)));
    }
  }
  return works;
}

/* ======================
   ÍNDICES UNIFICADOS
====================== */
function buildUnifiedIndexes() {
  // desde formularios .txt
  const forms = loadFormsCreatorsAndWorks();
  // desde JSON clásicos (si los usas)
  const creatorsJSON = loadAllCreatorsJSON();
  const worksJSON = loadAllWorksJSON();

  // merge creadores
  const creatorsMap = new Map();
  for (const c of [...(forms.creators || []), ...(creatorsJSON || [])]) {
    if (!creatorsMap.has(c.slug)) creatorsMap.set(c.slug, c);
    else {
      const prev = creatorsMap.get(c.slug);
      creatorsMap.set(c.slug, {
        ...prev,
        socials: [...(prev.socials || []), ...(c.socials || [])],
        support: [...(prev.support || []), ...(c.support || [])],
      });
    }
  }

  // merge obras
  const worksMap = new Map();
  for (const w of [...(forms.works || []), ...(worksJSON || [])]) {
    worksMap.set(w.slug, w); // si hay duplicados por slug, el último gana
  }

  return {
    creators: Array.from(creatorsMap.values()),
    works: Array.from(worksMap.values()),
  };
}

/* ======================
   API PÚBLICA USADA POR LAS PÁGINAS
====================== */
export function loadFeatured() {
  if (!fs.existsSync(FEATURED_FILE)) return [];
  return readJSON(FEATURED_FILE);
}

export function getAllCreatorSlugs() {
  const { creators } = buildUnifiedIndexes();
  return creators.map((c) => c.slug);
}

export function getCreatorBySlug(slug) {
  const { creators } = buildUnifiedIndexes();
  return creators.find((c) => c.slug === slug) || null;
}

export function getWorksByCreatorSlug(creatorSlug) {
  const { works } = buildUnifiedIndexes();
  return works.filter((w) => w.creatorSlug === creatorSlug);
}

export function getAllWorkSlugs() {
  const { works } = buildUnifiedIndexes();
  return works.map((w) => w.slug);
}

export function getWorkBySlug(slug) {
  const { creators, works } = buildUnifiedIndexes();
  const obra = works.find((w) => w.slug === slug);
  if (!obra) return null;

  const creator = obra.creatorSlug
    ? creators.find((c) => c.slug === obra.creatorSlug) || null
    : null;

  const support =
    (obra.support && obra.support.length > 0)
      ? obra.support
      : (creator?.support || []);

  return { ...obra, creator, support };
}
