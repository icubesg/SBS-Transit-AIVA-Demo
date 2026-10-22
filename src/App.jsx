import React, { useState, useRef, useEffect } from 'react';
import { X, Volume2, VolumeX, Send, Mic, MapPin, Map, TrainFront, Ticket, Bus, Menu, Home, Wifi, Bell, Share2, Bookmark, ShoppingBag, Repeat, Mail, MessageCircle, Search, ChevronLeft, ChevronRight, ChevronDown, RefreshCw, Bike, Accessibility, Locate, ArrowLeft, Star, ExternalLink, Lock, MoreVertical, ZoomIn, Navigation, Clock, ShieldAlert, RotateCw, Footprints, ArrowRightLeft, Maximize2, SlidersHorizontal, Car, Circle, BatteryFull, SignalHigh, Info, GitFork, HelpCircle, AlertTriangle, CornerUpRight } from 'lucide-react';

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
const LINE_NE = '#9900AA';
const LINE_CC = '#FA9E0D';
const LINE_DT = '#005EC4';
const LINE_TE = '#9D5B25';
// Keyed by MRT/LRT line prefix, for coloring the small line-code badges on the
// "alternative transport" designated-bus-stop table.
const LINE_COLORS = { NS: LINE_NS, EW: LINE_EW, NE: LINE_NE, CC: LINE_CC, CE: LINE_CC, DT: LINE_DT, TE: LINE_TE };

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

const STATION_BUS_STOPS = [
  { code: '03539', name: 'Marina Bay Stn', street: 'CTRL BLVD' },
  { code: '03579', name: 'Opp Downtown Stn', street: 'STRAITS VIEW' },
  { code: '03391', name: 'Marina Bay Financial Ctr', street: 'MARINA BLVD' },
  { code: '03529', name: 'Downtown Stn Exit E', street: 'CTRL BLVD' },
  { code: '03339', name: 'Aft Marina Gdns Dr', street: 'CTRL BLVD' },
];

