import React, { useState, useEffect } from 'react';
import './WifiStatus.css';

export function WifiStatus({ onOfflineUpdate }) {
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const fetchWifiStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://backend-mapdevice.onrender.com/api/ping-all-devices", {
        headers: { 'Cache-Control': 'no-cache' },
      });

      const data = await response.json();

      if (data.success) {
        setDevices(data.data);
        setLastUpdated(data.timestamp);
        const offline = data.data.filter(d => d.status === 'offline');
        onOfflineUpdate(offline); // truyền về Navbar
      } else {
        throw new Error(data.error || 'Lỗi không xác định từ server');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWifiStatus();
    const interval = setInterval(fetchWifiStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return null; // không hiển thị gì, chỉ truyền dữ liệu cho Navbar
}
