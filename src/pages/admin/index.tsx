import { DogLoader } from "@/components/DogLoader";
import React, { useEffect, useState } from "react";

type Pasture = {
  _id: string;
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

export default function AdminPanel() {
  const [pastures, setPastures] = useState<Pasture[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET;

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    setLoggedIn(isLoggedIn);

    if (isLoggedIn) {
      fetchPastures();
    }
  }, []);

  const fetchPastures = () => {
    setLoading(true);
    fetch("/api/pastures")
      .then((res) => res.json())
      .then((data) => {
        setPastures(data);
        setLoading(false);
      });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_SECRET) {
      setLoggedIn(true);
      localStorage.setItem("adminLoggedIn", "true");
      setLoginError("");
      fetchPastures();
    } else {
      setLoginError("Incorrect password.");
    }
  };

  const openEditor = (id: string) => {
    window.open(`/admin/edit/${id}`, "_blank");
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/pastures/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPastures((prev) => prev.filter((p) => p._id !== id));
        setDeleteConfirmId(null);
      } else {
        const json = await res.json();
        alert(`Delete failed: ${json.error || "Unknown error"}`);
      }
    } catch (error) {
      alert("Delete failed: " + error);
    }
  };

  if (!loggedIn) {
    return (
      <div style={{ maxWidth: 400, margin: "auto", padding: "2rem" }}>
        <h2>Admin Login</h2>
        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            type="password"
            placeholder="Enter admin password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            style={{
              padding: "0.5rem",
              fontSize: "1rem",
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
            autoFocus
          />
          <button
            type="submit"
            style={{
              padding: "0.5rem 1rem",
              fontWeight: "700",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Login
          </button>
          {loginError && <p style={{ color: "red" }}>{loginError}</p>}
        </form>
      </div>
    );
  }

  if (loading) return <DogLoader />;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Pastures Admin Panel</h1>
      <button
        onClick={() => window.open("/admin/edit/new", "_blank")}
        style={{ marginBottom: "1rem" }}
      >
        + Add New Pasture
      </button>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {pastures.map((p) => {
          const isHovered = hoveredId === p._id;
          const isConfirming = deleteConfirmId === p._id;

          // Sizes
          const baseHeight = 180;
          const hoverHeight = 220; // bigger to show delete button nicely
          const confirmHeight = 280; // bigger for confirmation box

          return (
            <div
              key={p._id}
              onClick={() => openEditor(p._id)}
              onMouseEnter={() => setHoveredId(p._id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                cursor: "pointer",
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 12,
                width: 180,
                minHeight: isConfirming
                  ? confirmHeight
                  : isHovered
                  ? hoverHeight
                  : baseHeight,
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease-in-out",
                position: "relative",
                overflow: "visible",
                transform:
                  isConfirming || isHovered ? "scale(1.05)" : "scale(1)",
              }}
            >
              {/* Image and text */}
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.dogParkName || "Pasture image"}
                  style={{
                    width: "100%",
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 6,
                  }}
                  loading="lazy"
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: 100,
                    backgroundColor: "#eee",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#888",
                    fontSize: 14,
                  }}
                >
                  No image
                </div>
              )}

              <h3
                style={{
                  margin: "0.5rem 0 0.25rem 0",
                  fontSize: "1rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {p.dogParkName || "Unnamed Park"}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: "#555",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {p.address || "No address"}
              </p>

              {/* Delete button or confirmation */}
              {(isHovered || isConfirming) && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    marginTop: 12,
                    width: "100%",
                    userSelect: "none",
                  }}
                >
                  {isConfirming ? (
                    <div
                      style={{
                        backgroundColor: "#ffe6e6",
                        border: "1px solid #e63946",
                        borderRadius: 6,
                        padding: 10,
                        color: "#e63946",
                        fontSize: 14,
                        textAlign: "center",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    >
                      <p style={{ margin: "0 0 12px 0", fontWeight: "600" }}>
                        Delete this pasture?
                      </p>
                      <button
                        onClick={() => handleDelete(p._id)}
                        style={{
                          backgroundColor: "#e63946",
                          color: "white",
                          border: "none",
                          borderRadius: 6,
                          padding: "10px 0",
                          cursor: "pointer",
                          fontWeight: "700",
                          fontSize: 16,
                          width: "100%",
                          marginBottom: 8,
                        }}
                      >
                        Yes, delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        style={{
                          backgroundColor: "#ccc",
                          color: "#333",
                          border: "none",
                          borderRadius: 6,
                          padding: "10px 0",
                          cursor: "pointer",
                          fontWeight: "700",
                          fontSize: 16,
                          width: "100%",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(p._id)}
                      style={{
                        backgroundColor: "#e63946",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        padding: "10px 0",
                        cursor: "pointer",
                        fontWeight: "700",
                        fontSize: 16,
                        width: "100%",
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <DogLoader />
    </div>
  );
}
