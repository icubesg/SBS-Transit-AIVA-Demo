import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Mic, MapPin, Map, TrainFront, Ticket, Bus, Menu, Home, Wifi, Bell, Share2, Bookmark, ShoppingBag, Repeat, Mail, MessageCircle, Search, ChevronLeft, ChevronRight, ChevronDown, RefreshCw, Bike, Accessibility, Locate, ArrowLeft, Star, ExternalLink, Lock, MoreVertical, ZoomIn, Navigation, Clock, ShieldAlert, RotateCw, Footprints, ArrowRightLeft, Maximize2, SlidersHorizontal, Car, Circle, BatteryFull, SignalHigh, Pause, Play, Square, Info, GitFork, HelpCircle } from 'lucide-react';

// ---- Color scheme (matches the quick-links reference) ----
const PURPLE = '#6F2482';
const PURPLE_DARK = '#4E1A5C';
const GRADIENT = '#871785';
const PAGE_GRADIENT = 'linear-gradient(135deg, #EDE3F6 0%, #FBFAFD 55%, #FFFFFF 100%)';
const USER_BUBBLE = '#3B3B3B';
// Journey Planner accent colours (matches the supplied Journey Planner screenshot)
const JP_ORANGE = '#F1832E';
const JP_ORANGE_DARK = '#E36F1E';
const JP_PEACH = 'rgba(255,255,255,0.28)';
const JP_PEACH_TEXT = 'rgba(255,255,255,0.85)';
const LINE_NS = '#E1251B';
const LINE_EW = '#009645';

