"use strict";

const $id = (id) => document.getElementById(id);

function initGallery() {
  const box = $id("gallery");
  if (!box) return;
  GALLERY.forEach((g) => {
    const col = document.createElement("div");
    col.className = "col-6 col-md-4";
    col.innerHTML = '<figure class="gallery-item"><img loading="lazy" width="400" height="260"><figcaption></figcaption></figure>';
    const img = col.querySelector("img");
    img.alt = g.alt; img.src = g.src;
    img.addEventListener("error", () => { img.src = "images/placeholder.svg"; }, { once: true });
    col.querySelector("figcaption").textContent = g.caption;
    box.appendChild(col);
  });
}
document.addEventListener("DOMContentLoaded", () => { initGallery(); });
