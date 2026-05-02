# embertalk 🔥

BBQの焚き火のそばで、自分らしさを見つけるコーチングアプリ。

## セットアップ

### 1. 依存関係のインストール

```bash
cd embertalk
npm install
```

### 2. APIキーの設定

`.env.local` を開いて、Anthropic APIキーを設定してください：

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
```

> APIキーは https://console.anthropic.com で取得できます。

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いてください。

## 機能

- **問いカード** — らしさ・強み・挑戦・関係性・未来の5テーマから問いを引く
- **AIコーチ** — Claude（claude-opus-4-7）との対話で自分らしさを探求
- **内省** — 今日の気づきをローカルに保存して振り返る

## 技術スタック

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- @anthropic-ai/sdk (claude-opus-4-7, adaptive thinking, streaming)
- LocalStorage（内省の保存）
