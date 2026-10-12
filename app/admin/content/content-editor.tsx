"use client";
import { useEffect, useState } from "react";
type RecordData = Record<string, string | number | boolean | null>;
const fields: Record<string, string[]> = {
  games: ["name", "subtitle", "description", "image", "sortOrder", "active"],
  promotions: [
    "title",
    "subtitle",
    "description",
    "image",
    "terms",
    "startDate",
    "endDate",
    "featured",
    "active",
    "sortOrder",
  ],
  events: [
    "title",
    "subtitle",
    "description",
    "image",
    "dateTime",
    "active",
    "sortOrder",
  ],
  gallery: ["image", "altText", "category", "caption", "sortOrder", "active"],
  pages: [
    "slug",
    "title",
    "eyebrow",
    "intro",
    "body",
    "heroImage",
    "seoTitle",
    "seoDescription",
    "published",
  ],
};
const bools = ["active", "featured", "published"],
  dates = ["startDate", "endDate", "dateTime"],
  long = ["description", "body", "intro", "terms", "caption", "seoDescription"];
const label = (s: string) =>
  s.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
export function ContentEditor() {
  const [resource, setResource] = useState("games"),
    [items, setItems] = useState<RecordData[]>([]),
    [record, setRecord] = useState<RecordData>({}),
    [status, setStatus] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    let cancelled = false;
    setRecord({});
    setStatus("Loading…");
    fetch(`/api/admin/${resource}`)
      .then(async (r) => {
        if (!r.ok) throw Error();
        const data = await r.json();
        if (!cancelled) {
          setItems(data);
          setStatus("");
        }
      })
      .catch(() => {
        if (!cancelled)
          setStatus(
            "Unable to load content. Please sign in again or check the database.",
          );
      });
    return () => {
      cancelled = true;
    };
  }, [resource]);
  function newRecord() {
    setRecord(
      Object.fromEntries(
        fields[resource].map((key) => [
          key,
          bools.includes(key)
            ? key !== "featured"
            : key === "sortOrder"
              ? 0
              : "",
        ]),
      ),
    );
    setStatus("");
  }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      const data = { ...record };
      for (const key of dates) {
        if (key in data)
          data[key] = data[key]
            ? new Date(
                String(data[key]).length === 16
                  ? `${data[key]}:00Z`
                  : String(data[key]),
              ).toISOString()
            : null;
      }
      const response = await fetch(`/api/admin/${resource}`, {
        method: record.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw Error();
      const saved = await response.json();
      setRecord(saved);
      setItems((prev) => [saved, ...prev.filter((x) => x.id !== saved.id)]);
      setStatus("Saved. Published content is available on the website.");
    } catch {
      setStatus(
        "Could not save. Check required fields, image paths, dates and your session.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function upload(file: File | undefined, key: string) {
    if (!file) return;
    setBusy(true);
    setStatus("Uploading…");
    try {
      const data = new FormData();
      data.append("file", file);
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (!response.ok) throw Error(result.error);
      setRecord((prev) => ({ ...prev, [key]: result.path }));
      setStatus("Uploaded. Save this record to publish the image.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="admin-tabs" aria-label="Content collections">
        {Object.keys(fields).map((key) => (
          <button
            key={key}
            disabled={busy}
            aria-pressed={resource === key}
            onClick={() => {
              setItems([]);
              setResource(key);
            }}
          >
            {key}
          </button>
        ))}
      </div>
      <p role="status">{status}</p>
      <div className="admin-collection">
        <aside className="admin-records">
          <button
            className="button button-dark"
            onClick={newRecord}
            disabled={busy}
          >
            Add new {resource === "gallery" ? "image" : "record"}
          </button>
          {items.map((item) => (
            <button
              disabled={busy}
              aria-pressed={item.id === record.id}
              key={String(item.id)}
              onClick={() => {
                setRecord(item);
                setStatus("");
              }}
            >
              {String(item.name || item.title || item.altText || item.id)}
              {item.active === false || item.published === false
                ? " · Hidden"
                : ""}
            </button>
          ))}
        </aside>
        {Object.keys(record).length > 0 ? (
          <form className="admin-form" onSubmit={save}>
            {fields[resource].map((key) => (
              <div className="editor-field" key={key}>
                <label htmlFor={`field-${key}`}>{label(key)}</label>
                {bools.includes(key) ? (
                  <input
                    id={`field-${key}`}
                    disabled={busy}
                    type="checkbox"
                    checked={Boolean(record[key])}
                    onChange={(e) =>
                      setRecord({ ...record, [key]: e.target.checked })
                    }
                  />
                ) : long.includes(key) ? (
                  <textarea
                    id={`field-${key}`}
                    disabled={busy}
                    value={String(record[key] ?? "")}
                    onChange={(e) =>
                      setRecord({ ...record, [key]: e.target.value })
                    }
                  />
                ) : (
                  <input
                    id={`field-${key}`}
                    disabled={busy}
                    required={[
                      "name",
                      "title",
                      "slug",
                      "image",
                      "altText",
                      "dateTime",
                    ].includes(key)}
                    type={
                      key === "sortOrder"
                        ? "number"
                        : dates.includes(key)
                          ? "datetime-local"
                          : "text"
                    }
                    value={
                      dates.includes(key) && record[key]
                        ? String(record[key]).slice(0, 16)
                        : String(record[key] ?? "")
                    }
                    onChange={(e) =>
                      setRecord({
                        ...record,
                        [key]:
                          key === "sortOrder"
                            ? Number(e.target.value)
                            : e.target.value,
                      })
                    }
                  />
                )}{" "}
                {dates.includes(key) && (
                  <small>Times are entered in UTC (Accra time).</small>
                )}
                {["image", "heroImage"].includes(key) && (
                  <>
                    <span>
                      Upload image (JPG, PNG, WebP or GIF, up to 8 MB)
                    </span>
                    <input
                      aria-label={`Upload ${label(key)}`}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      disabled={busy}
                      onChange={(e) => void upload(e.target.files?.[0], key)}
                    />
                    {record[key] && (
                      <span>Current image: {String(record[key])}</span>
                    )}
                  </>
                )}
              </div>
            ))}
            <button className="button button-red" disabled={busy} type="submit">
              {busy ? "Working…" : "Save record"}
            </button>
            <small>
              Turn off Active or Published to hide a record without deleting it.
            </small>
          </form>
        ) : (
          <p>Select a record to edit, or add a new one.</p>
        )}
      </div>
    </>
  );
}
