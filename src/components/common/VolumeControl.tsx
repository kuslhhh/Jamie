import { useAudio } from "@/app/store/AudioContext";

export const VolumeControl: React.FC = () => {
  const { volume, setVolume } = useAudio();

  return (
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={volume}
      className="w-10/12 h-1.5 bg-zinc-200/20 transition-all duration-300 overflow-hidden rounded-lg appearance-none cursor-pointer"
      onChange={(e) => setVolume(parseFloat(e.target.value))}
      aria-label="Volume control"
    />
  );
};

export default VolumeControl;
