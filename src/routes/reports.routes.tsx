import { reportService } from "@/modules/report-service";
import { Hono } from "hono";

const app = new Hono();

app.post("/", async (c) => {
  const formData = await c.req.parseBody();
  const from = formData.from as string;
  const to = formData.to as string;
  const type = formData.type as string;

  console.log(from, to, type);

  const report = await reportService.getReport(type, from, to);
  if (!report) {
    return c.html(
      <div>
        <h1>Không tìm thấy báo cáo</h1>
      </div>
    );
  }

  return c.html(
    <table class="table table-bordered table-condensed mt-5">
      <thead>
        <tr>
          {report?.columns.map((column) => (
            <th>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {report?.data.length === 0 && (
          <tr>
            <td colSpan={report?.columns.length} className="text-center">
              Không tìm thấy dữ liệu
            </td>
          </tr>
        )}
        {report?.data.map((row) => (
          <tr>
            <td>{row.label}</td>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

app.get("/", async (c) => {
  return c.render(
    <div>
      <form hx-post="/reports" hx-target="#report">
        <div className="mb-3">
          <label htmlFor="from" className="form-label">
            Từ ngày
          </label>
          <input type="date" name="from" className="form-control" />
          <div id="from-help" className="form-text">
            Ngày bắt đầu tính báo cáo
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="to" className="form-label">
            Đến ngày
          </label>
          <input type="date" name="to" className="form-control" />
          <div id="to-help" className="form-text">
            Ngày kết thúc tính báo cáo
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="type" className="form-label">
            Loại báo cáo
          </label>
          <select name="type" className="form-select">
            <option value="borrow-quantity-by-day">
              Số lượng sách được mượn theo ngày
            </option>
            <option value="new-student-by-day">
              Số lượng học sinh mới theo ngày
            </option>
            <option value="top-borrow-by-title">
              Top số lượng sách được mượn theo đầu sách
            </option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Xem báo cáo
        </button>
      </form>

      <div id="report"></div>
    </div>,
    {
      title: "Báo cáo",
    }
  );
});

const reportRoutes = app;
export default reportRoutes;
