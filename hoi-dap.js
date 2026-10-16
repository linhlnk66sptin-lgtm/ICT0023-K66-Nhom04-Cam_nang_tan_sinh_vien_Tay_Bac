"use strict";

const $id = (id) => document.getElementById(id);

const removeAccents = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase();

function initFaq() {
  const box = $id("faq-list");
  if (!box) return;
  FAQS.forEach((f, i) => {
    box.insertAdjacentHTML("beforeend", `<div class="accordion-item faq-item">
      <h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq${i}" aria-expanded="false" aria-controls="faq${i}"></button></h2>
      <div id="faq${i}" class="accordion-collapse collapse" data-bs-parent="#faq-list"><div class="accordion-body"></div></div></div>`);
    const item = box.lastElementChild;
    item.querySelector("button").textContent = f.q;
    item.querySelector(".accordion-body").textContent = f.a;
  });
  function filter() {
    const kw = removeAccents($("#faq-search").val().trim());
    let shown = 0;
    $(".faq-item").each(function () {
      const hit = kw === "" || removeAccents($(this).text()).includes(kw);
      $(this).toggle(hit); if (hit) shown++;
    });
    $("#faq-empty").toggleClass("d-none", shown > 0);
    $("#faq-count").text(`Có ${shown}/${FAQS.length} câu hỏi`);
  }
  $("#faq-search").on("input", filter);
  filter();
}

document.addEventListener("DOMContentLoaded", () => { initFaq(); });
