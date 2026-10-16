"use strict";
const $id = (id) => document.getElementById(id);
const removeAccents = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase();
function initGuides() {
  const list = $id("guide-list");
  if (!list) return;
  let activeGroup = "Tất cả";
  const filters = $id("guide-filters");
  const modal = new bootstrap.Modal($id("guideModal"));

  ["Tất cả", ...GROUPS].forEach((g) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "btn btn-outline-primary btn-sm"; b.textContent = g;
    b.setAttribute("aria-pressed", g === "Tất cả");
    if (g === "Tất cả") b.classList.add("active");
    b.addEventListener("click", () => { activeGroup = g; render(); });
    filters.appendChild(b);
  });
  function render() {
    const kw = removeAccents($id("guide-search").value.trim());
    const result = GUIDES.filter((x) =>
      (activeGroup === "Tất cả" || x.group === activeGroup) &&
      (kw === "" || removeAccents(x.title + " " + x.summary).includes(kw)));
    filters.querySelectorAll("button").forEach((b) => {
      const on = b.textContent === activeGroup;
      b.classList.toggle("active", on); b.setAttribute("aria-pressed", on);
    });
    list.innerHTML = "";
    result.forEach((x) => {
      const col = document.createElement("div");
      col.className = "col-12 col-md-6 col-lg-4";
      col.innerHTML = `<div class="card h-100"><div class="card-body d-flex flex-column">
        <span class="badge-tag"></span><h2 class="h5"></h2><p></p>
        <button type="button" class="btn btn-outline-primary btn-sm mt-auto align-self-start">Xem chi tiết</button></div></div>`;
      col.querySelector(".badge-tag").textContent = x.group;
      col.querySelector("h2").textContent = x.title;
      col.querySelector("p").textContent = x.summary;
      col.querySelector("button").addEventListener("click", () => {
        $id("guideModalTitle").textContent = x.title;
        $id("guideModalBody").textContent = x.detail;
        modal.show();
      });
      list.appendChild(col);
    });
    $id("guide-empty").classList.toggle("d-none", result.length > 0);
    $id("guide-count").textContent = `Hiển thị ${result.length}/${GUIDES.length} mục`;
  }
  $id("guide-search").addEventListener("input", render);
  $id("guide-reset").addEventListener("click", () => { $id("guide-search").value = ""; activeGroup = "Tất cả"; render(); });
  render();
}

document.addEventListener("DOMContentLoaded", () => { initGuides(); });
