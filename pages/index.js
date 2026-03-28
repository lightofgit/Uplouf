import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [log, setLog] = useState([]);
  const [result, setResult] = useState(null);

  function addLog(msg, type = "info") {
    setLog((prev) => [...prev, { msg, type }]);
  }

  async function startUpload() {
    setStatus("loading");
    setLog([]);
    setResult(null);

    addLog("999 metadata dosyası oluşturuluyor...", "info");
    addLog("Pinata'ya klasör yükleniyor... (1-2 dk sürebilir)", "info");

    try {
      const res = await fetch("/api/upload", { method: "POST" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Bilinmeyen hata");

      addLog(`✅ Yükleme başarılı!`, "ok");
      addLog(`Klasör CID: ${data.cid}`, "ok");
      addLog(`baseURI: ${data.baseURI}`, "ok");
      setResult(data);
      setStatus("done");
    } catch (err) {
      addLog(`❌ Hata: ${err.message}`, "err");
      setStatus("error");
    }
  }

  function copy(text) {
    navigator.clipboard.writeText(text);
  }

  return (
    <>
      <Head>
        <title>Tempo Genesis Uploader</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #050e0a;
          --surface: #0a1a11;
          --border: #1a3324;
          --accent: #00ff87;
          --accent-dim: #00c96a;
          --text: #e0f5eb;
          --muted: #4a7a5f;
          --error: #ff4f4f;
          --warning: #ffb347;
        }
        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'Syne', sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
      `}</style>

      <div style={{ width: "100%", maxWidth: 540 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "var(--accent)", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>
            tempo.fun
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--accent)", textShadow: "0 0 40px rgba(0,255,135,0.3)" }}>
            Genesis <span style={{ color: "var(--text)" }}>Uploader</span>
          </h1>
          <div style={{ marginTop: 8, fontSize: 13, color: "var(--muted)", fontFamily: "'Space Mono',monospace" }}>
            999 metadata → Pinata IPFS
          </div>
        </div>

        {/* Info card */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontFamily: "'Space Mono',monospace", color: "var(--accent)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>
            Koleksiyon Bilgileri
          </div>
          {[
            ["Görsel CID", "bafybei...2xweq"],
            ["Supply", "999"],
            ["İsimlendirme", "Tempo Genesis #1–999"],
            ["Network", "TEMPO"],
            ["Tier", "Genesis"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: "'Space Mono',monospace", color: "var(--muted)", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <span>{k}</span><span style={{ color: "var(--accent)" }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Warning */}
        <div style={{ background: "rgba(255,179,71,0.08)", border: "1px solid rgba(255,179,71,0.3)", borderRadius: 10, padding: "14px 16px", marginBottom: 20, fontSize: 12, fontFamily: "'Space Mono',monospace", color: "var(--warning)", lineHeight: 1.6 }}>
          <strong style={{ display: "block", marginBottom: 4, fontSize: 11, letterSpacing: 1 }}>🔒 GÜVENLİK</strong>
          API key'ler Vercel Environment Variables'da güvenle saklanır. Hiçbir zaman frontend'e gönderilmez.
        </div>

        {/* Button */}
        <button
          onClick={startUpload}
          disabled={status === "loading"}
          style={{
            width: "100%", padding: 16, background: status === "loading" ? "var(--muted)" : "var(--accent)",
            color: "var(--bg)", border: "none", borderRadius: 10, fontFamily: "'Syne',sans-serif",
            fontSize: 15, fontWeight: 700, cursor: status === "loading" ? "not-allowed" : "pointer",
            letterSpacing: 1, transition: "all 0.2s",
          }}
        >
          {status === "loading" ? "⏳ Yükleniyor..." : status === "error" ? "🔄 Tekrar Dene" : "🚀 Yüklemeyi Başlat"}
        </button>

        {/* Log */}
        {log.length > 0 && (
          <div style={{ marginTop: 16, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px", fontFamily: "'Space Mono',monospace", fontSize: 11, lineHeight: 1.9, maxHeight: 160, overflowY: "auto" }}>
            {log.map((l, i) => (
              <div key={i} style={{ color: l.type === "ok" ? "var(--accent)" : l.type === "err" ? "var(--error)" : "var(--warning)" }}>
                {l.msg}
              </div>
            ))}
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{ marginTop: 16, background: "rgba(0,255,135,0.05)", border: "1px solid rgba(0,255,135,0.3)", borderRadius: 16, padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Yükleme Tamamlandı!</div>
            <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "'Space Mono',monospace", marginBottom: 16 }}>
              Contract'ında kullanacağın baseURI:
            </div>
            <div
              onClick={() => copy(result.baseURI)}
              style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "var(--accent)", wordBreak: "break-all", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: 12, cursor: "pointer", marginBottom: 8 }}
            >
              {result.baseURI}
            </div>
            <div style={{ fontSize: 10, fontFamily: "'Space Mono',monospace", color: "var(--muted)" }}>👆 tıkla kopyala</div>
          </div>
        )}
      </div>
    </>
  );
}
