import { Hono } from "hono";

import { userService } from "@/modules/user-service";
import { authService } from "@/modules/auth-service";
import {
  getRandomAddress,
  getRandomCardId,
  getRandomCellphone,
  getRandomEmail,
  getRandomName,
  getRandomUsername,
} from "@/utils/faker";

const userRoutes = new Hono();

userRoutes.get("/create", async (c) => {
  const user = await authService.getUser(c);
  if (!user) {
    return c.redirect("/auth/login");
  }

  if (!user.roles.includes("admin") && !user.roles.includes("librarian")) {
    c.status(403);
    return c.render(
      <div>
        <p>Bạn không có quyền truy cập trang này.</p>
      </div>,
      {
        title: "Không có quyền truy cập",
      }
    );
  }

  return c.render(
    <div>
      <form
        class="flex flex-col gap-2"
        hx-post="/users/create"
        hx-swap="innerHTML"
        hx-on:submit="document.getElementById('error-message').innerHTML = ''"
      >
        <div class="flex flex-col gap-2">
          <label for="name">Họ tên</label>
          <input
            type="text"
            name="name"
            placeholder="Họ tên"
            class="border border-gray-300 p-2 rounded-md"
            value={getRandomName()}
            required
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="username">Tên đăng nhập</label>
          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            class="border border-gray-300 p-2 rounded-md"
            value={getRandomUsername()}
            required
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            class="border border-gray-300 p-2 rounded-md"
            value={getRandomEmail()}
            required
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="cellphone">Số điện thoại</label>
          <input
            type="text"
            name="cellphone"
            placeholder="Số điện thoại"
            class="border border-gray-300 p-2 rounded-md"
            value={getRandomCellphone()}
            required
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="cardId">Mã sinh viên/nhân viên</label>
          <input
            type="text"
            name="cardId"
            placeholder="Mã sinh viên/nhân viên"
            class="border border-gray-300 p-2 rounded-md"
            value={getRandomCardId()}
            required
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="address">Địa chỉ</label>
          <input
            type="text"
            name="address"
            placeholder="Địa chỉ"
            class="border border-gray-300 p-2 rounded-md"
            value={getRandomAddress()}
            required
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="roles">Vai trò</label>
          <select
            name="roles"
            class="border border-gray-300 p-2 rounded-md"
            required
          >
            <option value="student">Sinh viên</option>
            <option value="librarian">Thủ thư</option>
            <option value="admin">Kế toán</option>
          </select>
        </div>
        <div class="flex flex-col gap-2">
          <label for="deposit">Số tiền cọc</label>
          <input
            type="number"
            name="deposit"
            placeholder="Số tiền cọc"
            class="border border-gray-300 p-2 rounded-md"
            value="200000"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="password">Mật khẩu</label>
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            class="border border-gray-300 p-2 rounded-md"
            value={"12345678"}
            required
          />
        </div>
        <button type="submit" class="bg-blue-500 text-white p-2 rounded-md">
          Tạo tài khoản
        </button>
        <div id="error-message" class="text-red-500 text-sm"></div>
      </form>
    </div>,
    {
      title: "Tạo tài khoản",
    }
  );
});

userRoutes.post("/create", async (c) => {
  const target = c.req.header("HX-Target");
  console.log(target);
  const user = await authService.getUser(c);
  if (!user) {
    c.status(401);
    c.header("HX-Retarget", "#error-message");
    return c.html(<div>Bạn không được phép thực hiện lệnh này.</div>);
  }

  if (!user.roles.includes("admin") && !user.roles.includes("librarian")) {
    c.status(403);
    c.header("HX-Retarget", "#error-message");
    return c.html(<div>Bạn không có quyền thực hiện lệnh này.</div>);
  }

  const formData = await c.req.parseBody();

  try {
    await userService.createUser(formData);
    c.header("HX-Push-Url", "/users");
    c.header("HX-Redirect", "/users");
    c.status(204);
    return c.html(<div>Tạo tài khoản thành công</div>);
  } catch (error) {
    console.log(error);
    c.status(400);
    c.header("HX-Retarget", "#error-message");
    return c.html(
      <div>{userService.getCreateUserErrorMessage(error as any)}</div>
    );
  }
});

userRoutes.get("/", async (c) => {
  const users = await userService.getUsers();
  return c.render(
    <div class="w-full overflow-x-auto">
      <table class="table-auto border-collapse border border-slate-400 text-xs">
        <thead class="bg-gray-200">
          <tr>
            <th class="text-left p-2 border border-slate-400">ID</th>
            <th class="text-left p-2 border border-slate-400">Tên</th>
            <th class="text-left p-2 border border-slate-400">Tên đăng nhập</th>
            <th class="text-left p-2 border border-slate-400">Email</th>
            <th class="text-left p-2 border border-slate-400">Số điện thoại</th>
            <th class="text-left p-2 border border-slate-400">
              Mã sinh viên/nhân viên
            </th>
            <th class="text-left p-2 border border-slate-400">Địa chỉ</th>
            <th class="text-left p-2 border border-slate-400">Vai trò</th>
            <th class="text-left p-2 border border-slate-400">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr class="hover:bg-gray-100">
              <td class="text-left p-2 border border-slate-400">{user.id}</td>
              <td class="text-left p-2 border border-slate-400">{user.name}</td>
              <td class="text-left p-2 border border-slate-400">
                {user.username}
              </td>
              <td class="text-left p-2 border border-slate-400">
                {user.email}
              </td>
              <td class="text-left p-2 border border-slate-400">
                {user.cellphone}
              </td>
              <td class="text-left p-2 border border-slate-400">
                {user.cardId}
              </td>
              <td class="text-left p-2 border border-slate-400">
                {user.address}
              </td>
              <td class="text-left p-2 border border-slate-400">
                {user.roles?.join(", ")}
              </td>
              <td class="text-left p-2 border border-slate-400">
                <div class="flex flex-col gap-1 text-xs">
                  <a href={`/users/${user.id}`} class="text-blue-500">
                    Sửa
                  </a>
                  <a href={`/users/${user.id}/delete`} class="text-red-500">
                    Vô hiệu
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>,
    {
      title: "Quản lý tài khoản",
    }
  );
});

export default userRoutes;
