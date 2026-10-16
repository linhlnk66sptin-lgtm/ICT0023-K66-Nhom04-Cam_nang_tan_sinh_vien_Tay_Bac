"use strict";
const $id = (id) => document.getElementById(id);
const removeAccents = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase();
const formatVND = (n) => n.toLocaleString("vi-VN") + " đ";

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

function initChecklist() {
  const ul = $id("checklist");
  if (!ul) return;
  CHECKLIST.forEach((item) => {
    const li = document.createElement("li");
    li.className = "check-item";
    li.innerHTML = `<input type="checkbox" id="${item.id}"><label for="${item.id}"></label>`;
    li.querySelector("label").textContent = item.text;
    ul.appendChild(li);
  });
  function updateProgress() {
    const total = $("#checklist input").length;
    const done = $("#checklist input:checked").length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    $("#progress-bar").css("width", pct + "%").text(pct + "%");
    $("#progress-wrap").attr("aria-valuenow", pct);
    $("#checklist .check-item").each(function () {
      $(this).toggleClass("done", $(this).find("input").prop("checked"));
    });
    $("#progress-text").text(done === total ? "Bạn đã hoàn tất mọi bước!" : `Đã xong ${done}/${total} bước, còn ${total - done} bước.`);
  }
  $("#checklist").on("change", "input", updateProgress);
  $("#check-sample").on("click", () => { $("#checklist input").each((i, el) => { el.checked = i < 4; }); updateProgress(); });
  $("#check-reset").on("click", () => { $("#checklist input").prop("checked", false); updateProgress(); });
  updateProgress();
}

function parseMoney(raw) {
  const s = raw.trim().replace(/[.,\s]/g, "");
  if (s === "") return { empty: true };
  if (!/^\d+$/.test(s)) return { error: "chỉ nhập số nguyên không âm (không có chữ hoặc dấu âm)" };
  const n = Number(s);
  if (n > 1e9) return { error: "giá trị quá lớn (tối đa 1.000.000.000)" };
  return { value: n };
}
function initCost() {
  const form = $id("cost-form");
  if (!form) return;
  const ids = ["c-budget", "c-dorm", "c-food", "c-book", "c-other"];
  const errBox = $id("cost-errors");
  function clearErrors() {
    ids.forEach((id) => { const el = $id(id); el.classList.remove("is-invalid"); el.nextElementSibling.textContent = ""; });
    errBox.classList.add("d-none"); errBox.innerHTML = "";
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault(); clearErrors();
    const errors = []; const values = {};
    ids.forEach((id) => {
      const el = $id(id); const r = parseMoney(el.value);
      const required = id === "c-budget";
      let msg = "";
      if (r.empty) { if (required) msg = "Hãy nhập ngân sách."; else values[id] = 0; }
      else if (r.error) msg = r.error.charAt(0).toUpperCase() + r.error.slice(1) + ".";
      else values[id] = r.value;
      if (msg) { el.classList.add("is-invalid"); el.nextElementSibling.textContent = msg; errors.push(`${el.dataset.name}: ${msg}`); }
    });
    if (errors.length) {
      errBox.innerHTML = "<strong>Vui lòng sửa:</strong><ul class='mb-0'>" + errors.map((x) => `<li>${x}</li>`).join("") + "</ul>";
      errBox.classList.remove("d-none"); errBox.focus();
      $id("cost-result").innerHTML = ""; return;
    }
    const total = values["c-dorm"] + values["c-food"] + values["c-book"] + values["c-other"];
    const diff = values["c-budget"] - total;
    const cls = diff >= 0 ? "alert-success" : "alert-danger";
    const msg = diff >= 0 ? `Còn dư ${formatVND(diff)}.` : `Vượt ngân sách ${formatVND(-diff)}. Hãy cân nhắc giảm khoản chi.`;
    const rate = values["c-budget"] === 0 ? "—" : Math.round((total / values["c-budget"]) * 100) + "%";
    $id("cost-result").innerHTML = `<div class="alert ${cls}" role="status"><p class="mb-1"><strong>Tổng chi: ${formatVND(total)}</strong> (${rate} ngân sách)</p><p class="mb-0">${msg}</p></div>`;
  });
  $id("cost-sample").addEventListener("click", () => {
    [["c-budget", "3000000"], ["c-dorm", "600000"], ["c-food", "1500000"], ["c-book", "400000"], ["c-other", "300000"]]
      .forEach(([id, v]) => { $id(id).value = v; });
    form.requestSubmit();
  });
  form.addEventListener("reset", () => { clearErrors(); $id("cost-result").innerHTML = ""; });
}

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

