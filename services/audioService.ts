
// A simple service to generate sounds using the Web Audio API.

let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
    // The AudioContext must be created after a user gesture on the page.
    // We will initialize it on the first sound playback.
    if (typeof window === 'undefined') return null;
    if (!audioCtx) {
        try {
            audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            console.error("Web Audio API is not supported in this browser.");
            return null;
        }
    }
    return audioCtx;
};

const playNote = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    const ctx = getAudioContext();
    if (!ctx) return;

    // The user must interact with the document before an AudioContext can be resumed.
    if (ctx.state === 'suspended') {
        ctx.resume();
    }
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
};

export const playClickSound = () => {
    playNote(440, 0.1, 'triangle');
};

export const playBlockExecuteSound = () => {
    playNote(261.63, 0.1, 'square');
};

export const playSuccessSound = () => {
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((note, i) => {
        setTimeout(() => {
            playNote(note, 0.15, 'sine');
        }, i * 100);
    });
};

export const playFailureSound = () => {
    playNote(150, 0.4, 'sawtooth');
};

export const playClearSound = () => {
    playNote(220, 0.15, 'square');
};
