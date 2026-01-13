import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shield, 
  Flame, Snowflake, Crown, Anchor, BookOpen, Sparkles, Wand2, X, Loader2 
} from 'lucide-react';

const appId = typeof __app_id !== 'undefined' ? __app_id : 'asoiaf-cinematic';
const apiKey = ""; // Environment provides the key

const initialScenes = [
  {
    title: "The Resurrection of the Wolf",
    part: "Part I: The Winds of Winter",
    content: "The assassination of Jon Snow is short-lived. Guided by a desperate prayer, Melisandre performs the last rites of R'hllor, and Jon Snow is resurrected. He returns colder, more ruthless, and freed from his vows, rallying the North.",
    theme: "ice",
    icon: <Snowflake className="w-12 h-12 text-blue-200" />,
    gradient: "from-slate-900 via-blue-900 to-black"
  },
  {
    title: "The Lady of Winterfell",
    part: "Part I: The Winds of Winter",
    content: "Stannis defeats the Boltons but finds his hold tenuous. Sansa Stark arrives with the Knights of the Vale, outmaneuvering both Stannis and Littlefinger to unite the North under the Stark banner once more.",
    theme: "ice",
    icon: <Shield className="w-12 h-12 text-gray-300" />,
    gradient: "from-gray-900 via-slate-800 to-black"
  },
  {
    title: "The Mother of Dragons Awakes",
    part: "Part I: The Winds of Winter",
    content: "Daenerys commands the Dothraki khalasars, while Tyrion Lannister secures Meereen with wildfire and strategic brilliance. With a united army and the Iron Fleet, her path to Westeros is finally clear.",
    theme: "fire",
    icon: <Flame className="w-12 h-12 text-orange-500" />,
    gradient: "from-red-950 via-orange-900 to-black"
  },
  {
    title: "The Lioness & The Prince",
    part: "Part I: The Winds of Winter",
    content: "Cersei obliterates her enemies in King's Landing with wildfire, claiming the throne. Meanwhile, Aegon Targaryen takes Storm's End, hailed by many as the true king. A new war of dragons and lions begins.",
    theme: "fire",
    icon: <Crown className="w-12 h-12 text-yellow-600" />,
    gradient: "from-red-900 via-red-950 to-black"
  },
  {
    title: "The Second Dance of Dragons",
    part: "Part II: A Dream of Spring",
    content: "Daenerys arrives to find Aegon already beloved. A brutal war ensues. Aegon is revealed as a Blackfyre pretender and slain. Daenerys takes the Iron Throne, but rules over a city that fears her.",
    theme: "fire",
    icon: <Flame className="w-12 h-12 text-red-600" />,
    gradient: "from-orange-950 via-red-950 to-black"
  },
  {
    title: "The Long Night Returns",
    part: "Part II: A Dream of Spring",
    content: "The Wall falls. The Night King and the army of the dead sweep south. Jon Snow calls for aid, and Daenerys chooses to save the kingdom she conquered. The War for the Dawn begins on the banks of the Trident.",
    theme: "ice",
    icon: <Snowflake className="w-12 h-12 text-white" />,
    gradient: "from-black via-blue-950 to-black"
  },
  {
    title: "The Song of Ice and Fire",
    part: "Part II: A Dream of Spring",
    content: "At the Gods Eye, the climax arrives. To fulfill the prophecy of Azor Ahai, Daenerys sacrifices her life force to Jon. With the power of fire and ice, Jon destroys the Night King, ending the Long Night forever.",
    theme: "magic",
    icon: <Shield className="w-12 h-12 text-purple-400" />,
    gradient: "from-blue-950 via-purple-950 to-orange-950"
  },
  {
    title: "A New Dawn",
    part: "The Aftermath",
    content: "The Iron Throne is melted. Bran the Broken is chosen as King to serve as the world's memory. Sansa rules an independent North. Arya sails into the unknown west. Tyrion becomes the Hand.",
    theme: "nature",
    icon: <BookOpen className="w-12 h-12 text-emerald-400" />,
    gradient: "from-green-950 via-slate-900 to-black"
  },
  {
    title: "The True North",
    part: "The Aftermath",
    content: "Jon Snow abdicates his claim and returns to the true North with the free folk. Somewhere in the Citadel, Samwell Tarly finishes his chronicle: A Song of Ice and Fire.",
    theme: "ice",
    icon: <Anchor className="w-12 h-12 text-blue-100" />,
    gradient: "from-slate-900 via-black to-black"
  }
];

