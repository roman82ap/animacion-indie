// scripts/ingest-forms.js
// Lee /content/forms/*.txt y genera JSON en /content/creators/<slug>/

const fs = require("fs");
const path = require("path");

/* =========================
   Utilidades
========================= */

const ROOT = process.cwd();
const FORMS_DIR = path.join(ROOT, "content", "forms");
const CREATORS_DIR = path.join(ROOT, "content", "creators");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function youtubeIdFrom(url) {
  if (!url) return "";
  try {
    // normalizamos
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;

    const u = new URL(url);
    // youtu.be/<id>
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace(/^\//, "");
    }
    // youtube.com/watch?v=<id>
    if (u.searchParams.has("v")) {
      return u.searchParams.get("v");
    }
    // embed
    const m = u.pathname.match(/\/embed\/([^\/\?]+)/);
    if (m) return m[1];
    // fallback: lo que quede
    return u.pathname.split("/").filter(Boolean).pop() || "";
  } catch {
    return "";
  }
}

function labelFromUrl(u) {
  try {
    if (!/^https?:\/\//.test(u)) u = "https://" + u;
    const host = new URL(u).hostname.replace(/^www\./, "");
    if (host.includes("youtube")) return "YouTube";
    if (host.includes("instagram")) return "Instagram";
    if (host.includes("twitter")) return "Twitter/X";
    if (host.includes("patreon")) return "Patreon";
    if (host.includes("ko-fi")) return "Ko-fi";
    return host;
  } catch {
    return "Link";
  }
}

function readTxtFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".txt"));
}

/* =========================
   Parser del .txt
   Formato esperado (flexible):
   TIENE CREADOR: si|no
   CREADOR: veridion23 (slug)
   REDES:
   - https://...
   - https://...
   FINANCIACION:
   - https://...
   --------------------------------
   TIPO: Serie|Corto|Película|Trailer|Huerfano
   NOMBRE: Fuerza abusiva
   MEDIO: 2D|3D|Stop-motion|Híbrido
   GENERO: Acción, Sci-Fi
   DESCRIPCION: texto
   VIDEOS:
   - title=Trailer Oficial | url=https://youtu...
   - url=https://youtu...           (title opcional)
========================= */

