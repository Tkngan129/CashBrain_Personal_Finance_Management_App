import { ChevronDown, RefreshCcw, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { AnimatePresence, motion } from '../lib/motion';
import { PhotoExpenseSheet } from './PhotoExpenseSheet';

interface Props {
  onClose: () => void;
}

export function CameraScreen({ onClose }: Props) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef   = useRef<HTMLInputElement>(null);

  const [facing,        setFacing]        = useState<'user' | 'environment'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [camError,      setCamError]      = useState(false);
  const [isReady,       setIsReady]       = useState(false);
  const [showSheet,     setShowSheet]     = useState(false);

  const { photoTransactions } = useTransactions();
  const lastPhoto = photoTransactions[0]?.imageDataUrl ?? null;

  // ── camera lifecycle ────────────────────────────────────────────────────────
  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    stopStream();
    setIsReady(false);
    setCamError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().then(() => setIsReady(true));
        };
      }
    } catch {
      setCamError(true);
    }
  }, [facing, stopStream]);

  useEffect(() => {
    startCamera();
    return stopStream;
  }, [startCamera, stopStream]);

  // ── capture ─────────────────────────────────────────────────────────────────
  const capture = () => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    const url = canvas.toDataURL('image/jpeg', 0.88);
    stopStream();
    setCapturedImage(url);
    setShowSheet(true);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      stopStream();
      setCapturedImage(ev.target?.result as string);
      setShowSheet(true);
    };
    reader.readAsDataURL(file);
  };

  const retake = () => {
    setCapturedImage(null);
    setShowSheet(false);
    startCamera();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="h-full flex flex-col overflow-hidden"
      style={{ background: '#000' }}
    >
      {/* ── Top area: social / status bar ───────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 pt-5 pb-3">
        {/* Left icon */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.12)' }}
        >
          <X style={{ width: 17, height: 17 }} className="text-white" />
        </motion.button>

        {/* Friends pill */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          <span className="text-white text-sm font-semibold">👥 42 Friends</span>
        </div>

        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
          style={{ border: '2px solid rgba(255,255,255,0.25)' }}
        >
          <div
            className="w-full h-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #9ED3DC 0%, #1C4D8D 100%)' }}
          >
            NT
          </div>
        </div>
      </div>

      {/* ── Viewfinder card ─────────────────────────────────────────────────── */}
      <div className="flex-1 px-3 pb-3 min-h-0">
        <div
          className="relative w-full h-full overflow-hidden"
          style={{ borderRadius: 24 }}
        >
          {/* Live camera feed */}
          {!capturedImage && (
            <>
              {!camError ? (
                <>
                  {!isReady && (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: '#111' }}
                    >
                      <div className="w-9 h-9 rounded-full border-2 border-white/15 border-t-white/60 animate-spin" />
                    </div>
                  )}
                  <video
                    ref={videoRef}
                    playsInline muted autoPlay
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ opacity: isReady ? 1 : 0, transition: 'opacity 0.35s' }}
                  />
                </>
              ) : (
                /* No camera access – show placeholder */
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center"
                  style={{ background: '#111' }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.07)' }}
                  >
                    <span style={{ fontSize: '1.75rem' }}>📷</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Camera unavailable</p>
                    <p className="text-white/40 text-xs leading-relaxed">
                      Allow camera access or pick a photo from your gallery
                    </p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fileRef.current?.click()}
                    className="px-6 py-2.5 rounded-2xl text-white text-sm font-semibold"
                    style={{ background: '#f59e0b' }}
                  >
                    Choose from Gallery
                  </motion.button>
                </div>
              )}
            </>
          )}

          {/* Captured preview */}
          {capturedImage && !showSheet && (
            <>
              <img
                src={capturedImage}
                alt="Captured"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={retake}
                  className="px-5 py-2.5 rounded-full text-white text-sm font-semibold"
                  style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}
                >
                  Retake
                </motion.button>
              </div>
            </>
          )}

          {/* 1× zoom badge — top-right corner of viewfinder */}
          {!capturedImage && isReady && (
            <div className="absolute top-3 right-3">
              <div
                className="px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)' }}
              >
                <span className="text-white text-xs font-bold">1×</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom controls (on black, outside card) ─────────────────────────── */}
      {!capturedImage && (
        <div className="flex-shrink-0 px-8 pt-2 pb-6" style={{ background: '#000' }}>

          {/* Main controls row */}
          <div className="flex items-center justify-between">

            {/* Gallery thumbnail */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => fileRef.current?.click()}
              className="overflow-hidden flex-shrink-0"
              style={{
                width: 56, height: 56,
                borderRadius: 14,
                background: '#1c1c1c',
                border: '1.5px solid rgba(255,255,255,0.08)',
              }}
            >
              {lastPhoto ? (
                <img src={lastPhoto} alt="Last" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span style={{ fontSize: '1.4rem' }}>🖼️</span>
                </div>
              )}
            </motion.button>

            {/* ── Shutter button (large white disc + amber ring) ── */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={!camError ? capture : () => fileRef.current?.click()}
              className="relative flex items-center justify-center"
              style={{ width: 84, height: 84 }}
            >
              {/* Amber outer ring */}
              <div
                className="absolute inset-0 rounded-full"
                style={{ border: '4px solid #f59e0b' }}
              />
              {/* White inner disc */}
              <div
                className="rounded-full"
                style={{
                  width: 66, height: 66,
                  background: 'white',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
                }}
              />
            </motion.button>

            {/* Flip camera */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              animate={{}}
              onClick={() => setFacing(f => f === 'environment' ? 'user' : 'environment')}
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: 56, height: 56,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
              }}
            >
              <RefreshCcw style={{ width: 22, height: 22 }} className="text-white" />
            </motion.button>
          </div>

          {/* History row */}
          <div className="flex justify-center mt-5">
            <button className="flex items-center gap-2">
              {photoTransactions.length > 0 && (
                <span
                  className="flex items-center justify-center text-white text-xs font-bold rounded-lg"
                  style={{
                    minWidth: 26, height: 26,
                    background: '#f59e0b',
                    padding: '0 6px',
                  }}
                >
                  {photoTransactions.length}
                </span>
              )}
              <span className="text-white font-semibold text-sm">History</span>
              <ChevronDown className="w-4 h-4 text-white/50" />
            </button>
          </div>
        </div>
      )}

      {/* Hidden helpers */}
      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {/* ── Photo expense sheet ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSheet && capturedImage && (
          <PhotoExpenseSheet
            imageDataUrl={capturedImage}
            onClose={onClose}
            onRetake={retake}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}