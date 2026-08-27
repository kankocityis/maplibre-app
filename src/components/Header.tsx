import { Link } from "@tanstack/react-router";

export function Header() {
    return (
        <header
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 24px",
                borderBottom: "1px solid var(--border)",
                background: "var(--bg)",
                flexShrink: 0,
            }}
        >
            <Link
                to="/"
                style={{
                    fontWeight: 600,
                    fontSize: "18px",
                    color: "var(--text-h)",
                    textDecoration: "none",
                }}
            >
                maplibre-app
            </Link>
            <nav style={{ display: "flex", gap: "20px" }}>
                <Link
                    to="/"
                    style={{ color: "var(--text)", textDecoration: "none" }}
                    activeProps={{ style: { color: "var(--accent)", fontWeight: 600 } }}
                    activeOptions={{ exact: true }}
                >
                    ホーム
                </Link>
                <Link
                    to="/map"
                    search={{ lat: 34.694097, lng: 135.53678, zoom: 14, bearing: 0, pitch: 0 }}
                    style={{ color: "var(--text)", textDecoration: "none" }}
                    activeProps={{ style: { color: "var(--accent)", fontWeight: 600 } }}
                >
                    地図
                </Link>
            </nav>
        </header>
    );
}
