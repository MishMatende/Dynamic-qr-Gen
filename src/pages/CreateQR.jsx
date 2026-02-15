import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import VantaBackground from "../components/VantaBackground";
import ColorPicker from "../components/ColorPicker";
import { toPng } from "html-to-image";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function CreateQR() {
  const qrRef = useRef(null);
  const qrCode = useRef(null);
  const frameRef = useRef(null);
  const navigate = useNavigate();

  // Saving QR
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [activeTab, setActiveTab] = useState("basic");

  // Basic QR
  const [url, setUrl] = useState("https://google.com");
  const [size, setSize] = useState(320);
  const [margin, setMargin] = useState(10);

  // Error Correction
  const [errorCorrection, setErrorCorrection] = useState("H");

  // Dots style
  const [dotStyle, setDotStyle] = useState("rounded");
  const [dotColor, setDotColor] = useState("#22d3ee");

  // Background
  const [bgColor, setBgColor] = useState("#000000");

  // Corners
  const [cornerSquareStyle, setCornerSquareStyle] = useState("extra-rounded");
  const [cornerSquareColor, setCornerSquareColor] = useState("#ffffff");

  const [cornerDotStyle, setCornerDotStyle] = useState("dot");
  const [cornerDotColor, setCornerDotColor] = useState("#22d3ee");

  // Gradient
  const [useGradient, setUseGradient] = useState(false);
  const [gradientType, setGradientType] = useState("linear"); // linear or radial
  const [gradientColor1, setGradientColor1] = useState("#22d3ee");
  const [gradientColor2, setGradientColor2] = useState("#ffffff");
  const [gradientRotation, setGradientRotation] = useState(0);

  //Frames
  const [frameEnabled, setFrameEnabled] = useState(true);
  const [frameStyle, setFrameStyle] = useState("rounded");
  const [frameBg, setFrameBg] = useState("#ffffff");
  const [frameBorder, setFrameBorder] = useState("#22d3ee");
  const [framePadding, setFramePadding] = useState(18);
  const [frameBorderWidth, setFrameBorderWidth] = useState(3);

  const [frameText, setFrameText] = useState("Scan Me!");
  const [frameTextColor, setFrameTextColor] = useState("#000000");
  const [frameTextSize, setFrameTextSize] = useState(16);

  // Logo
  const [logo, setLogo] = useState(null);
  const [logoSize, setLogoSize] = useState(0.3);
  const [logoMargin, setLogoMargin] = useState(6);
  const [hideBackgroundDots, setHideBackgroundDots] = useState(true);

  // Init QR Code ONCE
  useLayoutEffect(() => {
    if (!qrRef.current) return;

    qrCode.current = new QRCodeStyling({
      width: size,
      height: size,
      data: url,
      margin: margin,
      qrOptions: {
        errorCorrectionLevel: errorCorrection,
      },
      backgroundOptions: {
        color: bgColor,
      },
      dotsOptions: {
        type: dotStyle,
        color: dotColor,
      },
      cornersSquareOptions: {
        type: cornerSquareStyle,
        color: cornerSquareColor,
      },
      cornersDotOptions: {
        type: cornerDotStyle,
        color: cornerDotColor,
      },
      image: logo,
      imageOptions: {
        crossOrigin: "anonymous",
        margin: logoMargin,
        imageSize: logoSize,
        hideBackgroundDots: hideBackgroundDots,
      },
    });

    qrRef.current.innerHTML = "";
    qrCode.current.append(qrRef.current);
  }, []);

  // Saving QR Code
  const saveQRCode = async () => {
    setSaveMessage("");

    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData?.user) {
      setSaveMessage("You must be logged in to save QR codes.");
      navigate("/login");
      return;
    }

    const user = authData.user;

    const designData = {
      url,
      size,
      margin,
      errorCorrection,

      dotStyle,
      dotColor,

      bgColor,

      cornerSquareStyle,
      cornerSquareColor,
      cornerDotStyle,
      cornerDotColor,

      useGradient,
      gradientType,
      gradientColor1,
      gradientColor2,
      gradientRotation,

      frameEnabled,
      frameStyle,
      frameBg,
      frameBorder,
      framePadding,
      frameBorderWidth,
      frameText,
      frameTextColor,
      frameTextSize,

      logo,
      logoSize,
      logoMargin,
      hideBackgroundDots,
    };

    setSaving(true);

    const { data, error } = await supabase
      .from("qr_codes")
      .insert([
        {
          user_id: user.id,
          destination_url: url,
          design: designData,
        },
      ])
      .select("id, short_code")
      .single();

    if (data) {
      console.log("Short Code:", data.short_code);
      setSaveMessage(`Saved! Short Code: ${data.short_code}`);
    }

    setSaving(false);

    if (error) {
      console.error(error);
      setSaveMessage("Failed to save QR Code.");
      return;
    }

    setSaveMessage("QR Code saved successfully!");
    console.log("Saved QR:", data);
  };

  // Update QR Code
  useEffect(() => {
    if (!qrCode.current) return;

    const dotsOptions = {
      type: dotStyle,
    };

    if (useGradient) {
      dotsOptions.gradient = {
        type: gradientType,
        rotation: (gradientRotation * Math.PI) / 180,
        colorStops: [
          { offset: 0, color: gradientColor1 },
          { offset: 1, color: gradientColor2 },
        ],
      };

      // IMPORTANT: remove solid color when using gradient
      dotsOptions.color = undefined;
    } else {
      dotsOptions.color = dotColor;

      // IMPORTANT: remove gradient when switching off
      dotsOptions.gradient = undefined;
    }

    qrCode.current.update({
      width: size,
      height: size,
      data: url,
      margin: margin,
      qrOptions: {
        errorCorrectionLevel: errorCorrection,
      },
      backgroundOptions: {
        color: bgColor,
      },
      dotsOptions,
      cornersSquareOptions: {
        type: cornerSquareStyle,
        color: cornerSquareColor,
      },
      cornersDotOptions: {
        type: cornerDotStyle,
        color: cornerDotColor,
      },
      image: logo,
      imageOptions: {
        crossOrigin: "anonymous",
        margin: logoMargin,
        imageSize: logoSize,
        hideBackgroundDots: hideBackgroundDots,
      },
    });
  }, [
    url,
    size,
    margin,
    errorCorrection,
    dotStyle,
    dotColor,
    bgColor,
    cornerSquareStyle,
    cornerSquareColor,
    cornerDotStyle,
    cornerDotColor,
    logo,
    logoSize,
    logoMargin,
    hideBackgroundDots,
    useGradient,
    gradientType,
    gradientColor1,
    gradientColor2,
    gradientRotation,
  ]);

  // Upload Logo
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setLogo(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Download QR
  const downloadQR = (format) => {
    if (!qrCode.current) return;
    qrCode.current.download({ name: "DynamicCodes", extension: format });
  };

  const downloadFramedPNG = async () => {
    if (!frameRef.current) return;

    try {
      const dataUrl = await toPng(frameRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: frameEnabled ? frameBg : "#000000",
      });

      const link = document.createElement("a");
      link.download = "DynamicCodes-framed.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download framed PNG:", err);
    }
  };

  const clearLogo = () => setLogo(null);

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded-xl text-sm font-semibold transition border cursor-pointer
        ${
          activeTab === id
            ? "bg-[var(--cyan)] text-black border-[var(--cyan)]"
            : "bg-black text-white border-zinc-800 hover:border-[var(--cyan)]"
        }
      `}
    >
      {label}
    </button>
  );

  return (
    <VantaBackground overlayOpacity={0.84}>
      <div className="px-6 py-12 md:px-12">
        <div className="mx-auto max-w-7xl">
          {/* Title */}
          <div className="text-center mb-12 fade-in">
            <h1 className="text-4xl md:text-5xl font-extrabold">
              Create <span className="text-[var(--cyan)]">QR Code</span>
            </h1>
            <p className="mt-4 text-muted max-w-2xl mx-auto leading-relaxed">
              Customize your QR design, upload a logo, apply gradients, and
              download in PNG or SVG format.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Side Controls */}
            <div className="card fade-in-delay">
              <h2 className="text-xl font-bold mb-6">Customization Settings</h2>

              {/* Tabs */}
              <div className="flex flex-wrap gap-3 mb-8">
                <TabButton id="basic" label="Basic" />
                <TabButton id="frame" label="frame" />
                <TabButton id="design" label="Design" />
                <TabButton id="gradient" label="Gradient" />
                <TabButton id="logo" label="Logo" />
              </div>

              {/* BASIC TAB */}
              {activeTab === "basic" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Destination URL
                    </label>
                    <input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-[var(--cyan)]"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        QR Size (px)
                      </label>
                      <input
                        type="number"
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                        className="w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-[var(--cyan)]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Margin / Padding
                      </label>
                      <input
                        type="number"
                        value={margin}
                        onChange={(e) => setMargin(Number(e.target.value))}
                        className="w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-[var(--cyan)]"
                      />
                    </div>
                  </div>

                  {/* Error Correction */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Error Correction Level
                    </label>

                    <select
                      value={errorCorrection}
                      onChange={(e) => setErrorCorrection(e.target.value)}
                      className="w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-[var(--cyan)]"
                    >
                      <option value="L">L (Low)</option>
                      <option value="M">M (Medium)</option>
                      <option value="Q">Q (Quartile)</option>
                      <option value="H">H (High)</option>
                    </select>

                    <p className="text-xs text-muted mt-2 leading-relaxed">
                      <span className="text-white font-semibold">
                        Error Correction Level
                      </span>{" "}
                      controls how much of the QR code can be damaged and still
                      scan correctly.
                      <br />
                      <span className="text-white font-semibold">L</span> = 7%
                      recovery,
                      <span className="text-white font-semibold"> M</span> =
                      15%,
                      <span className="text-white font-semibold"> Q</span> =
                      25%,
                      <span className="text-white font-semibold"> H</span> =
                      30%.
                      <br />
                      Recommended:{" "}
                      <span className="text-[var(--cyan)] font-semibold">
                        H
                      </span>{" "}
                      if you use a logo.
                    </p>
                  </div>
                </div>
              )}

              {/* FRAME TAB */}
              {activeTab === "frame" && (
                <div className="space-y-6">
                  {/* Enable Frame */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Enable Frame</p>
                      <p className="text-xs text-muted">
                        Adds a border and label around the QR code.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFrameEnabled(!frameEnabled)}
                      className={`relative w-12 h-7 rounded-full transition duration-300 cursor-pointer border ${
                        frameEnabled
                          ? "bg-[var(--cyan)] border-[var(--cyan)]"
                          : "bg-zinc-900 border-zinc-700"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-black transition duration-300 ${
                          frameEnabled ? "translate-x-5" : ""
                        }`}
                      ></span>
                    </button>
                  </div>

                  {/* Frame Style */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Frame Style
                    </label>
                    <select
                      value={frameStyle}
                      onChange={(e) => setFrameStyle(e.target.value)}
                      className="w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-[var(--cyan)]"
                    >
                      <option value="rounded">Rounded</option>
                      <option value="square">Square</option>
                      <option value="pill">Pill</option>
                    </select>
                  </div>

                  {/* Colors */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <ColorPicker
                      label="Frame Background"
                      color={frameBg}
                      setColor={setFrameBg}
                    />
                    <ColorPicker
                      label="Frame Border"
                      color={frameBorder}
                      setColor={setFrameBorder}
                    />
                  </div>

                  {/* Border & Padding */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Border Width ({frameBorderWidth}px)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="12"
                        value={frameBorderWidth}
                        onChange={(e) =>
                          setFrameBorderWidth(Number(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Padding ({framePadding}px)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={framePadding}
                        onChange={(e) =>
                          setFramePadding(Number(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Frame Text */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Frame Text
                    </label>
                    <input
                      value={frameText}
                      onChange={(e) => setFrameText(e.target.value)}
                      className="w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-[var(--cyan)]"
                      placeholder="Scan Me!"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <ColorPicker
                      label="Text Color"
                      color={frameTextColor}
                      setColor={setFrameTextColor}
                    />

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Text Size ({frameTextSize}px)
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="28"
                        value={frameTextSize}
                        onChange={(e) =>
                          setFrameTextSize(Number(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* DESIGN TAB */}
              {activeTab === "design" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Dot Style
                    </label>
                    <select
                      value={dotStyle}
                      onChange={(e) => setDotStyle(e.target.value)}
                      className="w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-[var(--cyan)]"
                    >
                      <option value="square">Square</option>
                      <option value="dots">Dots</option>
                      <option value="rounded">Rounded</option>
                      <option value="classy">Classy</option>
                      <option value="classy-rounded">Classy Rounded</option>
                      <option value="extra-rounded">Extra Rounded</option>
                    </select>
                  </div>

                  <ColorPicker
                    label="Dot Color"
                    color={dotColor}
                    setColor={setDotColor}
                  />

                  <ColorPicker
                    label="Background Color"
                    color={bgColor}
                    setColor={setBgColor}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Corner Square Style
                      </label>
                      <select
                        value={cornerSquareStyle}
                        onChange={(e) => setCornerSquareStyle(e.target.value)}
                        className="w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-[var(--cyan)]"
                      >
                        <option value="square">Square</option>
                        <option value="dot">Dot</option>
                        <option value="extra-rounded">Extra Rounded</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Corner Dot Style
                      </label>
                      <select
                        value={cornerDotStyle}
                        onChange={(e) => setCornerDotStyle(e.target.value)}
                        className="w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-[var(--cyan)]"
                      >
                        <option value="square">Square</option>
                        <option value="dot">Dot</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <ColorPicker
                      label="Corner Square Color"
                      color={cornerSquareColor}
                      setColor={setCornerSquareColor}
                    />

                    <ColorPicker
                      label="Corner Dot Color"
                      color={cornerDotColor}
                      setColor={setCornerDotColor}
                    />
                  </div>
                </div>
              )}

              {/* GRADIENT TAB */}
              {activeTab === "gradient" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Enable Gradient</p>
                      <p className="text-xs text-muted">
                        Apply gradient color to the QR dots.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setUseGradient(!useGradient)}
                      className={`relative w-12 h-7 rounded-full transition cursor-pointer duration-300 border ${
                        useGradient
                          ? "bg-[var(--cyan)] border-[var(--cyan)]"
                          : "bg-zinc-900 border-zinc-700"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-black shadow-[0_0_12px_rgba(34,211,238,0.4)]
 transition duration-300 ${useGradient ? "translate-x-5" : ""}`}
                      ></span>
                    </button>
                  </div>

                  {useGradient ? (
                    <>
                      <div className="grid gap-4 md:grid-cols-2">
                        <ColorPicker
                          label="Gradient Color 1"
                          color={gradientColor1}
                          setColor={setGradientColor1}
                        />

                        <ColorPicker
                          label="Gradient Color 2"
                          color={gradientColor2}
                          setColor={setGradientColor2}
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            Gradient Type
                          </label>
                          <select
                            value={gradientType}
                            onChange={(e) => setGradientType(e.target.value)}
                            className="w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-[var(--cyan)]"
                          >
                            <option value="linear">Linear</option>
                            <option value="radial">Radial</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            Rotation ({gradientRotation}°)
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={gradientRotation}
                            onChange={(e) =>
                              setGradientRotation(Number(e.target.value))
                            }
                            className="w-full"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-muted leading-relaxed">
                      Gradient is currently disabled. Turn it on to customize
                      gradient colors and rotation.
                    </div>
                  )}
                </div>
              )}

              {/* LOGO TAB */}
              {activeTab === "logo" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Upload Logo (Optional)
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="block w-full text-sm text-zinc-300 file:mr-4 file:rounded-xl file:border-0 file:bg-[var(--cyan)] file:px-4 file:py-2 file:text-black file:font-semibold hover:file:bg-[var(--cyan-soft)]"
                    />
                  </div>

                  {logo ? (
                    <>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            Logo Size ({Math.round(logoSize * 100)}%)
                          </label>
                          <input
                            type="range"
                            min="0.1"
                            max="0.5"
                            step="0.05"
                            value={logoSize}
                            onChange={(e) =>
                              setLogoSize(Number(e.target.value))
                            }
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            Logo Margin ({logoMargin}px)
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="20"
                            step="1"
                            value={logoMargin}
                            onChange={(e) =>
                              setLogoMargin(Number(e.target.value))
                            }
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">
                            Hide Background Dots Behind Logo
                          </p>
                          <p className="text-xs text-muted">
                            Recommended for cleaner logo display.
                          </p>
                        </div>

                        <input
                          type="checkbox"
                          checked={hideBackgroundDots}
                          onChange={(e) =>
                            setHideBackgroundDots(e.target.checked)
                          }
                          className="w-5 h-5 accent-cyan-400"
                        />
                      </div>

                      <button
                        onClick={clearLogo}
                        className="btn-outline cursor-pointer w-full"
                      >
                        Remove Logo
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-muted">
                      No logo uploaded yet. Upload one to unlock logo settings.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="card flex flex-col items-center justify-center fade-in-delay">
              <h2 className="text-xl font-bold mb-6">Live Preview</h2>

              <div className="w-full flex items-center justify-center">
                <div
                  ref={frameRef}
                  className="flex flex-col items-center justify-center"
                  style={{
                    backgroundColor: frameEnabled ? frameBg : "transparent",
                    border: frameEnabled
                      ? `${frameBorderWidth}px solid ${frameBorder}`
                      : "none",
                    padding: frameEnabled ? `${framePadding}px` : "0px",
                    borderRadius:
                      frameEnabled && frameStyle === "rounded"
                        ? "22px"
                        : frameEnabled && frameStyle === "square"
                          ? "10px"
                          : frameEnabled && frameStyle === "pill"
                            ? "50px"
                            : "22px",
                    boxShadow: frameEnabled
                      ? "0 0 25px rgba(34,211,238,0.12)"
                      : "none",
                    transition: "0.25s ease",
                  }}
                >
                  <div
                    ref={qrRef}
                    className="bg-black rounded-2xl flex items-center justify-center"
                  ></div>

                  {frameEnabled && frameText.trim() !== "" && (
                    <p
                      className="mt-4 font-semibold tracking-wide"
                      style={{
                        color: frameTextColor,
                        fontSize: `${frameTextSize}px`,
                      }}
                    >
                      {frameText}
                    </p>
                  )}
                </div>
              </div>

              <p className="mt-6 text-muted text-sm text-center max-w-sm">
                This QR code updates instantly. Use{" "}
                <span className="text-[var(--cyan)] font-semibold">High</span>{" "}
                error correction when adding logos.
              </p>
            </div>
          </div>

          {/* Download Buttons OUTSIDE the grid */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="w-full max-w-4xl flex flex-col sm:flex-row gap-4">
              <button
                onClick={saveQRCode}
                disabled={saving}
                className="btn-primary cursor-pointer w-full"
              >
                {saving ? "Saving..." : "Save QR Code"}
              </button>

              {saveMessage && (
                <p className="text-sm text-[var(--cyan)] text-center mt-2">
                  {saveMessage}
                </p>
              )}

              <button
                onClick={downloadFramedPNG}
                className="btn-primary cursor-pointer w-full"
              >
                Download PNG
              </button>

              <button
                onClick={() => downloadQR("svg")}
                className="btn-outline cursor-pointer w-full"
              >
                Download SVG
              </button>
            </div>

            <p className="text-xs text-muted text-center max-w-xl">
              Tip: Use{" "}
              <span className="text-[var(--cyan)] font-semibold">SVG</span> for
              printing and{" "}
              <span className="text-[var(--cyan)] font-semibold">PNG</span> for
              web use.
            </p>
          </div>
        </div>
      </div>
    </VantaBackground>
  );
}
