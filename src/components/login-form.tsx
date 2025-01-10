import { type FC } from "hono/jsx";

const LoginForm: FC<{
  username: string;
  password: string;
  message?: string;
}> = (props) => {
  return (
    <form class="flex flex-col gap-2" hx-post="/auth/login">
      <input
        type="text"
        name="username"
        placeholder="Tên đăng nhập"
        class="border border-gray-300 p-2 rounded-md"
        value={props.username}
      />
      <input
        type="password"
        name="password"
        placeholder="Mật khẩu"
        class="border border-gray-300 p-2 rounded-md"
        value={props.password}
      />
      <button type="submit" class="bg-blue-500 text-white p-2 rounded-md">
        Đăng nhập
      </button>
      {props.message && <p class="text-red-500">{props.message}</p>}
    </form>
  );
};

export default LoginForm;
