import { useState, useEffect } from "react";

import imageCompression from "browser-image-compression";
import path from "path";
type Pasture = {
  id: string;
  area: string;
  image: string;
  dogParkName: string | null;
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
  waterFountainDetail: string | null;
  hasWaterPool: boolean;
  hasParkourObstacles: boolean;
  hasEveningLight: boolean;
  isFenced: boolean;
  fenceDetail: string;
  groundTypes: string[];
  reviews: any[];
  rating: number;
  extraInfo: string;
};

export default function Admin() {
  const [data, setData] = useState<Pasture[]>([]);
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null);

  const sanitizeData = (raw: any[]): Pasture[] =>
    raw.map((p) => ({
      ...p,
      location: p.location ?? { latitude: 0, longitude: 0 },
      dogParkName: p.dogParkName ?? null,
      waterFountainDetail: p.waterFountainDetail ?? null,
      groundTypes: Array.isArray(p.groundTypes) ? p.groundTypes : [],
      reviews: Array.isArray(p.reviews) ? p.reviews : [],
    }));

  useEffect(() => {
    if (isAuthed) {
      fetch("/api/pastures")
        .then((res) => res.json())
        .then((raw) => setData(sanitizeData(raw)));
    }
  }, [isAuthed]);

  const handleChange = (i: number, field: keyof Pasture, value: any) => {
    const updated = [...data];
    // @ts-ignore
    updated[i][field] = value;
    setData(updated);
  };

  const handleNestedChange = (
    i: number,
    field: keyof Pasture["location"],
    value: number
  ) => {
    const updated = [...data];
    updated[i].location[field] = value;
    setData(updated);
  };

  // Special handler for groundTypes (array of strings)
  const handleGroundTypesChange = (i: number, value: string) => {
    const updated = [...data];
    updated[i].groundTypes = value.split(",").map((g) => g.trim());
    setData(updated);
  };

  const generateId = () => "_" + Math.random().toString(36).substr(2, 9);

  const handleSave = async () => {
    const dataWithIds = data.map((p) => ({
      ...p,
      id: p.id && p.id.trim() !== "" ? p.id : generateId(),
    }));

    const res = await fetch("/api/pastures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataWithIds),
    });

    if (res.ok) {
      setData(dataWithIds); // update state with new IDs
      alert("Changes saved!");
    } else {
      alert("Failed to save changes.");
    }
  };

  const handleAddNew = () => {
    setData([
      ...data,
      {
        id: generateId(),
        area: "",
        image: "",
        dogParkName: null,
        address: "",
        location: { latitude: 0, longitude: 0 },
        size: "",
        benchCount: 0,
        hasShade: false,
        hasTrashbin: false,
        hasWaterFountain: false,
        waterFountainDetail: null,
        hasWaterPool: false,
        hasParkourObstacles: false,
        hasEveningLight: false,
        isFenced: false,
        fenceDetail: "",
        groundTypes: [],
        reviews: [],
        rating: 0,
        extraInfo: "",
      },
    ]);
  };

  if (!isAuthed) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Admin Login</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
        <button onClick={() => setIsAuthed(password === "admin123")}>
          Login
        </button>
      </div>
    );
  }

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const id = data[index].id || index.toString();
    const fileName = "image" + path.extname(file.name); // e.g. image.jpg

    try {
      const arrayBuffer = await file.arrayBuffer();
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          "x-pasture-id": id,
          "x-file-name": fileName,
        },
        body: arrayBuffer,
      });

      if (!res.ok) throw new Error("Upload failed.");
      const { imagePath } = await res.json();
      handleChange(index, "image", imagePath);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Pastures Admin Panel</h1>
      <button onClick={handleAddNew}>+ Add New Pasture</button>
      <button onClick={handleSave} style={{ marginLeft: "1rem" }}>
        💾 Save Changes
      </button>

      {data.map((p, i) => (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          {data.map((p, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                overflow: "hidden",
                textAlign: "center",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ height: 140, overflow: "hidden" }}>
                <img
                  src={p.image || "/placeholder.jpg"}
                  alt={p.dogParkName || "No name"}
                  style={{ width: "100%", objectFit: "cover", height: "100%" }}
                />
              </div>
              <div style={{ padding: "1rem" }}>
                <h3 style={{ margin: "0 0 0.5rem" }}>
                  {p.dogParkName || `Pasture #${i + 1}`}
                </h3>
                <button
                  onClick={() =>
                    window.open(
                      `/admin/pasture/${p.id || i}?edit=true`,
                      "_blank"
                    )
                  }
                  style={{
                    margin: "0.5rem",
                    padding: "6px 12px",
                    backgroundColor: "#3498db",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => setConfirmingDelete(i)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#f1c40f",
                    color: "#000",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  ❌ Delete
                </button>
              </div>

              {confirmingDelete === i && (
                <div style={{ padding: "1rem", backgroundColor: "#ffe" }}>
                  <p>Confirm delete?</p>
                  <button
                    onClick={() => {
                      fetch(`/api/pastures/${i}`, { method: "DELETE" }).then(
                        () => {
                          setData(data.filter((_, idx) => idx !== i));
                          setConfirmingDelete(null);
                        }
                      );
                    }}
                    style={{
                      backgroundColor: "#e74c3c",
                      color: "white",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: 4,
                      marginRight: 8,
                      cursor: "pointer",
                    }}
                  >
                    ✅ Confirm
                  </button>
                  <button
                    onClick={() => setConfirmingDelete(null)}
                    style={{
                      backgroundColor: "#bdc3c7",
                      color: "black",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
