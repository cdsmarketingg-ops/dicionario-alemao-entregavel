/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Copyright, Music, Printer } from 'lucide-react';

// Types
type Note = string;
type ChordType = {
  name: string;
  suffix: string;
  intervals: number[]; // semitones from root
};

const NOTES: Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTE_LABELS: Record<string, string> = {
  'C': 'C', 'C#': 'C#', 'D': 'D', 'D#': 'D#', 'E': 'E', 'F': 'F', 'F#': 'F#', 'G': 'G', 'G#': 'G#', 'A': 'A', 'A#': 'A#', 'B': 'B'
};

const CHORD_TYPES: ChordType[] = [
  { name: 'Dur', suffix: '', intervals: [0, 4, 7] },
  { name: 'Moll', suffix: 'm', intervals: [0, 3, 7] },
  { name: 'Dominantseptakkord', suffix: '7', intervals: [0, 4, 7, 10] },
  { name: 'Großer Septakkord', suffix: 'Maj7', intervals: [0, 4, 7, 11] },
  { name: 'Kleiner Septakkord', suffix: 'm7', intervals: [0, 3, 7, 10] },
  { name: 'Sextakkord', suffix: '6', intervals: [0, 4, 7, 9] },
  { name: 'Moll-Sextakkord', suffix: 'm6', intervals: [0, 3, 7, 9] },
  { name: 'Dominantnonenakkord', suffix: '9', intervals: [0, 4, 7, 10, 14] },
  { name: 'Großer Nonenakkord', suffix: 'Maj9', intervals: [0, 4, 7, 11, 14] },
  { name: 'Kleiner Nonenakkord', suffix: 'm9', intervals: [0, 3, 7, 10, 14] },
  { name: 'Add9-Akkord', suffix: 'add9', intervals: [0, 4, 7, 14] },
  { name: 'Sus4-Akkord', suffix: 'sus4', intervals: [0, 5, 7] },
  { name: 'Sus2-Akkord', suffix: 'sus2', intervals: [0, 2, 7] },
  { name: 'Übermäßiger Akkord', suffix: 'aug', intervals: [0, 4, 8] },
  { name: 'Verminderter Akkord', suffix: 'dim', intervals: [0, 3, 6] },
  { name: 'Verminderter Septakkord', suffix: 'dim7', intervals: [0, 3, 6, 9] },
  { name: 'Halbverminderter Septakkord', suffix: 'm7b5', intervals: [0, 3, 6, 10] },
  { name: 'Moll-Akkord mit großer Septime', suffix: 'm(Maj7)', intervals: [0, 3, 7, 11] },
  { name: 'Septakkord mit verminderter Quinte', suffix: '7b5', intervals: [0, 4, 6, 10] },
  { name: 'Septakkord mit übermäßiger Quinte', suffix: '7#5', intervals: [0, 4, 8, 10] },
  { name: 'Septakkord mit kleiner None', suffix: '7b9', intervals: [0, 4, 7, 10, 13] },
  { name: 'Septakkord mit übermäßiger None', suffix: '7#9', intervals: [0, 4, 7, 10, 15] },
  { name: '7sus4-Akkord', suffix: '7sus4', intervals: [0, 5, 7, 10] },
  { name: '9sus4-Akkord', suffix: '9sus4', intervals: [0, 5, 7, 10, 14] },
  { name: 'Undezimenakkord', suffix: '11', intervals: [0, 4, 7, 10, 14, 17] },
  { name: 'Tredezimenakkord', suffix: '13', intervals: [0, 4, 7, 10, 14, 17, 21] },
];

