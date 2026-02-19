import { Link } from 'react-router-dom';
import heroSketch from '../assets/hero-sketch.png';
import { FileClusterIllustration, EmbeddingIllustration, QueryIllustration } from '../components/landing/SketchIllustration';
import '../styles/landing.css';

const steps = [
    {
        number: "01",
        title: "Drop your files",
        description: "Add any documents—PDFs, notes, reports. The system extracts and reads every word.",
        illustration: <QueryIllustration />,
    },
    {
        number: "02",
        title: "Meaning is mapped",
        description: "Each file is chunked, embedded into vectors, and clustered with semantically similar documents—automatically.",
        illustration: <EmbeddingIllustration />,
    },
    {
        number: "03",
        title: "Ask in plain English",
        description: "Query your entire library with natural language. Get precise answers drawn from the right files.",
        illustration: <FileClusterIllustration />,
    },
];

const features = [
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" strokeLinecap="round" />
            </svg>
        ),
        title: "Semantic Clustering",
        description: "Files group themselves by meaning, not by name or folder. Related ideas find each other.",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
        ),
        title: "Natural Language Search",
        description: "Ask questions the way you think them. The AI retrieves relevant context across all your files.",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "Instant Processing",
        description: "Text extraction, chunking, and embedding happen the moment a file is added. Always up to date.",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2a10 10 0 110 20A10 10 0 0112 2z" />
                <path d="M12 6v6l4 2" strokeLinecap="round" />
            </svg>
        ),
        title: "Zero Manual Sorting",
        description: "No folders to create, no tags to assign. Organization emerges from the content itself.",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        ),
        title: "React Interface",
        description: "A clean, fast UI for browsing clusters, exploring relationships, and querying your library.",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
        title: "Private by Design",
        description: "Your files and embeddings stay yours. No third-party indexing, no data leaving your system.",
    },
];

/* ── Scattered decoration components ───────────────────────────────────── */

const NodeGraph = ({ className = "" }) => (
    <svg viewBox="0 0 120 80" fill="none" className={`absolute pointer-events-none ${className}`} aria-hidden="true">
        <circle cx="20" cy="40" r="5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="60" cy="15" r="5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="60" cy="65" r="5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="100" cy="40" r="5" stroke="currentColor" strokeWidth="1.5" />
        <line x1="25" y1="40" x2="55" y2="17" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
        <line x1="25" y1="40" x2="55" y2="63" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
        <line x1="65" y1="15" x2="95" y2="38" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
        <line x1="65" y1="65" x2="95" y2="42" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
        <line x1="65" y1="15" x2="65" y2="60" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.3" />
    </svg>
);

const Annotation = ({ text, className = "" }) => (
    <div className={`absolute pointer-events-none flex items-center gap-1.5 ${className}`} aria-hidden="true">
        <svg viewBox="0 0 14 24" fill="none" className="w-3 h-5 shrink-0" stroke="currentColor" strokeWidth="1.5" opacity="0.35">
            <path d="M10 2 Q2 2 2 12 Q2 22 10 22" strokeLinecap="round" />
        </svg>
        <span className="text-[10px] font-medium tracking-wide whitespace-nowrap opacity-60" style={{ color: 'hsl(220 9% 46%)' }}>{text}</span>
    </div>
);

const DotField = ({ className = "" }) => (
    <svg viewBox="0 0 200 120" fill="none" className={`absolute pointer-events-none ${className}`} aria-hidden="true">
        {[
            [20, 20], [55, 10], [90, 35], [130, 15], [170, 25],
            [10, 60], [40, 75], [80, 55], [115, 70], [150, 50], [185, 65],
            [25, 100], [65, 90], [105, 105], [145, 95], [180, 100],
        ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="2" fill="currentColor" opacity={0.12 + (i % 4) * 0.06} />
        ))}
        <line x1="20" y1="20" x2="55" y2="10" stroke="currentColor" strokeWidth="0.7" opacity="0.12" />
        <line x1="55" y1="10" x2="90" y2="35" stroke="currentColor" strokeWidth="0.7" opacity="0.12" />
        <line x1="90" y1="35" x2="80" y2="55" stroke="currentColor" strokeWidth="0.7" opacity="0.12" />
        <line x1="115" y1="70" x2="150" y2="50" stroke="currentColor" strokeWidth="0.7" opacity="0.12" />
    </svg>
);

const LooseCircle = ({ className = "" }) => (
    <svg viewBox="0 0 100 100" fill="none" className={`absolute pointer-events-none ${className}`} aria-hidden="true">
        <path d="M50 8 C78 6 94 26 93 50 C92 74 74 94 50 93 C26 92 6 74 7 50 C8 26 26 6 50 8 Z"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.12" />
    </svg>
);

