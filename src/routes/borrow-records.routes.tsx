import borrowRecordService from "@/modules/borrow-record-service";
import dayjs from "dayjs";
import { Hono } from "hono";
import { getDotPath, ValiError } from "valibot";

const app = new Hono();

app.post("/", async (c) => {
  const formData = await c.req.parseBody();
  const bookTitleId = Number(formData.bookTitleId);
  const quantity = Number(formData.quantity) || 1;
  const userId = Number(formData.userId);
  const dueDate = formData.dueDate;
  try {
    await borrowRecordService.createBorrowRecord({
      bookTitleId,
      quantity,
      userId,
      dueDate,
    });
    c.header("HX-Push-Url", "/borrow-records");
    c.header("HX-Redirect", "/borrow-records");
    c.status(204);
    return c.html("<p>Mượn sách thành công</p>");
  } catch (error) {
    if (error instanceof ValiError) {
      const issues = error.issues.map(
        (issue) => `${getDotPath(issue)}: ${issue.message}`
      );

      return c.html(
        <div className="text-red-500">
          <p>Mượn sách thất bại. Lý do:</p>
          <ul className="list-disc list-inside">
            {issues.map((issue) => (
              <li className="text-red-500 list-item">{issue}</li>
            ))}
          </ul>
        </div>
      );
    }
    return c.html(
      "<p>Mượn sách thất bại. " + (error as Error).message + "</p>"
    );
  }
});

app.get("/create", async (c) => {
  return c.render(
    <div>
      <form hx-post="/borrow-records" hx-target="#error-message">
        <div className="mb-3">
          <label htmlFor="bookTitleId" className="form-label">
            Mã sách
          </label>
          <input type="text" name="bookTitleId" className="form-control" />
          <div id="bookTitleId-help" className="form-text">
            Vui lòng quét mã sách
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">
            Số lượng
          </label>
          <input
            type="number"
            name="quantity"
            className="form-control"
            disabled
            value="1"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="userId" className="form-label">
            Mã học sinh
          </label>
          <input type="text" name="userId" className="form-control" />
          <div id="userId-help" className="form-text">
            VD: 1234567890
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="dueDate" className="form-label">
            Thời hạn mượn
          </label>
          <input
            type="date"
            name="dueDate"
            className="form-control"
            value={dayjs().add(2, "week").format("YYYY-MM-DD")}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Mượn
        </button>
        <div id="error-message" class="text-red-500"></div>
      </form>
    </div>,
    {
      title: "Mượn sách",
    }
  );
});

app.post("/:borrowRecordId/return", async (c) => {
  const borrowRecordId = Number(c.req.param("borrowRecordId"));
  try {
    await borrowRecordService.returnBorrowRecord(borrowRecordId);
    c.header("HX-Refresh", "true");
    return c.html("<p>Trả sách thành công</p>");
  } catch (error) {
    return c.html("<p>Trả sách thất bại. " + (error as Error).message + "</p>");
  }
});

app.get("/confirm-return", async (c) => {
  const borrowRecordId = c.req.query("borrowRecordId");
  const bookTitleName = c.req.query("bookTitleName");
  const userName = c.req.query("userName");
  return c.html(
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Xác nhận trả sách cho phiếu mượn số {borrowRecordId}
          </h5>
        </div>
        <div class="modal-body">
          <p>
            Bạn có chắc chắn đã nhận được sách <strong>{bookTitleName}</strong>{" "}
            từ <strong>{userName}</strong> không?
          </p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Hủy
          </button>
          <button
            type="button"
            class="btn btn-primary"
            hx-post={`/borrow-records/${borrowRecordId}/return`}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
});

app.get("/", async (c) => {
  const borrowRecords = await borrowRecordService.getBorrowRecords();
  return c.render(
    <div className="overflow-x-auto">
      <table className="table table-striped table-bordered text-xs">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ngày mượn</th>
            <th>Thời hạn</th>
            <th>Ngày trả</th>
            <th>Tên sách</th>
            <th>Số lượng</th>
            <th>Người mượn</th>
            <th>Số điện thoại</th>
            <th>Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          {borrowRecords.map((borrowRecord) => (
            <tr>
              <td>{borrowRecord.id}</td>
              <td>{dayjs(borrowRecord.createdAt).format("DD/MM/YYYY")}</td>
              <td>{dayjs(borrowRecord.dueDate).format("DD/MM/YYYY")}</td>
              <td>
                {borrowRecord.returnedAt
                  ? dayjs(borrowRecord.returnedAt).format("DD/MM/YYYY")
                  : "-"}
              </td>
              <td>
                {borrowRecord.bookTitleName} [{borrowRecord.bookTitleId}]
              </td>
              <td>{borrowRecord.quantity}</td>
              <td>{borrowRecord.userName}</td>
              <td>{borrowRecord.userCellphone}</td>
              <td>
                <div class="flex gap-2">
                  {!borrowRecord.returnedAt && (
                    <a
                      hx-get={`/borrow-records/confirm-return?borrowRecordId=${borrowRecord.id}&bookTitleName=${borrowRecord.bookTitleName}&userName=${borrowRecord.userName}`}
                      class="text-blue-500 hover:text-blue-700 text-sm cursor-pointer"
                      hx-target="#modals-here"
                      data-bs-toggle="modal"
                      data-bs-target="#modals-here"
                    >
                      Trả sách
                    </a>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>,
    {
      title: "Lịch sử mượn/trả sách",
    }
  );
});

const borrowRecordsRoutes = app;
export default borrowRecordsRoutes;
