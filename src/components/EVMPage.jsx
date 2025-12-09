import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getWardData, getLevelTheme } from "../data/evmData";

const EVMPage = () => {
  const { panchayatId, wardNo } = useParams();
  const [currentLevel, setCurrentLevel] = useState("Ward");
  const [locationData, setLocationData] = useState(null);
  const [theme, setTheme] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [glowingBulb, setGlowingBulb] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentLocationId, setCurrentLocationId] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Responsive breakpoints
  const isMobile = windowWidth <= 480;
  const isTablet = windowWidth <= 768;
  const isRestrictedPanchayat = String(panchayatId || "1") === "2161";

  // Add blink animation styles
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const pId = panchayatId || "1";
    const wNo = wardNo || "1";
    setCurrentLocationId(`${pId}/${wNo}`);

    setCurrentLevel("Ward");
    updateData("Ward", pId, wNo);
  }, [panchayatId, wardNo]);

  const updateData = (level, pId = panchayatId || "1", wNo = wardNo || "1") => {
    const data = getWardData(pId, wNo);
    if (data && data.ward && data.ward[level]) {
      setLocationData(data.ward[level]);
      setTheme(getLevelTheme(level));
    }
  };

  const handleTabClick = (level) => {
    if (isRestrictedPanchayat && level !== "Ward") {
      return;
    }

    setCurrentLevel(level);
    updateData(level);
    setShowSuccess(false);
    setSelectedCandidate(null);
    setGlowingBulb(null);
  };

  const playBeepSound = () => {
    // Play custom beep sound from external URL or local file
    try {
      const audio = new Audio("/sounds/beep.mp3");
      audio.volume = 0.5; // Adjust volume as needed
      audio.play().catch((error) => {
        console.log("Audio playback failed:", error);
        // Fallback to Web Audio API if file fails
        playFallbackBeep();
      });
    } catch (error) {
      console.log("Audio not supported, using fallback");
      playFallbackBeep();
    }
  };

  const playFallbackBeep = () => {
    // Fallback beep using Web Audio API
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log("No audio support available");
    }
  };

  const handleVote = (candidate) => {
    setSelectedCandidate(candidate);
    setGlowingBulb(candidate.id);

    // Play beep sound
    try {
      playBeepSound();
    } catch (error) {
      console.log("Audio not supported");
    }

    // Show success after a short delay
    setTimeout(() => {
      setShowSuccess(true);
    }, 1000);
  };

  const handleRepeat = () => {
    setShowSuccess(false);
    setSelectedCandidate(null);
    setGlowingBulb(null);
  };

  if (!locationData || !theme) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  // Success Screen - Mobile Responsive
  if (showSuccess) {
    return (
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          position: "relative",
          fontFamily: "Arial, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden", // Prevents scroll from blur
          backgroundColor: "#f3f4f6",
        }}
      >
        {/* 1. Blurred Background Layer */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: selectedCandidate?.candidateImgName
              ? `url(/candidate/${selectedCandidate.candidateImgName})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(15px) brightness(0.9)",
            transform: "scale(1.1)", // Scale up slightly to hide blur edges
            zIndex: 0,
          }}
        />

        {/* 2. White Gradient Overlay from bottom to mid */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 25%, rgba(255, 255, 255, 0) 50%)",
            zIndex: 1,
          }}
        />

        {/* Main Content Wrapper */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
            width: "100%",
          }}
        >
          {/* 2. The White Card */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "16px",
              width: isMobile ? "280px" : "320px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Image Container */}
            <div style={{ position: "relative", width: "100%" }}>
              {/* Candidate Image */}
              {selectedCandidate?.candidateImgName ? (
                <img
                  src={`/candidate/${selectedCandidate.candidateImgName}`}
                  alt={selectedCandidate.name}
                  style={{
                    width: "100%",
                    aspectRatio: "1/1",
                    objectFit: "cover",
                    borderRadius: "15px",
                    display: "block",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                // if no candidate image, show symbol instead
                selectedCandidate?.symbol && (
                  <img
                    src={`/symbols/${selectedCandidate.symbol}`}
                    alt={selectedCandidate.name}
                    style={{
                      width: "100%",
                      aspectRatio: "1/1",
                      objectFit: "contain",
                      borderRadius: "15px",
                      display: "block",
                      backgroundColor: "#f9fafb",
                      padding: "20px",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )
              )}

              {/* VOTED Badge (Top Right inside image) */}
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "#DC2626", // Red
                  color: "white",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  letterSpacing: "0.5px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                VOTED
              </div>
            </div>

            {/* Candidate Name */}
            <div
              style={{
                marginTop: "20px",
                marginBottom: "15px",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  color: "#991b1b", // Dark Red text
                  lineHeight: "1.2",
                }}
              >
                {selectedCandidate?.name}
              </span>
            </div>

            {/* Separator Line */}
            <div
              style={{
                width: "100%",
                height: "1px",
                backgroundColor: "#e5e7eb",
                marginBottom: "15px",
              }}
            />

            {/* Footer Info (Ward + Symbol) */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                paddingBottom: "5px",
              }}
            >
              {/* Ward Info */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {currentLevel === "Ward" && (
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#374151",
                      fontWeight: "500",
                    }}
                  >
                    {(() => {
                      const data = getWardData(
                        panchayatId || "1",
                        wardNo || "1"
                      );
                      return `Ward ${data?.ward?.wardNo || wardNo || "1"} - ${
                        data?.ward?.name || ""
                      }`;
                    })()}
                  </span>
                )}
                {currentLevel === "Block" && (
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#374151",
                      fontWeight: "500",
                    }}
                  >
                    {locationData?.name || "Block"}
                  </span>
                )}
                {currentLevel === "District" && (
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#374151",
                      fontWeight: "500",
                    }}
                  >
                    {locationData?.name || "District"}
                  </span>
                )}
              </div>

              {/* Symbol */}
              {(selectedCandidate?.successSymbol ||
                selectedCandidate?.symbol) && (
                <img
                  src={`/symbols/${
                    selectedCandidate?.successSymbol ||
                    selectedCandidate?.symbol
                  }`}
                  alt="Symbol"
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
            </div>
          </div>

          {/* 3. Vote Again Button (Floating Below) */}
          <button
            onClick={handleRepeat}
            style={{
              marginTop: "20px",
              backgroundColor: "#b91c1c", // Deep Red
              color: "white",
              border: "none",
              padding: "12px 0",
              width: isMobile ? "280px" : "320px", // Match card width
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
            }}
          >
            Vote Again
            {/* Simple User Icon SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ width: "20px", height: "20px" }}
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
        padding: isTablet ? "10px" : "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* Level Tabs - Mobile Responsive */}
        <div
          style={{
            display: "flex",
            marginBottom: "0",
            gap: isMobile ? "5px" : "10px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => handleTabClick("Ward")}
            style={{
              backgroundColor: currentLevel === "Ward" ? "#9CA3AF" : "#D1D5DB",
              color: "white",
              padding: isMobile ? "8px 20px" : "10px 30px",
              borderRadius: "20px",
              fontSize: isMobile ? "12px" : "14px",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
              minWidth: isMobile ? "70px" : "80px",
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            Ward
          </button>
          {!isRestrictedPanchayat && (
            <>
              <button
                onClick={() => handleTabClick("Block")}
                style={{
                  backgroundColor:
                    currentLevel === "Block" ? "#D1D5DB" : "#EC4899",
                  color: "white",
                  padding: isMobile ? "8px 20px" : "10px 30px",
                  borderRadius: "20px",
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                  minWidth: isMobile ? "70px" : "80px",
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                Block
              </button>
              <button
                onClick={() => handleTabClick("District")}
                style={{
                  backgroundColor:
                    currentLevel === "District" ? "#D1D5DB" : "#0891b2",
                  color: "white",
                  padding: isMobile ? "8px 20px" : "10px 30px",
                  borderRadius: "20px",
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                  minWidth: isMobile ? "70px" : "80px",
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                District
              </button>
            </>
          )}
        </div>

        {/* EVM Container - Mobile Responsive */}
        <div
          style={{
            backgroundColor: theme.containerColor,
            border: `3px solid ${theme.borderColor}`,
            borderRadius: isMobile ? "15px" : "20px",
            padding: isMobile ? "15px" : "20px",
            marginTop: "10px",
          }}
        >
          {/* Header - Mobile Responsive */}
          <div
            style={{
              backgroundColor: "white",
              padding: isMobile ? "12px" : "15px",
              borderRadius: isMobile ? "8px" : "10px",
              marginBottom: isMobile ? "15px" : "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: isMobile ? "8px" : "10px",
              }}
            >
              <span
                style={{
                  color: "#10B981",
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: "bold",
                }}
              >
                Ready
              </span>
              <div
                style={{
                  width: isMobile ? "6px" : "8px",
                  height: isMobile ? "6px" : "8px",
                  backgroundColor: "#10B981",
                  borderRadius: "50%",
                }}
              ></div>
            </div>
            <div
              style={{
                fontSize: isMobile ? "14px" : "16px",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Ballot Unit{" "}
              {(() => {
                const data = getWardData(panchayatId || "1", wardNo || "1");
                return data?.ward?.ballotUnit || "1";
              })()}
            </div>
          </div>

          {/* Candidate Table - Clean Table Design */}
          <table
            style={{
              width: "100%",
              border: "4px solid #D1D5DB",
              borderCollapse: "collapse",
              borderRadius: "12px",
              overflow: "hidden",
              backgroundColor: "white",
            }}
          >
            <tbody>
              {locationData.candidates.slice(0, 8).map((candidate, index) => (
                <tr
                  key={candidate.id}
                  style={{
                    borderBottom:
                      index < locationData.candidates.length - 1
                        ? "6px solid #E5E7EB"
                        : "none",
                  }}
                >
                  {/* Row Number */}
                  <td
                    style={{
                      width: isMobile ? "50px" : "60px",
                      padding: isMobile ? "12px 8px" : "16px 12px",
                      borderRight: "6px solid #E5E7EB",
                      textAlign: "center",
                      verticalAlign: "middle",
                      fontSize: isMobile ? "16px" : "18px",
                      color: candidate.name ? "#374151" : "#a1a6aeff",
                      fontWeight: "bold",
                    }}
                  >
                    {candidate.id}
                  </td>

                  {/* Candidate Name and Symbol */}
                  <td
                    style={{
                      padding: isMobile ? "12px" : "16px",
                      borderRight: "6px solid #E5E7EB",
                      verticalAlign: "middle",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          fontSize: isMobile ? "12px" : "14px",
                          color: "#111827",
                          fontWeight: candidate.name ? "700" : "normal",
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {candidate.name}
                      </div>
                      <div
                        style={{
                          fontSize: "30px",
                          marginLeft: "8px",
                          flexShrink: 0,
                        }}
                      >
                        {candidate.symbol && (
                          <img
                            src={`/symbols/${candidate.symbol}`}
                            alt={
                              candidate.name
                                ? `${candidate.name} Symbol`
                                : "No Symbol"
                            }
                            style={{
                              width: isMobile ? "36px" : "44px",
                              height: isMobile ? "36px" : "44px",
                              objectFit: "contain",
                            }}
                            onError={(e) => {
                              console.error(
                                "Failed to load symbol:",
                                candidate.symbol
                              );
                              e.target.style.display = "none";
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Arrow and Vote Button Column */}
                  <td
                    style={{
                      width: isMobile ? "90px" : "100px",
                      padding: isMobile ? "12px" : "16px",
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: isMobile ? "8px" : "12px",
                      }}
                    >
                      {/* Left Arrow with Bar Indicator */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          filter:
                            glowingBulb === candidate.id
                              ? "drop-shadow(0 0 8px #FF0000) drop-shadow(0 0 15px #FF0000)"
                              : "none",
                          animation:
                            glowingBulb === candidate.id
                              ? "blink 0.3s ease-in-out infinite"
                              : "none",
                          flexShrink: 0,
                        }}
                      >
                        {/* Arrow Triangle */}
                        <div
                          style={{
                            width: "0",
                            height: "0",
                            borderTop: isMobile
                              ? "10px solid transparent"
                              : "12px solid transparent",
                            borderBottom: isMobile
                              ? "10px solid transparent"
                              : "12px solid transparent",
                            borderRight: isMobile ? "12px solid" : "14px solid",
                            borderRightColor:
                              glowingBulb === candidate.id
                                ? "#FF0000"
                                : "#8B5A2B",
                            transition: "all 0.3s ease",
                          }}
                        ></div>
                        {/* Horizontal Bar */}
                        <div
                          style={{
                            width: isMobile ? "12px" : "14px",
                            height: isMobile ? "8px" : "10px",
                            backgroundColor:
                              glowingBulb === candidate.id
                                ? "#FF0000"
                                : "#8B5A2B",
                            transition: "all 0.3s ease",
                          }}
                        ></div>
                      </div>

                      {/* Vote Button */}
                      <button
                        onClick={
                          candidate.name
                            ? () => handleVote(candidate)
                            : undefined
                        }
                        style={{
                          backgroundColor: "#1E40AF",
                          border: "none",
                          padding: isMobile ? "8px 12px" : "10px 16px",
                          borderRadius: isMobile ? "6px" : "8px",
                          cursor: candidate.name ? "pointer" : "default",
                          minWidth: isMobile ? "45px" : "55px",
                          minHeight: isMobile ? "30px" : "35px",
                          touchAction: "manipulation",
                          WebkitTapHighlightColor: "transparent",
                          flexShrink: 0,
                        }}
                        onMouseOver={(e) => {
                          if (candidate.name) {
                            e.target.style.backgroundColor = "#1E3A8A";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (candidate.name) {
                            e.target.style.backgroundColor = "#1E40AF";
                          }
                        }}
                      >
                        {/* Empty button - no text */}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Share Button - Mobile Responsive */}
        {/* <div
          style={{
            textAlign: "center",
            marginTop: isMobile ? "15px" : "20px",
          }}
        >
          <button
            style={{
              backgroundColor: "#059669",
              color: "white",
              border: "none",
              padding: isMobile ? "10px 20px" : "12px 30px",
              borderRadius: isMobile ? "15px" : "20px",
              fontSize: isMobile ? "12px" : "14px",
              fontWeight: "bold",
              cursor: "pointer",
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
              maxWidth: "100%",
              wordWrap: "break-word",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#047857")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#059669")}
          >
            Share Demo Voting Machine
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default EVMPage;