const Brace = ({ className = "" }) => (
    <svg viewBox="0 0 30 120" fill="none" className={`absolute pointer-events-none ${className}`} aria-hidden="true">
        <path d="M22 4 Q6 4 6 20 L6 52 Q6 60 2 60 Q6 60 6 68 L6 100 Q6 116 22 116"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
    </svg>
);

const ArrowLabel = ({ label, className = "" }) => (
    <div className={`absolute pointer-events-none flex flex-col items-center gap-1 ${className}`} aria-hidden="true">
        <span className="text-[9px] uppercase tracking-widest opacity-50 font-semibold" style={{ color: 'hsl(220 9% 46%)' }}>{label}</span>
        <svg viewBox="0 0 20 30" fill="none" className="w-4 h-6" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
            <path d="M10 2 Q10 20 10 24" strokeLinecap="round" />
            <path d="M6 20 L10 26 L14 20" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </div>
);

const VectorAxes = ({ className = "" }) => (
    <svg viewBox="0 0 90 70" fill="none" className={`absolute pointer-events-none ${className}`} aria-hidden="true">
        <line x1="15" y1="55" x2="75" y2="55" stroke="currentColor" strokeWidth="1" opacity="0.2" strokeLinecap="round" />
        <line x1="15" y1="55" x2="15" y2="10" stroke="currentColor" strokeWidth="1" opacity="0.2" strokeLinecap="round" />
        <line x1="15" y1="55" x2="45" y2="35" stroke="currentColor" strokeWidth="1" opacity="0.15" strokeLinecap="round" strokeDasharray="3 2" />
        <circle cx="55" cy="30" r="3" fill="currentColor" opacity="0.2" />
        <circle cx="40" cy="45" r="2.5" fill="currentColor" opacity="0.15" />
        <circle cx="65" cy="42" r="2" fill="currentColor" opacity="0.18" />
        <circle cx="30" cy="25" r="3.5" fill="currentColor" opacity="0.12" />
        <circle cx="50" cy="20" r="2" fill="currentColor" opacity="0.22" />
    </svg>
);

/* ── Main Landing Page ─────────────────────────────────────────────────── */

