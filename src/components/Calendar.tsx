import { useState } from 'react';

const Calendar = ({ onSelectDate, initialDate, minDate }: { onSelectDate: (date: string) => void, initialDate: Date, minDate: Date }) => {
    const [date, setDate] = useState(initialDate);

    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const daysInMonth = endOfMonth.getDate();
    const startDay = startOfMonth.getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: startDay });

    const prevMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    const nextMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));

    const handleDayClick = (day: number) => {
        const selected = new Date(date.getFullYear(), date.getMonth(), day);
        if (selected >= minDate) {
            onSelectDate(selected.toISOString().split('T')[0]);
        }
    };

    return (
        <div className="calendar-popover">
            <div className="calendar-header">
                <button type="button" onClick={prevMonth}>‹</button>
                <span>{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                <button type="button" onClick={nextMonth}>›</button>
            </div>
            <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="calendar-day-name">{d}</div>)}
                {emptyDays.map((_, i) => <div key={`empty-${i}`} className="calendar-day empty"></div>)}
                {days.map(day => {
                    const fullDate = new Date(date.getFullYear(), date.getMonth(), day);
                    const isDisabled = fullDate < minDate;
                    return (
                        <div
                            key={day}
                            className={`calendar-day ${isDisabled ? 'disabled' : ''}`}
                            onClick={() => !isDisabled && handleDayClick(day)}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;