export default function App() {
  const [scenes, setScenes] = useState(initialScenes);
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isNarrationEnabled, setIsNarrationEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Gemini Feature States
  const [isLoreOpen, setIsLoreOpen] = useState(false);
  const [loreText, setLoreText] = useState("");
  const [isGeneratingLore, setIsGeneratingLore] = useState(false);
  
  const [isFateOpen, setIsFateOpen] = useState(false);
  const [fatePrompt, setFatePrompt] = useState("");
  const [isGeneratingFate, setIsGeneratingFate] = useState(false);
  const [error, setError] = useState(null);

  const audioRef = useRef(null);
  const [fade, setFade] = useState(true);

  const scene = scenes[currentScene];

  // Helper for Gemini API with exponential backoff
  const callGemini = async (prompt, systemInstruction = "") => {
    let retries = 0;
    const maxRetries = 5;
    const delays = [1000, 2000, 4000, 8000, 16000];

    while (retries < maxRetries) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
          })
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const result = await response.json();
        return result.candidates?.[0]?.content?.parts?.[0]?.text;
      } catch (e) {
        retries++;
        if (retries === maxRetries) throw e;
        await new Promise(resolve => setTimeout(resolve, delays[retries-1]));
      }
    }
  };

  const fetchLore = async () => {
    setIsLoreOpen(true);
    setIsGeneratingLore(true);
    setLoreText("");
    try {
      const prompt = `Provide deep, book-accurate historical lore and analysis for this ASOIAF scene: "${scene.title} - ${scene.content}". Explain the connections to prophecies, ancient history of Westeros, and character arcs. Keep it under 150 words.`;
      const result = await callGemini(prompt, "You are a Maester of the Citadel, an expert on A Song of Ice and Fire lore.");
      setLoreText(result);
    } catch (err) {
      setError("Failed to consult the Citadel libraries.");
    } finally {
      setIsGeneratingLore(false);
    }
  };

  const fetchAlternateFate = async (e) => {
    e.preventDefault();
    if (!fatePrompt.trim()) return;
    
    setIsGeneratingFate(true);
    try {
      const prompt = `Current Scene: "${scene.title}: ${scene.content}". Rewrite this scene entirely based on this "What if" idea: "${fatePrompt}". Return the response as a JSON object with "title" and "content" keys.`;
      const resultText = await callGemini(prompt, "You are a master storyteller specialized in A Song of Ice and Fire. Provide a JSON response only.");
      
      // Attempt to parse JSON
      const jsonStart = resultText.indexOf('{');
      const jsonEnd = resultText.lastIndexOf('}') + 1;
      const jsonStr = resultText.substring(jsonStart, jsonEnd);
      const newSceneData = JSON.parse(jsonStr);

      const updatedScenes = [...scenes];
      updatedScenes[currentScene] = {
        ...updatedScenes[currentScene],
        title: newSceneData.title,
        content: newSceneData.content
      };
      
      setScenes(updatedScenes);
      setIsFateOpen(false);
      setFatePrompt("");
      // Restart narration for the new version
      if (isPlaying) speakScene(newSceneData.content);
    } catch (err) {
      setError("The threads of destiny were too tangled to reweave.");
    } finally {
      setIsGeneratingFate(false);
    }
  };

  // TTS Helper (from original implementation)
  const pcmToWav = (pcmData, sampleRate) => {
    const buffer = new ArrayBuffer(44 + pcmData.length);
    const view = new DataView(buffer);
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
    };
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + pcmData.length, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, pcmData.length, true);
    for (let i = 0; i < pcmData.length; i++) view.setUint8(44 + i, pcmData[i]);
    return new Blob([buffer], { type: 'audio/wav' });
  };

  const speakScene = async (text) => {
    if (!isNarrationEnabled || !apiKey) return;
    setIsSpeaking(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Read this in a deep, epic, cinematic narrator voice: ${text}` }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: "Charon" } }
            }
          }
        })
      });

      const result = await response.json();
      const audioData = result.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioData) {
        const binaryString = window.atob(audioData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
        const wavBlob = pcmToWav(bytes, 24000);
        const url = URL.createObjectURL(wavBlob);
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.play();
          audioRef.current.onended = () => {
            setIsSpeaking(false);
            if (isPlaying) setTimeout(nextScene, 2000);
          };
        }
      }
    } catch (error) {
      console.error("TTS failed:", error);
      setIsSpeaking(false);
      if (isPlaying) setTimeout(nextScene, 5000);
    }
  };

  const nextScene = () => {
    if (currentScene < scenes.length - 1) {
      setFade(false);
      setTimeout(() => {
        setCurrentScene(prev => prev + 1);
        setFade(true);
        setIsLoreOpen(false);
      }, 500);
    } else {
      setIsPlaying(false);
    }
  };

  const prevScene = () => {
    if (currentScene > 0) {
      setFade(false);
      setTimeout(() => {
        setCurrentScene(prev => prev - 1);
        setFade(true);
        setIsLoreOpen(false);
      }, 500);
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  useEffect(() => {
    if (isPlaying && !isSpeaking) {
      speakScene(scene.content);
    }
  }, [currentScene, isPlaying]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-all duration-1000 bg-gradient-to-b ${scene.gradient} text-white font-serif overflow-hidden relative`}>
      
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {scene.theme === 'ice' && (
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="animate-pulse absolute bg-white rounded-full" 
                style={{ 
                  width: Math.random() * 4 + 'px', 
                  height: Math.random() * 4 + 'px',
                  top: Math.random() * 100 + '%', 
                  left: Math.random() * 100 + '%' 
                }} 
              />
            ))}
          </div>
        )}
        {scene.theme === 'fire' && (
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent" />
        )}
      </div>

      {/* Cinematic Frame */}
      <div className={`w-full max-w-5xl px-8 transition-opacity duration-1000 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        <div className="mb-4 text-center">
          <span className="text-sm tracking-widest uppercase text-gray-400 border-b border-gray-700 pb-2">{scene.part}</span>
        </div>

        <div className="flex flex-col items-center text-center gap-8">
          <div className="animate-bounce-slow">
            {scene.icon}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-2xl">
            {scene.title}
          </h1>
          
          <div className="max-w-3xl">
            <p className="text-xl md:text-2xl leading-relaxed text-gray-200 italic">
              "{scene.content}"
            </p>
          </div>

          {/* AI Feature Buttons */}
          <div className="flex gap-4 mt-4">
            <button 
              onClick={fetchLore}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/30 rounded-full transition-all group backdrop-blur-sm"
            >
              <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
              <span>Lore Master ✨</span>
            </button>
            <button 
              onClick={() => setIsFateOpen(true)}
              className="flex items-center gap-2 px-6 py-2 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-400/30 rounded-full transition-all group backdrop-blur-sm"
            >
              <Wand2 size={18} className="group-hover:rotate-12 transition-transform" />
              <span>Alternate Fate ✨</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lore Overlay */}
      {isLoreOpen && (
        <div className="fixed inset-x-0 bottom-40 flex justify-center px-4 animate-slide-up z-40">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-6 rounded-2xl max-w-2xl shadow-2xl relative">
            <button onClick={() => setIsLoreOpen(false)} className="absolute top-4 right-4 hover:text-red-400">
              <X size={20} />
            </button>
            <h3 className="text-indigo-400 font-bold uppercase tracking-widest text-sm mb-2 flex items-center gap-2">
              <BookOpen size={14} /> Maester's Insight
            </h3>
            {isGeneratingLore ? (
              <div className="flex items-center gap-4 text-gray-400 animate-pulse py-4">
                <Loader2 className="animate-spin" />
                <span>Consulting the archives...</span>
              </div>
            ) : (
              <p className="text-gray-200 text-sm md:text-base leading-relaxed">
                {loreText || "No lore found for this moment."}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Alternate Fate Modal */}
      {isFateOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-amber-500/30 p-8 rounded-3xl max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                <Wand2 /> Change the Song
              </h3>
              <button onClick={() => setIsFateOpen(false)} className="text-gray-500 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-400 text-sm mb-4 italic">
              The threads of fate are yours to pluck. What if this moment went differently?
            </p>
            <form onSubmit={fetchAlternateFate}>
              <textarea 
                value={fatePrompt}
                onChange={(e) => setFatePrompt(e.target.value)}
                placeholder="e.g., What if the Night King won the battle at the Gods Eye?"
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50 mb-4 h-32"
              />
              <button 
                type="submit"
                disabled={isGeneratingFate || !fatePrompt.trim()}
                className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                {isGeneratingFate ? <Loader2 className="animate-spin" /> : <Sparkles />}
                {isGeneratingFate ? 'Reweaving Fate...' : 'Rewrite Scene ✨'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-red-900/80 border border-red-500 px-6 py-2 rounded-full text-white text-sm animate-bounce z-[60]">
          {error}
          <button onClick={() => setError(null)} className="ml-4 font-bold">×</button>
        </div>
      )}

      {/* Audio Controller (Hidden) */}
      <audio ref={audioRef} />

      {/* Controls Overlay */}
      <div className="fixed bottom-12 left-0 right-0 flex flex-col items-center gap-6 z-50">
        
        {/* Progress Bar */}
        <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-500" 
            style={{ width: `${((currentScene + 1) / scenes.length) * 100}%` }}
          />
        </div>

        <div className="flex items-center gap-8 bg-black/40 backdrop-blur-md p-4 rounded-full border border-white/10 shadow-2xl">
          <button 
            onClick={prevScene} 
            disabled={currentScene === 0}
            className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-30"
          >
            <SkipBack size={24} />
          </button>

          <button 
            onClick={togglePlay}
            className="p-4 bg-white text-black rounded-full hover:scale-110 transition-transform"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
          </button>

          <button 
            onClick={nextScene}
            disabled={currentScene === scenes.length - 1}
            className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-30"
          >
            <SkipForward size={24} />
          </button>

          <div className="w-px h-8 bg-white/20" />

          <button 
            onClick={() => setIsNarrationEnabled(!isNarrationEnabled)}
            className={`p-2 rounded-full transition-colors ${isNarrationEnabled ? 'text-white' : 'text-red-500'}`}
          >
            {isNarrationEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>

        <div className="text-xs text-gray-500 uppercase tracking-widest">
          Scene {currentScene + 1} of {scenes.length}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5px); }
          50% { transform: translateY(5px); }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out forwards;
        }
      `}} />
    </div>
  );
}