import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    component: HomePage,
});

function HomePage() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                textAlign: "center",
                padding: "24px",
                gap: "16px",
            }}
        >
            <h1 style={{ margin: 0 }}>Web地図プラットフォーム</h1>
            <p style={{ color: "var(--text)", maxWidth: "480px" }}>
                MapLibre GL JSを用いたWeb地図プラットフォームです。下のリンクから地図画面を表示できます。
            </p>
            <Link
                to="/map"
                search={{ lat: 34.694097, lng: 135.53678, zoom: 14, bearing: 0, pitch: 0 }}
                style={{
                    padding: "10px 20px",
                    borderRadius: "6px",
                    background: "var(--accent)",
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: 600,
                }}
            >
                地図を表示する →
            </Link>
        </div>
    );
}
