
import { Link } from 'react-router-dom';

export default function StatCard({ title, value, description, icon, type = "primary", to }) {
    const cardContent = (
        <div className={`stat-card ${type} ${to ? 'cursor-pointer hover:opacity-90' : ''}`}>
            <div className="stat-card-header">
                <div>
                    <span className="stat-title">{title}</span>
                    <h2 className="stat-value">{value}</h2>
                </div>
                <div className="stat-icon">
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
            </div>
            {description && <p className="stat-description">{description}</p>}
        </div>
    );

    if (to) {
        return <Link to={to}>{cardContent}</Link>;
    }

    return cardContent;
}
