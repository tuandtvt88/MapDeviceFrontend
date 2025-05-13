import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export function Navbar() {
  const [showNotification, setShowNotification] = useState(false);
  const [offlineDevices, setOfflineDevices] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const navigate = useNavigate();

  // Hàm fetch dữ liệu offline devices
  const fetchOfflineDevices = async () => {
    try {
      const response = await fetch('https://backend-mapdevice.onrender.com/api/ping-all-devices', {
        cache: 'no-store'
      });
      const data = await response.json();

      if (data.success) {
        const offline = data.data.filter(device => device.status === 'offline');
        setOfflineDevices(offline);
        setLastUpdated(new Date());
        return offline;
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu thiết bị:", error);
    }
    return [];
  };

  // Hàm xử lý khi click vào thiết bị offline
  const handleDeviceClick = async (deviceName) => {
    try {
      // Tìm kiếm vị trí của thiết bị
      const response = await fetch(`https://backend-mapdevice.onrender.com/api/wifi-locations?search=${encodeURIComponent(deviceName)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const deviceInfo = data[0];
        navigate(deviceInfo.path, { 
          state: { 
            highlightedWifi: {
              name: deviceInfo.name,
              top: deviceInfo.topPosition,
              left: deviceInfo.leftPosition
            },
            scrollToWifi: true 
          } 
        });
        setShowNotification(false); // Đóng popup thông báo
      } else {
        console.warn("Không tìm thấy thông tin vị trí cho thiết bị:", deviceName);
        alert(`Không tìm thấy vị trí của thiết bị ${deviceName}`);
      }
    } catch (error) {
      console.error("Lỗi khi tìm vị trí thiết bị:", error);
      alert("Đã xảy ra lỗi khi tìm vị trí thiết bị");
    }
  };

  // Hàm refresh thủ công
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchOfflineDevices();
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Thiết lập interval để tự động cập nhật mỗi phút
  useEffect(() => {
    fetchOfflineDevices();
    const intervalId = setInterval(fetchOfflineDevices, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="navbar">
        <div className="navbar-left"></div>

        <div className="navbar-title-center">
          <h1 className="title">🔧 SƠ ĐỒ LẮP ĐẶT THIẾT BỊ 🔧</h1>
        </div>

        <div className="navbar-right">
          <div className="refresh-container">
            <button
              className={`refresh-button ${isRefreshing ? 'refreshing' : ''}`}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
            {lastUpdated && (
              <div className="last-updated">
                Auto-updated at: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>

          <div className="notification-bell-container">
            <div className="notification-bell" onClick={() => setShowNotification(!showNotification)}>
              🔔
              {offlineDevices.length > 0 && (
                <div className="notification-count">{offlineDevices.length}</div>
              )}
            </div>
            {showNotification && (
              <div className="notification-popup">
                <div className="notification-header">
                  <h3>Thiết bị đang offline</h3>
                  <button
                    className="close-notification"
                    onClick={() => setShowNotification(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="notification-list">
                  {offlineDevices.length > 0 ? (
                    offlineDevices.map((device, index) => (
                      <div 
                        key={index} 
                        className="notification-item clickable"
                        onClick={() => handleDeviceClick(device.name)}
                      >
                        <div className="notification-message">
                          🛑 {device.name} ({device.ip})
                        </div>
                        </div>
                    ))
                  ) : (
                    <div className="no-notification">Không có thiết bị offline</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="marquee-container">
        <div className="marquee">
          <p>🔥 Chào mừng bạn đến với hệ thống quản lý sơ đồ lắp đặt thiết bị! 🚀🚀🚀</p>
        </div>
      </div>
    </>
  );
}