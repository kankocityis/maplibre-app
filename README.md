# maplibre-app

[MapLibre GL JS](https://maplibre.org/) を用いたWeb地図プラットフォーム。React + TypeScript + Vite上に構築する。

## 概要

ブラウザ上でインタラクティブな地図を表示・操作するためのプラットフォーム。地図の表示状態（中心座標・ズーム・回転・傾き）をURLクエリパラメータと同期させ、地図の状態をURLだけで共有・再現できることを目指す。

## 主な機能

現時点で実装済みの機能:

- **MapLibre地図表示**: [CARTO Voyager](https://carto.com/basemaps) スタイルをベースマップとして使用
- **URL連動の地図状態管理**: 中心座標(`lat`/`lng`)・ズーム(`zoom`)・回転(`bearing`)・傾き(`pitch`)をURLクエリパラメータで管理し、`zod`でバリデーション（[src/routes/index.tsx](src/routes/index.tsx)）
- **中央クロスヘア表示**: 地図中心を示すクロスヘアアイコン（[src/components/CrosshairIcon.tsx](src/components/CrosshairIcon.tsx)）
- **座標オーバーレイ**: 現在の中心座標を表示するオーバーレイ（[src/components/CoordinateOverlayProps.tsx](src/components/CoordinateOverlayProps.tsx)）

## 技術スタック

| 分類 | 技術 |
|---|---|
| フレームワーク | React 19 |
| ビルドツール | Vite |
| 言語 | TypeScript |
| 地図ライブラリ | MapLibre GL JS |
| ルーティング | TanStack Router |
| バリデーション | Zod |
| Lint | oxlint |

## セットアップ

```bash
npm install
npm run dev
```

デフォルトでは `http://localhost:5173` で起動する。

## 利用可能なスクリプト

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 型チェック(`tsc -b`)後、本番ビルド |
| `npm run lint` | oxlintによるLintチェック |
| `npm run preview` | ビルド成果物のプレビュー |
| `npm run generate` | TanStack Routerのルートツリー(`routeTree.gen.ts`)を再生成 |

> `build1` / `lint1` / `preview1` は `tsr generate` やESLintを使う代替スクリプトとして残されている（現状は上表のコマンドが標準）。

## プロジェクト構成

```
src/
├── components/
│   ├── CrosshairIcon.tsx          # 地図中心のクロスヘア表示
│   └── CoordinateOverlayProps.tsx # 座標オーバーレイ表示
├── routes/
│   ├── __root.tsx                 # ルートレイアウト
│   └── index.tsx                  # 地図表示ページ（MapLibre本体）
├── App.tsx                        # Viteテンプレート初期画面（現状のエントリーポイント）
├── main.tsx                       # アプリのエントリーポイント
└── routeTree.gen.ts               # TanStack Router自動生成ファイル
```

## 現在の状態・既知の課題

- [src/main.tsx](src/main.tsx) では `RouterProvider` の呼び出しがコメントアウトされており、現状はVite初期テンプレートの `App` コンポーネントが表示される。地図画面（`routes/index.tsx`）を表示するには `RouterProvider` への切り替えが必要。
- ベースマップは外部提供のCARTOスタイルURLに依存している。本番運用時は自前のスタイル/タイル提供に切り替えるか、利用条件を確認すること。

## 今後の展望

地図上へのデータ表示（レイヤー追加、ピン/マーカー表示など）を含め、Web地図プラットフォームとしての機能を拡張していく予定。
