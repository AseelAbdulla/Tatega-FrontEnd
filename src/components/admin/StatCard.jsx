export default function StatCard({
    title,
    value,
    description,
    icon,
    type = "primary",
}) {
    return (
        <div className={`stat-card stat-card-${type}`}>

            <div className="stat-card-header">

                <div>
                    <span className="stat-title">
                        {title}
                    </span>

                    <strong className="stat-value">
                        {value}
                    </strong>
                </div>

                <div className="stat-icon">
                    <span className="material-symbols-outlined">
                        {icon}
                    </span>
                </div>

            </div>

            <div className="stat-description">
                {description}
            </div>

        </div>
    );
}