import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { X } from "lucide-react";

export function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBetaOpen, setIsBetaOpen] = useState(false);
  const [isGammaOpen, setIsGammaOpen] = useState(false);
  const [isCongVuOpen, setIsCongVuOpen] = useState(false);
  const [isNha5Open, setIsNha5Open] = useState(false);
  const [isNha6Open, setIsNha6Open] = useState(false);
  const [isNha7Open, setIsNha7Open] = useState(false);
  const [isKTXOpen, setIsKTXOpen] = useState(false);
  const [isVovinamOpen, setIsVovinamOpen] = useState(false);

  // Search functionality states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedWifi, setSelectedWifi] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch WiFi locations from backend
  const fetchWifiLocations = async (searchQuery) => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://backend-mapdevice.onrender.com/api/wifi-locations?search=${encodeURIComponent(searchQuery)}`);
      
      const text = await response.text();
      try {
        const data = JSON.parse(text); // Thử parse thủ công
        if (!response.ok) {
          throw new Error(data.error || "Network response was not ok");
        }
        return data;
      } catch (e) {
        throw new Error(`Invalid JSON response: ${text}`);
      }
    } catch (error) {
      console.error("Error fetching WiFi locations:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setNoResultsFound(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      const results = await fetchWifiLocations(searchTerm);
      setSearchResults(results.slice(0, 5)); // Limit to 5 results
      setNoResultsFound(results.length === 0);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Handle WiFi selection and navigation
  const handleWifiSelect = (wifi) => {
    setSelectedWifi(wifi);
    setSearchTerm(wifi.name);
    setSearchResults([]);
    setNoResultsFound(false);
    setIsSidebarOpen(false);
    
    // Navigate to the location
    navigate(wifi.path, { 
      state: { 
        highlightedWifi: {
          name: wifi.name,
          top: wifi.topPosition,
          left: wifi.leftPosition
        },
        scrollToWifi: true 
      } 

    });
  };

  // Clear search input
  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setSelectedWifi(null);
    setNoResultsFound(false);

            // Navigate to current location without highlight state
            navigate(location.pathname, { 
              state: { 
                  highlightedWifi: null,
                  scrollToWifi: false 
              } 
          });
  };

  return (
    <>
      <button className="menu-button" onClick={() => setIsSidebarOpen(true)}>
        ☰
      </button>

      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>
          ✖
        </button>

        {/* Search Component */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Tìm kiếm tên WiFi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search-button"
                onClick={handleClearSearch}
                aria-label="Xóa tìm kiếm"
                onMouseDown={(e) => e.preventDefault()}
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {(isSearchFocused && searchTerm) && ( // Chỉ hiển thị khi có focus VÀ có nội dung tìm kiếm
  <div className="search-results-container">
    {isLoading ? (
      <div className="loading-message">Đang tải...</div>
    ) : searchResults.length > 0 ? (
      <div className="search-results">
        {searchResults.map((wifi, index) => (
          <div
            key={index}
            className="search-result-item"
            onClick={() => handleWifiSelect(wifi)}
          >
            {wifi.name}
          </div>
        ))}
      </div>
    ) : noResultsFound ? (
      <div className="no-results-message">
        Không tìm thấy WiFi "{searchTerm}"
      </div>
    ) : null}
  </div>
)}
        </div>

        {/* Beta */}
        <button 
          className={`toggle-button ${selectedWifi?.path.includes("beta") ? "highlighted" : ""}`}
          onClick={() => setIsBetaOpen(!isBetaOpen)}
        >
          Vị trí AP nhà Beta {isBetaOpen ? "▲" : "▼"}
        </button>
        {isBetaOpen && (
          <nav className="sidebar-menu">
            <SidebarButton 
              to="/tang1beta" 
              text="Tầng 1 Beta" 
              isHighlighted={selectedWifi?.path === "/tang1beta"}
            />
            <SidebarButton 
              to="/tang2beta" 
              text="Tầng 2 Beta" 
              isHighlighted={selectedWifi?.path === "/tang2beta"}
            />
            <SidebarButton 
              to="/tang3beta" 
              text="Tầng 3 Beta" 
              isHighlighted={selectedWifi?.path === "/tang3beta"}
            />
            <SidebarButton 
              to="/tang4beta" 
              text="Tầng 4 Beta" 
              isHighlighted={selectedWifi?.path === "/tang4beta"}
            />
            <SidebarButton 
              to="/tang5beta" 
              text="Tầng 5 Beta" 
              isHighlighted={selectedWifi?.path === "/tang5beta"}
            />
          </nav>
        )}

        {/* Gamma */}
        <button 
          className={`toggle-button ${selectedWifi?.path.includes("gamma") ? "highlighted" : ""}`}
          onClick={() => setIsGammaOpen(!isGammaOpen)}
        >
          Vị trí AP nhà Gamma {isGammaOpen ? "▲" : "▼"}
        </button>
        {isGammaOpen && (
          <nav className="sidebar-menu">
            <SidebarButton 
              to="/tang1gamma" 
              text="Tầng 1 Gamma" 
              isHighlighted={selectedWifi?.path === "/tang1gamma"}
            />
            <SidebarButton 
              to="/tang2gamma" 
              text="Tầng 2 Gamma" 
              isHighlighted={selectedWifi?.path === "/tang2gamma"}
            />
            <SidebarButton 
              to="/tang3gamma" 
              text="Tầng 3 Gamma" 
              isHighlighted={selectedWifi?.path === "/tang3gamma"}
            />
            <SidebarButton 
              to="/tang4gamma" 
              text="Tầng 4 Gamma" 
              isHighlighted={selectedWifi?.path === "/tang4gamma"}
            />
            <SidebarButton 
              to="/tang5gamma" 
              text="Tầng 5 Gamma" 
              isHighlighted={selectedWifi?.path === "/tang5gamma"}
            />
          </nav>
        )}

        {/* Nhà công vụ */}
        <button 
          className={`toggle-button ${selectedWifi?.path.includes("ncv") ? "highlighted" : ""}`}
          onClick={() => setIsCongVuOpen(!isCongVuOpen)}
        >
          Vị trí AP nhà Công Vụ {isCongVuOpen ? "▲" : "▼"}
        </button>
        {isCongVuOpen && (
          <div className="sidebar-menu nha-cong-vu">
            {/* Nhà 5 */}
            <button 
              className={`nha-cong-vu-title ${selectedWifi?.path.includes("so5") ? "highlighted" : ""}`}
              onClick={() => setIsNha5Open(!isNha5Open)}
            >
              Nhà công vụ số 5 {isNha5Open ? "▲" : "▼"}
            </button>
            {isNha5Open && (
              <div className="floor-buttons-container">
                <SidebarButton 
                  to="/tang1ncvso5" 
                  text="Tầng 1" 
                  className="floor-button"
                  isHighlighted={selectedWifi?.path === "/tang1ncvso5"}
                />
                <SidebarButton 
                  to="/tang2ncvso5" 
                  text="Tầng 2" 
                  className="floor-button"
                  isHighlighted={selectedWifi?.path === "/tang2ncvso5"}
                />
              </div>
            )}

            {/* Nhà 6 */}
            <button 
              className={`nha-cong-vu-title ${selectedWifi?.path.includes("so6") ? "highlighted" : ""}`}
              onClick={() => setIsNha6Open(!isNha6Open)}
            >
              Nhà công vụ số 6 {isNha6Open ? "▲" : "▼"}
            </button>
            {isNha6Open && (
              <div className="floor-buttons-container">
                <SidebarButton 
                  to="/tang1ncvso6" 
                  text="Tầng 1" 
                  className="floor-button"
                  isHighlighted={selectedWifi?.path === "/tang1ncvso6"}
                />
                <SidebarButton 
                  to="/tang2ncvso6" 
                  text="Tầng 2" 
                  className="floor-button"
                  isHighlighted={selectedWifi?.path === "/tang2ncvso6"}
                />
              </div>
            )}

            {/* Nhà 7 */}
            <button 
              className={`nha-cong-vu-title ${selectedWifi?.path.includes("so7") ? "highlighted" : ""}`}
              onClick={() => setIsNha7Open(!isNha7Open)}
            >
              Nhà công vụ số 7 {isNha7Open ? "▲" : "▼"}
            </button>
            {isNha7Open && (
              <div className="floor-buttons-container">
                <SidebarButton 
                  to="/tang1ncvso7" 
                  text="Tầng 1" 
                  className="floor-button"
                  isHighlighted={selectedWifi?.path === "/tang1ncvso7"}
                />
                <SidebarButton 
                  to="/tang2ncvso7" 
                  text="Tầng 2" 
                  className="floor-button"
                  isHighlighted={selectedWifi?.path === "/tang2ncvso7"}
                />
              </div>
            )}
          </div>
        )}

        {/* KTX */}
        <button 
          className={`toggle-button ${selectedWifi?.path.includes("ktx") ? "highlighted" : ""}`}
          onClick={() => setIsKTXOpen(!isKTXOpen)}
        >
          Vị trí AP Kí Túc Xá {isKTXOpen ? "▲" : "▼"}
        </button>
        {isKTXOpen && (
          <nav className="sidebar-menu">
            <SidebarButton 
              to="/ktxdomB" 
              text="KTX Dom B" 
              isHighlighted={selectedWifi?.path === "/ktxdomB"}
            />
            <SidebarButton 
              to="/ktxdomA" 
              text="KTX Dom A" 
              isHighlighted={selectedWifi?.path === "/ktxdomA"}
            />
          </nav>
        )}

        {/* Vovinam */}
        <button 
          className={`toggle-button ${selectedWifi?.path.includes("vovinam") ? "highlighted" : ""}`}
          onClick={() => setIsVovinamOpen(!isVovinamOpen)}
        >
          Vị trí AP sân Vovinam {isVovinamOpen ? "▲" : "▼"}
        </button>
        {isVovinamOpen && (
          <nav className="sidebar-menu">
            <SidebarButton 
              to="/vovinam" 
              text="Sân Vovinam" 
              isHighlighted={selectedWifi?.path === "/vovinam"}
            />
          </nav>
        )}

        {/* Thống kê */}
        <Link to="/thongke" className="stat-button">
          Thống kê số lượng wifi
        </Link>
      </div>
    </>
  );
}

function SidebarButton({ to, text, isHighlighted = false, className = "", ...props }) {
  return (
    <Link 
      to={to} 
      className={`sidebar-button ${className} ${isHighlighted ? "highlighted" : ""}`}
      {...props}
    >
      {text}
    </Link>
  );
}