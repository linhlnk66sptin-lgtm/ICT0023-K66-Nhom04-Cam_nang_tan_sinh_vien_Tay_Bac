const GROUPS = ["Thủ tục", "Học vụ", "Học bổng", "Ký túc xá", "Đời sống"];
const GUIDES = [
  { id: 1, group: "Thủ tục", title: "Chuẩn bị hồ sơ nhập học", summary: "Danh sách giấy tờ cần mang theo khi nhập học.", detail: "Mang bản gốc để đối chiếu và thêm bản sao theo thông báo. Kiểm tra kỹ họ tên, ngày sinh trên mọi giấy tờ để kịp sửa sai sót." },
  { id: 2, group: "Thủ tục", title: "Nhận thẻ sinh viên và tài khoản", summary: "Thẻ sinh viên, email và tài khoản cổng thông tin.", detail: "Sau khi hoàn tất hồ sơ, bạn nhận thẻ và thông tin tài khoản. Đổi mật khẩu ngay lần đầu đăng nhập và không chia sẻ cho người khác." },
  { id: 3, group: "Học vụ", title: "Đọc khung chương trình đào tạo", summary: "Biết mình phải học những học phần nào, theo thứ tự nào.", detail: "Mở khung chương trình của ngành, đánh dấu học phần bắt buộc và tự chọn, ghi lại học phần tiên quyết trước khi đăng ký." },
  { id: 4, group: "Học vụ", title: "Đăng ký học phần", summary: "Các bước đăng ký, thay đổi và hủy học phần.", detail: "Đăng ký đúng khung thời gian trường thông báo, kiểm tra trùng lịch học và số tín chỉ tối thiểu/tối đa trước khi xác nhận." },
  { id: 5, group: "Học bổng", title: "Các loại học bổng thường gặp", summary: "Học bổng khuyến khích học tập và hỗ trợ khác.", detail: "Theo dõi thông báo của phòng chức năng về điều kiện, hồ sơ và hạn nộp. Chuẩn bị bảng điểm và giấy tờ minh chứng sớm." },
  { id: 6, group: "Ký túc xá", title: "Đăng ký ở ký túc xá", summary: "Quy trình đăng ký, nội quy và đồ dùng cần mang.", detail: "Đọc kỹ nội quy, thời gian đóng/mở cửa và quy định an toàn phòng ở. Chuẩn bị đồ dùng cá nhân cần thiết, tránh mang quá nhiều." },
  { id: 7, group: "Đời sống", title: "Làm quen khu học tập và thư viện", summary: "Giảng đường, thư viện, căng tin và nơi cần hỗ trợ.", detail: "Dành buổi đầu đi một vòng các khu chính, lưu số điện thoại hỗ trợ và vị trí các phòng chức năng bạn sẽ làm việc." },
  { id: 8, group: "Đời sống", title: "Quản lý chi tiêu tháng đầu", summary: "Lập ngân sách để không bị hụt tiền giữa tháng.", detail: "Liệt kê các khoản cố định (ở, ăn) và khoản phát sinh. Dùng công cụ ước tính trong trang Công cụ để so sánh với ngân sách." }
];

const CHECKLIST = [
  { id: "c1", text: "Kiểm tra thông báo nhập học và thời hạn" },
  { id: "c2", text: "Chuẩn bị đủ hồ sơ, giấy tờ bản gốc và bản sao" },
  { id: "c3", text: "Hoàn thành thủ tục nhập học tại trường" },
  { id: "c4", text: "Nhận thẻ sinh viên, đổi mật khẩu tài khoản" },
  { id: "c5", text: "Đăng ký ký túc xá hoặc chỗ ở" },
  { id: "c6", text: "Làm quen khung chương trình, đăng ký học phần" },
  { id: "c7", text: "Theo dõi thông báo học bổng" },
  { id: "c8", text: "Lưu số liên hệ cố vấn học tập, phòng hỗ trợ" }
];

const FAQS = [
  { q: "Tôi mất thẻ sinh viên thì làm gì?", a: "Liên hệ đơn vị quản lý sinh viên của trường để được hướng dẫn cấp lại thẻ và các giấy tờ cần nộp." },
  { q: "Khi nào tôi đăng ký học phần?", a: "Trường thông báo lịch đăng ký từng kỳ. Hãy theo dõi cổng thông tin và thông báo của khoa." },
  { q: "Học bổng khuyến khích học tập xét dựa trên gì?", a: "Thường dựa trên kết quả học tập và rèn luyện của kỳ trước, theo quy chế trường công bố." },
  { q: "Tôi có bắt buộc ở ký túc xá không?", a: "Không bắt buộc. Bạn chọn ký túc xá hoặc nhà trọ tùy hoàn cảnh; hãy xem điều kiện đăng ký của trường." },
  { q: "Tôi quên mật khẩu cổng thông tin?", a: "Dùng chức năng lấy lại mật khẩu hoặc liên hệ đơn vị quản trị hệ thống của trường." },
  { q: "Làm sao biết lịch học của mình?", a: "Xem thời khóa biểu trên cổng thông tin sau khi đăng ký học phần thành công." },
  { q: "Có thể xin hỗ trợ tài chính không?", a: "Có các chế độ miễn giảm, hỗ trợ theo quy định. Hãy hỏi đơn vị phụ trách chính sách sinh viên." },
  { q: "Nên chuẩn bị gì cho buổi học đầu tiên?", a: "Mang thẻ, sổ ghi chép, kiểm tra phòng học trước và đến sớm 10–15 phút." }
];