// ---- Phone status bar (time, signal, wifi, battery) ----
function StatusBarRow({ dark = false }) {
  const color = dark ? '#111114' : '#fff';
  return (
    <div className="flex items-center justify-between px-5 pt-1.5 pb-1 shrink-0">
      <span className="text-[13px] font-semibold" style={{ color }}>9:41</span>
      <div className="flex items-center gap-1.5">
        <SignalHigh size={13} color={color} />
        <Wifi size={13} color={color} />
        <BatteryFull size={16} color={color} />
      </div>
    </div>
  );
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// ---- Schematic wayfinding diagrams (illustrative, not to scale) ----
function PlatformLevelMap() {
  return (
    <svg viewBox="0 0 320 168" width="100%" height="150" role="img" aria-label="Platform level map">
      <rect x="0" y="0" width="320" height="168" fill="#FAFAFC" />
      <rect x="20" y="24" width="130" height="40" rx="6" fill="#EDE3F1" stroke={PURPLE} strokeWidth="1" />
      <text x="85" y="48" fontSize="11" textAnchor="middle" fill={PURPLE_DARK} fontWeight="600">Platform A</text>
      <rect x="170" y="24" width="130" height="40" rx="6" fill="#EDE3F1" stroke={PURPLE} strokeWidth="1" />
      <text x="235" y="48" fontSize="11" textAnchor="middle" fill={PURPLE_DARK} fontWeight="600">Platform B</text>
      <line x1="20" y1="84" x2="300" y2="84" stroke="#B9B9C2" strokeWidth="3" strokeDasharray="6 5" />
      <rect x="130" y="76" width="34" height="16" rx="3" fill="#9AA0A6" />
      <text x="147" y="88" fontSize="8" textAnchor="middle" fill="#fff">train</text>
      <circle cx="60" cy="120" r="14" fill="#fff" stroke={PURPLE} strokeWidth="1.5" />
      <TrainFront x="52" y="112" width="16" height="16" color={PURPLE} />
      <text x="60" y="146" fontSize="8" textAnchor="middle" fill="#555">Escalator up</text>
      <circle cx="260" cy="120" r="14" fill="#fff" stroke={PURPLE} strokeWidth="1.5" />
      <text x="260" y="124" fontSize="9" textAnchor="middle" fill={PURPLE} fontWeight="700">Lift</text>
      <text x="260" y="146" fontSize="8" textAnchor="middle" fill="#555">To Concourse</text>
      <g>
        <circle cx="20" cy="12" r="4" fill="#E14848" />
        <text x="28" y="15" fontSize="7" fill="#E14848">You are here</text>
      </g>
    </svg>
  );
}

function ConcourseLevelMap() {
  return (
    <svg viewBox="0 0 320 168" width="100%" height="150" role="img" aria-label="Concourse level map">
      <rect x="0" y="0" width="320" height="168" fill="#FAFAFC" />
      <rect x="110" y="18" width="100" height="26" rx="4" fill="#EDE3F1" stroke={PURPLE} strokeWidth="1" />
      <text x="160" y="35" fontSize="10" textAnchor="middle" fill={PURPLE_DARK} fontWeight="600">Fare Gates</text>
      <rect x="20" y="60" width="70" height="34" rx="4" fill="#fff" stroke="#C9C9D2" />
      <text x="55" y="80" fontSize="9" textAnchor="middle" fill="#555">Ticket Office</text>
      <rect x="230" y="60" width="70" height="34" rx="4" fill="#fff" stroke="#C9C9D2" />
      <text x="265" y="80" fontSize="9" textAnchor="middle" fill="#555">Shops</text>
      <circle cx="55" cy="130" r="14" fill="#fff" stroke={PURPLE} strokeWidth="1.5" />
      <text x="55" y="134" fontSize="8" textAnchor="middle" fill={PURPLE} fontWeight="700">Exit A</text>
      <circle cx="160" cy="130" r="14" fill="#fff" stroke={PURPLE} strokeWidth="1.5" />
      <text x="160" y="134" fontSize="8" textAnchor="middle" fill={PURPLE} fontWeight="700">Exit B</text>
      <circle cx="265" cy="130" r="14" fill="#fff" stroke={PURPLE} strokeWidth="1.5" />
      <text x="265" y="134" fontSize="8" textAnchor="middle" fill={PURPLE} fontWeight="700">Exit C</text>
      <line x1="160" y1="44" x2="160" y2="60" stroke="#B9B9C2" strokeWidth="2" />
      <text x="160" y="105" fontSize="8" textAnchor="middle" fill="#555">↓ To Platforms</text>
      <g>
        <circle cx="12" cy="12" r="4" fill="#E14848" />
        <text x="20" y="15" fontSize="7" fill="#E14848">You are here</text>
      </g>
    </svg>
  );
}

function UpperConcourseLevelMap() {
  return (
    <svg viewBox="0 0 320 168" width="100%" height="150" role="img" aria-label="Upper concourse level map">
      <rect x="0" y="0" width="320" height="168" fill="#FAFAFC" />
      <rect x="30" y="20" width="260" height="30" rx="4" fill="#EDE3F1" stroke={PURPLE} strokeWidth="1" />
      <text x="160" y="39" fontSize="10" textAnchor="middle" fill={PURPLE_DARK} fontWeight="600">Bus Interchange Linkway</text>
      <rect x="30" y="66" width="90" height="30" rx="4" fill="#fff" stroke="#C9C9D2" />
      <text x="75" y="85" fontSize="9" textAnchor="middle" fill="#555">Sheltered Link</text>
      <rect x="200" y="66" width="90" height="30" rx="4" fill="#fff" stroke="#C9C9D2" />
      <text x="245" y="85" fontSize="9" textAnchor="middle" fill="#555">Taxi Stand</text>
      <circle cx="75" cy="130" r="14" fill="#fff" stroke={PURPLE} strokeWidth="1.5" />
      <text x="75" y="134" fontSize="8" textAnchor="middle" fill={PURPLE} fontWeight="700">Exit D</text>
      <circle cx="245" cy="130" r="14" fill="#fff" stroke={PURPLE} strokeWidth="1.5" />
      <text x="245" y="134" fontSize="8" textAnchor="middle" fill={PURPLE} fontWeight="700">Exit E</text>
      <circle cx="160" cy="130" r="14" fill="#fff" stroke={PURPLE} strokeWidth="1.5" />
      <Bus x="152" y="122" width="16" height="16" color={PURPLE} />
      <text x="160" y="150" fontSize="8" textAnchor="middle" fill="#555">To Bus Bays</text>
      <g>
        <circle cx="12" cy="12" r="4" fill="#E14848" />
        <text x="20" y="15" fontSize="7" fill="#E14848">You are here</text>
      </g>
    </svg>
  );
}

function AmkBusInterchangeMap() {
  return (
    <svg viewBox="0 0 320 168" width="100%" height="150" role="img" aria-label="Ang Mo Kio Bus Interchange map">
      <rect x="0" y="0" width="320" height="168" fill="#FAFAFC" />
      <rect x="20" y="18" width="280" height="26" rx="4" fill="#EDE3F1" stroke={PURPLE} strokeWidth="1" />
      <text x="160" y="35" fontSize="10" textAnchor="middle" fill={PURPLE_DARK} fontWeight="600">Concourse &amp; Ticketing</text>
      <rect x="20" y="58" width="60" height="28" rx="4" fill="#fff" stroke="#C9C9D2" />
      <text x="50" y="76" fontSize="8" textAnchor="middle" fill="#555">Berth A</text>
      <rect x="90" y="58" width="60" height="28" rx="4" fill="#fff" stroke="#C9C9D2" />
      <text x="120" y="76" fontSize="8" textAnchor="middle" fill="#555">Berth B</text>
      <rect x="170" y="58" width="60" height="28" rx="4" fill="#fff" stroke="#C9C9D2" />
      <text x="200" y="76" fontSize="8" textAnchor="middle" fill="#555">Berth C</text>
      <rect x="240" y="58" width="60" height="28" rx="4" fill="#fff" stroke="#C9C9D2" />
      <text x="270" y="76" fontSize="8" textAnchor="middle" fill="#555">Berth D</text>
      <line x1="20" y1="98" x2="300" y2="98" stroke="#B9B9C2" strokeWidth="2" strokeDasharray="6 5" />
      <text x="160" y="112" fontSize="8" textAnchor="middle" fill="#555">Sheltered walkway to Ang Mo Kio MRT</text>
      <circle cx="55" cy="140" r="14" fill="#fff" stroke={PURPLE} strokeWidth="1.5" />
      <text x="55" y="144" fontSize="8" textAnchor="middle" fill={PURPLE} fontWeight="700">Exit 1</text>
      <circle cx="160" cy="140" r="14" fill="#fff" stroke={PURPLE} strokeWidth="1.5" />
      <Bus x="152" y="132" width="16" height="16" color={PURPLE} />
      <circle cx="265" cy="140" r="14" fill="#fff" stroke={PURPLE} strokeWidth="1.5" />
      <text x="265" y="144" fontSize="8" textAnchor="middle" fill={PURPLE} fontWeight="700">Exit 2</text>
      <g>
        <circle cx="12" cy="12" r="4" fill="#E14848" />
        <text x="20" y="15" fontSize="7" fill="#E14848">You are here</text>
      </g>
    </svg>
  );
}

const LEVEL_INFO = {
  'Platform Level': { Map: PlatformLevelMap, Icon: TrainFront, note: 'Shows platform doors, escalators and the lift to Concourse Level.' },
  'Concourse Level': { Map: ConcourseLevelMap, Icon: Ticket, note: 'Shows fare gates, ticket office and Exits A–C.' },
  'Upper Concourse Level': { Map: UpperConcourseLevelMap, Icon: Bus, note: 'Shows the bus interchange linkway and Exits D–E.' },
  'Bus Interchange': { Map: AmkBusInterchangeMap, Icon: Bus, note: 'Shows bus berths A–D, the sheltered walkway to the MRT, and Exits 1–2.' },
};

let idCounter = 0;
const nextId = () => `m-${++idCounter}`;

// ---- Journey Planner (Screens 3.2 / 4.2) — matches supplied Journey Planner screenshot ----
const JOURNEY_ROUTES = [
  {
    duration: 77,
    timeRange: '13:22 - 14:40',
    boardNote: '1:28 pm from Opp Blk 419',
    legs: [{ t: 'walk' }, { t: 'bus', code: '804' }, { t: 'walk' }, { t: 'train', code: 'NS', color: LINE_NS }, { t: 'walk' }, { t: 'train', code: 'EW', color: LINE_EW }, { t: 'walk' }],
  },
  {
    duration: 79,
    timeRange: '13:22 - 14:41',
    boardNote: '1:31 pm from Opp Blk 419',
    legs: [{ t: 'walk' }, { t: 'bus', code: '804' }, { t: 'walk' }, { t: 'train', code: 'NS', color: LINE_NS }, { t: 'walk' }, { t: 'train', code: 'EW', color: LINE_EW }, { t: 'walk' }],
  },
  {
    duration: 80,
    timeRange: '13:22 - 14:43',
    boardNote: '1:25 pm from Blk 413',
    legs: [{ t: 'walk' }, { t: 'bus', code: '806' }, { t: 'walk' }, { t: 'train', code: 'NS', color: LINE_NS }, { t: 'walk' }, { t: 'train', code: 'EW', color: LINE_EW }, { t: 'walk' }],
  },
  {
    duration: 81,
    timeRange: '13:22 - 14:43',
    boardNote: '1:24 pm from Yishun',
    legs: [{ t: 'walk' }, { t: 'train', code: 'NS', color: LINE_NS }, { t: 'walk' }, { t: 'train', code: 'EW', color: LINE_EW }, { t: 'walk' }],
  },
  {
    duration: 81,
    timeRange: '13:22 - 14:44',
    boardNote: '1:23 pm from Opp Blk 430B',
    legs: [{ t: 'walk' }, { t: 'bus', code: '117' }, { t: 'walk' }, { t: 'train', code: 'NS', color: LINE_NS }, { t: 'walk' }, { t: 'train', code: 'EW', color: LINE_EW }, { t: 'walk' }],
  },
  {
    duration: 82,
    timeRange: '13:22 - 14:45',
    boardNote: '1:23 pm from Aft Yishun Ave 6',
    legs: [{ t: 'walk' }, { t: 'bus', code: '801' }, { t: 'walk' }, { t: 'train', code: 'NS', color: LINE_NS }, { t: 'walk' }, { t: 'train', code: 'EW', color: LINE_EW }, { t: 'walk' }],
  },
];

function formatDuration(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h} hour${h > 1 ? 's' : ''} ${m} mins` : `${m} mins`;
}

function RouteLegIcons({ legs }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      {legs.map((leg, i) => (
        <React.Fragment key={i}>
          {leg.t === 'walk' ? (
            <Footprints size={14} color="#3B3B3B" className="shrink-0" />
          ) : leg.t === 'bus' ? (
            <span className="flex items-center gap-0.5 shrink-0">
              <Bus size={14} color="#3B3B3B" />
              <span className="text-[9px] font-bold text-white rounded px-1 py-0.5" style={{ backgroundColor: '#1A1A1A' }}>{leg.code}</span>
            </span>
          ) : (
            <span className="flex items-center gap-0.5 shrink-0">
              <TrainFront size={14} color="#3B3B3B" />
              <span className="text-[9px] font-bold text-white rounded px-1 py-0.5" style={{ backgroundColor: leg.color }}>{leg.code}</span>
            </span>
          )}
          {i < legs.length - 1 && <ChevronRight size={10} color="#C9C9D2" className="shrink-0" />}
        </React.Fragment>
      ))}
    </div>
  );
}

function RouteRow({ route, fastest }) {
  return (
    <div className="flex items-stretch border-b border-gray-100">
      <div className="flex-1 py-3 pr-2 min-w-0">
        <RouteLegIcons legs={route.legs} />
        <p className="text-xs font-semibold text-gray-800 mt-1.5">{route.timeRange}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Footprints size={10} color={JP_ORANGE_DARK} />
          <p className="text-[10px]" style={{ color: JP_ORANGE_DARK }}>{route.boardNote}</p>
        </div>
      </div>
      <div className="w-16 flex flex-col items-center justify-center shrink-0" style={{ backgroundColor: fastest ? '#FCE0C8' : '#FCEEE1' }}>
        <p className="text-lg font-bold" style={{ color: JP_ORANGE_DARK }}>{route.duration}</p>
        <p className="text-[10px] font-medium" style={{ color: JP_ORANGE_DARK }}>min</p>
      </div>
    </div>
  );
}

function JourneyPlannerScreen({ origin, destination, onBack }) {
  const isCurrentLocation = origin === 'Current location';
  const [recommended, ...otherOptions] = JOURNEY_ROUTES;
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#FAFAFC' }}>
      {/* Header */}
      <div className="shrink-0" style={{ background: GRADIENT }}>
        <StatusBarRow />
        <div className="flex items-center gap-3 px-4 pb-3 pt-1">
          <button onClick={onBack} className="p-1 shrink-0" aria-label="Back to Ask AIVA">
            <ArrowLeft size={20} color="#fff" />
          </button>
          <p className="text-white text-lg font-bold flex-1 text-center pr-6">Journey Planner</p>
        </div>
      </div>

      {/* Origin / destination + mode selector */}
      <div className="px-4 pt-4 pb-3 shrink-0" style={{ background: `linear-gradient(180deg, ${JP_ORANGE} 0%, ${JP_ORANGE_DARK} 100%)` }}>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center py-1" style={{ gap: 2 }}>
            <Circle size={9} color="#fff" strokeWidth={2.5} />
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className="w-0.5 h-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.6)' }} />
            ))}
            <MapPin size={14} color="#fff" fill="#fff" />
          </div>
          <div className="flex-1 flex flex-col gap-2.5">
            <div className="rounded-lg px-3.5 py-2.5" style={{ backgroundColor: JP_PEACH }}>
              <span className="text-sm font-medium" style={{ color: isCurrentLocation ? '#fff' : JP_PEACH_TEXT }}>
                {isCurrentLocation ? 'Your Location' : origin}
              </span>
            </div>
            <div className="rounded-lg px-3.5 py-2.5" style={{ backgroundColor: JP_PEACH }}>
              <span className="text-sm font-medium text-white">{destination}</span>
            </div>
          </div>
          <button className="shrink-0" aria-label="Swap origin and destination">
            <ArrowRightLeft size={18} color="#fff" className="rotate-90" />
          </button>
        </div>

        <div className="flex items-center gap-2.5 mt-4">
          <span className="flex items-center gap-2 bg-white rounded-full pl-3.5 pr-4 py-2">
            <span className="flex items-center -space-x-1">
              <Bus size={14} color={JP_ORANGE_DARK} />
              <TrainFront size={14} color={JP_ORANGE_DARK} />
            </span>
            <span className="text-xs font-bold" style={{ color: JP_ORANGE_DARK }}>{formatDuration(recommended.duration)}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Car size={16} color="#fff" />
            <span className="text-xs font-medium text-white">31 mins</span>
          </span>
        </div>
      </div>

      {/* Depart bar */}
      <div className="flex items-center justify-between px-4 py-2.5 shrink-0" style={{ backgroundColor: JP_ORANGE_DARK }}>
        <span className="flex items-center gap-2">
          <SlidersHorizontal size={13} color="#fff" />
          <span className="text-xs font-semibold text-white">Depart at 13:22</span>
        </span>
        <span className="text-xs font-semibold text-white underline underline-offset-2">View Map</span>
      </div>

      {/* Route results */}
      <div className="flex-1 overflow-y-auto bg-white">
        <p className="text-xs font-semibold text-gray-500 px-4 py-2" style={{ backgroundColor: '#F1F1F4' }}>Recommended Route</p>
        <div className="px-4">
          <RouteRow route={recommended} fastest />
        </div>
        <p className="text-xs font-semibold text-gray-500 px-4 py-2" style={{ backgroundColor: '#F1F1F4' }}>Other options</p>
        <div className="px-4">
          {otherOptions.map((r, i) => (
            <RouteRow key={i} route={r} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Nearby bus stops (Screen 2.1 downstream) — matches supplied Nearby screenshot ----
const NEARBY_STOPS = [
  { code: '59469', name: 'Blk 419', street: 'Yishun Ave 11', distance: '180m', bike: '01' },
  { code: '59781', name: 'Aft Yishun Ave 6', street: 'Yishun Ave 1', distance: '230m', bike: '00' },
  { code: '59461', name: 'Opp Blk 419', street: 'Yishun Ave 11', distance: '240m', bike: '02' },
  { code: '59789', name: 'Bef Yishun Ave 6', street: 'Yishun Ave 1', distance: '260m', bike: '00' },
  { code: '59471', name: 'Blk 430B', street: 'Yishun Ave 1', distance: '270m', bike: '05' },
  { code: '59771', name: 'Blk 469B', street: 'Yishun Ave 1', distance: '330m', bike: '00' },
  { code: '59591', name: 'Bet Blks 405/406', street: 'Yishun Ave 6', distance: '340m', bike: '00' },
  { code: '59479', name: 'Opp Blk 430B', street: 'Yishun Ave 1', distance: '360m', bike: '03' },
  { code: '59779', name: 'Opp Blks 469A/469B', street: 'Yishun Ave 1', distance: '390m', bike: '00' },
];

function NearbyScreen({ onBack }) {
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#FAFAFC' }}>
      {/* Header */}
      <div className="shrink-0" style={{ background: GRADIENT }}>
        <StatusBarRow />
        <div className="flex items-center gap-3 px-4 pb-3 pt-1">
          <button onClick={onBack} className="p-1 shrink-0" aria-label="Back to Ask AIVA">
            <ArrowLeft size={20} color="#fff" />
          </button>
          <p className="text-white text-lg font-bold flex-1 text-center">Nearby</p>
          <Map size={20} color="#fff" className="shrink-0" />
        </div>
      </div>

      {/* Search + radius filter */}
      <div className="flex items-center gap-2 px-3 py-2.5 shrink-0" style={{ backgroundColor: '#2E2A2E' }}>
        <div className="flex-1 flex items-center gap-2 bg-white rounded-full px-3 py-2">
          <Search size={14} color="#8A8A93" />
          <span className="text-xs text-gray-400">e.g. 52039</span>
        </div>
        <button className="flex items-center gap-1.5 rounded-full pl-3 pr-2.5 py-2 shrink-0" style={{ backgroundColor: '#8BC53F' }}>
          <Bike size={15} color="#fff" />
          <span className="text-xs font-bold text-white">50m</span>
          <ChevronDown size={13} color="#fff" />
        </button>
      </div>

      {/* Stop list */}
      <div className="flex-1 overflow-y-auto bg-white">
        {NEARBY_STOPS.map((s, i) => (
          <div key={s.code} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < NEARBY_STOPS.length - 1 ? '1px solid #EEEEF0' : 'none' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#E8842C' }}>
              <Bus size={18} color="#fff" />
            </div>
            <div className="min-w-0">
              <p className="text-[15px] font-bold text-gray-800 truncate">{s.code} - {s.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span className="text-xs text-gray-500">{s.street}</span>
                <span className="text-xs font-semibold" style={{ color: '#E8842C' }}>{s.distance}</span>
                <span className="text-xs text-gray-300">|</span>
                <span className="flex items-center gap-0.5">
                  <Bike size={12} color="#8BC53F" />
                  <span className="text-xs font-semibold" style={{ color: '#8BC53F' }}>{s.bike}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Distance range slider */}
      <div className="shrink-0 px-6 pt-4 pb-3" style={{ backgroundColor: '#E5E5E7' }}>
        <div className="relative h-1 rounded-full" style={{ backgroundColor: '#C9C9CE' }}>
          <div className="absolute left-0 top-0 h-1 rounded-full" style={{ width: '35%', backgroundColor: GRADIENT }} />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white shadow-md border"
            style={{ left: 'calc(35% - 10px)', borderColor: '#D8D8DC' }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px] text-gray-500">0.4 km</span>
          <span className="text-[11px] text-gray-500">0.6 km</span>
          <span className="text-[11px] text-gray-500">0.8 km</span>
        </div>
      </div>
    </div>
  );
}

// ---- Star rating control (Screen 6.2) ----
function StarRating({ onSelect, selected }) {
  const [hover, setHover] = useState(0);
  const active = hover || selected || 0;
  return (
    <div className="flex flex-col items-start gap-2 pl-1">
      <div className="bg-white shadow-sm rounded-2xl rounded-bl-md px-4 py-3.5 flex flex-col gap-2 items-start">
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              disabled={!!selected}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onClick={() => onSelect(n)}
              aria-label={`${n} star`}
              className="transition active:scale-90"
            >
              <Star
                size={26}
                color={GRADIENT}
                fill={n <= active ? GRADIENT : 'transparent'}
                strokeWidth={1.6}
              />
            </button>
          ))}
        </div>
        <p className="text-[11px] text-gray-400">Tap a star to rate your experience.</p>
      </div>
    </div>
  );
}

// ---- Exit-app warning prompt (Screen 8.2) ----
function ExitWarningModal({ onCancel, onConfirm }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-8" style={{ backgroundColor: 'rgba(17,17,20,0.45)' }}>
      <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col items-center text-center px-5 pt-6 pb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: '#FBEFE4' }}>
            <ShieldAlert size={22} color="#E8842C" />
          </div>
          <p className="text-sm font-bold text-gray-800">You are now leaving SBS Transit App</p>
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
            You will be redirected to an external website in your device's browser.
          </p>
        </div>
        <div className="flex border-t border-gray-100">
          <button onClick={onCancel} className="flex-1 py-3.5 text-sm font-semibold text-gray-500 border-r border-gray-100">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-3.5 text-sm font-bold" style={{ color: GRADIENT }}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- External browser hand-off (Screen 8.3) ----
function BrowserScreen({ onClose }) {
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#F1F1F4' }}>
      <div className="shrink-0 bg-white border-b border-gray-200">
        <StatusBarRow dark />
        <div className="flex items-center gap-2 px-3 pb-2 pt-0.5">
          <button onClick={onClose} className="p-1.5 rounded-full" style={{ backgroundColor: '#F1F1F4' }} aria-label="Close browser">
            <X size={16} color="#4B4B55" />
          </button>
          <div className="flex-1 flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ backgroundColor: '#F1F1F4' }}>
            <Lock size={11} color="#6B6B76" />
            <span className="text-[11px] text-gray-600 truncate">contactus.sbstransit.com.sg</span>
          </div>
          <MoreVertical size={16} color="#4B4B55" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        <div className="px-5 py-5 border-b border-gray-100">
          <p className="text-[10px] font-semibold tracking-wide" style={{ color: GRADIENT }}>SBS TRANSIT LTD</p>
          <h1 className="text-lg font-bold text-gray-800 mt-1">Contact Us</h1>
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
            Have a question, compliment or complaint about our bus or train services? Fill in the form below and our team will get back to you.
          </p>
        </div>
        <div className="px-5 py-4 space-y-3">
          {['Full name', 'Email address', 'Contact number'].map((label) => (
            <div key={label}>
              <label className="text-[10px] font-medium text-gray-500">{label}</label>
              <div className="mt-1 rounded-lg px-3 py-2.5 border border-gray-200 text-xs text-gray-300">Enter {label.toLowerCase()}</div>
            </div>
          ))}
          <div>
            <label className="text-[10px] font-medium text-gray-500">Feedback category</label>
            <div className="mt-1 rounded-lg px-3 py-2.5 border border-gray-200 text-xs text-gray-400 flex items-center justify-between">
              Select a category <ChevronRight size={12} className="rotate-90" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-medium text-gray-500">Message</label>
            <div className="mt-1 rounded-lg px-3 py-2.5 border border-gray-200 text-xs text-gray-300 h-16">Tell us more…</div>
          </div>
          <button className="w-full rounded-full py-3 text-sm font-semibold text-white mt-2" style={{ background: GRADIENT }}>
            Submit
          </button>
        </div>
      </div>

      <div className="shrink-0 bg-white border-t border-gray-200 px-4 py-1.5 text-center">
        <p className="text-[9px] text-gray-400">Opened in external browser · not part of SBS Transit App</p>
      </div>
    </div>
  );
}

// ---- Enlarged station map, landscape (Screen 5.4) ----
function EnlargedMapOverlay({ level, station = 'Punggol Coast MRT', onClose }) {
  const { Map, Icon } = LEVEL_INFO[level];
  return (
    <div className="absolute inset-0 z-50 overflow-hidden" style={{ backgroundColor: '#111114' }}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 780,
          height: 375,
          transform: 'translate(-50%, -50%) rotate(90deg)',
        }}
        className="flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-2.5 shrink-0" style={{ background: GRADIENT }}>
          <div className="flex items-center gap-2 min-w-0">
            <Icon size={15} color="#fff" className="shrink-0" />
            <p className="text-white text-xs font-semibold truncate">{station} · {level}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} aria-label="Close map">
            <X size={15} color="#fff" />
          </button>
        </div>
        <div className="flex-1 relative bg-white flex items-center justify-center px-6">
          <div className="w-full" style={{ maxWidth: 640 }}>
            <Map />
          </div>
          <div className="absolute bottom-3 right-4 flex items-center gap-1.5 text-[10px] text-gray-400">
            <ZoomIn size={12} />
            Pinch to zoom · drag to pan
          </div>
        </div>
      </div>
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[9px] text-gray-400">
        <RotateCw size={10} />
        Landscape view
      </div>
    </div>
  );
}

const MENU_ITEMS = [
  { icon: Home, label: 'Home' },
  { icon: Bus, label: 'Bus' },
  { icon: TrainFront, label: 'Train' },
  { icon: Info, label: 'Updates' },
  { icon: GitFork, label: 'Journey Planner' },
  { icon: MapPin, label: 'NaviAID' },
  { icon: Bookmark, label: 'Bookmarks' },
  { icon: ShoppingBag, label: 'Shops' },
  { icon: Repeat, label: 'Alternative Transport Options' },
  { icon: Mail, label: 'Contact Us' },
  { icon: HelpCircle, label: 'FAQs' },
  { icon: MessageCircle, label: 'Ask AIVA', aiva: true },
];

function DrawerMenu({ open, onClose, onSelect }) {
  return (
    <>
      <div
        className={`absolute inset-0 z-30 bg-black transition-opacity duration-300 ${open ? 'opacity-40 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />
      <div
        className="absolute top-0 left-0 h-full z-40 flex flex-col transition-transform duration-300 ease-out"
        style={{ width: '78%', backgroundColor: '#1C1C1E', transform: open ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        <div className="flex-1 overflow-y-auto pt-14">
          {MENU_ITEMS.map(({ icon: Icon, label, aiva }) => (
            <button
              key={label}
              onClick={() => onSelect(label)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left transition border-b"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <Icon size={22} color={aiva ? '#D9A9E8' : '#EDEDEF'} strokeWidth={1.6} />
              <span className="text-[15px] font-medium" style={{ color: aiva ? '#D9A9E8' : '#EDEDEF' }}>{label}</span>
            </button>
          ))}
        </div>
        <div className="px-5 py-3 shrink-0" style={{ backgroundColor: '#2C2C2E' }}>
          <p className="text-[11px] text-gray-400">SBS Transit v2.9.7</p>
        </div>
      </div>
    </>
  );
}

// AIVA avatar portrait (illustrated character, provided asset)
const AIVA_AVATAR_SRC = "data:image/jpeg;base64,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";

function AivaPortrait({ size = 64 }) {
  return (
    <div
      className="rounded-full overflow-hidden shrink-0 shadow-sm"
      style={{ width: size, height: size, border: `2px solid ${GRADIENT}` }}
    >
      <img
        src={AIVA_AVATAR_SRC}
        alt="AIVA avatar"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

const MAP_PINS = [
  { top: '10%', left: '18%' },
  { top: '16%', left: '78%' },
  { top: '28%', left: '45%' },
  { top: '40%', left: '12%', orange: true },
  { top: '52%', left: '72%' },
  { top: '64%', left: '32%' },
  { top: '74%', left: '82%' },
  { top: '80%', left: '55%' },
];

function BusPin({ orange }) {
  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center shadow-md border-2 border-white"
      style={{ backgroundColor: orange ? '#E8842C' : GRADIENT }}
    >
      <Bus size={12} color="#fff" />
    </div>
  );
}

// Realistic stylized road-map illustration (no third-party branding)
function MapBackground() {
  return (
    <svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <pattern id="blockPattern" width="50" height="50" patternUnits="userSpaceOnUse">
          <rect width="50" height="50" fill="#F2EFE7" />
          <rect x="2" y="2" width="46" height="46" fill="#EDE9DE" />
        </pattern>
      </defs>
      {/* land base */}
      <rect width="400" height="600" fill="url(#blockPattern)" />

      {/* park */}
      <path d="M20,60 C60,40 110,45 130,80 C145,110 120,150 80,150 C40,150 5,110 20,60 Z" fill="#D6E8CC" />
      <path d="M40,75 C60,65 90,68 100,85" stroke="#BFDCB0" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* water */}
      <path d="M260,0 C300,60 260,110 300,160 C330,195 400,190 400,190 L400,0 Z" fill="#CFE3F0" />

      {/* secondary streets — horizontal-ish */}
      {[95, 175, 255, 335, 415, 495, 565].map((y, i) => (
        <path key={`h${i}`} d={`M0,${y} C120,${y - 8} 260,${y + 8} 400,${y - 4}`} stroke="#FFFFFF" strokeWidth="5" fill="none" />
      ))}
      {/* secondary streets — vertical-ish */}
      {[45, 130, 210, 290, 355].map((x, i) => (
        <path key={`v${i}`} d={`M${x},0 C${x - 10},150 ${x + 12},300 ${x - 6},450 C${x - 12},520 ${x},560 ${x + 4},600`} stroke="#FFFFFF" strokeWidth="5" fill="none" />
      ))}

      {/* arterial roads (casing + fill) */}
      <path d="M-10,120 L410,460" stroke="#FFFFFF" strokeWidth="16" fill="none" />
      <path d="M-10,120 L410,460" stroke="#F6C453" strokeWidth="11" fill="none" />
      <path d="M330,-10 L60,610" stroke="#FFFFFF" strokeWidth="16" fill="none" />
      <path d="M330,-10 L60,610" stroke="#F6C453" strokeWidth="11" fill="none" />
      <path d="M0,330 L400,300" stroke="#FFFFFF" strokeWidth="14" fill="none" />
      <path d="M0,330 L400,300" stroke="#F8D27A" strokeWidth="9" fill="none" />

      {/* road name labels */}
      <text x="70" y="145" fontSize="10" fill="#7A7A6E" transform="rotate(-52 70 145)">Yishun Ave 11</text>
      <text x="230" y="330" fontSize="10" fill="#7A7A6E" transform="rotate(58 230 330)">Yishun Ave 1</text>
      <text x="110" y="325" fontSize="10" fill="#8A8A7C">Yishun Ave 6</text>
      <text x="255" y="470" fontSize="10" fill="#8A8A7C">Khatib Ave</text>
      <text x="55" y="95" fontSize="9" fill="#9A9A8C">Nee Soon</text>

      {/* compass */}
      <g transform="translate(360,40)">
        <circle r="16" fill="#FFFFFF" opacity="0.9" />
        <path d="M0,-10 L4,0 L0,10 L-4,0 Z" fill="#6B6B76" />
        <text x="0" y="-20" fontSize="9" fill="#6B6B76" textAnchor="middle">N</text>
      </g>
    </svg>
  );
}

function HomeScreen({ onOpenMenu, onOpenAiva }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0" style={{ background: GRADIENT }}>
        <StatusBarRow />
        <div className="flex items-center gap-2 px-3 pb-3 pt-1">
          <button onClick={onOpenMenu} className="p-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} aria-label="Open menu">
            <Menu size={18} color="#fff" />
          </button>
          <div className="flex-1 flex items-center gap-2 bg-white/90 rounded-full px-3 py-1.5">
            <Search size={14} color="#8A8A93" />
            <span className="text-xs text-gray-400">Search</span>
          </div>
        </div>
      </div>

      {/* Scam alert */}
      <div className="px-3 py-2 shrink-0" style={{ backgroundColor: '#FBEFE4' }}>
        <p className="text-[10px] text-gray-700 leading-snug">
          SCAM ALERT: Pls delete any msg claiming you've won a prize from SBS Transit — it's not from us. Only download/update our app via the official app store. Call the ScamShield helpline at 1799 to report scams.
        </p>
        <div className="flex justify-center gap-1 mt-1.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} className="w-1 h-1 rounded-full" style={{ backgroundColor: i === 2 ? '#E8842C' : '#D8CFE0' }} />
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="relative flex-1 overflow-hidden">
        <MapBackground />

        {MAP_PINS.map((p, i) => (
          <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: p.top, left: p.left }}>
            <BusPin orange={p.orange} />
          </div>
        ))}

        <button
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center"
          aria-label="Locate me"
        >
          <Locate size={16} color={GRADIENT} />
        </button>

        {/* Floating Ask AIVA launcher */}
        <button
          onClick={onOpenAiva}
          className="absolute flex items-center gap-2"
          style={{ bottom: '28%', right: '10%' }}
        >
          <span className="bg-white rounded-full px-3 py-1.5 shadow-md text-xs font-medium text-gray-700 whitespace-nowrap">
            Ask AIVA
          </span>
          <span className="relative">
            <AivaPortrait size={44} />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gray-500 flex items-center justify-center">
              <X size={9} color="#fff" />
            </span>
          </span>
        </button>
      </div>

      {/* Nearby nav bar */}
      <div className="flex items-center justify-between px-4 py-2 shrink-0" style={{ background: GRADIENT }}>
        <div className="w-4" />
        <div className="flex items-center gap-3">
          <ChevronLeft size={16} color="#fff" />
          <span className="text-white text-sm font-semibold">Nearby</span>
          <ChevronRight size={16} color="#fff" />
        </div>
        <RefreshCw size={15} color="#fff" />
      </div>

      {/* Bottom bus stop info */}
      <div className="px-4 py-3 shrink-0 bg-white border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs font-bold text-gray-800">67309 · Opp Blk 305 Cp</p>
            <p className="text-[10px] text-gray-500">Sengkang East Ave</p>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-bold text-white rounded-full px-2 py-1" style={{ backgroundColor: '#4CAF50' }}>
            09 <Bike size={12} />
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { no: '163', a: 'Arriving', b: 'green' },
            { no: '163A', a: 'NA', b: 'gray' },
            { no: '163B', a: 'NA', b: 'gray' },
          ].map((col) => (
            <div key={col.no} className="flex flex-col items-center gap-1">
              <p className="text-sm font-bold" style={{ color: GRADIENT }}>{col.no}</p>
              <div className="flex items-center gap-1 text-[10px]" style={{ color: col.b === 'green' ? '#2E9E4F' : '#9A9A9A' }}>
                <Accessibility size={11} />
                <span>{col.a}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OptionButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-center rounded-full px-4 py-2.5 text-sm font-semibold text-white transition active:scale-95"
      style={{ background: GRADIENT }}
    >
      {label}
    </button>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="bg-white shadow-sm rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full inline-block animate-bounce"
            style={{ backgroundColor: '#C9B7D4', animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function TranscribingBar() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 flex items-center justify-center rounded-full px-4 py-2.5" style={{ backgroundColor: '#F1F1F4' }}>
        <span className="text-xs text-gray-500">Transcribing…</span>
      </div>
      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#F1F1F4' }}>
        <span
          className="block w-4 h-4 rounded-full border-2 animate-spin"
          style={{ borderColor: '#D8CFE0', borderTopColor: GRADIENT }}
        />
      </div>
    </div>
  );
}

function Timestamp({ align }) {
  return (
    <p
      className={`text-[10px] text-gray-400 mt-1 ${align === 'right' ? 'text-right pr-1' : 'text-left pl-1'}`}
    >
      {formatTime(new Date())}
    </p>
  );
}

function VoiceControls({ isPaused, isStopped, onTogglePause, onStop, onPlay }) {
  return (
    <div className="flex items-center gap-4 px-4 py-2 border-t border-gray-100">
      <button
        onClick={onTogglePause}
        disabled={isStopped}
        className="flex items-center gap-1.5 transition active:scale-95 disabled:opacity-40"
        aria-label={isPaused ? 'Resume voice playback' : 'Pause voice playback'}
      >
        {isPaused ? <Play size={13} color={PURPLE_DARK} fill={PURPLE_DARK} /> : <Pause size={13} color={PURPLE_DARK} fill={PURPLE_DARK} />}
        <span className="text-[11px] font-semibold" style={{ color: PURPLE_DARK }}>{isPaused ? 'Resume' : 'Pause'}</span>
      </button>
      <span className="w-px h-3.5" style={{ backgroundColor: '#E5DCEC' }} />
      {isStopped ? (
        <button
          onClick={onPlay}
          className="flex items-center gap-1.5 transition active:scale-95"
          aria-label="Play voice playback"
        >
          <Play size={12} color="#6B6B76" fill="#6B6B76" />
          <span className="text-[11px] font-semibold text-gray-600">Play</span>
        </button>
      ) : (
        <button
          onClick={onStop}
          className="flex items-center gap-1.5 transition active:scale-95"
          aria-label="Stop voice playback"
        >
          <Square size={11} color="#6B6B76" fill="#6B6B76" />
          <span className="text-[11px] font-semibold text-gray-600">Stop</span>
        </button>
      )}
    </div>
  );
}

function Message({ msg, onOption, onRate, onEnlargeMap, playingId, isPaused, isStopped, onTogglePause, onStopPlayback, onPlayPlayback }) {
  if (msg.type === 'user') {
    return (
      <div className="flex flex-col items-end">
        <div
          className="max-w-xs rounded-2xl rounded-br-md px-4 py-2.5 text-sm leading-relaxed text-white"
          style={{ backgroundColor: USER_BUBBLE }}
        >
          {msg.text}
        </div>
        <p className="text-[10px] text-gray-400 mt-1 pr-1">{formatTime(msg.time)}</p>
      </div>
    );
  }

  if (msg.type === 'aiva-text') {
    const isPlaying = msg.id === playingId;
    return (
      <div className="flex flex-col items-start">
        <div className="max-w-xs bg-white shadow-sm rounded-2xl rounded-bl-md overflow-hidden">
          <div className="px-4 py-2.5 text-sm leading-relaxed" style={{ color: PURPLE_DARK }}>
            {msg.text}
          </div>
          {isPlaying && (
            <VoiceControls
              isPaused={isPaused}
              isStopped={isStopped}
              onTogglePause={onTogglePause}
              onStop={onStopPlayback}
              onPlay={onPlayPlayback}
            />
          )}
        </div>
        <p className="text-[10px] text-gray-400 mt-1 pl-1">{formatTime(msg.time)}</p>
      </div>
    );
  }

  if (msg.type === 'aiva-options') {
    return (
      <div className="flex flex-col items-stretch gap-2 pl-1">
        {msg.options.map((opt) => (
          <OptionButton key={opt} label={opt} onClick={() => onOption(opt)} />
        ))}
      </div>
    );
  }

  if (msg.type === 'aiva-image') {
    const { Map, Icon } = LEVEL_INFO[msg.level];
    const station = msg.station || 'Punggol Coast MRT';
    return (
      <div className="flex flex-col items-start">
        <button
          onClick={() => onEnlargeMap({ level: msg.level, station })}
          className="max-w-xs w-64 bg-white shadow-sm rounded-2xl overflow-hidden text-left relative active:scale-[0.98] transition"
          aria-label="Tap to enlarge map"
        >
          <Map />
          <span className="absolute top-2 right-2 flex items-center gap-1 bg-white/95 rounded-full px-2 py-1 shadow-sm">
            <Maximize2 size={10} color={GRADIENT} />
            <span className="text-[9px] font-semibold" style={{ color: GRADIENT }}>Tap to enlarge</span>
          </span>
          <div className="flex items-start gap-2 px-3 py-2 border-t border-gray-100">
            <Icon size={14} color={PURPLE} className="mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-gray-800">{msg.level} · {station}</p>
              <p className="text-[11px] text-gray-500 leading-snug mt-0.5">{LEVEL_INFO[msg.level].note}</p>
            </div>
          </div>
        </button>
        <p className="text-[10px] text-gray-400 mt-1 pl-1">{formatTime(msg.time)}</p>
      </div>
    );
  }

  if (msg.type === 'aiva-rating') {
    return <StarRating selected={msg.selected} onSelect={(n) => onRate(msg.id, n)} />;
  }

  return null;
}

export default function AskAivaMockup() {
  const [screen, setScreen] = useState('home'); // 'home' | 'chat' | 'journey' | 'nearby' | 'browser'
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [journeyOrigin, setJourneyOrigin] = useState('Current location');
  const [journeyDestination, setJourneyDestination] = useState('Singapore Polytechnic');
  const [enlargedMap, setEnlargedMap] = useState(null);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [awaitingOtherFeedback, setAwaitingOtherFeedback] = useState(false);
  const [awaitingDestination, setAwaitingDestination] = useState(false);
  const [awaitingOriginReply, setAwaitingOriginReply] = useState(false);
  const [pendingDestination, setPendingDestination] = useState('');
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [isVoicePaused, setIsVoicePaused] = useState(false);
  const [isVoiceStopped, setIsVoiceStopped] = useState(false);
  const scrollRef = useRef(null);

  const [messages, setMessages] = useState(() => buildWelcomeMessages());

  function buildWelcomeMessages() {
    const now = Date.now();
    const t = (minutesAgo) => new Date(now - minutesAgo * 60000);
    return [
      { id: nextId(), type: 'aiva-text', time: t(1), text: 'Hi, I am AIVA. How may I assist you today?' },
      {
        id: nextId(),
        type: 'aiva-options',
        options: ['Where is the nearest bus stop?', 'How do I get to…?', 'Station Map'],
      },
    ];
  }

  const resetChat = () => {
    setMessages(buildWelcomeMessages());
    setIsTyping(false);
    setIsRecording(false);
    setIsTranscribing(false);
    setInputValue('');
    setAwaitingOtherFeedback(false);
    setAwaitingDestination(false);
    setAwaitingOriginReply(false);
    setPendingDestination('');
    setPlayingMessageId(null);
    setIsVoicePaused(false);
    setIsVoiceStopped(false);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isTranscribing]);

  // Simulated voice playback: whenever AIVA sends a new text reply,
  // treat it as the message currently being "read aloud" and show Pause/Stop controls.
  useEffect(() => {
    const lastAivaText = [...messages].reverse().find((m) => m.type === 'aiva-text');
    if (lastAivaText) {
      setPlayingMessageId(lastAivaText.id);
      setIsVoicePaused(false);
      setIsVoiceStopped(false);
    }
  }, [messages]);

  const handleTogglePause = () => setIsVoicePaused((p) => !p);
  const handleStopPlayback = () => {
    setIsVoiceStopped(true);
    setIsVoicePaused(false);
  };
  const handlePlayPlayback = () => setIsVoiceStopped(false);

  const addMessage = (msg) => setMessages((prev) => [...prev, { id: nextId(), time: new Date(), ...msg }]);
  const clearOptions = () => setMessages((prev) => prev.filter((m) => m.type !== 'aiva-options'));

  const respond = (fn, delay = 800) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      fn();
    }, delay);
  };

  const handleLevelSelect = (level) => {
    clearOptions();
    addMessage({ type: 'user', text: level });
    respond(() => {
      addMessage({ type: 'aiva-text', text: `Here is the map of the Punggol Coast MRT ${level}.` });
      addMessage({ type: 'aiva-image', level });
      addMessage({ type: 'aiva-options', options: ['Search another station'] });
    }, 900);
  };

  const handleFollowUpOption = (opt) => {
    clearOptions();
    addMessage({ type: 'user', text: opt });
    respond(() => {
      addMessage({ type: 'aiva-text', text: 'Sure — which station would you like to look up next?' });
      addMessage({ type: 'aiva-options', options: ['Ang Mo Kio Bus Interchange', 'Punggol Coast MRT'] });
    }, 800);
  };

  const handleStationMapEntry = () => {
    clearOptions();
    addMessage({ type: 'user', text: 'Station Map' });
    respond(() => {
      addMessage({ type: 'aiva-text', text: 'Which station map would you like to see?' });
      addMessage({ type: 'aiva-options', options: ['Ang Mo Kio Bus Interchange', 'Punggol Coast MRT'] });
    }, 700);
  };

  const handlePunggolSelect = () => {
    clearOptions();
    addMessage({ type: 'user', text: 'Punggol Coast MRT' });
    respond(() => {
      addMessage({ type: 'aiva-text', text: 'Which level map would you like to view?' });
      addMessage({ type: 'aiva-options', options: ['Platform Level', 'Concourse Level', 'Upper Concourse Level'] });
    }, 700);
  };

  const handleAmkSelect = () => {
    clearOptions();
    addMessage({ type: 'user', text: 'Ang Mo Kio Bus Interchange' });
    respond(() => {
      addMessage({ type: 'aiva-text', text: 'Here is the map of the Ang Mo Kio Bus Interchange.' });
      addMessage({ type: 'aiva-image', level: 'Bus Interchange', station: 'Ang Mo Kio Bus Interchange' });
      addMessage({ type: 'aiva-options', options: ['Search another station'] });
    }, 900);
  };

  const handleNearestBusStop = (userText = 'Where is the nearest bus stop?') => {
    clearOptions();
    addMessage({ type: 'user', text: userText });
    respond(() => {
      addMessage({ type: 'aiva-text', text: 'Please follow the link to see bus stops near you.' });
      addMessage({ type: 'aiva-options', options: ['Bus stops near me'] });
    }, 700);
  };

  const handleJourneyStub = () => {
    clearOptions();
    addMessage({ type: 'user', text: 'How do I get to…?' });
    respond(() => {
      addMessage({ type: 'aiva-text', text: 'Sure — where would you like to go?' });
      setAwaitingDestination(true);
    }, 700);
  };

  const handleDestinationSubmitted = (destination) => {
    addMessage({ type: 'user', text: destination });
    setAwaitingDestination(false);
    setPendingDestination(destination);
    respond(() => {
      addMessage({
        type: 'aiva-text',
        text: "Are you going from your current location or from another address? Reply 'yes' if you are going from your current location. Reply with the starting address if you are not.",
      });
      setAwaitingOriginReply(true);
    }, 800);
  };

  const handleOriginReply = (reply) => {
    addMessage({ type: 'user', text: reply });
    setAwaitingOriginReply(false);
    const destination = pendingDestination || 'your destination';
    const isCurrentLocation = reply.trim().toLowerCase() === 'yes';
    respond(() => {
      if (isCurrentLocation) {
        addMessage({ type: 'aiva-text', text: `To go to ${destination} from your current location, please follow the link to see step-by-step navigation.` });
        addMessage({ type: 'aiva-options', options: ['View Journey Plan'] });
        setJourneyOrigin('Current location');
      } else {
        addMessage({ type: 'aiva-text', text: `To go to ${destination} from ${reply}, please follow the link to see step-by-step navigation.` });
        addMessage({ type: 'aiva-options', options: ['View Journey Map'] });
        setJourneyOrigin(reply);
      }
      setJourneyDestination(destination);
    }, 800);
  };

  // Flow 3 — journey planning from current location
  const handleJourneyFromCurrentLocation = (userText = 'How do I go to Singapore Poly?') => {
    clearOptions();
    addMessage({ type: 'user', text: userText });
    respond(() => {
      addMessage({ type: 'aiva-text', text: 'To go to Singapore Polytechnic from your current location, please follow the link to see step-by-step navigation.' });
      addMessage({ type: 'aiva-options', options: ['View Journey Plan'] });
      setJourneyOrigin('Current location');
      setJourneyDestination('Singapore Polytechnic');
    }, 800);
  };

  // Flow 4 — journey planning with a specified origin
  const handleJourneyFromOrigin = (userText = 'How do I go to Singapore Poly from 113 Bishan Street 12?') => {
    clearOptions();
    addMessage({ type: 'user', text: userText });
    respond(() => {
      addMessage({ type: 'aiva-text', text: 'To go to Singapore Polytechnic from 113 Bishan Street 12, please follow the link to see step-by-step navigation.' });
      addMessage({ type: 'aiva-options', options: ['View Journey Map'] });
      setJourneyOrigin('113 Bishan Street 12');
      setJourneyDestination('Singapore Polytechnic');
    }, 800);
  };

  // Flow 6/7 — rating and feedback reasons
  const handleRate = (msgId, stars) => {
    setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, selected: stars } : m)));
    addMessage({ type: 'user', text: `I give you ${stars}-star rating.` });
    if (stars >= 4) {
      respond(() => {
        addMessage({ type: 'aiva-text', text: `Thank you for giving us a ${stars}-star rating.` });
      }, 700);
    } else {
      respond(() => {
        addMessage({ type: 'aiva-text', text: "I'm sorry that you are not satisfied with the service we provided. May I ask the reason for your rating?" });
        addMessage({ type: 'aiva-options', options: ['Unable to answer my question', 'Response time was too long', 'Poor interface design', 'Other (please specify)'] });
      }, 700);
    }
  };

  const handleReasonSelect = (reason) => {
    clearOptions();
    addMessage({ type: 'user', text: reason });
    if (reason === 'Other (please specify)') {
      respond(() => {
        addMessage({ type: 'aiva-text', text: 'Your feedback helps us improve our service. Could you specify your reason?' });
        setAwaitingOtherFeedback(true);
      }, 700);
    } else {
      respond(() => {
        addMessage({ type: 'aiva-text', text: "Thank you for letting us know. We'll pass this along to help improve AIVA." });
      }, 700);
    }
  };

  const handleContactUsRedirect = (opt) => {
    clearOptions();
    addMessage({ type: 'user', text: opt });
    respond(() => {
      addMessage({ type: 'aiva-text', text: 'Sure. Let me bring you to the Contact Us form.' });
      addMessage({ type: 'aiva-options', options: ['Contact Us form'] });
    }, 700);
  };

  const handleGiveFeedback = () => {
    clearOptions();
    addMessage({ type: 'user', text: 'Give feedback' });
    respond(() => {
      addMessage({ type: 'aiva-text', text: 'Sure. Would you like to:' });
      addMessage({ type: 'aiva-options', options: ['Give feedback regarding AIVA service', 'Give feedback regarding SBS Transit services'] });
    }, 700);
  };

  const handleAivaServiceFeedback = (opt) => {
    clearOptions();
    addMessage({ type: 'user', text: opt });
    respond(() => {
      addMessage({ type: 'aiva-text', text: 'How would you like to rate my service?' });
      addMessage({ type: 'aiva-rating' });
    }, 700);
  };

  const handleOption = (opt) => {
    if (LEVEL_INFO[opt]) return handleLevelSelect(opt);
    if (opt === 'Search another station') return handleFollowUpOption(opt);
    if (opt === 'Station Map') return handleStationMapEntry();
    if (opt === 'Punggol Coast MRT') return handlePunggolSelect();
    if (opt === 'Ang Mo Kio Bus Interchange') return handleAmkSelect();
    if (opt === 'Where is the nearest bus stop?') return handleNearestBusStop();
    if (opt === 'How do I get to…?') return handleJourneyStub();
    if (opt === 'How do I go to Singapore Poly?') return handleJourneyFromCurrentLocation(opt);
    if (opt === 'How do I go to Singapore Poly from 113 Bishan Street 12?') return handleJourneyFromOrigin(opt);
    if (opt === 'View Journey Plan' || opt === 'View Journey Map') return setScreen('journey');
    if (opt === 'Bus stops near me') return setScreen('nearby');
    if (opt === 'Give feedback regarding AIVA service') return handleAivaServiceFeedback(opt);
    if (opt === 'Give feedback regarding SBS Transit services') return handleContactUsRedirect(opt);
    if (['Unable to answer my question', 'Response time was too long', 'Poor interface design', 'Other (please specify)'].includes(opt)) {
      return handleReasonSelect(opt);
    }
    if (opt === 'Contact Us form') return setShowExitWarning(true);
  };

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    setInputValue('');

    if (awaitingOtherFeedback) {
      addMessage({ type: 'user', text });
      setAwaitingOtherFeedback(false);
      respond(() => {
        addMessage({ type: 'aiva-text', text: 'Thank you for your feedback. We will use it to improve AIVA.' });
      }, 700);
      return;
    }

    if (awaitingDestination) {
      return handleDestinationSubmitted(text);
    }

    if (awaitingOriginReply) {
      return handleOriginReply(text);
    }

    const lower = text.toLowerCase();
    if (lower.includes('singapore poly') && lower.includes('bishan')) {
      return handleJourneyFromOrigin(text);
    }
    if (lower.includes('singapore poly')) {
      return handleJourneyFromCurrentLocation(text);
    }
    if (lower.includes('nearest bus stop')) {
      return handleNearestBusStop(text);
    }

    addMessage({ type: 'user', text });
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage({ type: 'aiva-text', text: "Got it — let me look that up. (Demo reply: connect this to AIVA's live intent engine.)" });
    }, 900);
  };

  const handleCancelExitWarning = () => setShowExitWarning(false);
  const handleConfirmExitWarning = () => {
    setShowExitWarning(false);
    setScreen('browser');
  };

  const handleStartRecording = () => setIsRecording(true);

  const handleCancelRecording = () => setIsRecording(false);

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsTranscribing(true);
    setTimeout(() => {
      setIsTranscribing(false);
      setInputValue('Where is the nearest bus stop');
    }, 1500);
  };

  const handleMenuSelect = (label) => {
    setMenuOpen(false);
    if (label === 'Ask AIVA') {
      setScreen('chat');
    } else if (label === 'Home') {
      setScreen('home');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-6">
      <div
        className="relative bg-white overflow-hidden flex flex-col shadow-2xl"
        style={{ width: 375, height: 780, borderRadius: '36px', border: '8px solid #111827' }}
      >
        {screen === 'home' ? (
          <HomeScreen onOpenMenu={() => setMenuOpen(true)} onOpenAiva={() => setScreen('chat')} />
        ) : screen === 'journey' ? (
          <JourneyPlannerScreen
            origin={journeyOrigin}
            destination={journeyDestination}
            onBack={() => { resetChat(); setScreen('chat'); }}
          />
        ) : screen === 'nearby' ? (
          <NearbyScreen onBack={() => setScreen('chat')} />
        ) : screen === 'browser' ? (
          <BrowserScreen onClose={() => setScreen('chat')} />
        ) : (
          <>
            {/* Header */}
            <div className="shrink-0" style={{ background: GRADIENT }}>
              <StatusBarRow />
              <div
                className="grid items-center px-4 pb-3 pt-1"
                style={{ gridTemplateColumns: '1fr auto 1fr' }}
              >
                <div className="flex items-center justify-start">
                  <button
                    onClick={() => setMenuOpen(true)}
                    className="p-2 rounded-full transition shrink-0"
                    style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                    aria-label="Open menu"
                  >
                    <Menu size={18} color="#fff" />
                  </button>
                </div>
                <p className="text-white text-sm font-semibold text-center whitespace-nowrap">Ask AIVA</p>
                <div />
              </div>
            </div>

            {/* Disclaimer */}
            <div className="px-4 py-1.5 shrink-0 border-b border-gray-100 bg-white text-left">
              <p className="text-[10px] font-bold text-gray-500">Disclaimer:</p>
              <p className="text-[10px] text-gray-400 leading-snug">
                When using AIVA, you agree to our collection of the personal information you enter, as well as audio recordings.
              </p>
            </div>

            {/* Chat area */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-3 py-4 space-y-3"
              style={{ background: PAGE_GRADIENT }}
            >
              {/* AIVA intro row */}
              <div className="flex items-center gap-2 pb-1">
                <AivaPortrait size={56} />
                <div className="leading-tight">
                  <p className="text-xs font-bold" style={{ color: PURPLE_DARK }}>AIVA</p>
                  <p className="text-[10px] text-gray-500">AI Virtual Assistant</p>
                </div>
              </div>

              {messages.map((msg) => (
                <Message
                  key={msg.id}
                  msg={msg}
                  onOption={handleOption}
                  onRate={handleRate}
                  onEnlargeMap={setEnlargedMap}
                  playingId={playingMessageId}
                  isPaused={isVoicePaused}
                  isStopped={isVoiceStopped}
                  onTogglePause={handleTogglePause}
                  onStopPlayback={handleStopPlayback}
                  onPlayPlayback={handlePlayPlayback}
                />
              ))}
              {isTyping && <TypingBubble />}
            </div>

            {/* Give feedback link */}
            {!isRecording && !isTranscribing && (
              <div className="shrink-0 flex justify-end px-4 pt-2 bg-white">
                <button onClick={handleGiveFeedback} className="text-xs underline text-gray-600 font-medium">
                  Give feedback
                </button>
              </div>
            )}

            {/* Input area */}
            <div className="shrink-0 bg-white border-t border-gray-200 px-3 py-3">
              {isRecording ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCancelRecording}
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: '#F1F1F4', color: '#6B6B76' }}
                    aria-label="Cancel recording"
                  >
                    <X size={18} />
                  </button>

                  <div className="flex-1 flex items-center justify-center gap-4">
                    <div className="flex items-end gap-1 h-8">
                      {[10, 20, 28, 16, 24, 14, 22, 12].map((h, i) => (
                        <span
                          key={i}
                          className="w-1 rounded-full"
                          style={{
                            backgroundColor: GRADIENT,
                            height: h,
                            animation: 'aivaWaveBar 0.9s ease-in-out infinite',
                            animationDelay: `${i * 0.09}s`,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">Listening…</span>
                  </div>

                  <button
                    onClick={handleStopRecording}
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: GRADIENT }}
                    aria-label="Stop recording"
                  >
                    <span className="w-3 h-3 rounded-sm bg-white block" />
                  </button>

                  <style>{`
                @keyframes aivaWaveBar {
                  0%, 100% { transform: scaleY(0.4); }
                  50% { transform: scaleY(1); }
                }
              `}</style>
                </div>
              ) : isTranscribing ? (
                <TranscribingBar />
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={
                      awaitingOtherFeedback
                        ? 'Type your feedback…'
                        : awaitingDestination
                          ? 'Enter your destination…'
                          : awaitingOriginReply
                            ? "Reply 'yes' or enter an address…"
                            : 'Ask AIVA anything…'
                    }
                    className="flex-1 rounded-full px-4 py-2.5 text-sm outline-none"
                    style={{ backgroundColor: '#F1F1F4', color: '#1F2937' }}
                  />
                  <button
                    onClick={handleStartRecording}
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition"
                    style={{ backgroundColor: '#F1F1F4', color: '#6B6B76' }}
                    aria-label="Voice input"
                  >
                    <Mic size={18} />
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition disabled:opacity-40"
                    style={{ background: GRADIENT }}
                    aria-label="Send message"
                  >
                    <Send size={16} color="#fff" />
                  </button>
                </div>
              )}
            </div>

            {showExitWarning && (
              <ExitWarningModal onCancel={handleCancelExitWarning} onConfirm={handleConfirmExitWarning} />
            )}
            {enlargedMap && (
              <EnlargedMapOverlay level={enlargedMap.level} station={enlargedMap.station} onClose={() => setEnlargedMap(null)} />
            )}
          </>
        )}

        <DrawerMenu open={menuOpen} onClose={() => setMenuOpen(false)} onSelect={handleMenuSelect} />
      </div>
    </div>
  );
}
