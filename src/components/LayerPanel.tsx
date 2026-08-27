import { useState } from "react";

type LayerPanelProps = {
    showPoints: boolean;
    onTogglePoints: (value: boolean) => void;
    showCoordinates: boolean;
    onToggleCoordinates: (value: boolean) => void;
};

export function LayerPanel({
    showPoints,
    onTogglePoints,
    showCoordinates,
    onToggleCoordinates,
}: LayerPanelProps) {
    const [open, setOpen] = useState(true);

    if (!open) {
        return (
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="レイヤパネルを開く"
                style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    zIndex: 1000,
                    padding: "8px 14px",
                    borderRadius: "6px",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text-h)",
                    fontSize: "14px",
                    cursor: "pointer",
                    boxShadow: "var(--shadow)",
                }}
            >
                ☰ レイヤ
            </button>
        );
    }

    return (
        <div
            style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                zIndex: 1000,
                minWidth: "200px",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                boxShadow: "var(--shadow)",
                padding: "12px 16px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                }}
            >
                <span style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-h)" }}>
                    レイヤ設定
                </span>
                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="レイヤパネルを閉じる"
                    style={{
                        border: "none",
                        background: "none",
                        color: "var(--text)",
                        cursor: "pointer",
                        fontSize: "16px",
                        lineHeight: 1,
                        padding: "2px 4px",
                    }}
                >
                    ×
                </button>
            </div>

            <label
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    color: "var(--text-h)",
                    marginBottom: "8px",
                    cursor: "pointer",
                }}
            >
                <input
                    type="checkbox"
                    checked={showPoints}
                    onChange={(e) => onTogglePoints(e.target.checked)}
                />
                ポイントデータ
            </label>

            <label
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    color: "var(--text-h)",
                    cursor: "pointer",
                }}
            >
                <input
                    type="checkbox"
                    checked={showCoordinates}
                    onChange={(e) => onToggleCoordinates(e.target.checked)}
                />
                緯度経度表示
            </label>
        </div>
    );
}
