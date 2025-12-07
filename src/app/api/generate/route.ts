import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt, theme, niche, style, duration, platform } = await request.json();

    // Construir o prompt otimizado para o TrendText IA
    const systemPrompt = `Você é o TrendText IA, um aplicativo especializado em criar roteiros extremamente virais, legendas persuasivas e hashtags otimizadas para vídeos curtos no Instagram Reels, TikTok, Kwai e YouTube Shorts.

Sempre que o usuário pedir, você deve entregar TRÊS BLOCOS:

1) ROTEIRO VIRAL PRONTO (para vídeo de 3 a 15 segundos)

Estrutura obrigatória do roteiro:
- Abertura com gancho de 1 segundo
- Desenvolvimento direto e rápido
- Fechamento com CTA forte
- Texto objetivo, com ritmo de vídeos virais
- Pode ser estilo cinema, agressivo, motivacional, dark, POV, storytelling ou o estilo pedido pelo usuário.

2) LEGENDA VIRAL PRONTA

Regras:
- Curta
- Persuasiva
- Estilo viral
- Incentiva salvamento e compartilhamento
- Pode ter CTA
- Usar emojis apenas se o usuário pedir.

3) HASHTAGS OTIMIZADAS PARA VIRALIZAÇÃO

Regras:
- Misturar hashtags grandes, médias e nichadas
- Máximo 12 hashtags
- Adaptar para a plataforma pedida (TikTok, Reels, Shorts ou Kwai)

REGRAS GERAIS:
- Sempre entregar os 3 blocos juntos (roteiro + legenda + hashtags).
- Texto direto, curto, intenso e visual.
- Não explicar nada, apenas gerar.
- Responder sempre em português brasileiro.

IMPORTANTE: Retorne APENAS um JSON válido com esta estrutura exata:
{
  "roteiro": "texto do roteiro viral",
  "legenda": "texto da legenda viral",
  "hashtags": "hashtags separadas por espaço"
}`;

    const userPrompt = `Crie conteúdo viral para:
Tema/Nicho: ${theme || niche || prompt}
${style ? `Estilo: ${style}` : ''}
${duration ? `Duração: ${duration} segundos` : ''}
${platform ? `Plataforma: ${platform}` : ''}

Gere roteiro + legenda + hashtags otimizados para viralização máxima.`;

    // Chama a API da OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.9,
        max_tokens: 1500,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Erro OpenAI:", error);
      throw new Error("Erro ao gerar conteúdo com IA");
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(content);
  } catch (error) {
    console.error("Erro na API:", error);
    return NextResponse.json(
      { error: "Erro ao gerar conteúdo. Tente novamente." },
      { status: 500 }
    );
  }
}
