import { type FC } from "hono/jsx";

const links: { name: string; href: string }[] = [
  {
    name: "Trang chủ",
    href: "/",
  },
  {
    name: "Tạo tài khoản",
    href: "/users/create",
  },
  {
    name: "Quản lý tài khoản",
    href: "/users",
  },
  {
    name: "Đổi mật khẩu",
    href: "/users/change-password",
  },
  {
    name: "Tra cứu đầu sách",
    href: "/book-titles",
  },
  {
    name: "Quản lý đầu sách",
    href: "/book-titles/manage",
  },
  {
    name: "Nhập/xuất sách",
    href: "/book-transactions/create",
  },
  {
    name: "Mượn/trả sách",
    href: "/borrow-records/create",
  },
  {
    name: "Lịch sử mượn/trả sách",
    href: "/borrow-records",
  },
  {
    name: "Báo cáo",
    href: "/reports",
  },
  {
    name: "Đăng xuất",
    href: "/logout",
  },
  {
    name: "Đăng nhập",
    href: "/login",
  },
];

const Nav: FC = () => {
  return (
    <nav class="col-span-12 md:col-span-3 bg-gray-200 p-2 rounded-md">
      <h1 class="text-xl font-bold mb-2">QLTV</h1>
      <ul class="grid grid-cols-2 md:grid-cols-1 gap-2 text-sm">
        {links.map((link) => (
          <li class="col-span-1">
            <a href={link.href}>{link.name}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
export default Nav;
