import { authService } from "@/modules/auth-service";
import { type FC } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";

const links: { name: string; href: string; roles?: string[] }[] = [
  {
    name: "Trang chủ",
    href: "/",
  },
  {
    name: "Tạo tài khoản",
    href: "/users/create",
    roles: ["admin", "librarian"],
  },
  {
    name: "Quản lý tài khoản",
    href: "/users",
    roles: ["admin", "librarian"],
  },
  {
    name: "Đầu sách",
    href: "/book-titles",
    roles: ["admin", "librarian", "student"],
  },
  {
    name: "Tạo phiếu nhập/xuất sách",
    href: "/book-transactions/create",
    roles: ["admin", "librarian"],
  },
  {
    name: "Lịch sử nhập/xuất sách",
    href: "/book-transactions",
    roles: ["admin", "librarian"],
  },
  {
    name: "Mượn sách",
    href: "/borrow-records/create",
    roles: ["admin", "librarian"],
  },
  {
    name: "Lịch sử mượn/trả sách",
    href: "/borrow-records",
    roles: ["admin", "librarian", "student"],
  },
  {
    name: "Báo cáo",
    href: "/reports",
    roles: ["admin", "librarian"],
  },
  {
    name: "Đổi mật khẩu",
    href: "/users/change-password",
    roles: ["admin", "librarian", "student"],
  },
  {
    name: "Đăng xuất",
    href: "/auth/logout",
    roles: ["admin", "librarian", "student"],
  },
  {
    name: "Đăng nhập",
    href: "/auth/login",
    roles: [],
  },
];

const Nav: FC<{ roles?: string[] }> = async (props) => {
  const c = useRequestContext();
  const user = await authService.getUser(c);
  const roles = user?.roles;
  return (
    <aside class="col-span-12 md:col-span-3 bg-gray-200 p-2 rounded-md md:h-full">
      <h1 class="font-bold mb-2 text-gray-500">Quản Lý Thư Viện</h1>
      <nav class="grid grid-cols-2 md:grid-cols-1 gap-2 text-sm">
        {links.map((link) =>
          !link.roles ||
          link.roles.some((role) => roles?.includes(role)) ||
          (link.roles.length === 0 && !roles) ? (
            <a class="col-span-1" href={link.href} hx-boost="true">
              {link.name}
            </a>
          ) : null
        )}
      </nav>
    </aside>
  );
};
export default Nav;
