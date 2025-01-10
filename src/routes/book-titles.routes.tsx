import { bookService } from "@/modules/book-serice";
import { Hono } from "hono";

const bookTitlesRoutes = new Hono();

bookTitlesRoutes.get("/", async (c) => {
  const bookTitles = await bookService.getBookTitles();
  return c.render(
    <div>
      <table class="table-auto border-collapse border border-slate-400 text-xs">
        <thead class="bg-gray-200">
          <tr>
            <th class="text-left p-2 border border-slate-400">ID</th>
            <th class="text-left p-2 border border-slate-400">Tên sách</th>
            <th class="text-left p-2 border border-slate-400">Tác giả</th>
            <th class="text-left p-2 border border-slate-400">Nhà xuất bản</th>
            <th class="text-left p-2 border border-slate-400">Năm xuất bản</th>
            <th class="text-left p-2 border border-slate-400">Thể loại</th>
            <th class="text-left p-2 border border-slate-400">Bìa sách</th>
            <th class="text-left p-2 border border-slate-400">Số lượng</th>
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
              <td class="text-left p-2 border border-slate-400">
                {bookTitle.year}
              </td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>,
    {
      title: "Tra cứu đầu sách",
    }
  );
});

export default bookTitlesRoutes;
