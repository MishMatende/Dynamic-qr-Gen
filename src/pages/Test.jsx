import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import VantaBackground from "../components/VantaBackground";
import ColorPicker from "../components/ColorPicker";

export default function CreateQR() {
  const qrRef = useRef(null);
  const qrCode = useRef(null);

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
  const [gradientType, setGradientType] = useState("linear");
  const [gradientColor1, setGradientColor1] = useState("#22d3ee");
  const [gradientColor2, setGradientColor2] = useState("#ffffff");
  const [gradientRotation, setGradientRotation] = useState(0);

  // Logo
  const [logo, setLogo] = useState(null);
  const [logoSize, setLogoSize] = useState(0.3);
  const [logoMargin, setLogoMargin] = useState(6);
  const [hideBackgroundDots, setHideBackgroundDots] = useState(true);

  // Init QR Code ONCE
  useEffect(() => {
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

    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      qrCode.current.append(qrRef.current);
    }
  }, []);

  // Update QR Code
  useEffect(() => {
    if (!qrCode.current) return;

    const dotsOptions = {
      type: dotStyle,
      color: dotColor,
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
      delete dotsOptions.color;
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

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setLogo(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const downloadQR = (format) => {
    if (!qrCode.current) return;
    qrCode.current.download({ name: "dynamicqr", extension: format });
  };

  const clearLogo = () => setLogo(null);

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded-xl text-sm font-semibold transition border
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
            {/* Controls */}
            <div className="card fade-in-delay">
              <h2 className="text-xl font-bold mb-6">Customization Settings</h2>

              {/* Tabs */}
              <div className="flex flex-wrap gap-3 mb-8">
                <TabButton id="basic" label="Basic" />
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
                      Controls scan reliability if QR is damaged or has a logo.
                      <br />
                      <span className="text-white font-semibold">L</span> = 7%,
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

                    <input
                      type="checkbox"
                      checked={useGradient}
                      onChange={(e) => setUseGradient(e.target.checked)}
                      className="w-5 h-5 accent-cyan-400"
                    />
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
                        className="btn-outline w-full"
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

              {/* Download Buttons (always visible) */}
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => downloadQR("png")}
                  className="btn-primary w-full"
                >
                  Download PNG
                </button>

                <button
                  onClick={() => downloadQR("svg")}
                  className="btn-outline w-full"
                >
                  Download SVG
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="card flex flex-col items-center justify-center fade-in-delay">
              <h2 className="text-xl font-bold mb-6">Live Preview</h2>

              <div
                ref={qrRef}
                className="p-6 rounded-2xl border border-zinc-800 bg-black"
              ></div>

              <p className="mt-6 text-muted text-sm text-center max-w-sm">
                This QR code updates instantly. Use{" "}
                <span className="text-[var(--cyan)] font-semibold">High</span>{" "}
                error correction when adding logos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </VantaBackground>
  );
}
