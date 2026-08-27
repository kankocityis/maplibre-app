import { createFileRoute, Link } from "@tanstack/react-router";
// v5までの書き方（デフォルトインポートはエラーになる）
// import maplibregl from 'maplibre-gl';
// v6からの書き方（名前空間インポート）
// import * as maplibregl from "maplibre-gl";
import { Map, Marker, NavigationControl, Popup, type StyleSpecification } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { CrosshairIcon } from "../components/CrosshairIcon";
import { CoordinateOverlay } from "../components/CoordinateOverlayProps";
import { LayerPanel } from "../components/LayerPanel";

// 京橋駅（大阪）の座標
const KYOBASHI_STATION: [number, number] = [135.53678, 34.694097];

// 地図上に表示するポイントデータ
type MapPoint = {
    id: string;
    name: string;
    coordinates: [number, number];
    color: string;
};

const POINTS: MapPoint[] = [
    { id: "kyobashi", name: "京橋駅", coordinates: KYOBASHI_STATION, color: "#e6472e" },
    {
        id: "kanko",
        name: "株式会社かんこう",
        coordinates: [135.538757, 34.700924],
        color: "#2e7de6",
    },
];

// 国土地理院タイル（標準地図）をラスターソースとして利用するスタイル定義
// 出典の明記が利用規約で必須のため、attributionに国土地理院へのリンクを含める
const gsiStyle: StyleSpecification = {
    version: 8,
    sources: {
        gsi: {
            type: "raster",
            tiles: ["https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"],
            tileSize: 256,
            maxzoom: 18,
            attribution:
                '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">国土地理院</a>',
        },
    },
    layers: [
        {
            id: "gsi-layer",
            type: "raster",
            source: "gsi",
        },
    ],
};

// クエリパラメータの定義（バリデーションとデフォルト値）
const mapSearchSchema = z.object({
    lat: z.number().catch(KYOBASHI_STATION[1]), // 京橋駅（大阪）
    lng: z.number().catch(KYOBASHI_STATION[0]),
    zoom: z.number().catch(14),
    bearing: z.number().catch(0),
    pitch: z.number().catch(0),
});

export const Route = createFileRoute("/map")({
    validateSearch: (search: Record<string, unknown>) =>
        mapSearchSchema.parse(search),
    component: MapPage,
});

function MapPage() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<Map | null>(null);
    const markersRef = useRef<Marker[]>([]);

    const [showPoints, setShowPoints] = useState(true);
    const [showCoordinates, setShowCoordinates] = useState(true);

    // URLから状態を取得 (型安全なところがポイント)
    const { lat, lng, zoom, bearing, pitch } = Route.useSearch();
    const navigate = Route.useNavigate();

    useEffect(() => {
        if (!mapContainer.current || mapInstance.current) return;

        mapInstance.current = new Map({
            container: mapContainer.current,
            style: gsiStyle,
            center: [lng, lat],
            zoom: zoom,
            bearing: bearing,
            pitch: pitch,
        });

        const map = mapInstance.current;
        map.addControl(new NavigationControl(), "top-right");

        // 地図が動いたらURLを更新
        map.on("moveend", () => {
            const center = map.getCenter();
            const newZoom = map.getZoom();
            const newBearing = map.getBearing();
            const newPitch = map.getPitch();

            navigate({
                search: (prev: { lat: number; lng: number; zoom: number }) => ({
                    ...prev,
                    lat: parseFloat(center.lat.toFixed(6)),
                    lng: parseFloat(center.lng.toFixed(6)),
                    zoom: parseFloat(newZoom.toFixed(2)),
                    bearing: parseFloat(newBearing.toFixed(2)),
                    pitch: parseFloat(newPitch.toFixed(2)),
                }),
                replace: true, // 戻るボタンの履歴を汚さないようにする
            });
        });

        return () => {
            map.remove();
            mapInstance.current = null;
        };
    }, []);

    // ポイントデータレイヤーの表示・非表示を切り替え
    useEffect(() => {
        const map = mapInstance.current;
        if (!map || !showPoints) return;

        const markers = POINTS.map((point) =>
            new Marker({ color: point.color })
                .setLngLat(point.coordinates)
                .setPopup(new Popup({ offset: 24 }).setText(point.name))
                .addTo(map),
        );
        markersRef.current = markers;

        return () => {
            markers.forEach((marker) => marker.remove());
            markersRef.current = [];
        };
    }, [showPoints]);

    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
            <CrosshairIcon />
            {showCoordinates && <CoordinateOverlay lat={lat} lng={lng} />}
            <LayerPanel
                showPoints={showPoints}
                onTogglePoints={setShowPoints}
                showCoordinates={showCoordinates}
                onToggleCoordinates={setShowCoordinates}
            />
            <Link
                to="/"
                style={{
                    position: "absolute",
                    bottom: "16px",
                    right: "16px",
                    zIndex: 1000,
                    padding: "8px 14px",
                    borderRadius: "6px",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text-h)",
                    textDecoration: "none",
                    fontSize: "14px",
                    boxShadow: "var(--shadow)",
                }}
            >
                ← ホームに戻る
            </Link>
        </div>
    );
}
