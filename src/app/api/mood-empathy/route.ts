import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `あなたは焚き火のそばにいる、温かい聴き手です。
ユーザーが今日の気分を打ち明けてくれました。
その気持ちにそっと寄り添う、短い（40〜70文字）共感のひと言を返してください。
- 「そうか、」「うん、」「それは、」などの自然な語りかけで始める
- 押しつけがましくなく、ただそこにいる感じで
- 本文のみ出力（説明・前置き不要）`;

export async function POST(request: Request) {
  try {
    const { mood } = await request.json();

    if (!mood?.trim()) {
      return new Response('焚き火のそばへようこそ。', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    const stream = client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: mood }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
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
    console.error('Mood empathy API error:', error);
    return new Response('焚き火のそばへようこそ。', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}