function parseForm(txt) {
  const lines = txt.split(/\r?\n/).map((l) => l.trim());

  let creatorFlag = "si";
  let creatorSlug = "";
  let creatorName = ""; // si quieres usar un nombre distinto al slug
  const socials = [];
  const support = [];

  const works = [];
  let current = null;
  let mode = ""; // "", "REDES", "FIN", "VIDEOS"

  const flushWork = () => {
    if (!current) return;
    // default/limpieza
    current.slug = current.slug || slugify(current.title || "obra");
    current.type = current.type || "Huerfano";
    current.medium = current.medium || "";
    current.genres = current.genres || [];
    current.description = current.description || "";
    current.episodes = current.episodes || [];
    works.push(current);
    current = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (/^ti[eé]ne\s+creador\s*:/i.test(line)) {
      creatorFlag = line.split(":")[1]?.trim().toLowerCase() || "si";
      continue;
    }
    if (/^creador\s*:/i.test(line)) {
      const val = line.split(":")[1]?.trim() || "";
      // Puedes permitir "slug | Nombre bonito"
      const [slug, name] = val.split("|").map((s) => s && s.trim());
      creatorSlug = slug || "";
      creatorName = name || slug || "";
      continue;
    }
    if (/^redes\s*:/i.test(line)) {
      mode = "REDES";
      continue;
    }
    if (/^financiaci[oó]n\s*:/i.test(line)) {
      mode = "FIN";
      continue;
    }
    if (/^-{3,}/.test(line)) {
      // separador de obra
      flushWork();
      mode = "";
      continue;
    }

    // bloques por obra
    if (/^tipo\s*:/i.test(line)) {
      if (current) flushWork();
      current = {};
      current.type = line.split(":")[1]?.trim() || "";
      continue;
    }
    if (/^nombre\s*:/i.test(line)) {
      if (!current) current = {};
      current.title = line.split(":")[1]?.trim() || "";
      current.slug = slugify(current.title);
      continue;
    }
    if (/^medio\s*:/i.test(line)) {
      if (!current) current = {};
      current.medium = line.split(":")[1]?.trim() || "";
      continue;
    }
    if (/^genero\s*:/i.test(line) || /^género\s*:/i.test(line)) {
      if (!current) current = {};
      const c = line.split(":")[1] || "";
      current.genres = c.split(",").map((g) => g.trim()).filter(Boolean);
      continue;
    }
    if (/^descripcion\s*:/i.test(line) || /^descripción\s*:/i.test(line)) {
      if (!current) current = {};
      current.description = line.split(":")[1]?.trim() || "";
      continue;
    }
    if (/^videos\s*:/i.test(line)) {
      if (!current) current = {};
      current.episodes = [];
      mode = "VIDEOS";
      continue;
    }

    // listas con "- " según modo
    if (/^- /.test(line)) {
      const item = line.replace(/^- +/, "");
      if (mode === "REDES") {
        socials.push({ label: labelFromUrl(item), href: item });
        continue;
      }
      if (mode === "FIN") {
        support.push({ label: labelFromUrl(item), href: item });
        continue;
      }
      if (mode === "VIDEOS") {
        const obj = { title: "", youtubeId: "" };
        // admite "title=.. | url=..", "url=..", o solo URL
        const parts = item.split("|").map((p) => p.trim());
        for (const p of parts) {
          const [k, v] = p.split("=").map((x) => x && x.trim());
          if (!v) {
            // no venía como k=v → asumimos que es la URL
            obj.youtubeId = youtubeIdFrom(p);
          } else {
            if (k.toLowerCase() === "title" || k.toLowerCase() === "titulo") {
              obj.title = v;
            } else if (k.toLowerCase() === "url") {
              obj.youtubeId = youtubeIdFrom(v);
            }
          }
        }
        // último intento: si no hay youtubeId, toda la línea puede ser la URL
        if (!obj.youtubeId) obj.youtubeId = youtubeIdFrom(item);
        if (!obj.title) obj.title = "Video";
        obj.id = slugify(obj.title);
        if (obj.youtubeId) current.episodes.push(obj);
        continue;
      }
    }
  }

  flushWork();

  // salida
  return {
    creatorFlag,
    creatorSlug: creatorSlug || (works[0] ? "orphan" : ""),
    creatorName: creatorName || creatorSlug || "",
    socials,
    support,
    works
  };
}

/* =========================
   Ingesta
========================= */

function main() {
  ensureDir(CREATORS_DIR);

  const files = readTxtFiles(FORMS_DIR);
  if (files.length === 0) {
    console.log("[ingest-forms] No hay .txt en /content/forms. Nada que hacer.");
    return;
  }

  for (const file of files) {
    const fp = path.join(FORMS_DIR, file);
    const txt = fs.readFileSync(fp, "utf8");
    const data = parseForm(txt);

    const creatorSlug = data.creatorSlug || "orphans";
    const baseDir = path.join(CREATORS_DIR, creatorSlug);
    ensureDir(baseDir);

    // Opcional: crear/actualizar creator.json si TIENE CREADOR: si
    if (data.creatorFlag !== "no") {
      const creatorJsonPath = path.join(baseDir, "creator.json");
      const creatorObj = {
        slug: creatorSlug,
        name: data.creatorName || creatorSlug,
        socials: data.socials || [],
        support: data.support || [],
        avatar: `/creators/${creatorSlug}/avatar.png`
      };
      fs.writeFileSync(creatorJsonPath, JSON.stringify(creatorObj, null, 2));
      console.log(` [creator] ${creatorSlug} -> creator.json`);
    }

    // Por cada obra, generar <slug>.json
    for (const w of data.works) {
      const out = {
        slug: w.slug,
        title: w.title,
        type: w.type,
        medium: w.medium,
        genres: w.genres,
        description: w.description,
        banner: w.banner || "", // si en el futuro lo quieres llenar
        support: data.support || [],
        episodes: w.episodes || []
      };

      const outPath = path.join(baseDir, `${out.slug}.json`);
      fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
      console.log(` [work]  ${creatorSlug}/${out.slug}.json (${out.episodes.length} videos)`);
    }
  }

  console.log("✔ Ingesta de formularios completada.\n");
}

main();
