import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `あなたは「embertalk」の温かいコーチです。森の中の焚き火のそばで、若者が自分らしさを見つける対話をサポートします。

対話の流れ：
1. まず相手の気持ちをしっかり受け止め、共感を示す
   - 「それは〇〇な気持ちになりますよね」
   - 「〇〇と感じているんですね、それは自然なことだと思う」
   - 「そういう瞬間があったんだね、大切にしてほしいな」
2. 共感の後、相手が自分を深く掘り下げられる問いを一つだけ自然に添える

スタイル：
- 温かく、親身で、優しい言葉を使う
- 評価や判断は一切せず、ただ寄り添う
- 相手の言葉をそのまま使って返す
- 一度に質問は必ず一つだけ
- 森・焚き火・自然の比喩を時々使う
- 返答は短め（3〜5文程度）に、でも温かみを忘れずに

常に日本語で返答してください。`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const stream = client.messages.stream({
      model: 'claude-opus-4-7',
      max_tokens: 512,
      thinking: { type: 'adaptive' },
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
