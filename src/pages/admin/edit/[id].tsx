import { useRouter } from "next/router";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";

type Pasture = {
  _id?: string;
  area: string;
  image: string;
  dogParkName: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  size: string;
  benchCount: number;
  hasShade: boolean;
  hasTrashbin: boolean;
  hasWaterFountain: boolean;
  waterFountainDetail: string;
  hasWaterPool: boolean;
  hasParkourObstacles: boolean;
  hasEveningLight: boolean;
  isFenced: boolean;
  fenceDetail: string;
  groundTypes: string[];
  rating: number;
  extraInfo: string;
};

export default function EditPasture() {
  const router = useRouter();
  const { id } = router.query;

  const [pasture, setPasture] = useState<Pasture>({
    area: "",
    image: "",
    dogParkName: "",
    address: "",
    location: { latitude: 0, longitude: 0 },
    size: "",
    benchCount: 0,
    hasShade: false,
    hasTrashbin: false,
    hasWaterFountain: false,
    waterFountainDetail: "",
    hasWaterPool: false,
    hasParkourObstacles: false,
    hasEveningLight: false,
    isFenced: false,
    fenceDetail: "",
    groundTypes: [],
    rating: 0,
    extraInfo: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  async function handleDelete() {
    if (!id || id === "new") return;

    if (!deleteConfirm) {
      setDeleteConfirm(true);
      setDeleteError(null);
      setDeleteSuccess(null);
      return;
    }

    setDeleting(true);
    setDeleteError(null);
    setDeleteSuccess(null);

    try {
      const res = await fetch(`/api/pastures/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete pasture");
      }

      setDeleteSuccess("Pasture deleted successfully!");
      setTimeout(() => {
        router.push("/admin");
      }, 1500); // Redirect after a short delay to show success message
    } catch (err: any) {
      setDeleteError(err.message || "Unknown error");
    } finally {
      setDeleting(false);
      setDeleteConfirm(false);
    }
  }

  function handleCancel() {
    setDeleteConfirm(false);
    setDeleteError(null);
    setDeleteSuccess(null);
  }

  useEffect(() => {
    if (!id) return;

    if (id === "new") {
      setLoading(false);
    } else {
      fetch(`/api/pastures/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch pasture");
          return res.json();
        })
        .then((data) => {
          setPasture(data);
          setLoading(false);
        })
        .catch((err) => {
          setSaveError(err.message); // Using saveError for initial fetch error
          setLoading(false);
        });
    }
  }, [id]);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setUploadError(null);
      setUploadSuccess(null);
    }
  }

  async function handleUpload() {
    if (!selectedFile) {
      setUploadError("Please select a file first.");
      return;
    }
    if (!id || id === "new") {
      setUploadError("Save the pasture first before uploading an image.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "x-pasture-id": id as string,
          "x-file-name": selectedFile.name,
        },
        body: selectedFile,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const data = await res.json();
      setPasture((prev) => ({
        ...prev,
        image: data.imagePath,
      }));
      setSelectedFile(null);
      setUploadSuccess("Image uploaded successfully!");
    } catch (err: any) {
      setUploadError(err.message || "Unknown error during upload");
    } finally {
      setUploading(false);
    }
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    if (type === "checkbox") {
      setPasture((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === "latitude" || name === "longitude") {
      setPasture((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: Number(value),
        },
      }));
    } else if (name === "benchCount" || name === "rating") {
      setPasture((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else if (name === "groundTypes") {
      setPasture((prev) => ({
        ...prev,
        groundTypes: value.split(",").map((s) => s.trim()),
      }));
    } else {
      setPasture((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const method = id === "new" ? "POST" : "PUT";
      const url = id === "new" ? "/api/pastures" : `/api/pastures/${id}`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pasture),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save pasture");
      }

      setSaveSuccess("Saved successfully!");
      setTimeout(() => {
        router.push("/admin");
      }, 1500); // Redirect after a short delay to show success message
    } catch (err: any) {
      setSaveError(err.message || "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading pasture data...</p>;
  if (saveError) return <p style={{ color: "red" }}>Error: {saveError}</p>; // Display initial fetch error prominently

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: 700,
        margin: "auto",
        fontFamily: "Arial, sans-serif",
        color: "#333",
        backgroundColor: "#fff",
        boxShadow: "0 4px 12px rgb(0 0 0 / 0.05)",
        borderRadius: 12,
      }}
    >
      <h1
        style={{ marginBottom: "2rem", fontWeight: "700", fontSize: "1.8rem" }}
      >
        {id === "new" ? "Add New Pasture" : `Edit Pasture ${id}`}
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
      >
        {/* Text Inputs */}
        {[
          { label: "Area", name: "area", type: "text", required: true },
          { label: "Image URL", name: "image", type: "text" },
          { label: "Dog Park Name", name: "dogParkName", type: "text" },
          { label: "Address", name: "address", type: "text" },
          { label: "Size", name: "size", type: "text" },
        ].map(({ label, name, type, required }) => (
          <label
            key={name}
            style={{
              display: "flex",
              flexDirection: "column",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            {label}:
            <input
              name={name}
              type={type}
              value={(pasture as any)[name]}
              onChange={handleChange}
              required={required}
              style={{
                marginTop: 6,
                padding: "0.55rem 0.75rem",
                borderRadius: 8,
                border: "1.5px solid #ccc",
                fontSize: "1rem",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#0070f3")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#ccc")}
            />
          </label>
        ))}

        {/* Image previews */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            marginTop: 12,
            alignItems: "center",
            justifyContent: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {/* Current Image */}
          <div style={{ textAlign: "center", minWidth: 160 }}>
            <p
              style={{
                fontWeight: "600",
                marginBottom: 6,
                fontSize: "0.9rem",
                color: "#444",
              }}
            >
              Current Image
            </p>
            {pasture.image ? (
              <img
                src={pasture.image}
                alt="Current Pasture"
                style={{
                  width: 150,
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 10,
                  border: "1.5px solid #ddd",
                  boxShadow: "0 2px 6px rgb(0 0 0 / 0.08)",
                }}
              />
            ) : (
              <p
                style={{
                  fontStyle: "italic",
                  color: "#999",
                  fontSize: "0.85rem",
                  marginTop: 40,
                }}
              >
                No image uploaded yet
              </p>
            )}
          </div>

          {/* New Image Preview */}
          <div style={{ textAlign: "center", minWidth: 160 }}>
            <p
              style={{
                fontWeight: "600",
                marginBottom: 6,
                fontSize: "0.9rem",
                color: "#444",
              }}
            >
              New Image Preview
            </p>
            {selectedFile ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="New Upload Preview"
                style={{
                  width: 150,
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 10,
                  border: "2px solid #0070f3",
                  boxShadow: "0 2px 8px rgb(0 112 243 / 0.3)",
                }}
              />
            ) : (
              <p
                style={{
                  fontStyle: "italic",
                  color: "#999",
                  fontSize: "0.85rem",
                  marginTop: 40,
                }}
              >
                No new image selected
              </p>
            )}
          </div>
        </div>

        {/* Upload controls */}
        <div
          style={{
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            Upload Image:
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={id === "new"}
              style={{
                marginTop: 6,
                cursor: id === "new" ? "not-allowed" : "pointer",
              }}
            />
          </label>

          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || uploading || id === "new"}
            style={{
              padding: "0.55rem 1.25rem",
              fontWeight: "700",
              color: "white",
              backgroundColor: uploading ? "#999" : "#0070f3",
              border: "none",
              borderRadius: 8,
              cursor:
                !selectedFile || uploading || id === "new"
                  ? "default"
                  : "pointer",
              transition: "background-color 0.3s ease",
              fontSize: "1rem",
              minWidth: 140,
              userSelect: "none",
            }}
            onMouseEnter={(e) => {
              if (!uploading && selectedFile && id !== "new")
                e.currentTarget.style.backgroundColor = "#005bb5";
            }}
            onMouseLeave={(e) => {
              if (!uploading && selectedFile && id !== "new")
                e.currentTarget.style.backgroundColor = "#0070f3";
            }}
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
          {uploadSuccess && (
            <p
              style={{
                color: "green",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              {uploadSuccess}
            </p>
          )}
        </div>

        {uploadError && (
          <p
            style={{
              color: "red",
              marginTop: 6,
              fontSize: "0.9rem",
              fontWeight: "600",
            }}
          >
            {uploadError}
          </p>
        )}

        {/* Number Inputs Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
            gap: "1.25rem",
            marginTop: "1rem",
          }}
        >
          {[
            {
              label: "Latitude",
              name: "latitude",
              min: undefined,
              step: "any",
              required: true,
            },
            {
              label: "Longitude",
              name: "longitude",
              min: undefined,
              step: "any",
              required: true,
            },
            {
              label: "Bench Count",
              name: "benchCount",
              min: 0,
              step: 1,
              required: false,
            },
            {
              label: "Rating",
              name: "rating",
              min: 0,
              max: 5,
              step: 0.1,
              required: false,
            },
          ].map(({ label, name, min, max, step, required }) => (
            <label
              key={name}
              style={{
                display: "flex",
                flexDirection: "column",
                fontWeight: 600,
                fontSize: "0.95rem",
              }}
            >
              {label}:
              <input
                name={name}
                type="number"
                value={
                  name === "latitude" || name === "longitude"
                    ? pasture.location[name as "latitude" | "longitude"]
                    : (pasture as any)[name]
                }
                min={min}
                max={max}
                step={step}
                required={required}
                onChange={handleChange}
                style={{
                  marginTop: 6,
                  padding: "0.55rem 0.75rem",
                  borderRadius: 8,
                  border: "1.5px solid #ccc",
                  fontSize: "1rem",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#0070f3")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#ccc")}
              />
            </label>
          ))}
        </div>

        {/* Features Fieldset */}
        <fieldset
          style={{
            border: "1.5px solid #ddd",
            padding: "1.25rem 1.5rem",
            borderRadius: 10,
            marginTop: "1.5rem",
            fontSize: "0.95rem",
            color: "#444",
          }}
        >
          <legend style={{ fontWeight: "700", marginBottom: "0.75rem" }}>
            Features
          </legend>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              { label: "Shade", name: "hasShade" },
              { label: "Trashbin", name: "hasTrashbin" },
              { label: "Water Fountain", name: "hasWaterFountain" },
              { label: "Water Pool", name: "hasWaterPool" },
              { label: "Parkour Obstacles", name: "hasParkourObstacles" },
              { label: "Evening Light", name: "hasEveningLight" },
              { label: "Fenced", name: "isFenced" },
            ].map(({ label, name }) => (
              <label
                key={name}
                style={{ userSelect: "none", cursor: "pointer" }}
                title={label}
              >
                <input
                  name={name}
                  type="checkbox"
                  checked={(pasture as any)[name]}
                  onChange={handleChange}
                  style={{ marginRight: 8, transform: "scale(1.25)" }}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Conditional Inputs */}
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            fontWeight: 600,
            fontSize: "0.95rem",
            marginTop: "1rem",
          }}
        >
          Water Fountain Detail:
          <input
            name="waterFountainDetail"
            value={pasture.waterFountainDetail}
            onChange={handleChange}
            disabled={!pasture.hasWaterFountain}
            placeholder={
              pasture.hasWaterFountain ? "" : "Enable Water Fountain to edit"
            }
            style={{
              marginTop: 6,
              padding: "0.55rem 0.75rem",
              borderRadius: 8,
              border: "1.5px solid #ccc",
              fontSize: "1rem",
              backgroundColor: pasture.hasWaterFountain ? "white" : "#f9f9f9",
              transition: "background-color 0.3s ease",
            }}
          />
        </label>

        <label
          style={{
            display: "flex",
            flexDirection: "column",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          Fence Detail:
          <input
            name="fenceDetail"
            value={pasture.fenceDetail}
            onChange={handleChange}
            disabled={!pasture.isFenced}
            placeholder={pasture.isFenced ? "" : "Enable Fenced to edit"}
            style={{
              marginTop: 6,
              padding: "0.55rem 0.75rem",
              borderRadius: 8,
              border: "1.5px solid #ccc",
              fontSize: "1rem",
              backgroundColor: pasture.isFenced ? "white" : "#f9f9f9",
              transition: "background-color 0.3s ease",
            }}
          />
        </label>

        {/* Ground Types */}
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            fontWeight: 600,
            fontSize: "0.95rem",
            marginTop: "1rem",
          }}
        >
          Ground Types (comma separated):
          <input
            name="groundTypes"
            value={pasture.groundTypes.join(", ")}
            onChange={handleChange}
            style={{
              marginTop: 6,
              padding: "0.55rem 0.75rem",
              borderRadius: 8,
              border: "1.5px solid #ccc",
              fontSize: "1rem",
            }}
          />
        </label>

        {/* Extra Info */}
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          Extra Info:
          <textarea
            name="extraInfo"
            value={pasture.extraInfo}
            onChange={handleChange}
            rows={4}
            style={{
              marginTop: 6,
              padding: "0.55rem 0.75rem",
              borderRadius: 8,
              border: "1.5px solid #ccc",
              fontSize: "1rem",
              resize: "vertical",
              minHeight: 110,
              fontFamily: "inherit",
            }}
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          style={{
            marginTop: "2rem",
            padding: "0.85rem",
            fontSize: "1.15rem",
            fontWeight: "700",
            color: "white",
            backgroundColor: saving ? "#999" : "#0070f3",
            border: "none",
            borderRadius: 10,
            cursor: saving ? "default" : "pointer",
            transition: "background-color 0.3s ease",
            userSelect: "none",
          }}
          onMouseEnter={(e) => {
            if (!saving) e.currentTarget.style.backgroundColor = "#005bb5";
          }}
          onMouseLeave={(e) => {
            if (!saving) e.currentTarget.style.backgroundColor = "#0070f3";
          }}
        >
          {saving ? "Saving..." : "Save Pasture"}
        </button>
        {saveSuccess && (
          <p
            style={{
              color: "green",
              marginTop: 6,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {saveSuccess}
          </p>
        )}
        {saveError && (
          <p
            style={{
              color: "red",
              marginTop: 6,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {saveError}
          </p>
        )}

        {id !== "new" && (
          <>
            {deleteConfirm && !deleting && (
              <p
                style={{ color: "#b71c1c", marginBottom: 8, fontWeight: "600" }}
              >
                Warning: This action is irreversible!
              </p>
            )}

            {!deleteConfirm ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  marginTop: "1rem",
                  padding: "0.85rem",
                  fontSize: "1.15rem",
                  fontWeight: "700",
                  color: "white",
                  backgroundColor: "#d32f2f",
                  border: "none",
                  borderRadius: 10,
                  cursor: deleting ? "default" : "pointer",
                  userSelect: "none",
                }}
              >
                {deleting ? "Deleting..." : "Delete Pasture"}
              </button>
            ) : (
              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={deleting}
                  style={{
                    padding: "0.85rem",
                    fontSize: "1.15rem",
                    fontWeight: "700",
                    color: "#333",
                    backgroundColor: "#eee",
                    border: "1px solid #ccc",
                    borderRadius: 10,
                    cursor: deleting ? "default" : "pointer",
                    userSelect: "none",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{
                    padding: "0.85rem",
                    fontSize: "1.15rem",
                    fontWeight: "700",
                    color: "white",
                    backgroundColor: deleting ? "#999" : "#b71c1c",
                    border: "none",
                    borderRadius: 10,
                    cursor: deleting ? "default" : "pointer",
                    userSelect: "none",
                  }}
                >
                  {deleting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            )}
            {deleteSuccess && (
              <p
                style={{
                  color: "green",
                  marginTop: 6,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                {deleteSuccess}
              </p>
            )}
            {deleteError && (
              <p style={{ color: "red", marginTop: 6, fontWeight: "600" }}>
                {deleteError}
              </p>
            )}
          </>
        )}
      </form>
    </div>
  );
}