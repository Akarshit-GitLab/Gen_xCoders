import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface KarmaData {
  score: number;
  level: string;
  streak: number;
}

export function useKarmaScore() {
  const { user } = useAuth();
  const [karmaData, setKarmaData] = useState<KarmaData>({
    score: 0,
    level: "Beginner",
    streak: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchKarmaScore = async () => {
      try {
        const { data, error } = await supabase
          .from('karma_scores')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error fetching karma score:', error);
          return;
        }

        if (data) {
          setKarmaData({
            score: data.score,
            level: data.level,
            streak: data.streak
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKarmaScore();
  }, [user]);

  const updateKarmaScore = async (newScore: number, newStreak?: number) => {
    if (!user) return;

    // Determine level based on score
    let level = "Beginner";
    if (newScore >= 100) level = "Mindful Explorer";
    if (newScore >= 250) level = "Digital Warrior";
    if (newScore >= 500) level = "Zen Master";

    try {
      const { error } = await supabase
        .from('karma_scores')
        .upsert({
          user_id: user.id,
          score: newScore,
          level,
          streak: newStreak !== undefined ? newStreak : karmaData.streak,
          last_updated: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating karma score:', error);
        return;
      }

      setKarmaData({
        score: newScore,
        level,
        streak: newStreak !== undefined ? newStreak : karmaData.streak
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return {
    karmaData,
    loading,
    updateKarmaScore
  };
}