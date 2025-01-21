import { authService } from "@/modules/auth-service";
import { bookService } from "@/modules/book-serice";
import { Hono } from "hono";

const bookTitlesRoutes = new Hono();

bookTitlesRoutes.delete("/:id", async (c) => {
  const user = await authService.getUser(c);
  const isAdmin =
    user?.roles.includes("admin") || user?.roles.includes("librarian");

  if (!isAdmin) {
    return c.redirect("/book-titles");
  }

  const bookTitle = await bookService.getBookTitleById(
    Number(c.req.param("id"))
  );

  if (!bookTitle) {
    return c.html(<p class="text-red-500">Đầu sách không tồn tại.</p>);
  }

  try {
    await bookService.deleteBookTitle(Number(c.req.param("id")));
    return c.html(
      <p class="text-green-500">Đầu sách đã được xóa thành công.</p>
    );
  } catch (error) {
    return c.html(
      <p class="text-red-500">
        Đầu sách không được xóa. Lỗi:{" "}
        {error instanceof Error ? error.message : "Không xác định"}
      </p>
    );
  }
});

bookTitlesRoutes.put("/:id", async (c) => {
  const user = await authService.getUser(c);
  const isAdmin =
    user?.roles.includes("admin") || user?.roles.includes("librarian");

  if (!isAdmin) {
    return c.redirect("/book-titles");
  }

  const bookTitle = await bookService.getBookTitleById(
    Number(c.req.param("id"))
  );

  if (!bookTitle) {
    c.status(404);
    return c.render(
      <div>
        <p>Đầu sách không tồn tại.</p>
      </div>,
      { title: "Đầu sách không tồn tại" }
    );
  }

  const formData = await c.req.parseBody();
  try {
    await bookService.updateBookTitle(bookTitle.id, formData);
    return c.html(
      <p class="text-green-500">Đầu sách đã được sửa thành công.</p>
    );
  } catch (error) {
    return c.html(
      <p class="text-red-500">
        Đầu sách không được sửa. Lỗi:{" "}
        {error instanceof Error ? error.message : "Không xác định"}
      </p>
    );
  }
});

bookTitlesRoutes.get("/:id/edit", async (c) => {
  const user = await authService.getUser(c);
  const isAdmin =
    user?.roles.includes("admin") || user?.roles.includes("librarian");

  if (!isAdmin) {
    return c.redirect("/book-titles");
  }

  const bookTitle = await bookService.getBookTitleById(
    Number(c.req.param("id"))
  );

  if (!bookTitle) {
    c.status(404);
    return c.render(
      <div>
        <p>Đầu sách không tồn tại.</p>
      </div>,
      {
        title: "Đầu sách không tồn tại",
      }
    );
  }

  return c.render(
    <div class="flex flex-col gap-4">
      <form
        hx-put={`/book-titles/${bookTitle?.id}`}
        hx-target="#book-title-edit-result"
        hx-swap="innerHTML"
        class="flex flex-col gap-2"
      >
        <div class="flex flex-col gap-2">
          <label for="name">Tên sách</label>
          <input
            type="text"
            name="name"
            value={bookTitle?.name}
            class="border border-slate-400 rounded-md p-2"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="author">Tác giả</label>
          <input
            type="text"
            name="author"
            value={bookTitle?.author}
            class="border border-slate-400 rounded-md p-2"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="publisher">Nhà xuất bản</label>
          <input
            type="text"
            name="publisher"
            value={bookTitle?.publisher}
            class="border border-slate-400 rounded-md p-2"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="year">Năm xuất bản</label>
          <input
            type="number"
            name="year"
            value={bookTitle?.year}
            class="border border-slate-400 rounded-md p-2"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="genre">Thể loại</label>
          <input
            type="text"
            name="genre"
            value={bookTitle?.genre}
            class="border border-slate-400 rounded-md p-2"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="slot">Vị trí</label>
          <input
            type="text"
            name="slot"
            value={bookTitle?.slot}
            class="border border-slate-400 rounded-md p-2"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="imageLink">Link bìa sách</label>
          <input
            type="text"
            name="imageLink"
            value={bookTitle?.imageLink}
            class="border border-slate-400 rounded-md p-2"
          />
        </div>
        <button type="submit" class="bg-blue-500 text-white rounded-md p-2">
          Sửa
        </button>
        <button
          type="button"
          class="bg-red-500 text-white rounded-md p-2"
          hx-delete={`/book-titles/${bookTitle?.id}`}
          hx-target="#book-title-edit-result"
          hx-swap="innerHTML"
        >
          Xóa
        </button>
        <div class="flex flex-col gap-2" id="book-title-edit-result"></div>
      </form>
    </div>,
    {
      title: "Sửa đầu sách",
    }
  );
});