function initContact() {
  const form = $id("contact-form");
  if (!form) return;
  const msg = $id("f-msg"), counter = $id("f-count"), errBox = $id("form-errors");
  const modal = new bootstrap.Modal($id("previewModal"));
  const MIN = 10, MAX = 300;
  function updateCount() {
    const n = msg.value.trim().length;
    counter.textContent = n < MIN ? `Đã nhập ${n}/${MAX} ký tự — cần thêm ${MIN - n} ký tự.` : `Đã nhập ${n}/${MAX} ký tự.`;
  }
  msg.addEventListener("input", updateCount);
  function setError(el, text, errors) {
    el.classList.add("is-invalid"); el.nextElementSibling.textContent = text;
    errors.push({ id: el.id, text });
  }
  function clear() {
    form.querySelectorAll(".is-invalid").forEach((el) => { el.classList.remove("is-invalid"); el.nextElementSibling.textContent = ""; });
    errBox.classList.add("d-none"); errBox.innerHTML = "";
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault(); clear();
    const errors = [];
    const name = $id("f-name"), email = $id("f-email"), topic = $id("f-topic");
    if (name.value.trim().length < 2) setError(name, "Họ tên cần ít nhất 2 ký tự.", errors);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) setError(email, "Email chưa đúng định dạng (ví dụ: ten@email.com).", errors);
    if (topic.value === "") setError(topic, "Hãy chọn một chủ đề.", errors);
    const len = msg.value.trim().length;
    if (len < MIN) setError(msg, `Nội dung quá ngắn (${len}/${MIN} ký tự).`, errors);
    else if (len > MAX) setError(msg, `Nội dung quá dài (${len}/${MAX} ký tự).`, errors);
    if (errors.length) {
      errBox.innerHTML = "<strong>Có " + errors.length + " lỗi cần sửa:</strong><ul class='mb-0'>" +
        errors.map((x) => `<li><a href="#${x.id}">${x.text}</a></li>`).join("") + "</ul>";
      errBox.classList.remove("d-none"); errBox.focus(); return;
    }
    const body = $id("previewBody"); body.innerHTML = "";
    [["Họ tên", name.value.trim()], ["Email", email.value.trim()], ["Chủ đề", topic.value], ["Nội dung", msg.value.trim()]].forEach(([k, v]) => {
      const p = document.createElement("p"); const b = document.createElement("strong");
      b.textContent = k + ": "; p.appendChild(b); p.appendChild(document.createTextNode(v)); body.appendChild(p);
    });
    const note = document.createElement("p"); note.className = "small";
    note.textContent = "Đây chỉ là bản xem trước trên trình duyệt, chưa có dữ liệu nào được gửi đi.";
    body.appendChild(note); modal.show();
  });
  $id("f-sample").addEventListener("click", () => {
    $id("f-name").value = "Sinh viên mẫu"; $id("f-email").value = "mau@example.com";
    $id("f-topic").value = "Ký túc xá"; msg.value = "Em muốn hỏi thời gian đăng ký ký túc xá cho tân sinh viên."; updateCount();
  });
  form.addEventListener("reset", () => { clear(); setTimeout(updateCount, 0); });
}

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

document.addEventListener("DOMContentLoaded", () => {
  initGallery(); initGuides(); initChecklist(); initCost(); initFaq(); initContact();
});
