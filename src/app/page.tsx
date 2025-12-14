"use client";

import { useState } from "react";
import { Sparkles, Zap, TrendingUp, Target, AlertCircle } from "lucide-react";
import Navbar from "@/components/custom/navbar";
import CardPremium from "../components/custom/card-premium";
import { useRouter } from "next/navigation";
import { generateContent } from "@/lib/openai";
import { saveToHistory } from "@/lib/history";

export default function Home() {
  const router = useRouter();
  const [theme, setTheme] = useState("");
  const [niche, setNiche] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!theme.trim()) return;

    setIsGenerating(true);
    setError("");

    try {
      // Gera conteúdo (mockado ou real dependendo da configuração)
      const result = await generateContent({ theme, niche });

      // Salva no histórico
      const historyItem = saveToHistory({
        theme,
        niche,
        script: result.script,
        caption: result.caption,
        hashtags: result.hashtags,
        performance: result.performance,
      });

      // Salva no localStorage para a página de resultados
      localStorage.setItem(
        "currentGeneration",
        JSON.stringify({
          theme,
          niche,
          timestamp: new Date().toISOString(),
          result,
        })
      );

      // Navega para resultados
      router.push("/results");
    } catch (err) {
      console.error("Erro ao gerar:", err);
      setError(
        "Erro ao gerar conteúdo. Tente novamente em alguns segundos."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const quickIdeas = [
    { icon: TrendingUp, text: "vídeo sobre emagrecimento rápido", niche: "Saúde" },
    { icon: Target, text: "ideias para vender como afiliado", niche: "Marketing" },
    { icon: Zap, text: "conteúdo para atrair clientes no Instagram", niche: "Redes Sociais" },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00FF00]/10 border border-[#00FF00]/20 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-[#00FF00]" />
              <span className="text-sm text-[#00FF00] font-medium">
                Powered by AI
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent leading-tight">
              Crie Conteúdo Viral
              <br />
              <span className="text-[#00FF00]">em Segundos</span>
            </h1>

            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Envie um tema, nicho ou ideia de vídeo que você quer transformar em um roteiro viral.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Input Card */}
          <CardPremium className="mb-8" glow>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tema ou Ideia de Vídeo *
                </label>
                <textarea
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="Ex: vídeo sobre emagrecimento rápido, ideias para vender como afiliado, conteúdo para atrair clientes no Instagram..."
                  rows={3}
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#00FF00]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF00] focus:ring-2 focus:ring-[#00FF00]/20 transition-all duration-300 resize-none"
                  disabled={isGenerating}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Basta me dizer o assunto e eu gero: roteiro pronto, legenda viral e hashtags perfeitas
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nicho (opcional)
                </label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="Ex: Empreendedorismo, Fitness, Tecnologia..."
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF00] focus:ring-2 focus:ring-[#00FF00]/20 transition-all duration-300"
                  disabled={isGenerating}
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={!theme.trim() || isGenerating}
                className="w-full py-4 bg-gradient-to-r from-[#00FF00] to-[#00CC00] text-[#0D0D0D] font-bold rounded-xl hover:shadow-[0_0_40px_rgba(0,255,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#0D0D0D] border-t-transparent rounded-full animate-spin" />
                    Gerando conteúdo com IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Gerar Conteúdo Viral
                  </>
                )}
              </button>
            </div>
          </CardPremium>

          {/* Quick Ideas */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-400 text-center">
              Exemplos de Ideias
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickIdeas.map((idea, index) => {
                const Icon = idea.icon;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setTheme(idea.text);
                      setNiche(idea.niche);
                    }}
                    disabled={isGenerating}
                    className="p-4 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-gray-800 rounded-xl hover:border-[#00FF00]/40 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon className="w-6 h-6 text-[#00FF00] mb-2 group-hover:scale-110 transition-transform duration-300" />
                    <p className="text-sm text-gray-300 font-medium">
                      {idea.text}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{idea.niche}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-[#00FF00]">
                10K+
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Conteúdos Criados
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-[#00FF00]">
                95%
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Taxa de Sucesso
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-[#00FF00]">
                2.5M+
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Views Geradas
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
