import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import apiClient from '../utils/api';
import { FaChevronLeft, FaChevronRight, FaCheck, FaTimes } from 'react-icons/fa';

interface Habit {
  _id: string;
  name: string;
  timesPerDay: number;
}

interface Checkin {
  _id: string;
  date: string;
  habitId: string;
  habitName: string;
}

interface TileProps {
  date: Date;
  view: string;
}

interface GroupedCheckin {
  name: string;
  count: number;
}

interface StatsDetail {
  habitId: string;
  name: string;
  count: number;
  goal: number;
}

interface StatsData {
  date: string;
  details: StatsDetail[];
}

const customTileClass = ({ date, view }: TileProps, checkins: Checkin[], habits: Habit[]): string => {
  if (view !== 'month') return '';
  const ymd = date.toISOString().slice(0, 10);
  const dayCheckins = checkins.filter((c: Checkin) => c.date.slice(0, 10) === ymd);
  
  if (dayCheckins.length === 0) return 'no-activity-day';
  
  // Calcular si se cumplieron todas las metas del día
  const totalGoal = habits.reduce((sum: number, habit: Habit) => sum + habit.timesPerDay, 0);
  const totalCompleted = dayCheckins.length;
  
  if (totalCompleted >= totalGoal) return 'all-goals-met';
  if (totalCompleted > 0) return 'partial-activity';
  
  return '';
};

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHabit, setSelectedHabit] = useState<Date | null>(null);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [checkinDate, setCheckinDate] = useState('');
  const [checkinTime, setCheckinTime] = useState('');
  const [checkinNotes, setCheckinNotes] = useState('');
  const [editingCheckin, setEditingCheckin] = useState<Checkin | null>(null);
  const [deletingCheckin, setDeletingCheckin] = useState<Checkin | null>(null);
  const [viewMode, setViewMode] = useState('month');
  const [filterHabit, setFilterHabit] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [monthTransition, setMonthTransition] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const { data: habits } = await apiClient.get('/habits');
      setHabits(habits);
      let allCheckins: Checkin[] = [];
      for (const h of habits) {
        const { data: cks } = await apiClient.get(`/habits/${h._id}/checkins`);
        allCheckins = allCheckins.concat(cks.map((c: any) => ({ ...c, habitId: h._id, habitName: h.name })));
      }
      setCheckins(allCheckins);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const getTileContent = ({ date, view }: TileProps): React.ReactElement | null => {
    if (view !== 'month') return null;
    const ymd = date.toISOString().slice(0, 10);
    const dayCheckins = checkins.filter((c: Checkin) => c.date.slice(0, 10) === ymd);
    
    if (dayCheckins.length === 0) return null;
    
    const totalGoal = habits.reduce((sum: number, habit: Habit) => sum + habit.timesPerDay, 0);
    const totalCompleted = dayCheckins.length;
    
    return (
      <div className="tile-content">
        <div className="tile-count">{totalCompleted} ✓</div>
        {totalCompleted >= totalGoal && <FaCheck className="tile-check" />}
      </div>
    );
  };

  const getTileTooltip = ({ date, view }: TileProps): string | null => {
    if (view !== 'month') return null;
    const ymd = date.toISOString().slice(0, 10);
    const dayCheckins = checkins.filter((c: Checkin) => c.date.slice(0, 10) === ymd);
    
    if (dayCheckins.length === 0) {
      return `Sin actividad - ${new Date(ymd).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}`;
    }
    
    const grouped: Record<string, GroupedCheckin> = {};
    dayCheckins.forEach((c: Checkin) => {
      if (!grouped[c.habitId]) grouped[c.habitId] = { name: c.habitName, count: 0 };
      grouped[c.habitId].count++;
    });
    
    const habitList = Object.values(grouped).map((h: GroupedCheckin) => `${h.name} (${h.count})`).join(', ');
    const totalGoal = habits.reduce((sum: number, habit: Habit) => sum + habit.timesPerDay, 0);
    const totalCompleted = dayCheckins.length;
    
    return `${totalCompleted}/${totalGoal} hábitos completados: ${habitList}`;
  };

  const handleDayClick = (date: Date) => {
    setSelectedHabit(date);
    const ymd = date.toISOString().slice(0, 10);
    const dayCheckins = checkins.filter((c: Checkin) => c.date.slice(0, 10) === ymd);
    const grouped: Record<string, GroupedCheckin> = {};
    dayCheckins.forEach((c: Checkin) => {
      if (!grouped[c.habitId]) grouped[c.habitId] = { name: c.habitName, count: 0 };
      grouped[c.habitId].count++;
    });
    const details = Object.entries(grouped).map(([habitId, data]: [string, GroupedCheckin]) => {
      const habit = habits.find((h: Habit) => h._id === habitId);
      return {
        habitId,
        name: data.name,
        count: data.count,
        goal: habit ? habit.timesPerDay : 1
      };
    });
    setStatsData({ date: ymd, details });
  };

  const handleMonthChange = (newDate: any) => {
    if (newDate instanceof Date) {
      setMonthTransition(true);
      setTimeout(() => {
        setCurrentDate(newDate);
        setMonthTransition(false);
      }, 150);
    }
  };

  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',overflow:'hidden',padding:'0 12px'}}>
      <style>{`
        .react-calendar {
          border: none;
          border-radius: 24px;
          font-family: Inter, Arial, sans-serif;
          background: #fff;
          box-shadow: 0 4px 32px #0002;
          padding: 32px 24px 18px 24px;
          margin: 0 auto;
          max-width: 1000px;
          min-width: 320px;
          width: 100%;
          transition: opacity 0.15s ease-in-out;
        }
        .react-calendar.transitioning {
          opacity: 0.7;
        }
        .react-calendar__tile {
          border-radius: 14px;
          transition: all 0.2s ease;
          font-size: 20px;
          font-weight: 600;
          padding: 18px 0 24px 0;
          position: relative;
          cursor: pointer;
        }
        .react-calendar__tile--active, .react-calendar__tile:focus {
          background: #bbf7d0 !important;
          color: #166534 !important;
          box-shadow: 0 0 0 2px #4ade80;
          transform: scale(1.05);
        }
        .react-calendar__tile--now {
          background: #fef9c3 !important;
          color: #ca8a04 !important;
        }
        .all-goals-met {
          background: #dcfce7 !important;
          color: #16a34a !important;
          border: 2px solid #4ade80;
          box-shadow: 0 2px 8px #4ade8033;
        }
        .partial-activity {
          background: #fef3c7 !important;
          color: #d97706 !important;
          border: 2px solid #fbbf24;
          box-shadow: 0 2px 8px #fbbf2433;
        }
        .no-activity-day {
          background: #f3f4f6 !important;
          color: #9ca3af !important;
        }
        .react-calendar__tile:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .react-calendar__month-view__weekdays__weekday {
          color: #16a34a;
          font-weight: 800;
          font-size: 18px;
          letter-spacing: -1px;
        }
        .tile-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .tile-count {
          font-size: 15px;
          font-weight: 800;
          letter-spacing: -1px;
        }
        .tile-check {
          font-size: 12px;
          color: #16a34a;
        }
        .react-calendar__navigation {
          margin-bottom: 20px;
        }
        .react-calendar__navigation button {
          background: none;
          border: none;
          font-size: 18px;
          font-weight: 600;
          color: #16a34a;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .react-calendar__navigation button:hover {
          background: #dcfce7;
          transform: scale(1.05);
        }
        .react-calendar__navigation__label {
          font-size: 20px;
          font-weight: 700;
          color: #166534;
          transition: all 0.2s ease;
        }
        .calendar-modal-anim {
          animation: calendarModalIn 0.25s cubic-bezier(.4,1.6,.6,1) both;
        }
        @keyframes calendarModalIn {
          0% { transform: scale(0.85) translateY(40px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @media (max-width: 900px) {
          .react-calendar {
            max-width: 98vw;
            padding: 18px 2vw 8px 2vw;
          }
        }
        @media (max-width: 600px) {
          .react-calendar {
            font-size: 15px;
            padding: 8px 0 0 0;
          }
        }
      `}</style>
      <div style={{width:'100%',maxWidth:1100,background:'#fff',borderRadius:24,boxShadow:'0 4px 32px #0002',padding:'24px',margin:'24px 0',position:'relative'}}>
        {loading ? (
          <div style={{textAlign:'center', color:'#16a34a', fontWeight:700, fontSize:22}}>Cargando...</div>
        ) : habits.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#555' }}>
            <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>Aún no has creado ningún hábito.</p>
            <p style={{ marginTop: '10px' }}>¡Crea tu primer hábito para empezar a ver tu progreso en el calendario!</p>
          </div>
        ) : (
          <Calendar
            onClickDay={handleDayClick}
            tileContent={getTileContent}
            tileClassName={(args: TileProps) => customTileClass(args, checkins, habits)}
            onChange={handleMonthChange}
            value={currentDate}
            locale="es-ES"
            className={monthTransition ? 'transitioning' : ''}
          />
        )}
      </div>
      {statsData && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'#0007',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div className="calendar-modal-anim" style={{background:'#fff',borderRadius:20,padding:44,minWidth:340,maxWidth:600,boxShadow:'0 8px 40px #0004',textAlign:'center',position:'relative',width:'90vw'}}>
            <h3 style={{fontSize:26,fontWeight:800,marginBottom:22,color:'#16a34a',letterSpacing:'-1px'}}>
              Detalle del {new Date(statsData.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h3>
            {statsData.details.length === 0 ? (
              <div style={{color:'#888',fontSize:18}}>No hay hábitos completados este día.</div>
            ) : (
              <ul style={{listStyle:'none',padding:0,margin:0}}>
                {statsData.details.map((d: StatsDetail, i: number) => (
                  <li key={d.habitId} style={{marginBottom:18,textAlign:'left',display:'flex',alignItems:'center',gap:10}}>
                    <span style={{fontWeight:800,color:'#16a34a',fontSize:19}}>{d.name}</span>
                    <span style={{marginLeft:10,color:'#555',fontSize:16}}>{d.count}/{d.goal}</span>
                    {d.count >= d.goal && <FaCheck style={{color:'#22c55e',fontSize:22,marginLeft:8}} />}
                    {d.count < d.goal && <FaTimes style={{color:'#ef4444',fontSize:22,marginLeft:8}} />}
                  </li>
                ))}
              </ul>
            )}
            <button onClick={()=>setStatsData(null)} style={{marginTop:28,background:'#16a34a',color:'#fff',padding:'14px 32px',border:'none',borderRadius:10,fontWeight:800,cursor:'pointer',fontSize:18,boxShadow:'0 2px 12px #16a34a22'}}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage; 