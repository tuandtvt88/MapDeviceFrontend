import { useState, useEffect } from "react";

const useFetchWifi = () => {
  const [wifiLocations, setWifiLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/tang1beta")
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi tải dữ liệu!");
        return res.json();
      })
      .then((data) => {
        setWifiLocations(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { wifiLocations, loading, error };
};

export default useFetchWifi;
