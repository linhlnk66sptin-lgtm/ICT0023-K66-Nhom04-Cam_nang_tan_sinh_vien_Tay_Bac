"use strict";
const $id=id=>document.getElementById(id);
function initContact(){
const form=$id("contact-form");
if(!form)return;
const name=$id("f-name"),email=$id("f-email"),topic=$id("f-topic"),msg=$id("f-msg"),counter=$id("f-count"),errBox=$id("form-errors"),sampleButton=$id("f-sample");
const MIN=10,MAX=300,fields=[name,email,topic,msg];
let successBox=$id("form-success");
if(!successBox){
successBox=document.createElement("div");
successBox.id="form-success";
successBox.className="alert alert-success d-none mt-3";
successBox.setAttribute("role","status");
successBox.setAttribute("aria-live","polite");
successBox.textContent="Gửi câu hỏi hoặc góp ý thành công! Cảm ơn bạn đã đóng góp ý kiến.";
form.appendChild(successBox);
}
function getFeedback(input){
let feedback=input.parentElement.querySelector(".invalid-feedback");
if(!feedback){
feedback=document.createElement("div");
feedback.className="invalid-feedback";
input.insertAdjacentElement("afterend",feedback);
}
return feedback;
}
function setError(input,text){
const feedback=getFeedback(input);
feedback.textContent=text;
feedback.style.display=text?"block":"none";
input.classList.remove("is-invalid");
input.removeAttribute("aria-invalid");
if(text)input.setAttribute("aria-invalid","true");
}
function updateCount(){
const length=msg.value.trim().length;
counter.textContent=length<MIN?`Đã nhập ${length}/${MAX} ký tự — cần thêm ${MIN-length} ký tự.`:`Đã nhập ${length}/${MAX} ký tự.`;
}
function hideMessages(){
successBox.classList.add("d-none");
if(errBox){
errBox.classList.add("d-none");
errBox.replaceChildren();
}
}
function clearErrors(){
fields.forEach(input=>setError(input,""));
if(errBox){
errBox.classList.add("d-none");
errBox.replaceChildren();
}
}
function validateField(input){
const value=input.value.trim();
let error="";
if(!value){
if(input===name)error="Vui lòng nhập họ tên.";
else if(input===email)error="Vui lòng nhập email.";
else if(input===topic)error="Vui lòng chọn chủ đề.";
else if(input===msg)error="Vui lòng nhập nội dung.";
}else if(input===name&&value.length<2){
error="Họ tên cần ít nhất 2 ký tự.";
}else if(input===email){
if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value))error="Email chưa đúng định dạng (ví dụ: ten@email.com).";
}else if(input===msg){
if(value.length<MIN)error=`Nội dung quá ngắn (${value.length}/${MIN} ký tự).`;
else if(value.length>MAX)error=`Nội dung quá dài (${value.length}/${MAX} ký tự).`;
}
setError(input,error);
return error==="";
}
fields.forEach(input=>{
input.addEventListener("input",()=>{
validateField(input);
hideMessages();
if(input===msg)updateCount();
});
input.addEventListener("change",()=>{
validateField(input);
hideMessages();
});
});
form.addEventListener("submit",event=>{
event.preventDefault();
hideMessages();
let firstInvalid=null;
const errors=[];
fields.forEach(input=>{
if(!validateField(input)){
if(!firstInvalid)firstInvalid=input;
errors.push({id:input.id,text:getFeedback(input).textContent});
}
});
if(errors.length){
if(errBox){
const list=document.createElement("ul");
list.className="mb-0";
errors.forEach(item=>{
    const li=document.createElement("li");
    const link=document.createElement("a");
    link.href=`#${item.id}`;
    link.textContent=item.text;
    li.appendChild(link);
    list.appendChild(li);
});
errBox.replaceChildren(list);
errBox.classList.remove("d-none");
errBox.focus();
}
if(firstInvalid)firstInvalid.focus();
return;
}
successBox.textContent="✓ Gửi câu hỏi hoặc góp ý thành công! Cảm ơn bạn đã đóng góp ý kiến.";
successBox.classList.remove("d-none");
successBox.scrollIntoView({behavior:"smooth",block:"nearest"});
});
if(sampleButton){
sampleButton.addEventListener("click",()=>{
name.value="Sinh viên mẫu";
email.value="mau@example.com";
topic.value="Ký túc xá";
msg.value="Em muốn hỏi thời gian đăng ký ký túc xá cho tân sinh viên.";
clearErrors();
hideMessages();
updateCount();
});
}
form.addEventListener("reset",()=>{
setTimeout(()=>{
clearErrors();
hideMessages();
updateCount();
},0);
});
clearErrors();
updateCount();
}
document.addEventListener("DOMContentLoaded",initContact);