bookTitlesRoutes.post("/", async (c) => {
  const user = await authService.getUser(c);
  const isAdmin =
    user?.roles.includes("admin") || user?.roles.includes("librarian");
  if (!isAdmin) {
    return c.redirect("/book-titles");
  }
  const formData = await c.req.parseBody();
  try {
    await bookService.createBookTitle({
      ...formData,
      userId: user?.id,
    });
    return c.html(
      <p class="text-green-500">Đầu sách đã được tạo thành công.</p>
    );
  } catch (error) {
    return c.html(
      <p class="text-red-500">
        Đầu sách không được tạo. Lỗi:{" "}
        {error instanceof Error ? error.message : "Không xác định"}
      </p>
    );
  }
});

bookTitlesRoutes.get("/create", async (c) => {
  const user = await authService.getUser(c);
  const isAdmin =
    user?.roles.includes("admin") || user?.roles.includes("librarian");
  if (!isAdmin) {
    return c.redirect("/book-titles");
  }
  return c.render(
    <div class="flex flex-col gap-4">
      <form
        hx-post="/book-titles"
        hx-target="#book-title-create-result"
        hx-swap="innerHTML"
        class="flex flex-col gap-2"
      >
        <div class="flex flex-col gap-2">
          <label for="name">Tên sách</label>
          <input
            type="text"
            name="name"
            class="border border-slate-400 rounded-md p-2"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="author">Tác giả</label>
          <input
            type="text"
            name="author"
            class="border border-slate-400 rounded-md p-2"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="publisher">Nhà xuất bản</label>
          <input
            type="text"
            name="publisher"
            class="border border-slate-400 rounded-md p-2"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="year">Năm xuất bản</label>
          <input
            type="number"
            name="year"
            class="border border-slate-400 rounded-md p-2"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="genre">Thể loại</label>
          <input
            type="text"
            name="genre"
            class="border border-slate-400 rounded-md p-2"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="slot">Vị trí</label>
          <input
            type="text"
            name="slot"
            class="border border-slate-400 rounded-md p-2"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="imageLink">Link bìa sách</label>
          <input
            type="text"
            name="imageLink"
            class="border border-slate-400 rounded-md p-2"
          />
        </div>
        <button type="submit" class="bg-blue-500 text-white rounded-md p-2">
          Tạo
        </button>
        <div class="flex flex-col gap-2" id="book-title-create-result"></div>
      </form>
    </div>,
    {
      title: "Tạo đầu sách",
    }
  );
});

