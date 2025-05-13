// WifiStatusService.js
import { useState, useEffect } from 'react';

// Mock function to check WiFi status (in a real app, this would be an API call)
const checkWifiStatus = async (ip) => {
  // Simulate real checking with random status for demo purposes
  return Math.random() > 0.3; // 70% chance of being online
};

export const useWifiStatus = () => {
  const [wifiStatus, setWifiStatus] = useState({});
  const [offlineDevices, setOfflineDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // WiFi device IP mapping
  const wifiDevices = {
    "AP - KTX Dom A": "10.10.0.81",
    "AP - KTX Dom B-ACP": "10.10.0.79",
    "AP - VOVINAM": "10.10.0.87",
    "AP-BT- Tang-5-515-U6": "10.10.0.83",
    "AP-BT-CTSV-U6": "10.10.0.102",
    "AP-BT-FU-U6P": "10.10.0.184",
    "AP-BT-IT-ACP": "10.10.0.76",
    "AP-BT-Phong AI": "10.10.0.71",
    "AP-BT-Phong hop-ACP": "10.10.0.52",
    "AP-BT-Sales-U6P": "10.10.0.139",
    "AP-BT-SanTruong-01-U6": "10.10.0.117",
    "AP-BT-SanTruong-02-U6P": "10.10.0.91",
    "AP-BT-SanTruong-03-ACP": "10.10.0.82",
    "AP-BT-Server-ACP": "10.10.0.86",
    "AP-BT-Thu vien-01-ACP": "10.10.0.54",
    "AP-BT-Thu vien-03-ACP": "10.10.0.95",
    "AP-BT-Thuvien-02-ACP": "10.10.0.134",
    // Add all other devices from your list here
  };

  const checkAllDevices = async () => {
    setIsLoading(true);
    const statusUpdates = {};
    const offline = [];

    for (const [name, ip] of Object.entries(wifiDevices)) {
      try {
        const isOnline = await checkWifiStatus(ip);
        statusUpdates[name] = isOnline;
        if (!isOnline) {
          offline.push(name);
        }
      } catch (error) {
        console.error(`Error checking status for ${name}:`, error);
        statusUpdates[name] = false;
        offline.push(name);
      }
    }

    setWifiStatus(statusUpdates);
    setOfflineDevices(offline);
    setIsLoading(false);
  };

  useEffect(() => {
    checkAllDevices();
    
    // Set up polling every 30 seconds
    const interval = setInterval(checkAllDevices, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { wifiStatus, offlineDevices, isLoading };
};