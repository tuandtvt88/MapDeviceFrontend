import React, { useState, useEffect } from "react";
import "./ThongKeWiFi.css";

export function ThongKeWiFi() {
  const [wifiData, setWifiData] = useState({
    beta: {},
    gamma: {},
    ncv: { 5: {}, 6: {}, 7: {} },
    ktxDomA: {},
    ktxDomB: {},
    vovinam: {}
  });

  useEffect(() => {
    const fetchData = async () => {
      const floors = [1, 2, 3, 4, 5];
      let betaData = {};
      let gammaData = {};
      const ncvHouses = [5, 6, 7];
      const ncvFloors = [1, 2];
      let ncvData = { 5: {}, 6: {}, 7: {} };
      let ktxDomAData = {};
      let ktxDomBData = {};
      let vovinamData = {};

      // Fetch data cho Beta và Gamma
      for (const floor of floors) {
        try {
          const betaResponse = await fetch(`https://backend-mapdevice.onrender.com/api/tang${floor}beta`);
          betaData[`Tầng ${floor} Beta`] = await betaResponse.json();
        } catch (error) {
          console.error(`❌ Lỗi lấy dữ liệu WiFi tầng ${floor} Beta:`, error);
        }

        try {
          const gammaResponse = await fetch(`https://backend-mapdevice.onrender.com/api/tang${floor}gamma`);
          gammaData[`Tầng ${floor} Gamma`] = await gammaResponse.json();
        } catch (error) {
          console.error(`❌ Lỗi lấy dữ liệu WiFi tầng ${floor} Gamma:`, error);
        }
      }

      // Fetch data cho Nhà công vụ
      for (const house of ncvHouses) {
        for (const floor of ncvFloors) {
          try {
            const response = await fetch(`https://backend-mapdevice.onrender.com/api/tang${floor}ncvso${house}`);
            if (!response.ok) throw new Error("HTTP error " + response.status);
            ncvData[house][`Tầng ${floor}`] = await response.json();
          } catch (error) {
            console.error(`❌ Lỗi lấy dữ liệu Nhà CV ${house} tầng ${floor}:`, error);
            ncvData[house][`Tầng ${floor}`] = [];
          }
        }
      }

      // Fetch data cho KTX
      try {
        const ktxAResponse = await fetch("https://backend-mapdevice.onrender.com/api/ktxdoma");
        ktxDomAData["Ký túc xá"] = await ktxAResponse.json();
      } catch (error) {
        console.error("❌ Lỗi lấy dữ liệu KTX Dom A:", error);
      }

      try {
        const ktxBResponse = await fetch("https://backend-mapdevice.onrender.com/api/ktxdomb");
        ktxDomBData["Ký túc xá"] = await ktxBResponse.json();
      } catch (error) {
        console.error("❌ Lỗi lấy dữ liệu KTX Dom B:", error);
      }

      // Fetch data cho Sân Vovinam
      try {
        const vovinamResponse = await fetch("https://backend-mapdevice.onrender.com/api/vovinam");
        vovinamData["Sân Vovinam"] = await vovinamResponse.json();
      } catch (error) {
        console.error("❌ Lỗi lấy dữ liệu Sân Vovinam:", error);
      }

      setWifiData({
        beta: betaData,
        gamma: gammaData,
        ncv: ncvData,
        ktxDomA: ktxDomAData,
        ktxDomB: ktxDomBData,
        vovinam: vovinamData
      });
    };

    fetchData();
  }, []);

  const calculateGrandTotal = () => {
    const calculateBuildingTotal = (data) => {
      const { U6Pro, U6LR, ACPro, ACLite } = calculateTotal(data);
      return U6Pro + U6LR + ACPro + ACLite;
    };

    let total = 0;

    // Tính tổng cho Beta và Gamma
    total += calculateBuildingTotal(wifiData.beta);
    total += calculateBuildingTotal(wifiData.gamma);

    // Tính tổng cho các nhà công vụ
    [5, 6, 7].forEach(house => {
      total += calculateBuildingTotal(wifiData.ncv[house]);
    });

    // Tính tổng cho KTX
    total += calculateBuildingTotal(wifiData.ktxDomA);
    total += calculateBuildingTotal(wifiData.ktxDomB);

    // Tính tổng cho Sân Vovinam
    total += calculateBuildingTotal(wifiData.vovinam);

    return total;
  };

  const classifyAP = (wifiList) => {
    const result = { 
      U6Pro: 0, 
      U6LR: 0, 
      ACPro: 0,
      ACLite: 0
    };

    if (!Array.isArray(wifiList)) return result;

    wifiList.forEach((wifi) => {
      const name = wifi.name?.toUpperCase();
      switch(true) {
        case name.includes('U6P'):
        case name.includes('U6-PRO'):
          result.U6Pro += 1;
          break;
        case name.includes('U6'):
          result.U6LR += 1;
          break;
        case name.includes('ACP'):
        case name.includes('AC-PRO'):
          result.ACPro += 1;
          break;
        case name.includes('LITE'):
          result.ACLite += 1;
          break;
      }
    });

    return result;
  };

  const calculateTotal = (data) => {
    return Object.values(data).reduce((acc, curr) => {
      const classified = classifyAP(curr);
      acc.U6Pro += classified.U6Pro || 0;
      acc.U6LR += classified.U6LR || 0;
      acc.ACPro += classified.ACPro || 0;
      acc.ACLite += classified.ACLite || 0;
      return acc;
    }, { U6Pro: 0, U6LR: 0, ACPro: 0, ACLite: 0 });
  };

  const renderMainTable = (data, title) => {
    const total = calculateTotal(data);
    
    return (
      <div className="table-wrapper">
        <h3 className="building-title">{title}</h3>
        <table className="wifi-table">
          <thead>
            <tr>
              <th>Tầng</th>
              <th>U6 Pro</th>
              <th>U6 LR</th>
              <th>AC-Pro</th>
              <th>AC-Lite</th>
              <th>Tổng</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([tang, apList]) => {
              const { U6Pro, U6LR, ACPro, ACLite } = classifyAP(apList);
              return (
                <tr key={tang}>
                  <td>{tang}</td>
                  <td>{U6Pro}</td>
                  <td>{U6LR}</td>
                  <td>{ACPro}</td>
                  <td>{ACLite}</td>
                  <td>{U6Pro + U6LR + ACPro + ACLite}</td>
                </tr>
              );
            })}
            <tr className="total-row">
              <td><strong>Tổng</strong></td>
              <td><strong>{total.U6Pro}</strong></td>
              <td><strong>{total.U6LR}</strong></td>
              <td><strong>{total.ACPro}</strong></td>
              <td><strong>{total.ACLite}</strong></td>
              <td><strong>{total.U6Pro + total.U6LR + total.ACPro + total.ACLite}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderNCVTable = (house) => {
    const houseData = wifiData.ncv[house];
    if (!Object.keys(houseData).length) return null;

    let houseTotal = { U6Pro: 0, U6LR: 0, ACPro: 0, ACLite: 0 };
    const floorData = Object.entries(houseData).map(([floorName, apList]) => {
      const classified = classifyAP(apList);
      houseTotal.U6Pro += classified.U6Pro;
      houseTotal.U6LR += classified.U6LR;
      houseTotal.ACPro += classified.ACPro;
      houseTotal.ACLite += classified.ACLite;
      
      return {
        floorName,
        ...classified,
        total: classified.U6Pro + classified.U6LR + classified.ACPro + classified.ACLite
      };
    });

    return (
      <div key={`ncv-${house}`} className="ncv-house">
        <h2 className="ncv-title">NHÀ CÔNG VỤ SỐ {house}</h2>
        <div className="table-wrapper">
          <table className="wifi-table">
            <thead>
              <tr>
                <th>Tầng</th>
                <th>U6 Pro</th>
                <th>U6 LR</th>
                <th>AC-Pro</th>
                <th>AC-Lite</th>
                <th>Tổng</th>
              </tr>
            </thead>
            <tbody>
              {floorData.map(({ floorName, U6Pro, U6LR, ACPro, ACLite, total }) => (
                <tr key={floorName}>
                  <td>{floorName}</td>
                  <td>{U6Pro}</td>
                  <td>{U6LR}</td>
                  <td>{ACPro}</td>
                  <td>{ACLite}</td>
                  <td>{total}</td>
                </tr>
              ))}
              <tr className="total-row">
                <td><strong>Tổng</strong></td>
                <td><strong>{houseTotal.U6Pro}</strong></td>
                <td><strong>{houseTotal.U6LR}</strong></td>
                <td><strong>{houseTotal.ACPro}</strong></td>
                <td><strong>{houseTotal.ACLite}</strong></td>
                <td><strong>{houseTotal.U6Pro + houseTotal.U6LR + houseTotal.ACPro + houseTotal.ACLite}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderKTXTable = (data, title) => {
    const total = calculateTotal(data);
    
    return (
      <div className="table-wrapper">
        <h3 className="building-title">{title}</h3>
        <table className="wifi-table">
          <thead>
            <tr>
              <th>Khu vực</th>
              <th>U6 Pro</th>
              <th>U6 LR</th>
              <th>AC-Pro</th>
              <th>AC-Lite</th>
              <th>Tổng</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([khuVuc, apList]) => {
              const { U6Pro, U6LR, ACPro, ACLite } = classifyAP(apList);
              return (
                <tr key={khuVuc}>
                  <td>{khuVuc}</td>
                  <td>{U6Pro}</td>
                  <td>{U6LR}</td>
                  <td>{ACPro}</td>
                  <td>{ACLite}</td>
                  <td>{U6Pro + U6LR + ACPro + ACLite}</td>
                </tr>
              );
            })}
            <tr className="total-row">
              <td><strong>Tổng</strong></td>
              <td><strong>{total.U6Pro}</strong></td>
              <td><strong>{total.U6LR}</strong></td>
              <td><strong>{total.ACPro}</strong></td>
              <td><strong>{total.ACLite}</strong></td>
              <td><strong>{total.U6Pro + total.U6LR + total.ACPro + total.ACLite}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderVovinamTable = (data, title) => {
    const total = calculateTotal(data);
    
    return (
      <div className="table-wrapper">
        <h3 className="building-title">{title}</h3>
        <table className="wifi-table">
          <thead>
            <tr>
              <th>Khu vực</th>
              <th>U6 Pro</th>
              <th>U6 LR</th>
              <th>AC-Pro</th>
              <th>AC-Lite</th>
              <th>Tổng</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([khuVuc, apList]) => {
              const { U6Pro, U6LR, ACPro, ACLite } = classifyAP(apList);
              return (
                <tr key={khuVuc}>
                  <td>{khuVuc}</td>
                  <td>{U6Pro}</td>
                  <td>{U6LR}</td>
                  <td>{ACPro}</td>
                  <td>{ACLite}</td>
                  <td>{U6Pro + U6LR + ACPro + ACLite}</td>
                </tr>
              );
            })}
            <tr className="total-row">
              <td><strong>Tổng</strong></td>
              <td><strong>{total.U6Pro}</strong></td>
              <td><strong>{total.U6LR}</strong></td>
              <td><strong>{total.ACPro}</strong></td>
              <td><strong>{total.ACLite}</strong></td>
              <td><strong>{total.U6Pro + total.U6LR + total.ACPro + total.ACLite}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="thong-ke">
      <h1 className="main-title">THỐNG KÊ HỆ THỐNG WIFI</h1>
      <div className="total-system">
        <span className="total-label">Tổng số lượng WiFi hiện có:</span>
        <span className="total-value">{calculateGrandTotal()}</span>
      </div>
      <div className="tables-container">
        {renderMainTable(wifiData.beta, "NHÀ BETA")}
        {renderMainTable(wifiData.gamma, "NHÀ GAMMA")}
        {[5, 6, 7].map(renderNCVTable)}
        {renderKTXTable(wifiData.ktxDomA, "KÝ TÚC XÁ DOM A")}
        {renderKTXTable(wifiData.ktxDomB, "KÝ TÚC XÁ DOM B")}
        {renderVovinamTable(wifiData.vovinam, "SÂN VOVINAM")}
      </div>
    </div>
  );
}