bookTitlesRoutes.get("/", async (c) => {
  const q = c.req.query("q");
  const page = c.req.query("page");

  const pageSize = 10;

  const currentPage = parseInt(page || "1");

  const bookTitles = await bookService.getBookTitles(q, currentPage, pageSize);
  const bookTitlesCount = await bookService.getBookTitlesCount(q);
  const pageCount = Math.ceil(bookTitlesCount / pageSize);

  const searchParams = new URLSearchParams();
  searchParams.set("q", q || "");
  searchParams.set("page", page || "1");
  c.header("HX-Replace-Url", "/book-titles?" + searchParams.toString());

  const user = await authService.getUser(c);
  const isAdmin =
    user?.roles.includes("admin") || user?.roles.includes("librarian");

  return c.render(
    <div class="flex flex-col gap-4">
      {/* Search box */}
      <form class="flex items-center gap-2" action="/book-titles" method="get">
        <input
          type="search"
          name="q"
          hx-get="/book-titles"
          placeholder="Tìm kiếm đầu sách..."
          hx-select="#book-titles"
          hx-trigger="keyup changed delay:1s, search"
          hx-target="#book-titles"
          hx-swap="outerHTML"
          class="border border-slate-400 rounded-md p-2"
          value={q}
        />
        <button type="submit" class="bg-blue-500 text-white rounded-md p-2">
          Tìm
        </button>
      </form>

      <div class="flex justify-start">
        <div class="flex justify-end gap-2 items-center">
          <a
            href={`/book-titles?page=${currentPage - 1}`}
            class={`${
              currentPage === 1 ? "hidden" : ""
            } border border-slate-400 rounded-md p-2`}
            hx-boost="true"
          >
            Trang trước
          </a>
          <span class="p-2">
            {currentPage} / {pageCount}
          </span>
          <a
            href={`/book-titles?page=${currentPage + 1}`}
            class={`${
              currentPage === pageCount ? "hidden" : ""
            } border border-slate-400 rounded-md p-2`}
            hx-boost="true"
          >
            Trang sau
          </a>
        </div>
      </div>

      <table
        id="book-titles"
        class="table-auto border-collapse border border-slate-400 text-xs"
      >
        <thead class="bg-gray-200">
          <tr>
            <th class="text-left p-2 border border-slate-400">ID</th>
            <th class="text-left p-2 border border-slate-400">Tên sách</th>
            <th class="text-left p-2 border border-slate-400">Tác giả</th>
            <th class="text-left p-2 border border-slate-400">Nhà xuất bản</th>
            {/* <th class="text-left p-2 border border-slate-400">Năm xuất bản</th> */}
            <th class="text-left p-2 border border-slate-400">Thể loại</th>
            <th class="text-left p-2 border border-slate-400">Bìa sách</th>
            <th class="text-left p-2 border border-slate-400">Số lượng</th>
            <th class="text-left p-2 border border-slate-400">Vị trí</th>
            {isAdmin && (
              <th class="text-left p-2 border border-slate-400">Tác vụ</th>
            )}
          </tr>
        </thead>
        <tbody>
          {bookTitles.map((bookTitle) => (
            <tr>
              <td class="text-left p-2 border border-slate-400">
                {bookTitle.id}
              </td>
              <td class="text-left p-2 border border-slate-400">
                {bookTitle.name}
              </td>
              <td class="text-left p-2 border border-slate-400">
                {bookTitle.author}
              </td>
              <td class="text-left p-2 border border-slate-400">
                {bookTitle.publisher}
              </td>
              {/* <td class="text-left p-2 border border-slate-400">
                {bookTitle.year}
              </td> */}
              <td class="text-left p-2 border border-slate-400">
                {bookTitle.genre}
              </td>
              <td class="text-left p-2 border border-slate-400">
                <div class="aspect-[3/4] max-w-20 overflow-hidden rounded-md">
                  <img
                    src={bookTitle.imageLink}
                    alt={bookTitle.name}
                    class="object-cover w-full h-full"
                  />
                </div>
              </td>
              <td
                class={`text-left p-2 border border-slate-400 ${
                  bookTitle.quantity === 0 ? "text-red-500" : "text-green-500"
                }`}
              >
                {bookTitle.quantity}
              </td>
              <td class="text-left p-2 border border-slate-400">
                {bookTitle.slot}
              </td>
              {isAdmin && (
                <td class="text-left p-2 border border-slate-400">
                  <a href={`/book-titles/${bookTitle.id}/edit`} hx-boost="true">
                    Sửa
                  </a>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>,
    {
      title: "Liệt kê đầu sách",
    }
  );
});

export default bookTitlesRoutes;
