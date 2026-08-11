import { IdCard } from "lucide-react";

export default function TeamMembers({
  project,
  editMode,
  isFullEditor,
  form,
  setForm,
}) {
  return (
    <div className="">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <IdCard width={16} /> Site ID :
        {editMode && editMode ? (
          <input
            type="text"
            className="form-input"
            value={form.siteId}
            onChange={(e) =>
              setForm({
                ...form,
                siteId: Number(e.target.value),
              })
            }
          />
        ) : (
          <>{project.siteId} </>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <IdCard width={16} /> Tawal ID :{" "}
        {editMode && isFullEditor ? (
          <input
            type="text"
            className="form-input"
            value={form.tawalId}
            onChange={(e) =>
              setForm({
                ...form,
                tawalId: e.target.value,
              })
            }
          />
        ) : (
          <>{project.tawalId} </>
        )}
      </div>
    </div>
  );
}
