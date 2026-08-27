import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
    // GitHub Pages(プロジェクトページ)はリポジトリ名配下で配信されるため、
    // ビルド時のみ base をリポジトリ名に合わせる
    base: command === "build" ? "/maplibre-app/" : "/",
    plugins: [
        tanstackRouter(), // react() より前に記述するのがポイント
        react(),
    ],
}));
