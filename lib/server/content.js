// lib/server/content.js
// Utilidades de carga SOLO lado servidor (Node)

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const CREATORS_DIR = path.join(CONTENT_DIR, "creators");
const ORPHANS_DIR = path.join(CONTENT_DIR, "orphans");

export const ytThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function safeArray(x) {
  return Array.isArray(x) ? x : [];
}

function loadAll() {
  const all = [];

  // CREADORES
  if (fs.existsSync(CREATORS_DIR)) {
    const creators = fs.readdirSync(CREATORS_DIR, { withFileTypes: true }).filter(d => d.isDirectory());
    for (const dirent of creators) {
      const cdir = path.join(CREATORS_DIR, dirent.name);
      const creatorFile = path.join(cdir, "creator.json");
      let creator = null;
      if (fs.existsSync(creatorFile)) creator = readJSON(creatorFile);

      const works = fs.readdirSync(cdir).filter(f => f.endsWith(".json") && f !== "creator.json");
      for (const w of works) {
        const item = readJSON(path.join(cdir, w));
        if (creator) item.creatorInfo = creator; // attach info útil
        all.push(item);
      }
    }
  }

  // HUÉRFANAS
  if (fs.existsSync(ORPHANS_DIR)) {
    const works = fs.readdirSync(ORPHANS_DIR).filter(f => f.endsWith(".json"));
    for (const w of works) {
      const item = readJSON(path.join(ORPHANS_DIR, w));
      all.push(item);
    }
  }

  // ordenar por título
  all.sort((a, b) => String(a.title).localeCompare(String(b.title)));
  return all;
}

export function getAllWorks() {
  return loadAll();
}

export function getWorksByType(type) {
  return loadAll().filter(x => x.type?.toLowerCase() === type.toLowerCase());
}

export function getWorkBySlug(slug) {
  return loadAll().find(x => x.slug === slug) || null;
}
