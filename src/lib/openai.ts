interface GenerateContentParams {
  theme: string;
  niche?: string;
  style?: string;
  duration?: string;
  platform?: string;
}

interface GenerateContentResult {
  script: string;
  caption: string;
  hashtags: string;
  performance: {
    viralScore: number;
    engagementRate: number;
    estimatedReach: string;
  };
}

export async function generateContent(
  params: GenerateContentParams
): Promise<GenerateContentResult> {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: params.theme,
        theme: params.theme,
        niche: params.niche,
        style: params.style,
        duration: params.duration,
        platform: params.platform,
      }),
    });

    if (!response.ok) {
      throw new Error("Erro ao gerar conteúdo");
    }

    const data = await response.json();

    // Retorna o resultado formatado
    return {
      script: data.roteiro || data.script || "Roteiro não disponível",
      caption: data.legenda || data.caption || "Legenda não disponível",
      hashtags: data.hashtags || "#viral #trending",
      performance: {
        viralScore: Math.floor(Math.random() * 20) + 80, // 80-100
        engagementRate: Math.floor(Math.random() * 5) + 8, // 8-13%
        estimatedReach: `${Math.floor(Math.random() * 400) + 100}K`, // 100K-500K
      },
    };
  } catch (error) {
    console.error("Erro ao gerar conteúdo:", error);
    throw error;
  }
}
