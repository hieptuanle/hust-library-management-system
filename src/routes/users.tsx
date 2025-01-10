import { Hono } from "hono";

import { userService } from "@/modules/user-service";

const userRoutes = new Hono();

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