export default function LandingPage() {
    return (
        <div className="landing-page min-h-screen overflow-x-hidden">
            {/* Nav */}
            <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, backdropFilter: 'blur(8px)', borderBottom: '1px solid hsl(220 13% 91%)', backgroundColor: 'hsl(0 0% 100% / 0.9)' }}>
                <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
                            <path d="M4 4h5l2 2h5v10H4V4z" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="10" cy="11" r="2" />
                            <path d="M8 13.5 L5 17M12 13.5 L15 17" strokeLinecap="round" opacity="0.5" />
                        </svg>
                        <span className="font-display font-semibold tracking-tight text-sm">FileMind</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: 'hsl(220 9% 46%)' }}>
                        <a href="#how-it-works" className="hover:opacity-80 transition-opacity">How it works</a>
                        <a href="#features" className="hover:opacity-80 transition-opacity">Features</a>
                    </div>
                    <Link
                        to="/dashboard"
                        className="text-sm px-4 py-1.5 rounded font-medium transition-opacity hover:opacity-80"
                        style={{
                            border: '1px solid hsl(220 15% 10%)',
                            backgroundColor: 'hsl(220 15% 10%)',
                            color: 'hsl(0 0% 100%)',
                        }}
                    >
                        Get early access
                    </Link>
                </div>
            </nav>

            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <section className="relative pt-32 pb-20 px-6 max-w-5xl mx-auto">
                <DotField className="top-8 right-0 w-64 h-40 opacity-80" />
                <LooseCircle className="w-48 h-48 -top-4 -left-16 opacity-60" style={{ color: 'hsl(42 90% 60%)' }} />
                <NodeGraph className="w-32 h-20 bottom-10 left-0 opacity-60" />
                <VectorAxes className="w-28 h-20 bottom-24 right-8" />

                <Annotation text="vector space" className="top-36 right-4 md:right-52 hidden md:flex" />

                <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                    <div>
                        <div className="inline-flex items-center gap-2 text-xs border rounded-full px-3 py-1 mb-8" style={{ color: 'hsl(220 9% 46%)', borderColor: 'hsl(220 13% 91%)' }}>
                            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: 'hsl(142 72% 50%)' }}></span>
                            AI-powered · semantic · zero folders
                        </div>
                        <h1 className="font-display text-5xl md:text-6xl leading-tight mb-6">
                            Files that{" "}
                            <span className="sketch-underline italic">understand</span>{" "}
                            themselves.
                        </h1>
                        <p className="text-lg leading-relaxed mb-10 max-w-md" style={{ color: 'hsl(220 9% 46%)' }}>
                            Drop your documents and walk away. FileMind reads every word, maps
                            meaning into vectors, and clusters related files—automatically.
                            Then ask anything in plain English.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <a
                                id="get-started"
                                href="#how-it-works"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded text-sm font-semibold hover:opacity-85 transition-opacity"
                                style={{ backgroundColor: 'hsl(220 15% 10%)', color: 'white' }}
                            >
                                See how it works
                                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </a>
                            <a
                                href="#features"
                                className="inline-flex items-center gap-2 px-6 py-3 border rounded text-sm transition-colors hover:opacity-80"
                                style={{ borderColor: 'hsl(220 13% 91%)', color: 'hsl(220 9% 46%)' }}
                            >
                                Explore features
                            </a>
                        </div>
                    </div>

                    {/* Hero illustration */}
                    <div className="relative">
                        <ArrowLabel label="embeddings" className="-top-10 right-12 hidden md:flex" />
                        <div className="dash-border rounded-2xl p-4 relative" style={{ backgroundColor: 'hsl(0 0% 99%)' }}>
                            <img
                                src={heroSketch}
                                alt="Files clustering by semantic meaning"
                                className="w-full h-72 object-contain opacity-90"
                            />
                            <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                <span className="text-[9px] uppercase tracking-widest font-semibold opacity-50" style={{ color: 'hsl(220 9% 46%)' }}>semantic map</span>
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -left-4 rounded-lg px-3 py-2 shadow-sm text-xs" style={{ backgroundColor: 'hsl(0 0% 100%)', border: '1px solid hsl(220 13% 91%)', color: 'hsl(220 9% 46%)' }}>
                            <span className="font-semibold" style={{ color: 'hsl(220 15% 10%)' }}>6 clusters</span> · 142 files · 0 folders
                        </div>
                        <Brace className="w-6 h-20 -right-6 top-8 hidden lg:block" />
                    </div>
                </div>
            </section>

            {/* Wavy divider */}
            <div className="max-w-5xl mx-auto px-6 my-2">
                <svg viewBox="0 0 800 20" fill="none" className="w-full opacity-15">
                    <path d="M0 10 Q200 4 400 10 Q600 16 800 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </div>

            {/* ── How it works ──────────────────────────────────────────────── */}
            <section id="how-it-works" className="relative py-24 px-6 max-w-5xl mx-auto">
                <LooseCircle className="w-64 h-64 -right-20 top-20 opacity-40" style={{ color: 'hsl(42 90% 60%)' }} />
                <DotField className="w-56 h-36 left-0 bottom-12 opacity-60" />
                <NodeGraph className="w-40 h-28 right-8 bottom-32 opacity-50" />
                <Brace className="w-8 h-32 left-2 top-64 hidden lg:block" />

                <div className="mb-16 relative">
                    <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'hsl(220 9% 46%)' }}>Process</p>
                    <h2 className="font-display text-4xl">Three steps,<br />infinite clarity.</h2>
                    <Annotation text="auto-organized" className="-right-0 top-4 hidden lg:flex" />
                </div>

                <div className="space-y-20 relative z-10">
                    {steps.map((step, i) => (
                        <div key={i} className="relative">
                            {i < steps.length - 1 && (
                                <svg viewBox="0 0 20 60" fill="none" className="absolute -bottom-16 left-12 w-4 h-14 hidden md:block" aria-hidden="true">
                                    <path d="M10 2 Q10 30 10 56" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" strokeLinecap="round" opacity="0.25" />
                                    <path d="M6 52 L10 58 L14 52" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.25" />
                                </svg>
                            )}

                            <div className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "md:[&>:first-child]:order-2" : ""}`}>
                                <div className="relative">
                                    <span className="text-7xl font-display font-bold leading-none block mb-4" style={{ color: 'hsl(220 13% 91%)' }}>{step.number}</span>
                                    <h3 className="font-display text-2xl mb-3">{step.title}</h3>
                                    <p className="leading-relaxed" style={{ color: 'hsl(220 9% 46%)' }}>{step.description}</p>
                                    {i === 0 && <Annotation text="PDF · DOCX · TXT" className="-right-2 top-12 hidden lg:flex" />}
                                    {i === 1 && <Annotation text="1536-dim vector" className="-right-2 top-12 hidden lg:flex" />}
                                    {i === 2 && <Annotation text="cosine similarity" className="-right-2 top-12 hidden lg:flex" />}
                                </div>
                                <div className="dash-border rounded-xl p-6 h-44 flex items-center justify-center relative" style={{ backgroundColor: 'hsl(220 14% 96% / 0.4)', color: 'hsl(220 15% 10% / 0.6)' }}>
                                    {step.illustration}
                                    {i === 1 && <VectorAxes className="w-16 h-12 bottom-2 right-2" />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Features ──────────────────────────────────────────────────── */}
            <section id="features" className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: 'hsl(220 14% 96% / 0.4)' }}>
                <LooseCircle className="w-72 h-72 -top-10 -right-16 opacity-30" />
                <DotField className="w-72 h-40 left-0 bottom-0 opacity-40" />
                <NodeGraph className="w-44 h-28 right-4 bottom-24 opacity-30" />
                <svg viewBox="0 0 30 300" fill="none" className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-56 pointer-events-none hidden lg:block" aria-hidden="true">
                    <path d="M22 4 Q6 4 6 50 L6 140 Q6 150 2 150 Q6 150 6 160 L6 250 Q6 296 22 296"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.12" />
                </svg>

                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="mb-16 relative">
                        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'hsl(220 9% 46%)' }}>Features</p>
                        <h2 className="font-display text-4xl max-w-xs">Built for how knowledge actually works.</h2>
                        <VectorAxes className="w-24 h-16 top-0 right-0 hidden md:block" />
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="relative rounded-xl p-6 transition-colors group" style={{ backgroundColor: 'hsl(0 0% 100%)', border: '1px solid hsl(220 13% 91%)' }}>
                                <div className="w-10 h-10 flex items-center justify-center ink-border rounded-lg mb-4 transition-colors">
                                    {f.icon}
                                </div>
                                <h4 className="font-display text-base font-semibold mb-2">{f.title}</h4>
                                <p className="text-sm leading-relaxed" style={{ color: 'hsl(220 9% 46%)' }}>{f.description}</p>
                                {i % 3 === 0 && (
                                    <svg viewBox="0 0 40 30" fill="none" className="absolute bottom-3 right-3 w-8 h-6 opacity-10" aria-hidden="true">
                                        <circle cx="8" cy="15" r="3" fill="currentColor" />
                                        <circle cx="22" cy="8" r="3" fill="currentColor" />
                                        <circle cx="34" cy="20" r="3" fill="currentColor" />
                                        <line x1="11" y1="14" x2="19" y2="9" stroke="currentColor" strokeWidth="1" />
                                        <line x1="25" y1="10" x2="31" y2="18" stroke="currentColor" strokeWidth="1" />
                                    </svg>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ───────────────────────────────────────────────────────── */}
            <section className="relative py-32 px-6 overflow-hidden">
                <LooseCircle className="w-56 h-56 -left-16 top-8 opacity-50" style={{ color: 'hsl(42 90% 60%)' }} />
                <LooseCircle className="w-40 h-40 -right-10 bottom-12 opacity-30" />
                <DotField className="w-64 h-32 left-0 bottom-0 opacity-50" />
                <DotField className="w-64 h-32 right-0 top-8 opacity-50" />
                <NodeGraph className="w-36 h-24 left-8 top-24 opacity-40" />
                <NodeGraph className="w-36 h-24 right-8 bottom-20 opacity-40" />
                <Annotation text="no spam, promise" className="right-1/4 bottom-24 hidden md:flex" />

                <div className="max-w-2xl mx-auto text-center relative z-10">
                    <svg viewBox="0 0 200 60" fill="none" className="w-32 mx-auto mb-8 opacity-20">
                        <path d="M10 30 Q50 10 100 30 Q150 50 190 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="100" cy="30" r="3" fill="currentColor" />
                    </svg>
                    <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight">
                        Stop filing.<br />Start{" "}
                        <span className="sketch-underline italic">finding.</span>
                    </h2>
                    <p className="leading-relaxed mb-10 max-w-md mx-auto" style={{ color: 'hsl(220 9% 46%)' }}>
                        FileMind is in active development. Get early access and experience the future of semantic file organization.
                    </p>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded text-sm font-semibold hover:opacity-85 transition-opacity"
                        style={{ backgroundColor: 'hsl(220 15% 10%)', color: 'white' }}
                    >
                        Get Early Access
                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5">
                            <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                    <p className="text-xs mt-4" style={{ color: 'hsl(220 9% 46%)' }}>Free during the development phase.</p>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid hsl(220 13% 91%)' }} className="py-8 px-6">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs" style={{ color: 'hsl(220 9% 46%)' }}>
                    <div className="flex items-center gap-2">
                        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5">
                            <path d="M4 4h5l2 2h5v10H4V4z" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="10" cy="11" r="2" />
                        </svg>
                        FileMind · AI-powered semantic file system
                    </div>
                    <span>Built with embeddings, clustering & React</span>
                </div>
            </footer>
        </div>
    );
}