function StationBusStopsScreen({ station = 'Downtown', onBack }) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="shrink-0" style={{ background: GRADIENT }}>
        <StatusBarRow />
        <div className="flex items-center gap-3 px-4 pb-3 pt-1">
          <button onClick={onBack} className="p-1 shrink-0" aria-label="Back to Ask AIVA">
            <ArrowLeft size={20} color="#fff" />
          </button>
          <p className="text-white text-xl font-bold flex-1 text-center pr-7">Bus</p>
        </div>
      </div>

      <div className="flex shrink-0" style={{ backgroundColor: '#262626' }}>
        {['Service', 'Bus Stop', 'MRT & LRT'].map((t) => (
          <div
            key={t}
            className="flex-1 py-3.5 text-center text-sm font-bold text-white"
            style={t === 'MRT & LRT' ? { backgroundColor: '#621D5F' } : undefined}
          >
            {t}
          </div>
        ))}
      </div>

      <div className="px-2.5 py-2.5 shrink-0" style={{ backgroundColor: '#454545' }}>
        <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2" style={{ border: '1.5px solid #111' }}>
          <Search size={15} color="#111" />
          <span className="flex-1 text-sm text-gray-900 uppercase">{station} STN</span>
          <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#111' }}>
            <X size={11} color="#fff" />
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {STATION_BUS_STOPS.map((s) => (
          <div key={s.code} className="flex items-center gap-3 px-3 py-3" style={{ borderBottom: '1px solid #D8D8DC' }}>
            <Bus size={26} color="#E8703A" className="shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold truncate" style={{ color: '#555' }}>{s.code} - {s.name}</p>
              <p className="text-xs" style={{ color: '#666' }}>{s.street}</p>
            </div>
            <ChevronRight size={18} color="#9A9AA2" className="shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

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

// ---- Bus stop arrival times — matches supplied Bus Stop screenshot ----
const BUS_ARRIVALS = [
  { number: '663', destination: 'Prince Edward Rd Stn Exit 2', loop: true },
  { number: '804', destination: 'Yishun Int', etas: [{ status: 'Arriving', accessible: true }, { status: '8 min', accessible: true }] },
  { number: '806', destination: 'Yishun Int', etas: [{ status: '3 min', accessible: true }, { status: '8 min', accessible: true }] },
  { number: '807', destination: 'Yishun Int', etas: [{ status: '5 min', accessible: true }, { status: '10 min', accessible: true }] },
  { number: '807A', destination: 'Khatib Stn Exit D', loop: true },
  { number: '807B', destination: 'Jiemin Pr Sch', loop: true },
  { number: '860', destination: 'Yio Chu Kang Int', etas: [{ status: 'Arriving', accessible: true }, { status: '26 min', accessible: true }] },
];

function InaccessibleWheelchairIcon() {
  return (
    <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
      <Accessibility size={15} color="#6B6B76" />
      <div className="absolute w-5 h-[2px] bg-red-500 rotate-45 rounded-full" />
    </div>
  );
}

function BusStopLegend() {
  return (
    <div className="shrink-0 px-3 py-2.5" style={{ backgroundColor: '#EDEDEF' }}>
      <div className="flex items-center justify-between text-center">
        <div className="flex flex-col items-center gap-1 flex-1">
          <InaccessibleWheelchairIcon />
          <span className="text-[8px] text-gray-600 leading-tight">Wheelchair Inaccessible<br />Bus Stop</span>
        </div>
        <div className="flex flex-col items-center gap-1 flex-1">
          <AlertTriangle size={15} color="#E8842C" />
          <span className="text-[8px] text-gray-600 leading-tight">Bus Delay</span>
        </div>
        <div className="flex flex-col items-center gap-1 flex-1">
          <CornerUpRight size={15} color="#2E9E4F" />
          <span className="text-[8px] text-gray-600 leading-tight">Route<br />Diversion</span>
        </div>
      </div>
      <div className="flex items-center justify-between text-center mt-2.5 pt-2.5" style={{ borderTop: '1px solid #DADADE' }}>
        <div className="flex flex-col items-center gap-1 flex-1">
          <Accessibility size={15} color="#6B6B76" />
          <span className="text-[8px] text-gray-600 leading-tight">Wheelchair<br />Accessible</span>
        </div>
        <div className="flex flex-col items-center gap-1 flex-1">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#3EAA46' }} />
          <span className="text-[8px] text-gray-600 leading-tight">Seats<br />Available</span>
        </div>
        <div className="flex flex-col items-center gap-1 flex-1">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#F2A93B' }} />
          <span className="text-[8px] text-gray-600 leading-tight">Standing<br />Available</span>
        </div>
        <div className="flex flex-col items-center gap-1 flex-1">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#E14848' }} />
          <span className="text-[8px] text-gray-600 leading-tight">Limited<br />Standing</span>
        </div>
      </div>
    </div>
  );
}

function BusArrivalScreen({ onBack, stopCode = '59409' }) {
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#FAFAFC' }}>
      {/* Header */}
      <div className="shrink-0" style={{ background: GRADIENT }}>
        <StatusBarRow />
        <div className="flex items-center gap-3 px-4 pb-3 pt-1">
          <button onClick={onBack} className="p-1 shrink-0" aria-label="Back to Ask AIVA">
            <ArrowLeft size={20} color="#fff" />
          </button>
          <p className="text-white text-lg font-bold flex-1 text-center">Bus Stop {stopCode}</p>
          <Map size={19} color="#fff" className="shrink-0" />
        </div>
      </div>

      {/* Street name + bike lots */}
      <div className="flex items-center justify-between px-4 py-2 shrink-0" style={{ backgroundColor: '#26262A' }}>
        <span className="text-xs font-medium text-white">Yishun Ring Rd</span>
        <span className="flex items-center gap-1">
          <span className="text-xs font-semibold text-white">00</span>
          <Bike size={14} color="#B9B9C2" />
        </span>
      </div>

      {/* Bus service list */}
      <div className="flex-1 overflow-y-auto bg-white">
        {BUS_ARRIVALS.map((b, i) => (
          <div key={b.number} className="flex items-center justify-between gap-3 px-4 py-3" style={{ borderBottom: i < BUS_ARRIVALS.length - 1 ? '1px solid #EEEEF0' : 'none' }}>
            <div className="min-w-0">
              <p className="text-lg font-bold" style={{ color: PURPLE }}>{b.number}</p>
              <p className="text-xs text-gray-500 truncate">To: {b.destination}</p>
            </div>
            {b.loop ? (
              <RotateCw size={20} color={PURPLE} className="shrink-0" />
            ) : (
              <div className="flex flex-col gap-1.5 items-end shrink-0">
                {b.etas.map((e, j) => (
                  <div key={j} className="flex items-center gap-1.5">
                    {e.accessible ? <Accessibility size={14} color="#6B6B76" /> : <InaccessibleWheelchairIcon />}
                    <Bus size={15} color="#4B4B55" />
                    <span className="text-sm font-semibold w-12 text-right" style={{ color: '#2E9E4F' }}>{e.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <BusStopLegend />
    </div>
  );
}

// ---- Specific bus service arrival + route map — matches supplied Service 806 screenshot ----
const SERVICE_NEARBY_STOP = { code: '59469', name: 'Blk 419', street: 'Yishun Ave 11', etas: ['7 min', '12 min'] };
// Demo-only: services with no stop near the user — their screen shows the route
// without a pinned stop, ETA badge or "Nearby Bus Stop" section.
const NO_NEARBY_STOP_SERVICES = ['960'];
const SERVICE_OTHER_STOPS = [
  { code: '59591', name: 'Bet Blks 405/406', street: 'Yishun Ave 6' },
  { code: '59601', name: 'Blk 391', street: 'Yishun Ave 6' },
  { code: '59801', name: 'Blk 382C', street: 'Yishun Ave 6' },
];

function ServiceRouteMap({ serviceNumber, etaLabel, hasNearbyStop = true }) {
  return (
    <div className="relative shrink-0 overflow-hidden" style={{ height: 260 }}>
      <MapBackground />
      <svg className="absolute inset-0" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
        <path
          d="M35,110 L35,175 L140,175 C165,175 180,190 195,215 L245,290 C258,310 275,318 295,318 L335,318 C352,318 363,303 363,286 L363,175 C363,148 345,128 320,128 L262,128 C240,128 225,142 213,162 L192,205"
          fill="none"
          stroke={PURPLE}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {[[35, 145], [95, 175], [175, 190], [222, 250], [290, 318], [345, 305], [363, 230], [332, 138], [262, 128], [202, 178]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="5" fill="#fff" stroke={PURPLE} strokeWidth="2.5" />
        ))}
        {hasNearbyStop && (
          <>
            <circle cx="295" cy="318" r="7" fill="#2E7BE0" stroke="#fff" strokeWidth="2" />
            <circle cx="265" cy="318" r="6" fill="#F2A93B" stroke="#fff" strokeWidth="2" />
          </>
        )}
        <g transform="translate(150,268)">
          <circle r="10" fill="#E14848" />
          <text y="4" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">H</text>
        </g>
        <text x="168" y="272" fontSize="13" fontWeight="700" fill="#D6335A">Khoo Teck Puat Hospital</text>
      </svg>

      {hasNearbyStop && (
        <div className="absolute top-3 left-3 flex flex-col items-center">
          <div
            className="w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-lg text-white border-2 border-white"
            style={{ backgroundColor: PURPLE }}
          >
            <span className="flex items-center gap-0.5 text-[10px] font-bold">
              <Bus size={11} /> {serviceNumber}
            </span>
            <span className="text-[11px] font-bold leading-none mt-0.5">{etaLabel}</span>
          </div>
        </div>
      )}

      <button
        className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center"
        aria-label="Locate me"
      >
        <Locate size={16} color={GRADIENT} />
      </button>
    </div>
  );
}

function ServiceArrivalScreen({ serviceNumber = '163', etaLabel = '7 min', from = 'Toa Payoh Int', to = 'Sengkang Int', hasNearbyStop = true, pinnedStopCode = '', onBack }) {
  const pinnedStop = pinnedStopCode ? { code: pinnedStopCode, name: 'Selected stop', street: 'Yishun Ave 2', etas: ['4 min', '11 min'] } : null;
  const nearbyStop = pinnedStop || SERVICE_NEARBY_STOP;
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#FAFAFC' }}>
      {/* Header */}
      <div className="shrink-0" style={{ background: GRADIENT }}>
        <StatusBarRow />
        <div className="flex items-center gap-3 px-4 pb-3 pt-1">
          <button onClick={onBack} className="p-1 shrink-0" aria-label="Back to Ask AIVA">
            <ArrowLeft size={20} color="#fff" />
          </button>
          <p className="text-white text-lg font-bold flex-1 text-center">Service {serviceNumber}</p>
          <Map size={19} color="#fff" className="shrink-0" />
        </div>
      </div>

      <ServiceRouteMap serviceNumber={serviceNumber} etaLabel={etaLabel} hasNearbyStop={hasNearbyStop} />

      {/* From / To bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 shrink-0" style={{ backgroundColor: '#1C1C1E' }}>
        <ArrowRightLeft size={16} color="#fff" className="rotate-90 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white truncate"><span className="font-semibold">From:</span> {from}</p>
          <p className="text-xs text-white truncate"><span className="font-semibold">To:</span> {to}</p>
        </div>
        <Info size={18} color="#fff" className="shrink-0" />
      </div>

      {/* Stop list */}
      <div className="flex-1 overflow-y-auto bg-white">
        {hasNearbyStop ? (
          <>
            <div className="px-3 pt-3">
              <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: PURPLE }}>
                {pinnedStop ? 'Selected Bus Stop' : 'Nearby Bus Stop'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-3" style={{ backgroundColor: '#F3ECF5', borderBottom: '1px solid #EEEEF0' }}>
              <div className="min-w-0">
                <p className="text-sm font-bold" style={{ color: PURPLE }}>{nearbyStop.code} - {nearbyStop.name}</p>
                <p className="text-xs text-gray-600 truncate">{nearbyStop.street}</p>
              </div>
              <div className="flex flex-col gap-1.5 items-end shrink-0">
                {nearbyStop.etas.map((eta, j) => (
                  <div key={j} className="flex items-center gap-1.5">
                    <Accessibility size={14} color="#6B6B76" />
                    <Bus size={15} color="#4B4B55" />
                    <span className="text-sm font-semibold w-12 text-right" style={{ color: '#2E9E4F' }}>{eta}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="px-4 py-2 text-xs text-gray-500" style={{ backgroundColor: '#F4F4F6', borderBottom: '1px solid #EEEEF0' }}>
            No bus stop for this service near you — showing the full route.
          </div>
        )}
        {(hasNearbyStop ? SERVICE_OTHER_STOPS : [SERVICE_NEARBY_STOP, ...SERVICE_OTHER_STOPS]).map((s, i, arr) => (
          <div key={s.code} className="flex items-center justify-between gap-3 px-4 py-3" style={{ borderBottom: i < arr.length - 1 ? '1px solid #EEEEF0' : 'none' }}>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-800">{s.code} - {s.name}</p>
              <p className="text-xs text-gray-500 truncate">{s.street}</p>
            </div>
            <RotateCw size={20} color={PURPLE} className="shrink-0" />
          </div>
        ))}
      </div>

      <BusStopLegend />
    </div>
  );
}

// ---- Bridging bus location — station vicinity map with a highlighted pick-up point ----
function StationVicinityMap({ station }) {
  return (
    <svg viewBox="0 0 400 620" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      {/* land base */}
      <rect width="400" height="620" fill="#E9F0E3" />

      {/* city blocks */}
      {[
        { x: 14, y: 40, w: 150, h: 120 },
        { x: 230, y: 30, w: 150, h: 95 },
        { x: 20, y: 215, w: 115, h: 110 },
        { x: 170, y: 230, w: 95, h: 90 },
        { x: 290, y: 220, w: 100, h: 130 },
        { x: 30, y: 370, w: 160, h: 85 },
        { x: 230, y: 390, w: 150, h: 150 },
      ].map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="4" fill="#C9C3D6" opacity="0.55" />
      ))}

      {/* roads */}
      <rect x="0" y="175" width="400" height="14" fill="#fff" />
      <rect x="0" y="355" width="400" height="12" fill="#fff" />
      <rect x="183" y="0" width="14" height="620" fill="#fff" />
      <rect x="0" y="0" width="12" height="620" fill="#fff" opacity="0.7" />

      {/* MRT line + station */}
      <rect x="187" y="0" width="7" height="620" fill="#2E7BE0" opacity="0.7" />
      <circle cx="190" cy="182" r="22" fill="#fff" stroke={PURPLE} strokeWidth="3" />
      <TrainFront x="178" y="170" width="24" height="24" color={PURPLE} />
      <text x="190" y="222" fontSize="12" fontWeight="700" textAnchor="middle" fill={PURPLE_DARK}>
        {station}
      </text>

      {/* building labels */}
      <text x="89" y="100" fontSize="9" textAnchor="middle" fill="#6B6578">Shopping Centre</text>
      <text x="305" y="78" fontSize="9" textAnchor="middle" fill="#6B6578">Office Tower</text>
      <text x="77" y="270" fontSize="9" textAnchor="middle" fill="#6B6578">Hotel</text>
      <text x="217" y="277" fontSize="9" textAnchor="middle" fill="#6B6578">Community Club</text>
      <text x="340" y="285" fontSize="9" textAnchor="middle" fill="#6B6578">Residences</text>
      <text x="110" y="415" fontSize="9" textAnchor="middle" fill="#6B6578">Heritage Place</text>
      <text x="305" y="465" fontSize="9" textAnchor="middle" fill="#6B6578">Park</text>

      {/* exits */}
      {[
        { cx: 150, cy: 175, label: 'A' },
        { cx: 230, cy: 175, label: 'B' },
        { cx: 150, cy: 189, label: 'C' },
        { cx: 230, cy: 189, label: 'D' },
      ].map((e, i) => (
        <g key={i}>
          <circle cx={e.cx} cy={e.cy} r="9" fill="#111114" />
          <text x={e.cx} y={e.cy + 3.5} fontSize="9" fontWeight="700" textAnchor="middle" fill="#fff">{e.label}</text>
        </g>
      ))}

      {/* bridging bus pick-up point — the highlighted marker for this screen */}
      <g transform="translate(300, 190)">
        <circle r="18" fill="#E8842C" stroke="#fff" strokeWidth="3" />
        <Bus x="-10" y="-10" width="20" height="20" color="#fff" />
      </g>
      <rect x="236" y="213" width="128" height="34" rx="8" fill="#fff" stroke="#E8842C" strokeWidth="1.5" />
      <text x="300" y="227" fontSize="9" fontWeight="700" textAnchor="middle" fill="#E8842C">Bridging Bus</text>
      <text x="300" y="239" fontSize="8" textAnchor="middle" fill="#8A8491">Pick-up Point</text>

      {/* compass */}
      <g transform="translate(360,40)">
        <circle r="16" fill="#FFFFFF" opacity="0.9" />
        <path d="M0,-10 L4,0 L0,10 L-4,0 Z" fill="#6B6B76" />
        <text x="0" y="-20" fontSize="9" fill="#6B6B76" textAnchor="middle">N</text>
      </g>
    </svg>
  );
}

function BridgingBusLocationScreen({ station = 'Serangoon MRT', onBack }) {
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#FAFAFC' }}>
      {/* Header */}
      <div className="shrink-0" style={{ background: GRADIENT }}>
        <StatusBarRow />
        <div className="flex items-center gap-3 px-4 pb-3 pt-1">
          <button onClick={onBack} className="p-1 shrink-0" aria-label="Back to Ask AIVA">
            <ArrowLeft size={20} color="#fff" />
          </button>
          <p className="text-white text-lg font-bold flex-1 text-center truncate">{station}</p>
          <Bus size={19} color="#fff" className="shrink-0" />
        </div>
      </div>

      {/* Subtitle strip */}
      <div className="flex items-center justify-center gap-1.5 px-4 py-1.5 shrink-0" style={{ backgroundColor: '#26262A' }}>
        <MapPin size={11} color="#E8842C" />
        <span className="text-xs font-medium text-white">Bridging Bus Location</span>
      </div>

      {/* Map */}
      <div className="relative flex-1 overflow-hidden">
        <StationVicinityMap station={station} />
      </div>

      {/* Drag handle, matches the supplied street-map reference */}
      <div className="shrink-0 flex items-center justify-center py-2 bg-white">
        <div className="w-24 h-1 rounded-full bg-gray-800" />
      </div>
    </div>
  );
}

// ---- Alternative transport options — designated-bus-stop table, matches supplied screenshot ----
function LineBadge({ code }) {
  const prefix = (code.match(/^[A-Za-z]+/) || [''])[0];
  const color = LINE_COLORS[prefix] || '#8A8A93';
  return (
    <span
      className="inline-flex items-center justify-center rounded font-bold text-white mr-1 mb-1 shrink-0"
      style={{ backgroundColor: color, fontSize: 8, padding: '2px 4px', lineHeight: 1.1 }}
    >
      {code}
    </span>
  );
}

const ALT_TRANSPORT_ROWS = [
  { to: 'Bayfront', lines: ['DT16', 'CE1'], exit: 'C', stop: '01119', services: '133' },
  { to: 'Bishan', lines: ['NS17', 'CC15'], exit: 'D', stop: '01541', services: '57' },
  { to: 'Botanic Gardens', lines: ['CC19', 'DT9'], exit: 'D', stop: '01541', services: '48' },
  { to: 'Chinatown', lines: ['NE4', 'DT19'], exit: 'C', stop: '01119', services: '2, 12, 12e*, 33' },
  { to: 'Clarke Quay', lines: ['NE5'], exit: 'C', stop: '01119', services: '2, 12, 12e*, 33' },
  { to: 'Downtown', lines: ['DT17'], exit: 'C', stop: '01119', services: '133' },
  { to: 'Esplanade', lines: ['CC3'], exit: 'C', stop: '01119', services: '130, 133' },
  { to: 'Farrer Road', lines: ['CC20'], exit: 'D', stop: '01541', services: '48' },
  { to: 'Holland Village', lines: ['CC21'], exit: 'D', stop: '01541', services: '48' },
  { to: 'Little India', lines: ['NE7', 'DT12'], exit: 'D', stop: '01541', services: '48, 57' },
  { to: 'Marina Bay', lines: ['NS27', 'TE20', 'CE2'], exit: 'C', stop: '01119', services: '133' },
  { to: 'Newton', lines: ['NS21', 'DT11'], exit: 'D', stop: '01541', services: '48' },
  { to: 'Novena', lines: ['NS20'], exit: 'D', stop: '01541', services: '57' },
  { to: 'one-North', lines: ['CC23'], exit: 'C', stop: '01119', services: '33' },
  { to: 'Outram Park', lines: ['EW16', 'NE3', 'TE17'], exit: 'C', stop: '01119', services: '2, 12, 12e*, 33' },
  { to: 'Prince Edward Road', lines: ['CC32'], exit: 'C', stop: '01119', services: '130, 133' },
  { to: 'Promenade', lines: ['DT15', 'CC4'], exit: 'C', stop: '01119', services: '133, 960, 960e*' },
  { to: 'Raffles Place', lines: ['EW14', 'NS26'], exit: 'C', stop: '01119', services: '130' },
  { to: 'Redhill', lines: ['EW18'], exit: 'C', stop: '01119', services: '33' },
  { to: 'Rochor', lines: ['DT13'], exit: 'D', stop: '01541', services: '48, 57' },
  { to: 'Shenton Way', lines: ['TE19'], exit: 'C', stop: '01119', services: '130, 133' },
  { to: 'Stevens', lines: ['DT10', 'TE11'], exit: 'D', stop: '01541', services: '48' },
];

function AlternativeTransportScreen({ station = 'Serangoon MRT', onBack }) {
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#fff' }}>
      {/* Header */}
      <div className="shrink-0" style={{ background: GRADIENT }}>
        <StatusBarRow />
        <div className="flex items-center gap-3 px-4 pb-3 pt-1">
          <button onClick={onBack} className="p-1 shrink-0" aria-label="Back to Ask AIVA">
            <ArrowLeft size={20} color="#fff" />
          </button>
          <p className="text-white text-lg font-bold flex-1 text-center truncate">{station}</p>
          <div className="w-5 shrink-0" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Title + designated bus stop notes */}
        <div className="px-4 pt-4 pb-3">
          <p className="text-center text-lg font-serif text-gray-900">Bus services at designated bus stops</p>
          <div className="mt-3 text-[13px] text-gray-800 leading-relaxed">
            <p>Bus Stop 3 : 01119, Aft {station} Exit C, Victoria St</p>
            <p>Bus Stop 6 : 01541, {station} Exit D, Rochor Rd</p>
            <p className="font-bold mt-1">Note : * Operates on selected days and / or times</p>
          </div>
        </div>

        {/* Table — fixed percentage widths (not Tailwind arbitrary flex-[n]
            classes, which this renderer doesn't reliably pick up) so every
            row's columns line up exactly under the header. Line badges get
            their own column instead of wrapping under the destination name. */}
        <div>
          <div className="flex items-stretch text-white font-bold" style={{ backgroundColor: '#9E9EA6', fontSize: 10 }}>
            <div style={{ flex: '0 0 28%', padding: '7px 8px' }}>Going to</div>
            <div style={{ flex: '0 0 22%', padding: '7px 4px' }}>Line</div>
            <div style={{ flex: '0 0 10%', padding: '7px 2px', textAlign: 'center' }}>Exit</div>
            <div style={{ flex: '0 0 16%', padding: '7px 2px', textAlign: 'center', lineHeight: 1.15 }}>Bus<br />Stop</div>
            <div style={{ flex: '0 0 24%', padding: '7px 4px', lineHeight: 1.15 }}>Bus<br />Services</div>
          </div>
          {ALT_TRANSPORT_ROWS.map((r, i) => (
            <div
              key={r.to}
              className="flex items-stretch"
              style={{ backgroundColor: i % 2 === 0 ? '#E7E7EA' : '#fff', fontSize: 11 }}
            >
              <div style={{ flex: '0 0 28%', padding: '8px 8px' }}>
                <p className="font-serif text-gray-900 leading-snug">{r.to}</p>
              </div>
              <div style={{ flex: '0 0 22%', padding: '8px 4px' }} className="flex flex-wrap items-start content-start">
                {r.lines.map((l) => <LineBadge key={l} code={l} />)}
              </div>
              <div style={{ flex: '0 0 10%', padding: '8px 2px', textAlign: 'center' }} className="font-serif text-gray-900">
                {r.exit}
              </div>
              <div style={{ flex: '0 0 16%', padding: '8px 2px' }} className="flex items-start justify-center">
                <span className="rounded font-bold text-white px-1 py-0.5" style={{ backgroundColor: '#2E9DB0', fontSize: 9 }}>
                  {r.stop}
                </span>
              </div>
              <div style={{ flex: '0 0 24%', padding: '8px 4px' }} className="font-serif text-gray-900 leading-snug">
                {r.services}
              </div>
            </div>
          ))}
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
        className={`absolute inset-0 z-30 bg-black transition-opacity duration-300 ${
          open ? 'opacity-40 pointer-events-auto' : 'opacity-0 pointer-events-none'
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
  const [showAivaLauncher, setShowAivaLauncher] = useState(true);
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
      <div
        className="relative flex-1 overflow-hidden"
        onClick={() => { if (!showAivaLauncher) setShowAivaLauncher(true); }}
      >
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

        {/* Floating Ask AIVA launcher — tap the badge to dismiss it, tap
            anywhere else on the map to bring it back. */}
        {showAivaLauncher && (
          <button
            onClick={onOpenAiva}
            className="absolute flex items-center gap-2"
            style={{ bottom: '28%', right: '10%' }}
            aria-label="Ask AIVA"
          >
            <span className="bg-white rounded-full px-3 py-1.5 shadow-md text-xs font-medium text-gray-700 whitespace-nowrap">
              Ask AIVA
            </span>
            <span className="relative">
              <AivaPortrait size={44} />
              <span
                onClick={(e) => { e.stopPropagation(); setShowAivaLauncher(false); }}
                role="button"
                aria-label="Hide Ask AIVA icon"
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gray-500 flex items-center justify-center active:scale-90 transition"
              >
                <X size={9} color="#fff" />
              </span>
            </span>
          </button>
        )}
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

// Station map card — shows a brief "downloading from AIVA backend" state before
// the map itself is revealed, so the map only loads once the "download" finishes.
function StationMapCard({ msg, onEnlargeMap }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1300);
    return () => clearTimeout(timer);
  }, []);

  const { Map, Icon } = LEVEL_INFO[msg.level];
  const station = msg.station || 'Punggol Coast MRT';

  return (
    <div className="flex flex-col items-start">
      {loaded ? (
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
      ) : (
        <div className="max-w-xs w-64 bg-white shadow-sm rounded-2xl overflow-hidden text-left" style={{ height: 200 }}>
          <div className="flex flex-col items-center justify-center gap-2 h-full px-4">
            <RefreshCw size={20} color={PURPLE} className="animate-spin" />
            <p className="text-xs font-medium text-gray-500 text-center">Downloading {station} map…</p>
          </div>
        </div>
      )}
      <p className="text-[10px] text-gray-400 mt-1 pl-1">{formatTime(msg.time)}</p>
    </div>
  );
}

function Message({ msg, onOption, onRate, onEnlargeMap }) {
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
    return (
      <div className="flex flex-col items-start">
        <div
          className="max-w-xs bg-white shadow-sm rounded-2xl rounded-bl-md px-4 py-2.5 text-sm leading-relaxed"
          style={{ color: PURPLE_DARK }}
        >
          {msg.text}
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
    return <StationMapCard msg={msg} onEnlargeMap={onEnlargeMap} />;
  }

  if (msg.type === 'aiva-rating') {
    return <StarRating selected={msg.selected} onSelect={(n) => onRate(msg.id, n)} />;
  }

  return null;
}

export default function AskAivaMockup() {
  const [screen, setScreen] = useState('home'); // 'home' | 'chat' | 'journey' | 'nearby' | 'busArrival' | 'serviceArrival' | 'bridgingBusLocation' | 'alternativeTransport' | 'browser'
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [journeyOrigin, setJourneyOrigin] = useState('Current location');
  const [journeyDestination, setJourneyDestination] = useState('Singapore Polytechnic');
  const [enlargedMap, setEnlargedMap] = useState(null);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const [awaitingOtherFeedback, setAwaitingOtherFeedback] = useState(false);
  const [awaitingOriginReply, setAwaitingOriginReply] = useState(false);
  const [pendingDestination, setPendingDestination] = useState('');
  const [pendingServiceNumber, setPendingServiceNumber] = useState('163');
  const [pendingBusStopCode, setPendingBusStopCode] = useState('59409');
  const [pendingBridgingBusStation, setPendingBridgingBusStation] = useState('Serangoon MRT');
  const [pendingAlternativeTransportStation, setPendingAlternativeTransportStation] = useState('Serangoon MRT');
  const [awaitingServiceBusStop, setAwaitingServiceBusStop] = useState(false);
  const [pendingServiceForStop, setPendingServiceForStop] = useState('');
  // Demo-only toggle (rendered outside the phone frame) so a presenter can switch
  // which service-arrival scenario free-text queries follow, without retyping.
  // 'main' = Scenario 1 (always link straight to the arrival screen).
  // 'deeplink3' = Scenario 2 (ask which bus stop, when one wasn't given).
  const [scenarioMode, setScenarioMode] = useState('main');
  const [pendingServiceStop, setPendingServiceStop] = useState('');
  const [trainDisruption, setTrainDisruption] = useState(true);
  const [nearbyStopAvailable, setNearbyStopAvailable] = useState(true);
  const [pendingStationBusStops, setPendingStationBusStops] = useState('Downtown');
  const [soundOn, setSoundOn] = useState(true);
  const scrollRef = useRef(null);

  const [messages, setMessages] = useState(() => buildWelcomeMessages());

  function buildWelcomeMessages() {
    const now = Date.now();
    const t = (minutesAgo) => new Date(now - minutesAgo * 60000);
    return [
      { id: nextId(), type: 'aiva-text', time: t(1), text: "Hello, I'm AIVA, your friendly AI Virtual Assistant. I'm here to help you with your journey. You can also check in with me if you have any questions about ticketing." },
    ];
  }

  const resetChat = () => {
    setMessages(buildWelcomeMessages());
    setIsTyping(false);
    setIsRecording(false);
    setIsTranscribing(false);
    setInputValue('');
    setAwaitingOtherFeedback(false);
    setAwaitingOriginReply(false);
    setPendingDestination('');
    setAwaitingServiceBusStop(false);
    setPendingServiceForStop('');
    setShowErrorBanner(false);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isTranscribing, screen]);

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
      addMessage({ type: 'aiva-text', text: `Here is the station map of Punggol Coast MRT Station, ${level}.` });
      addMessage({ type: 'aiva-image', level });
    }, 900);
  };

  // Bus stops near a named MRT station — button opens the station bus-stop list.
  const handleStationBusStops = (stationName, userText) => {
    clearOptions();
    addMessage({ type: 'user', text: userText });
    respond(() => {
      addMessage({ type: 'aiva-text', text: `Please follow the link to see the bus stops near ${stationName} MRT Station.` });
      addMessage({ type: 'aiva-options', options: [`Bus stops near ${stationName} STN`] });
      setPendingStationBusStops(stationName);
    }, 700);
  };

  // Train service status — a plain text answer, no button.
  const handleTrainStatus = (userText) => {
    clearOptions();
    addMessage({ type: 'user', text: userText });
    respond(() => {
      addMessage({ type: 'aiva-text', text: trainDisruption
        ? '0901 hrs: NEL - Additional travelling time of 20 minutes between Boon Keng and Dhoby Ghaut stations towards HarbourFront station due to a signal fault.'
        : 'All train services are running normally' });
    }, 700);
  };

  // Replacing a travel card — a plain text answer, no button.
  const handleReplaceTravelCard = (userText) => {
    clearOptions();
    addMessage({ type: 'user', text: userText });
    respond(() => {
      addMessage({ type: 'aiva-text', text: 'You can replace your travel card at the SimplyGo office counter. The staff will assist you further.' });
    }, 700);
  };

  // Station / interchange maps are not offered through AIVA, whether or not a
  // station was named, so every wayfinding request gets the same reply.
  const handleStationMapEntry = (userText = 'Show me the station map') => {
    clearOptions();
    addMessage({ type: 'user', text: userText });
    respond(() => {
      addMessage({ type: 'aiva-text', text: 'Station and interchange maps are not available through AIVA.' });
    }, 700);
  };

  const handlePunggolSelect = (userText = 'Punggol Coast MRT') => {
    clearOptions();
    addMessage({ type: 'user', text: userText });
    respond(() => {
      addMessage({ type: 'aiva-text', text: 'Which station level map would you like to view?' });
      addMessage({ type: 'aiva-options', options: ['Platform Level', 'Concourse Level', 'Upper Concourse Level'] });
    }, 700);
  };

  const handleAmkSelect = (userText = 'Ang Mo Kio Bus Interchange') => {
    clearOptions();
    addMessage({ type: 'user', text: userText });
    respond(() => {
      addMessage({ type: 'aiva-text', text: 'Here is the map of the Ang Mo Kio Bus Interchange.' });
      addMessage({ type: 'aiva-image', level: 'Bus Interchange', station: 'Ang Mo Kio Bus Interchange' });
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

  const handleBusArrivalTimes = (userText = 'When is the next bus arriving?') => {
    clearOptions();
    addMessage({ type: 'user', text: userText });
    respond(() => {
      addMessage({ type: 'aiva-text', text: 'Please follow the link to see bus services near you and the arrival times.' });
      addMessage({ type: 'aiva-options', options: ['Bus arrival times near me'] });
    }, 700);
  };

  // Demo-only invalid service numbers, so the "not found" flow is reachable
  const INVALID_SERVICE_NUMBERS = ['999'];

  // Scenario 1 / final step of Scenario 2 — service (and its bus stop) are known
  const respondWithServiceArrivalLink = (serviceNumber, stopCode = '') => {
    respond(() => {
      addMessage({ type: 'aiva-text', text: stopCode
        ? `Please follow the link to see arrival time of service ${serviceNumber} at bus stop ${stopCode}.`
        : `Please follow the link to see arrival time of service ${serviceNumber}.` });
      addMessage({ type: 'aiva-options', options: [`Service ${serviceNumber} arrival times`] });
      setPendingServiceNumber(serviceNumber);
      setPendingServiceStop(stopCode);
    }, 700);
  };

  const handleServiceArrivalTime = (serviceNumber, userText, stopCode) => {
    clearOptions();
    addMessage({ type: 'user', text: userText || `When is bus ${serviceNumber} arriving?` });

    if (INVALID_SERVICE_NUMBERS.includes(serviceNumber)) {
      return respond(() => {
        addMessage({ type: 'aiva-text', text: "I couldn't find that bus service. Please check the service number." });
      }, 700);
    }

    // Scenario 1 — a bus stop was already given (or we're in "main" demo mode,
    // which always resolves to the nearest stop from the user's location)
    // Scenario B — user-provided stop: pinned on the service screen
    if (stopCode) {
      return respondWithServiceArrivalLink(serviceNumber, stopCode);
    }
    // Scenario A — "arrival time of bus X": nearest stop from current location
    // Scenario C — no stop given ("arrival time of bus X" / "bus X arriving?"):
    // go straight to the link; screen pins nearest stop, or route only if none within 1 km
    return respondWithServiceArrivalLink(serviceNumber);
    // eslint-disable-next-line no-unreachable
    if (false) {
      return respondWithServiceArrivalLink(serviceNumber);
    }

    // Scenario C — "When is bus X arriving?": ask for the bus stop first
    respond(() => {
      addMessage({ type: 'aiva-text', text: `Which bus stop are you taking bus ${serviceNumber} from?` });
      setPendingServiceForStop(serviceNumber);
      setAwaitingServiceBusStop(true);
    }, 700);
  };

  const handleServiceBusStopReply = (reply) => {
    addMessage({ type: 'user', text: reply });
    setAwaitingServiceBusStop(false);
    const serviceNumber = pendingServiceForStop || '163';
    respondWithServiceArrivalLink(serviceNumber);
  };

  // Demo-only invalid bus stop codes, so the "not found" flow is reachable
  const INVALID_BUS_STOP_CODES = ['66666'];

  const handleBusStopCode = (stopCode, userText) => {
    clearOptions();
    addMessage({ type: 'user', text: userText || `What are the available bus services at bus stop ${stopCode}` });
    const isValid = /^\d{4,6}$/.test(stopCode) && !INVALID_BUS_STOP_CODES.includes(stopCode);
    respond(() => {
      if (isValid) {
        addMessage({ type: 'aiva-text', text: `Please follow the link to see bus services at bus stop ${stopCode}.` });
        addMessage({ type: 'aiva-options', options: [`Bus stop ${stopCode} arrival times`] });
        setPendingBusStopCode(stopCode);
      } else {
        addMessage({ type: 'aiva-text', text: "I couldn't find that bus stop code. Please check the code or enter the stop name." });
        addMessage({ type: 'aiva-options', options: ['Bus stops near me'] });
      }
    }, 700);
  };

  // Parses free text like: How do I get to "Singapore Zoo" from "Marina Bay Sands"
  // Also handles the destination-only form: How do I get to Singapore Zoo
  const parseJourneyRequest = (text) => {
    const clean = (s) =>
      s
        .trim()
        .replace(/^["'“”‘’]+|["'“”‘’]+$/g, '')
        .replace(/[?.!]+$/, '')
        .trim();
    const fromMatch = text.match(/(?:get|go)\s+to\s+(.+?)\s+from\s+(.+)$/i);
    if (fromMatch) {
      return { destination: clean(fromMatch[1]), origin: clean(fromMatch[2]) };
    }
    const toMatch = text.match(/(?:get|go)\s+to\s+(.+)$/i);
    if (toMatch) {
      return { destination: clean(toMatch[1]), origin: null };
    }
    return { destination: null, origin: null };
  };

  // Scenario A — origin and destination both provided in one message
  const handleJourneyWithOrigin = (destination, origin, userText) => {
    clearOptions();
    addMessage({ type: 'user', text: userText });
    respond(() => {
      addMessage({ type: 'aiva-text', text: 'Sure, here is the route to your destination.' });
      addMessage({ type: 'aiva-options', options: ['View my journey planner'] });
      setJourneyOrigin(origin);
      setJourneyDestination(destination);
    }, 800);
  };

  // Scenario B, step 1 — destination provided, origin unavailable
  const handleJourneyStub = (userText, destination) => {
    clearOptions();
    addMessage({ type: 'user', text: userText });
    setPendingDestination(destination || 'your destination');
    respond(() => {
      addMessage({ type: 'aiva-text', text: 'Could you tell me where you are right now?' });
      setAwaitingOriginReply(true);
    }, 700);
  };

  // Scenario B, step 2 — user replies with their current location
  const handleOriginReply = (reply) => {
    addMessage({ type: 'user', text: reply });
    setAwaitingOriginReply(false);
    const destination = pendingDestination || 'your destination';
    const origin = reply.trim();
    respond(() => {
      addMessage({ type: 'aiva-text', text: 'Sure, here is the route to your destination.' });
      addMessage({ type: 'aiva-options', options: ['View my journey planner'] });
      setJourneyOrigin(origin);
      setJourneyDestination(destination);
    }, 800);
  };

  // Demo-only: MRT stations not operated by SBS Transit, so the "not found" flow is reachable
  const INVALID_MRT_STATIONS = ['clementi'];
  const isKnownMrtStation = (station) => {
    const s = (station || '').trim().toLowerCase();
    return s.length > 0 && !INVALID_MRT_STATIONS.some((invalid) => s.includes(invalid));
  };

  // Alternative transport options at a named station — the button is a
  // display-only affordance for this mockup, it doesn't need to link anywhere.
  const handleAlternativeTransport = (station, userText) => {
    clearOptions();
    addMessage({ type: 'user', text: userText });
    respond(() => {
      if (!isKnownMrtStation(station)) {
        return addMessage({ type: 'aiva-text', text: "Sorry, I can only provide bridging bus and alternative bus services information for affected stations operated by SBS Transit." });
      }
      addMessage({ type: 'aiva-text', text: `Sure — here are the alternative transport options available at ${station}.` });
      addMessage({ type: 'aiva-options', options: ['View alternative transport options'] });
      setPendingAlternativeTransportStation(station);
    }, 700);
  };

  // Bridging bus location at a named station — same display-only button pattern.
  const handleBridgingBusLocation = (station, userText) => {
    clearOptions();
    addMessage({ type: 'user', text: userText });
    respond(() => {
      if (!isKnownMrtStation(station)) {
        return addMessage({ type: 'aiva-text', text: "Sorry, I can only provide bridging bus and alternative bus services information for affected stations operated by SBS Transit." });
      }
      addMessage({ type: 'aiva-text', text: `Sure — here are the bridging bus locations at ${station}.` });
      addMessage({ type: 'aiva-options', options: ['View bridging bus locations'] });
      setPendingBridgingBusStation(station);
    }, 700);
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
      setShowExitWarning(true);
    }, 700);
  };

  const handleGiveFeedback = () => {
    handleContactUsRedirect('Give feedback');
  };

  const handleOption = (opt) => {
    if (LEVEL_INFO[opt]) return handleLevelSelect(opt);
    if (opt === 'Station Map') return handleStationMapEntry();
    if (opt === 'Punggol Coast MRT') return handlePunggolSelect();
    if (opt === 'Ang Mo Kio Bus Interchange') return handleAmkSelect();
    if (opt === 'Where is the nearest bus stop?') return handleNearestBusStop();
    if (opt === 'How do I get to…?') return handleJourneyStub(opt, null);
    if (opt === 'View my journey planner') return setScreen('journey');
    if (opt === 'Bus stops near me') return setScreen('nearby');
    if (/^Bus stops near .+ STN$/.test(opt)) return setScreen('stationBusStops');
    if (opt === 'Bus arrival times near me') {
      setPendingBusStopCode('59409');
      return setScreen('busArrival');
    }
    if (/^Bus stop (.+) arrival times$/.test(opt)) return setScreen('busArrival');
    if (/^Service (.+) arrival times$/.test(opt)) return setScreen('serviceArrival');
    if (opt === 'View bridging bus locations') return setScreen('bridgingBusLocation');
    if (opt === 'View alternative transport options') return setScreen('alternativeTransport');
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

    if (awaitingServiceBusStop) {
      return handleServiceBusStopReply(text);
    }

    if (awaitingOriginReply) {
      return handleOriginReply(text);
    }

    const lower = text.toLowerCase();
    if (lower.includes('provide feedback') || lower.includes('give feedback') || lower.includes('leave feedback') || lower.includes('submit feedback') || lower.includes('complaint') || lower.includes('complain')) {
      return handleContactUsRedirect(text);
    }
    // These two are checked before the generic bus-service/bus-arrival matching
    // below, since phrasing like "bridging bus services" would otherwise be
    // caught by the "bus service" keyword meant for regular bus arrival times.
    if (lower.includes('alternative transport') || lower.includes('alternate transport')) {
      const stationMatch = text.match(/\bat\s+(.+?)[\?\.!]*$/i);
      const station = stationMatch ? stationMatch[1].trim() : 'this station';
      return handleAlternativeTransport(station, text);
    }
    if (lower.includes('bridging bus')) {
      const stationMatch = text.match(/\bat\s+(.+?)[\?\.!]*$/i);
      const station = stationMatch ? stationMatch[1].trim() : 'this station';
      return handleBridgingBusLocation(station, text);
    }
    const stationBusStopMatch = text.match(/\bbus stops?\s+(?:near|at|around|close to|nearby)\s+(.+?)\s+(?:mrt|lrt|stn)\b/i);
    if (stationBusStopMatch) {
      const name = stationBusStopMatch[1].trim().replace(/\b\w/g, (c) => c.toUpperCase());
      return handleStationBusStops(name, text);
    }
    const serviceMatch = text.match(/\b(?:bus|service)\s+(\d{1,4}[a-zA-Z]?)\b/i);
    const busStopCodeMatch = text.match(/\bbus stop\s+(\d{4,6})\b/i);
    if (serviceMatch) {
      return handleServiceArrivalTime(serviceMatch[1].toUpperCase(), text, busStopCodeMatch ? busStopCodeMatch[1] : null);
    }
    if (busStopCodeMatch) {
      return handleBusStopCode(busStopCodeMatch[1], text);
    }
    if (lower.includes('bus stop')) {
      return handleNearestBusStop(text);
    }
    if (
      /\b(disruption|delay|delays|delayed|breakdown|fault)\b/.test(lower) && /\b(train|mrt|lrt|rail|line)\b/.test(lower) ||
      /\b(train|mrt|rail)\s+(service\s+)?(status|update|disruption|delay)/.test(lower) ||
      /\b(current|latest)\s+(train|mrt|rail)\b/.test(lower) ||
      lower.includes('train status') || lower.includes('service disruption')
    ) {
      return handleTrainStatus(text);
    }
    if (lower.includes('next bus') || lower.includes('bus arriv') || lower.includes('bus service') || lower.includes('bus timing')) {
      return handleBusArrivalTimes(text);
    }
    if (
      /\b(replace|replacement|lost|loss|damaged|faulty)\b/.test(lower) &&
      /\b(travel ?card|ez-?link|card)\b/.test(lower)
    ) {
      return handleReplaceTravelCard(text);
    }
    if (lower.includes('station map') || lower.includes('interchange map') || lower.includes('wayfinding')) {
      return handleStationMapEntry(text);
    }
    if (lower.includes('get to') || lower.includes('go to')) {
      const { destination, origin } = parseJourneyRequest(text);
      if (destination && origin) {
        return handleJourneyWithOrigin(destination, origin, text);
      }
      if (destination) {
        return handleJourneyStub(text, destination);
      }
      return handleJourneyStub(text, null);
    }
    if (lower.includes('journey') || lower.includes('direction')) {
      return handleJourneyStub(text, null);
    }

    addMessage({ type: 'user', text });
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage({ type: 'aiva-text', text: "Sorry. As a SBS Transit AI Virtual Assistant, I might not be able to answer that. Is there another inquiry related to public transportation you would like to make?" });
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
    <div className="min-h-screen w-full flex items-center justify-center gap-10 bg-gray-100 p-6">
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
            onBack={() => setScreen('chat')}
          />
        ) : screen === 'stationBusStops' ? (
          <StationBusStopsScreen station={pendingStationBusStops} onBack={() => setScreen('chat')} />
        ) : screen === 'nearby' ? (
          <NearbyScreen onBack={() => setScreen('chat')} />
        ) : screen === 'busArrival' ? (
          <BusArrivalScreen stopCode={pendingBusStopCode} onBack={() => setScreen('chat')} />
        ) : screen === 'serviceArrival' ? (
          <ServiceArrivalScreen serviceNumber={pendingServiceNumber} pinnedStopCode={pendingServiceStop} hasNearbyStop={(nearbyStopAvailable && !NO_NEARBY_STOP_SERVICES.includes(pendingServiceNumber)) || !!pendingServiceStop} onBack={() => setScreen('chat')} />
        ) : screen === 'bridgingBusLocation' ? (
          <BridgingBusLocationScreen station={pendingBridgingBusStation} onBack={() => setScreen('chat')} />
        ) : screen === 'alternativeTransport' ? (
          <AlternativeTransportScreen station={pendingAlternativeTransportStation} onBack={() => setScreen('chat')} />
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

        {/* Edge case — AIVA returned an unrecognized response or an error;
            the chat stays intact and usable underneath the banner. */}
        {showErrorBanner && (
          <div
            className="px-4 py-2 shrink-0 flex items-start gap-2"
            style={{ backgroundColor: '#FDECEC', borderBottom: '1px solid #F8C9C9' }}
          >
            <AlertTriangle size={14} color="#D6335A" className="mt-0.5 shrink-0" />
            <p className="text-xs text-left flex-1" style={{ color: '#B0233F' }}>
              Sorry, something went wrong. Please try again.
            </p>
            <button
              onClick={() => setShowErrorBanner(false)}
              aria-label="Dismiss error"
              className="shrink-0 p-0.5"
            >
              <X size={14} color="#B0233F" />
            </button>
          </div>
        )}

        {/* Chat area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-3 py-4 space-y-3"
          style={{ background: PAGE_GRADIENT }}
        >
          {/* AIVA intro row: avatar + name on the left, sound toggle on the right */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <AivaPortrait size={56} />
              <div className="leading-tight">
                <p className="text-xs font-bold" style={{ color: PURPLE_DARK }}>AIVA</p>
                <p className="text-[10px] text-gray-500">AI Virtual Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setSoundOn((s) => !s)}
              className="flex items-center gap-1.5 pl-3 pr-2.5 py-2 rounded-full transition shrink-0"
              style={{ backgroundColor: '#EFE3F5' }}
              aria-label="Toggle sound"
            >
              <span className="text-xs font-semibold" style={{ color: PURPLE_DARK }}>
                {soundOn ? 'Sound On' : 'Sound Off'}
              </span>
              {soundOn ? <Volume2 size={17} color={PURPLE_DARK} /> : <VolumeX size={17} color={PURPLE_DARK} />}
            </button>
          </div>

          {messages.map((msg) => (
            <Message
              key={msg.id}
              msg={msg}
              onOption={handleOption}
              onRate={handleRate}
              onEnlargeMap={setEnlargedMap}
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
                    : awaitingOriginReply
                    ? 'Enter your current location…'
                    : awaitingServiceBusStop
                    ? 'Enter your bus stop code…'
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

      {/* Demo-only control, outside the phone/app UI. */}
      <div className="flex flex-col gap-3 select-none">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Train Service</p>
        <button
          onClick={() => setTrainDisruption((v) => !v)}
          className="text-left px-4 py-2.5 rounded-lg text-sm font-medium transition border"
          style={
            trainDisruption
              ? { backgroundColor: '#D6335A', color: '#fff', borderColor: '#D6335A' }
              : { backgroundColor: '#2E9E4F', color: '#fff', borderColor: '#2E9E4F' }
          }
          aria-pressed={trainDisruption}
        >
          {trainDisruption ? 'Disruption: ON' : 'Disruption: OFF (normal)'}
          <span className="block text-xs font-normal opacity-80 mt-0.5">
            {trainDisruption ? 'NEL signal fault reported' : 'All train services running normally'}
          </span>
        </button>
        <p className="text-xs text-gray-400 max-w-[220px] leading-relaxed">
          Controls AIVA&apos;s reply to &ldquo;Is there a train disruption now?&rdquo;.
        </p>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mt-2">Bus Service Screen</p>
        <button
          onClick={() => setNearbyStopAvailable((v) => !v)}
          className="text-left px-4 py-2.5 rounded-lg text-sm font-medium transition border"
          style={
            nearbyStopAvailable
              ? { backgroundColor: '#2E9E4F', color: '#fff', borderColor: '#2E9E4F' }
              : { backgroundColor: '#fff', color: '#4B4B55', borderColor: '#E5E5EA' }
          }
          aria-pressed={nearbyStopAvailable}
        >
          {nearbyStopAvailable ? 'Stop within 1 km: YES' : 'Stop within 1 km: NO'}
          <span className="block text-xs font-normal opacity-80 mt-0.5">
            {nearbyStopAvailable ? 'Nearest stop pinned' : 'Service route only'}
          </span>
        </button>
        <p className="text-xs text-gray-400 max-w-[220px] leading-relaxed">
          Applies when the user doesn&apos;t name a stop. A stop the user names (e.g. 67019) is always pinned.
        </p>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mt-2">Edge Case</p>
        <button
          onClick={() => { setScreen('chat'); setShowErrorBanner(true); }}
          className="text-left px-4 py-2.5 rounded-lg text-sm font-medium transition border"
          style={
            showErrorBanner
              ? { backgroundColor: '#D6335A', color: '#fff', borderColor: '#D6335A' }
              : { backgroundColor: '#fff', color: '#4B4B55', borderColor: '#E5E5EA' }
          }
        >
          Unrecognized response / error
          <span className="block text-xs font-normal opacity-80 mt-0.5">Shows the error banner — chat stays intact</span>
        </button>
        <p className="text-xs text-gray-400 max-w-[220px] leading-relaxed">
          Simulates AIVA returning a response the app doesn&apos;t recognize, or an error. The banner sits at the top of the chat; the conversation underneath stays fully usable, and it can be dismissed with the ✕.
        </p>
      </div>
    </div>
  );
}