// Components
const PianoBoard: React.FC<{ rootIndex: number; intervals: number[] }> = ({ rootIndex, intervals }) => {
  // Render 2.5 octaves to handle extensions like 9ths and 13ths properly
  const keys = [];
  const maxInterval = Math.max(...intervals);
  const numKeys = Math.max(24, rootIndex + maxInterval + 2); // Ensure we show all notes

  for (let i = 0; i < numKeys; i++) {
    const noteIndex = i % 12;
    const isBlack = [1, 3, 6, 8, 10].includes(noteIndex);
    const chordKeys = intervals.map(interval => rootIndex + interval);
    const isChordKey = chordKeys.includes(i);

    keys.push({
      index: i,
      isBlack,
      isActive: isChordKey,
      isRoot: i === rootIndex
    });
  }

  const whiteKeys = keys.filter(k => !k.isBlack);
  const totalWhiteKeys = whiteKeys.length;

  return (
    <div className="relative flex h-24 w-full border-t border-l border-gray-300 bg-white select-none">
      {whiteKeys.map((key, idx) => (
        <div
          key={`white-${idx}`}
          className={`relative flex-1 border-r border-b border-gray-300 h-full ${
            key.isActive ? (key.isRoot ? 'bg-emerald-400' : 'bg-emerald-200') : 'bg-white'
          }`}
        >
          {key.isRoot && <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-700" />}
        </div>
      ))}
      <div className="absolute top-0 left-0 w-full h-14 pointer-events-none flex">
        {keys.map((key, idx) => {
          if (!key.isBlack) return null;
          
          // Calculate position for black keys based on white keys before them
          const whiteKeyIndexBefore = keys.slice(0, idx).filter(k => !k.isBlack).length;
          const leftOffset = (whiteKeyIndexBefore / totalWhiteKeys) * 100;
          
          return (
            <div
              key={`black-${idx}`}
              className={`absolute h-full w-[3%] -ml-[1.5%] border border-gray-800 z-10 ${
                key.isActive ? (key.isRoot ? 'bg-emerald-500' : 'bg-emerald-300') : 'bg-black'
              }`}
              style={{ left: `${leftOffset}%` }}
            >
               {key.isRoot && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ChordCard: React.FC<{ root: string; rootIndex: number; type: ChordType }> = ({ root, rootIndex, type }) => {
  return (
    <div className="flex flex-row border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm print:shadow-none print:border-gray-300 h-32">
      <div className="bg-gray-50 w-48 px-4 flex flex-col justify-center border-r border-gray-200 print:bg-white">
        <span className="font-black text-3xl text-gray-900 leading-none">{root}{type.suffix}</span>
        <span className="text-xs uppercase tracking-widest text-gray-500 font-bold mt-1">{type.name}</span>
      </div>
      <div className="flex-1 p-4 flex items-center">
        <PianoBoard rootIndex={rootIndex} intervals={type.intervals} />
      </div>
    </div>
  );
};

const CoverPage = () => (
  <div className="flex flex-col items-center justify-center min-h-[297mm] bg-white p-12 text-center border-b-8 border-emerald-600 print:border-none">
    <div className="mb-8 p-8 rounded-full bg-emerald-50 text-emerald-600">
      <Music size={100} strokeWidth={1.5} />
    </div>
    <h1 className="text-7xl font-black tracking-tighter text-gray-900 mb-4 uppercase">
      Vollständiges Akkord-Wörterbuch
    </h1>
    <h2 className="text-3xl font-light text-gray-600 mb-16 tracking-widest uppercase">
      Der ultimative Leitfaden für Keyboard und Klavier
    </h2>
    
    <div className="max-w-2xl mx-auto space-y-8 text-gray-500 mb-24">
      <p className="text-xl leading-relaxed">
        Ein umfassendes Nachschlagewerk mit 26 Akkordvariationen in allen 12 Tonarten, insgesamt 312 detaillierte Diagramme.
      </p>
      <div className="h-1.5 w-32 bg-emerald-200 mx-auto rounded-full" />
    </div>

    <div className="mt-auto pt-12 border-t border-gray-100 w-full max-w-2xl">
      <div className="flex flex-col items-center justify-center gap-2 text-gray-400 mb-2">
        <div className="flex items-center gap-2">
          <Copyright size={20} />
          <span className="text-lg font-medium">2026 - Eliab Campos Teclas</span>
        </div>
        <span className="text-sm">Alle Rechte vorbehalten</span>
      </div>
      <p className="text-sm text-gray-400 max-w-lg mx-auto mt-4">
        Dieses Material ist für den persönlichen und pädagogischen Gebrauch bestimmt. Kommerzielle Vervielfältigung oder unbefugte Weitergabe ist gesetzlich verboten.
      </p>
    </div>
  </div>
);

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="col-span-full mb-8 mt-16 first:mt-0 border-b-4 border-emerald-500 pb-3">
    <h3 className="text-5xl font-black text-gray-900 flex items-center gap-4">
      <span className="bg-emerald-500 text-white w-14 h-14 rounded-xl flex items-center justify-center text-3xl">
        {title}
      </span>
      {title}-Akkorde
    </h3>
  </div>
);

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 print:bg-white font-sans text-gray-900">
      {/* Print Instructions - Hidden in Print */}
      <div className="fixed top-6 right-6 z-50 print:hidden">
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full shadow-2xl transition-all active:scale-95 font-black text-lg"
        >
          <Printer size={24} />
          Vollständiges PDF generieren
        </button>
      </div>

      <div className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none">
        {/* Cover Page */}
        <div className="print:break-after-page">
          <CoverPage />
        </div>

        {/* Dictionary Content */}
        <div className="p-8 md:p-12">
          {NOTES.map((note, noteIdx) => (
            <div key={note} className="flex flex-col gap-4 mb-20 print:break-inside-avoid-page">
              <SectionHeader title={NOTE_LABELS[note]} />
              <div className="flex flex-col gap-4">
                {CHORD_TYPES.map((type) => (
                  <div key={`${note}-${type.suffix}`} className="print:break-inside-avoid">
                    <ChordCard 
                      root={NOTE_LABELS[note]} 
                      rootIndex={noteIdx} 
                      type={type} 
                    />
                  </div>
                ))}
              </div>
              {/* Page break after each key for better organization */}
              <div className="print:break-after-page h-0" />
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            background: white;
          }
          .print\\:break-after-page {
            break-after: page;
          }
          .print\\:break-inside-avoid {
            break-inside: avoid;
          }
        }
      `}} />
    </div>
  );
}
