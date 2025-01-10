import { authService } from "@/modules/auth-service";
import { bookTransactionService } from "@/modules/book-transaction-service";
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  const user = await authService.getUser(c);
  const isAdmin =
    user?.roles.includes("admin") || user?.roles.includes("librarian");
  if (!isAdmin) {
    return c.redirect("/book-titles");
  }
  const bookTransactions = await bookTransactionService.getBookTransactions();
  return c.render(
    <div>
      <table class="table-auto border-collapse border border-slate-400 text-xs">
        <thead class="bg-slate-200">
          <tr>
            <th class="border border-slate-400 p-2">Mã phiếu</th>
            <th class="border border-slate-400 p-2">Mã sách</th>
            <th class="border border-slate-400 p-2">Tên sách</th>
            <th class="border border-slate-400 p-2">Người tạo</th>
            <th class="border border-slate-400 p-2">Số lượng</th>
            <th class="border border-slate-400 p-2">Mô tả</th>
            <th class="border border-slate-400 p-2">Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
          {bookTransactions.map((bookTransaction) => (
            <tr>
              <td class="border border-slate-400 p-2">{bookTransaction.id}</td>
              <td class="border border-slate-400 p-2">
                {bookTransaction.bookTitleId}
              </td>
              <td class="border border-slate-400 p-2">
                {bookTransaction.bookTitleName}
              </td>
              <td class="border border-slate-400 p-2">
                {bookTransaction.userName}
              </td>
              <td class="border border-slate-400 p-2">
                {bookTransaction.quantity}
              </td>
              <td class="border border-slate-400 p-2">
                {bookTransaction.description}
              </td>
              <td class="border border-slate-400 p-2">
                {bookTransaction.createdAt}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>,
    {
      title: "Phiếu nhập/xuất sách",
    }
  );
});

app.post("/", async (c) => {
  const user = await authService.getUser(c);
  const isAdmin =
    user?.roles.includes("admin") || user?.roles.includes("librarian");
  if (!isAdmin) {
    return c.redirect("/book-titles");
  }
  const formData = await c.req.parseBody();

  try {
    const bookTransaction = await bookTransactionService.createBookTransaction({
      ...formData,
      userId: user?.id,
    });
    c.header("HX-Push-Url", "/book-transactions");
    return c.html(<p>Phiếu nhập/xuất sách đã được tạo thành công.</p>);
  } catch (error) {
    return c.html(
      <p class="text-red-500">
        Phiếu nhập/xuất sách không được tạo. Lỗi:{" "}
        {error instanceof Error ? error.message : "Không xác định"}
      </p>
    );
  }
});

app.get("/create", async (c) => {
  return c.render(
    <div>
      <form
        className="flex flex-col gap-2"
        hx-post="/book-transactions"
        hx-target="#result"
      >
        <div className="flex flex-col gap-2">
          <label for="bookTitleId">Mã sách</label>
          <input
            type="text"
            id="bookTitleId"
            name="bookTitleId"
            className="border border-slate-400 rounded-md p-2"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label for="quantity">Số lượng (Dương: nhập, âm: xuất)</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            className="border border-slate-400 rounded-md p-2"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label for="description">Mô tả</label>
          <input
            type="text"
            id="description"
            name="description"
            className="border border-slate-400 rounded-md p-2"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          Tạo
        </button>
        <div id="result"></div>
      </form>
    </div>,
    {
      title: "Tạo phiếu nhập/xuất sách",
    }
  );
});

app.post("/", async (c) => {
  return c.render(<p>Book Transactions</p>, {
    title: "Danh sách phiếu nhập/xuất sách",
  });
});

const bookTransactionsRoutes = app;
export default bookTransactionsRoutes;
