// scripts/ingest-forms.js
// Lee /content/forms/*.txt y genera JSON en /content/creators/<creatorSlug>/*.json

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const FORMS_DIR = path.join(ROOT, "content", "forms");
const CREATORS_DIR = path.join(ROOT, "content", "creators");

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function slugify(str) {
  return String(str || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function youtubeIdFromUrl(url) {
  if (!url) return "";
  try {
    const u = new URL(url.trim().replace(/^http:/, "https:"));
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    // /shorts/<id>
    const m = u.pathname.match(/\/shorts\/([^/?#]+)/);
    if (m) return m[1];
  } catch {}
  return "";
}

function parseBlock(lines, i) {
  // parsea un bloque de “obra”
  const data = {
    type: "",
    title: "",
    medium: "",
    genres: [],
    description: "",
    creator: null,
    episodes: []
  };

  const readVal = (label) => {
    const re = new RegExp("^\\s*" + label + "\\s*:\\s*(.*)$", "i");
    for (; i < lines.length; i++) {
      const m = lines[i].match(re);
      if (m) return { val: m[1].trim(), next: i + 1 };
      if (/^[-]{5,}$/.test(lines[i])) return { val: "", next: i }; // nuevo separador
    }
    return { val: "", next: i };
  };

  let r;

  r = readVal("TIPO");
  data.type = r.val || "";
  i = r.next;

  r = readVal("NOMBRE");
  data.title = r.val || "";
  i = r.next;

  r = readVal("MEDIO");
  // admite: 2D | 3D | Stop-motion | Híbrido
  data.medium = (r.val || "").split("|")[0].trim();
  i = r.next;

  r = readVal("GENERO");
  data.genres = (r.val || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  i = r.next;

  r = readVal("DESCRIPCION");
  data.description = r.val || "";
  i = r.next;

  // VIDEOS: varias líneas tipo:
  // - title=Algo | url=https://youtu...
  // - https://youtu...
  let started = false;
  for (; i < lines.length; i++) {
    const line = lines[i].trim();
    if (/^[-]{5,}$/.test(line)) break; // siguiente bloque
    if (/^VIDEOS\s*:/.test(line)) { started = true; continue; }
    if (!started) continue;
    if (!line.startsWith("-")) continue;

    let title = "";
    let url = "";

    // con metadatos
    if (/title\s*=/.test(line) && /url\s*=/.test(line)) {
      const t = line.match(/title\s*=\s*([^|]+)/i);
      const u = line.match(/url\s*=\s*(.+)$/i);
      title = t ? t[1].trim() : "";
      url = u ? u[1].trim() : "";
    } else {
      // solo URL
      url = line.slice(1).trim();
    }

    const id = youtubeIdFromUrl(url);
    if (id) {
      data.episodes.push({
        id: slugify(title || id),
        title: title || data.title || "Video",
        youtubeId: id
      });
    }
  }

  return { item: data, next: i };
}

function parseForm(txt) {
  const lines = txt.split(/\r?\n/);
  let creatorSlug = "";
  let creatorName = "";
  let hasCreator = false;
  const socials = [];
  const support = [];

  const urlLines = (startIndex) => {
    const arr = [];
    for (let j = startIndex; j < lines.length; j++) {
      const l = lines[j].trim();
      if (/^-\s*https?:\/\//i.test(l)) arr.push(l.replace(/^-+/, "").trim());
      else if (l === "" || /^[A-ZÁÉÍÓÚÑ]+:/.test(l)) break;
    }
    return arr;
  };

  // encabezado
  for (let i = 0; i < lines.length; i++) {
    const L = lines[i];

    const mHas = L.match(/^\s*TIENE\s+CREADOR\s*:\s*(.+)$/i);
    if (mHas) { hasCreator = /si/i.test(mHas[1]); continue; }

    const mC = L.match(/^\s*CREADOR\s*:\s*(.+)$/i);
    if (mC) {
      creatorName = mC[1].trim();
      creatorSlug = slugify(creatorName || "sin-creador");
      continue;
    }

    if (/^\s*REDES\s*:/i.test(L)) {
      for (const u of urlLines(i + 1)) socials.push({ label: new URL(u).hostname, href: u });
      continue;
    }
    if (/^\s*FINANCIACION\s*:/i.test(L)) {
      for (const u of urlLines(i + 1)) {
        let label = "Apóyame";
        try {
          const host = new URL(u).hostname;
          if (/patreon/i.test(host)) label = "Patreon";
          else if (/ko-fi/i.test(host)) label = "Ko-fi";
        } catch {}
        support.push({ label, href: u });
      }
      continue;
    }
  }

  // obras (bloques separados por líneas de guiones)
  const items = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^[-]{5,}$/.test(lines[i])) {
      const { item, next } = parseBlock(lines, i + 1);
      if (item.title && item.type && item.episodes.length) {
        if (hasCreator) item.creator = creatorSlug;
        items.push(item);
      }
      i = next - 1;
    }
  }

  return {
    creator: hasCreator ? { slug: creatorSlug, name: creatorName, socials, support } : null,
    items
  };
}

function writeJSONCreator(baseDir, creator) {
  ensureDir(baseDir);
  const file = path.join(baseDir, "creator.json");
  fs.writeFileSync(file, JSON.stringify(creator, null, 2), "utf8");
}

function writeJSONWork(baseDir, item) {
  const slug = slugify(item.title);
  const file = path.join(baseDir, `${slug}.json`);
  const payload = {
    slug,
    title: item.title,
    type: item.type,
    medium: item.medium,
    genres: item.genres || [],
    description: item.description || "",
    episodes: item.episodes || [],
    creator: item.creator || null
  };
  fs.writeFileSync(file, JSON.stringify(payload, null, 2), "utf8");
}

function main() {
  ensureDir(CREATORS_DIR);
  if (!fs.existsSync(FORMS_DIR)) {
    console.log("[ingest] No hay /content/forms; nada que hacer.");
    return;
  }

  const forms = fs.readdirSync(FORMS_DIR).filter(f => f.endsWith(".txt"));
  for (const f of forms) {
    const raw = fs.readFileSync(path.join(FORMS_DIR, f), "utf8");
    const parsed = parseForm(raw);

    // con creador
    if (parsed.creator) {
      const cDir = path.join(CREATORS_DIR, parsed.creator.slug);
      ensureDir(cDir);
      writeJSONCreator(cDir, parsed.creator);
      for (const it of parsed.items) writeJSONWork(cDir, it);
      console.log(`[ingest] ${f} -> ${parsed.items.length} obras para creador ${parsed.creator.slug}`);
    } else {
      // huérfanas: /content/orphans
      const oDir = path.join(ROOT, "content", "orphans");
      ensureDir(oDir);
      for (const it of parsed.items) writeJSONWork(oDir, it);
      console.log(`[ingest] ${f} -> ${parsed.items.length} obras huérfanas`);
    }
  }
}

main();
