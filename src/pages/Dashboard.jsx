import React, { useEffect, useMemo, useState } from "react";
import VantaBackground from "../components/VantaBackground";
import { supabase } from "../lib/supabaseClient";

import {
  BarChart3,
  QrCode,
  MousePointerClick,
  CalendarDays,
  Copy,
  Trash2,
  Search,
  Filter,
} from "lucide-react";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [qrCodes, setQrCodes] = useState([]);
  const [scans, setScans] = useState([]);

  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCode, setSelectedCode] = useState("all");
  const [dateFilter, setDateFilter] = useState("30"); // 7, 30, all

  const [stats, setStats] = useState({
    totalCodes: 0,
    totalScans: 0,
    scansToday: 0,
    mostScanned: null,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);

    const { data: codes, error: codesError } = await supabase
      .from("qr_codes")
      .select("*")
      .order("created_at", { ascending: false });

    if (codesError) {
      console.error("Error fetching qr_codes:", codesError);
      setLoading(false);
      return;
    }

    const { data: scanRows, error: scansError } = await supabase
      .from("qr_scans")
      .select("*")
      .order("scanned_at", { ascending: false });

    if (scansError) {
      console.error("Error fetching qr_scans:", scansError);
      setLoading(false);
      return;
    }

    setQrCodes(codes);
    setScans(scanRows);

    calculateStats(codes, scanRows);

    setLoading(false);
  };

  const calculateStats = (codes, scanRows) => {
    const totalCodes = codes.length;
    const totalScans = scanRows.length;

    const today = new Date().toISOString().slice(0, 10);
    const scansToday = scanRows.filter((scan) =>
      scan.scanned_at?.startsWith(today),
    ).length;

    // Count scans per short_code
    const scanCountMap = {};
    scanRows.forEach((scan) => {
      scanCountMap[scan.short_code] = (scanCountMap[scan.short_code] || 0) + 1;
    });

    let mostScanned = null;
    let maxScans = 0;

    for (const code of codes) {
      const count = scanCountMap[code.short_code] || 0;
      if (count > maxScans) {
        maxScans = count;
        mostScanned = { ...code, scans: count };
      }
    }

    setStats({
      totalCodes,
      totalScans,
      scansToday,
      mostScanned,
    });
  };

  const getRedirectLink = (shortCode) => {
    return `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/qr-redirect/${shortCode}`;
  };

  const copyLink = async (shortCode) => {
    const link = getRedirectLink(shortCode);
    await navigator.clipboard.writeText(link);
    alert("Redirect link copied!");
  };

  const deleteQRCode = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this QR code? This cannot be undone.",
    );

    if (!confirmDelete) return;

    const { error } = await supabase.from("qr_codes").delete().eq("id", id);

    if (error) {
      alert("Failed to delete QR Code: " + error.message);
      return;
    }

    fetchDashboard();
  };

  // Filter scans by selected QR code + date range
  const filteredScans = useMemo(() => {
    let result = [...scans];

    if (selectedCode !== "all") {
      result = result.filter((scan) => scan.short_code === selectedCode);
    }

    if (dateFilter !== "all") {
      const days = Number(dateFilter);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);

      result = result.filter((scan) => new Date(scan.scanned_at) >= cutoff);
    }

    return result;
  }, [scans, selectedCode, dateFilter]);

  // Filter QR codes by search
  const filteredQrCodes = useMemo(() => {
    let result = [...qrCodes];

    if (search.trim() !== "") {
      result = result.filter(
        (code) =>
          code.short_code.toLowerCase().includes(search.toLowerCase()) ||
          code.destination_url.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return result;
  }, [qrCodes, search]);

  // Enrich QR codes with scan counts + last scan
  const enrichedCodes = useMemo(() => {
    const scanCountMap = {};
    const lastScanMap = {};

    scans.forEach((scan) => {
      scanCountMap[scan.short_code] = (scanCountMap[scan.short_code] || 0) + 1;

      if (!lastScanMap[scan.short_code]) {
        lastScanMap[scan.short_code] = scan.scanned_at;
      }
    });

    return filteredQrCodes.map((code) => ({
      ...code,
      scans: scanCountMap[code.short_code] || 0,
      lastScan: lastScanMap[code.short_code] || null,
    }));
  }, [filteredQrCodes, scans]);

  // --- Analytics Data Processing ---

  const scansPerDay = useMemo(() => {
    const map = {};

    filteredScans.forEach((scan) => {
      const date = new Date(scan.scanned_at).toISOString().slice(0, 10);
      map[date] = (map[date] || 0) + 1;
    });

    return Object.keys(map)
      .sort()
      .map((date) => ({
        date,
        scans: map[date],
      }));
  }, [filteredScans]);

  const deviceBreakdown = useMemo(() => {
    const map = {};

    filteredScans.forEach((scan) => {
      const device = scan.device_type || "Unknown";
      map[device] = (map[device] || 0) + 1;
    });

    return Object.keys(map).map((key) => ({
      name: key,
      value: map[key],
    }));
  }, [filteredScans]);

  const browserBreakdown = useMemo(() => {
    const map = {};

    filteredScans.forEach((scan) => {
      const browser = scan.browser || "Unknown";
      map[browser] = (map[browser] || 0) + 1;
    });

    return Object.keys(map).map((key) => ({
      name: key,
      scans: map[key],
    }));
  }, [filteredScans]);

  const osBreakdown = useMemo(() => {
    const map = {};

    filteredScans.forEach((scan) => {
      const os = scan.os || "Unknown";
      map[os] = (map[os] || 0) + 1;
    });

    return Object.keys(map).map((key) => ({
      name: key,
      scans: map[key],
    }));
  }, [filteredScans]);

  const countryBreakdown = useMemo(() => {
    const map = {};

    filteredScans.forEach((scan) => {
      const country = scan.country || "Unknown";
      map[country] = (map[country] || 0) + 1;
    });

    return Object.keys(map).map((key) => ({
      name: key,
      scans: map[key],
    }));
  }, [filteredScans]);

  return (
    <VantaBackground overlayOpacity={0.9}>
      <div className="min-h-screen px-6 py-10 md:px-12 text-white">
        <div className="mx-auto max-w-7xl w-full">
          {/* Header */}
          <div className="mb-10 fade-in">
            <h1 className="text-4xl font-extrabold">
              Dashboard <span className="text-[var(--cyan)]">Analytics</span>
            </h1>
            <p className="text-muted mt-2 max-w-2xl">
              View scan analytics, manage your QR codes, and track performance.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10 fade-in-delay">
            <StatCard
              title="Total QR Codes"
              value={stats.totalCodes}
              icon={<QrCode className="w-6 h-6 text-[var(--cyan)]" />}
            />

            <StatCard
              title="Total Scans"
              value={stats.totalScans}
              icon={
                <MousePointerClick className="w-6 h-6 text-[var(--cyan)]" />
              }
            />

            <StatCard
              title="Scans Today"
              value={stats.scansToday}
              icon={<CalendarDays className="w-6 h-6 text-[var(--cyan)]" />}
            />

            <StatCard
              title="Most Scanned"
              value={stats.mostScanned ? stats.mostScanned.short_code : "—"}
              icon={<BarChart3 className="w-6 h-6 text-[var(--cyan)]" />}
              subtitle={
                stats.mostScanned
                  ? `${stats.mostScanned.scans} scans`
                  : "No scans yet"
              }
            />
          </div>

          {/* Filters */}
          <div className="card p-6 mb-10 fade-in-delay">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}
              <div className="flex items-center gap-3 w-full lg:max-w-md border border-zinc-800 rounded-xl px-4 py-3 bg-black">
                <Search className="w-4 h-4 text-zinc-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search short code or destination URL..."
                  className="bg-transparent outline-none w-full text-sm"
                />
              </div>

              {/* QR Code Filter */}
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-zinc-500" />
                <select
                  value={selectedCode}
                  onChange={(e) => setSelectedCode(e.target.value)}
                  className="rounded-xl bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-[var(--cyan)]"
                >
                  <option value="all">All QR Codes</option>
                  {qrCodes.map((code) => (
                    <option key={code.id} value={code.short_code}>
                      {code.short_code}
                    </option>
                  ))}
                </select>

                {/* Date Filter */}
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="rounded-xl bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-[var(--cyan)]"
                >
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Analytics Charts */}
          <div className="grid gap-8 lg:grid-cols-2 mb-10">
            {/* Scans Per Day */}
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-4">Scans Per Day</h2>

              {loading ? (
                <p className="text-muted">Loading chart...</p>
              ) : scansPerDay.length === 0 ? (
                <p className="text-muted">No scans data available.</p>
              ) : (
                <div className="w-full h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={scansPerDay}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                      <XAxis dataKey="date" stroke="#999" />
                      <YAxis stroke="#999" />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="scans"
                        stroke="#22d3ee"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Device Breakdown */}
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-4">Device Breakdown</h2>

              {loading ? (
                <p className="text-muted">Loading chart...</p>
              ) : deviceBreakdown.length === 0 ? (
                <p className="text-muted">No scans data available.</p>
              ) : (
                <div className="w-full h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceBreakdown}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={90}
                        label
                      >
                        {deviceBreakdown.map((_, index) => (
                          <Cell
                            key={index}
                            fill="#22d3ee"
                            opacity={0.3 + index * 0.15}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Browser + OS */}
          <div className="grid gap-8 lg:grid-cols-2 mb-10">
            {/* Browser */}
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-4">Browser Breakdown</h2>

              {browserBreakdown.length === 0 ? (
                <p className="text-muted">No browser data available.</p>
              ) : (
                <div className="w-full h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={browserBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                      <XAxis dataKey="name" stroke="#999" />
                      <YAxis stroke="#999" />
                      <Tooltip />
                      <Bar
                        dataKey="scans"
                        fill="#22d3ee"
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* OS */}
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-4">OS Breakdown</h2>

              {osBreakdown.length === 0 ? (
                <p className="text-muted">No OS data available.</p>
              ) : (
                <div className="w-full h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={osBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                      <XAxis dataKey="name" stroke="#999" />
                      <YAxis stroke="#999" />
                      <Tooltip />
                      <Bar
                        dataKey="scans"
                        fill="#22d3ee"
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Country Breakdown */}
          {/* <div className="card p-6 mb-10">
            <h2 className="text-lg font-bold mb-4">Country Breakdown</h2>

            {countryBreakdown.length === 0 ? (
              <p className="text-muted">
                No country data available (you can add this later).
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-zinc-400 border-b border-zinc-800">
                      <th className="py-3">Country</th>
                      <th className="py-3">Scans</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countryBreakdown.map((row) => (
                      <tr
                        key={row.name}
                        className="border-b border-zinc-900 hover:bg-white/5 transition"
                      >
                        <td className="py-3">{row.name}</td>
                        <td className="py-3 text-[var(--cyan)] font-bold">
                          {row.scans}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div> */}

          {/* QR Codes Table */}
          <div className="card p-8">
            <h2 className="text-xl font-bold mb-6">Your QR Codes</h2>

            {loading ? (
              <p className="text-muted">Loading QR codes...</p>
            ) : enrichedCodes.length === 0 ? (
              <p className="text-muted">
                No QR codes found. Create one to begin tracking scans.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-zinc-400 border-b border-zinc-800">
                      <th className="py-3">Short Code</th>
                      <th className="py-3">Destination</th>
                      <th className="py-3">Scans</th>
                      <th className="py-3">Last Scan</th>
                      <th className="py-3">Created</th>
                      <th className="py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrichedCodes.map((code) => (
                      <tr
                        key={code.id}
                        className="border-b border-zinc-900 hover:bg-white/5 transition"
                      >
                        <td className="py-4 font-semibold text-white">
                          {code.short_code}
                        </td>

                        <td className="py-4 text-muted max-w-[280px] truncate">
                          {code.destination_url}
                        </td>

                        <td className="py-4 text-[var(--cyan)] font-bold">
                          {code.scans}
                        </td>

                        <td className="py-4 text-muted">
                          {code.lastScan
                            ? new Date(code.lastScan).toLocaleString()
                            : "—"}
                        </td>

                        <td className="py-4 text-muted">
                          {new Date(code.created_at).toLocaleDateString()}
                        </td>

                        <td className="py-4 text-right flex justify-end gap-3">
                          <button
                            onClick={() => copyLink(code.short_code)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-700 hover:border-[var(--cyan)] hover:shadow-[0_0_18px_rgba(34,211,238,0.45)] transition"
                          >
                            <Copy className="w-4 h-4" />
                            Copy
                          </button>

                          <button
                            onClick={() => deleteQRCode(code.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/40 text-red-400 hover:border-red-500 hover:bg-red-500/10 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </VantaBackground>
  );
}

function StatCard({ title, value, icon, subtitle }) {
  return (
    <div className="card p-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-muted">{title}</p>
        <h3 className="text-2xl font-extrabold mt-2">{value}</h3>
        {subtitle && <p className="text-xs text-zinc-400 mt-1">{subtitle}</p>}
      </div>

      <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-zinc-800">
        {icon}
      </div>
    </div>
  );
}
