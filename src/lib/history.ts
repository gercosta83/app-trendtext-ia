import { supabase, Generation } from './supabase';

interface SaveHistoryParams {
  theme: string;
  niche: string;
  script: string;
  caption: string;
  hashtags: string[];
  performance: {
    viral_score: number;
    engagement_rate: number;
    estimated_views: string;
  };
}

// Salvar no histórico (Supabase + localStorage como fallback)
export async function saveToHistory(data: SaveHistoryParams): Promise<Generation> {
  const historyItem: Omit<Generation, 'id' | 'created_at'> = {
    theme: data.theme,
    niche: data.niche,
    script: data.script,
    caption: data.caption,
    hashtags: data.hashtags,
    performance: data.performance,
  };

  try {
    // Tenta salvar no Supabase
    const { data: savedData, error } = await supabase
      .from('generations')
      .insert([historyItem])
      .select()
      .single();

    if (error) throw error;

    return savedData;
  } catch (error) {
    console.warn('Erro ao salvar no Supabase, usando localStorage:', error);
    
    // Fallback: salva no localStorage
    const localItem: Generation = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...historyItem,
    };

    const existing = getLocalHistory();
    existing.unshift(localItem);
    localStorage.setItem('trendtext_history', JSON.stringify(existing.slice(0, 50)));
    
    return localItem;
  }
}

// Buscar histórico (Supabase + localStorage como fallback)
export async function getHistory(): Promise<Generation[]> {
  try {
    // Tenta buscar do Supabase
    const { data, error } = await supabase
      .from('generations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.warn('Erro ao buscar do Supabase, usando localStorage:', error);
    
    // Fallback: busca do localStorage
    return getLocalHistory();
  }
}

// Deletar item do histórico
export async function deleteHistoryItem(id: string): Promise<void> {
  try {
    // Tenta deletar do Supabase
    const { error } = await supabase
      .from('generations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.warn('Erro ao deletar do Supabase, usando localStorage:', error);
    
    // Fallback: deleta do localStorage
    const existing = getLocalHistory();
    const filtered = existing.filter(item => item.id !== id);
    localStorage.setItem('trendtext_history', JSON.stringify(filtered));
  }
}

// Limpar todo o histórico
export async function clearHistory(): Promise<void> {
  try {
    // Tenta limpar do Supabase
    const { error } = await supabase
      .from('generations')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Deleta todos

    if (error) throw error;
  } catch (error) {
    console.warn('Erro ao limpar Supabase, usando localStorage:', error);
  }
  
  // Sempre limpa o localStorage também
  localStorage.removeItem('trendtext_history');
}

// Funções auxiliares para localStorage
function getLocalHistory(): Generation[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('trendtext_history');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}
