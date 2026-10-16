"use strict";

const $id = (id) => document.getElementById(id);

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

document.addEventListener("DOMContentLoaded", () => { initContact(); });
