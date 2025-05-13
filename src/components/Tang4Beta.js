import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./Tang1Beta.css";
import image from "../assets/T4.jpg";
import { Wifi, Trash2 } from "lucide-react";

export function Tang4Beta() {
    const location = useLocation();
    const mapRef = useRef(null);
    const highlightRef = useRef(null);
    
    const [wifiLocations, setWifiLocations] = useState([]);
    const [selectedFunction, setSelectedFunction] = useState("");
    const [selectedWifiId, setSelectedWifiId] = useState(null);
    const [editingNames, setEditingNames] = useState({});
    const [draggingId, setDraggingId] = useState(null);
    const [pendingAddPosition, setPendingAddPosition] = useState(null);
    const [newWifiName, setNewWifiName] = useState("");
    const [highlightedWifi, setHighlightedWifi] = useState(null);

    useEffect(() => {
        // Fetch wifi locations
        fetch("https://backend-mapdevice.onrender.com/api/tang4beta")
            .then((response) => response.json())
            .then((data) => setWifiLocations(data))
            .catch((error) => console.error("Lỗi lấy dữ liệu WiFi:", error));

        // Check for highlighted wifi from location state
        if (location.state?.highlightedWifi) {
            setHighlightedWifi(location.state.highlightedWifi);
        }
     else {
        // Clear highlight if no highlightedWifi in location state
        setHighlightedWifi(null);
    }
    }, [location.state]);

        // Add this function to manually clear the highlight
        const clearHighlight = () => {
            setHighlightedWifi(null);
        };

    const handleMapClick = (e) => {
        if (selectedFunction === "add") {
            const rect = e.target.getBoundingClientRect();
            const height = e.target.clientHeight;
            const width = e.target.clientWidth;

            const topPx = e.clientY - rect.top;
            const leftPx = e.clientX - rect.left;

            const top = `${(topPx / height * 100).toFixed(2)}%`;
            const left = `${(leftPx / width * 100).toFixed(2)}%`;

            setPendingAddPosition({ top, left });
            setNewWifiName("");
        }
    };

    const handleConfirmAddWifi = () => {
        if (!newWifiName || !pendingAddPosition) return;

        const newWifi = {
            name: newWifiName,
            topPosition: pendingAddPosition.top,
            leftPosition: pendingAddPosition.left
        };

        fetch("https://backend-mapdevice.onrender.com/api/tang4beta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newWifi),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.wifi) {
                    setWifiLocations((prev) => [...prev, data.wifi]);
                    setPendingAddPosition(null);
                    setNewWifiName("");
                }
            })
            .catch((error) => console.error("❌ Lỗi thêm WiFi:", error));
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Bạn có chắc muốn xóa WiFi này?");
        if (confirmDelete) {
            fetch(`https://backend-mapdevice.onrender.com/api/tang4beta/${id}`, {
                method: "DELETE",
            })
                .then(async (res) => {
                    if (!res.ok) {
                        const errorText = await res.text();
                        throw new Error(`Lỗi xóa WiFi: ${errorText}`);
                    }
                    setWifiLocations((prev) => prev.filter((wifi) => wifi.id !== id));
                    console.log("✅ Đã xóa WiFi có ID:", id);
                })
                .catch((error) => {
                    console.error("❌ Lỗi khi xóa WiFi:", error);
                    alert("Xóa thất bại. Vui lòng thử lại.\nChi tiết: " + error.message);
                });
        }
    };

    const handleStartEdit = (wifi) => {
        setSelectedWifiId(wifi.id);
        setEditingNames((prev) => ({ ...prev, [wifi.id]: wifi.name }));
    };

    const handleSaveName = (wifiId) => {
        const newName = editingNames[wifiId];
        if (!newName) return;

        const updatedWifiList = wifiLocations.map(wifi =>
            wifi.id === wifiId ? { ...wifi, name: newName } : wifi
        );
        setWifiLocations(updatedWifiList);

        const updatedWifi = updatedWifiList.find(wifi => wifi.id === wifiId);

        fetch(`https://backend-mapdevice.onrender.com/api/tang4beta/${wifiId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedWifi),
        })
            .then(res => res.json())
            .then(data => {
                console.log("✅ Đã lưu tên mới:", data);
            })
            .catch(err => console.error("❌ Lỗi khi lưu tên mới:", err));

        setSelectedWifiId(null);
        setEditingNames((prev) => {
            const updated = { ...prev };
            delete updated[wifiId];
            return updated;
        });
    };

    const handleSavePosition = (wifiId) => {
        const updatedWifi = wifiLocations.find(wifi => wifi.id === wifiId);
        if (!updatedWifi) return;

        fetch(`https://backend-mapdevice.onrender.com/api/tang4beta/${wifiId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedWifi),
        })
            .then(res => res.json())
            .then(data => {
                console.log("✅ Đã lưu vị trí mới:", data);
            })
            .catch(err => console.error("❌ Lỗi khi lưu vị trí mới:", err));

        setDraggingId(null);
    };

    const handleDragEnd = (e, id) => {
        if (selectedFunction !== "edit") return;

        const mapElement = e.target.closest(".map-container");
        const mapRect = mapElement.getBoundingClientRect();
        const mapHeight = mapElement.clientHeight;
        const mapWidth = mapElement.clientWidth;

        const topPx = e.clientY - mapRect.top;
        const leftPx = e.clientX - mapRect.left;

        const topPercent = (topPx / mapHeight) * 100;
        const leftPercent = (leftPx / mapWidth) * 100;

        const newTop = `${topPercent.toFixed(2)}%`;
        const newLeft = `${leftPercent.toFixed(2)}%`;

        const updatedWifiList = wifiLocations.map(wifi =>
            wifi.id === id ? { ...wifi, topPosition: newTop, leftPosition: newLeft } : wifi
        );
        setWifiLocations(updatedWifiList);
        setDraggingId(id);

        const updated = updatedWifiList.find(wifi => wifi.id === id);

        fetch(`https://backend-mapdevice.onrender.com/api/tang4beta/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated),
        })
            .then(res => res.json())
            .then(data => {
                console.log("✅ Đã lưu vị trí mới:", data);
            })
            .catch(err => console.error("❌ Lỗi khi lưu vị trí mới:", err));
    };

    const handleTouchStart = (e, id) => {
        const touch = e.touches[0];
        // No need for touchPosition state as we're not using it
    };

    const handleTouchMove = (e, id) => {
        e.preventDefault();
    };

    const handleTouchEnd = (e, id) => {
        if (selectedFunction !== "edit") return;

        const touch = e.changedTouches[0];
        const mapRect = e.target.closest(".map-container").getBoundingClientRect();
        const newTop = `${((touch.clientY - mapRect.top) / mapRect.height) * 100}%`;
        const newLeft = `${((touch.clientX - mapRect.left) / mapRect.width) * 100}%`;

        const updatedWifiList = wifiLocations.map(wifi =>
            wifi.id === id ? { ...wifi, topPosition: newTop, leftPosition: newLeft } : wifi
        );
        setWifiLocations(updatedWifiList);
        setDraggingId(id);

        const updated = updatedWifiList.find(wifi => wifi.id === id);

        fetch(`https://backend-mapdevice.onrender.com/api/tang4beta/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated),
        })
            .then(res => res.json())
            .then(data => {
                console.log("✅ Đã lưu vị trí mới (mobile):", data);
            })
            .catch(err => console.error("❌ Lỗi khi lưu vị trí mobile:", err));
    };

    return (
        <div className="tang4beta">
            <div className="map-container" onClick={handleMapClick} ref={mapRef}>
                <img src={image} alt="Tang 1 Beta" className="map-image" />

                <div className="controls-overlay">
                    <label>Chức năng: </label>
                    <select 
                        value={selectedFunction} 
                        onChange={(e) => {
                            setSelectedFunction(e.target.value);
                            setSelectedWifiId(null);
                            setDraggingId(null);
                            setPendingAddPosition(null);
                            setNewWifiName("");
                        }}
                    >
                        <option value="">-- Chọn --</option>
                        <option value="edit">Edit WiFi</option>
                        <option value="delete">Xóa WiFi</option>
                        <option value="add">Thêm WiFi</option>
                    </select>

                    {selectedFunction === "add" && !pendingAddPosition && (
                        <p style={{ color: "green", fontSize: 12, marginTop: 4 }}>
                            👉 Hãy click vào bản đồ để thêm WiFi
                        </p>
                    )}
                </div>

                {wifiLocations.map((wifi) => (
                    <div
                        key={wifi.id}
                        className="wifi-marker"
                        style={{ 
                            top: wifi.topPosition, 
                            left: wifi.leftPosition, 
                            position: "absolute",
                            zIndex: highlightedWifi?.name === wifi.name ? 10 : 1
                        }}
                        draggable={selectedFunction === "edit"}
                        onDragEnd={(e) => handleDragEnd(e, wifi.id)}
                        onTouchStart={(e) => handleTouchStart(e, wifi.id)}
                        onTouchMove={(e) => handleTouchMove(e, wifi.id)}
                        onTouchEnd={(e) => handleTouchEnd(e, wifi.id)}
                        onClick={() => {
                            if (selectedFunction === "edit") handleStartEdit(wifi);
                            else if (selectedFunction === "delete") setSelectedWifiId(wifi.id);
                        }}
                    >
                        <Wifi 
                            className="wifi-icon" 
                            size={28} 
                            color={highlightedWifi?.name === wifi.name ? "red" : "green"} 
                        />

                        {selectedFunction === "edit" && selectedWifiId === wifi.id ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <input
                                    type="text"
                                    value={editingNames[wifi.id] || ""}
                                    onChange={(e) =>
                                        setEditingNames((prev) => ({
                                            ...prev,
                                            [wifi.id]: e.target.value,
                                        }))
                                    }
                                    autoFocus
                                    style={{ fontSize: 10, marginBottom: 4, borderRadius: 4 }}
                                />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSaveName(wifi.id);
                                    }}
                                    style={{ fontSize: 10 }}
                                >
                                    OK
                                </button>
                            </div>
                        ) : (
                            <div 
                                className="wifi-name"
                                style={{
                                    color: highlightedWifi?.name === wifi.name ? "red" : "blue",
                                    fontWeight: "bold"
                                }}
                            >
                                {wifi.name}
                            </div>
                        )}

                        {draggingId === wifi.id && (
                            <button
                                onClick={() => handleSavePosition(wifi.id)}
                                style={{
                                    fontSize: 10,
                                    marginTop: 4,
                                    backgroundColor: "white",
                                    border: "1px solid #ccc",
                                    borderRadius: 4,
                                    cursor: "pointer"
                                }}
                            >
                                Xác nhận vị trí
                            </button>
                        )}

                        {selectedFunction === "delete" && selectedWifiId === wifi.id && (
                            <Trash2
                                className="delete-icon"
                                color="red"
                                size={18}
                                onClick={() => handleDelete(wifi.id)}
                            />
                        )}
                    </div>
                ))}

                {selectedFunction === "add" && pendingAddPosition && (
                    <div
                        className="wifi-marker"
                        style={{
                            position: "absolute",
                            top: pendingAddPosition.top,
                            left: pendingAddPosition.left,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            zIndex: 10,
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Tên WiFi"
                            value={newWifiName}
                            onChange={(e) => setNewWifiName(e.target.value)}
                            autoFocus
                            style={{ fontSize: 10, marginBottom: 4, borderRadius: 4 }}
                        />
                        <button
                            onClick={handleConfirmAddWifi}
                            style={{ fontSize: 10 }}
                        >
                            OK
                        </button>
                    </div>
                )}

                {highlightedWifi && (
                    <div
                        className="wifi-highlight"
                        style={{
                            position: "absolute",
                            top: highlightedWifi.top,
                            left: highlightedWifi.left,
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(255, 0, 0, 0.2)",
                            border: "2px solid red",
                            pointerEvents: "none",
                            zIndex: 5,
                            
                        }}
                    />
                )}
            </div>
        </div>
    );
}