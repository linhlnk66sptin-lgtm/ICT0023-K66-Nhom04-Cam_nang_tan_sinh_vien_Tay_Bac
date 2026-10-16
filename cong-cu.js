"use strict";

const $id = (id) => document.getElementById(id);

const formatVND = (n) => n.toLocaleString("vi-VN") + " đ";

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

document.addEventListener("DOMContentLoaded", () => { initChecklist(); initCost(); });
