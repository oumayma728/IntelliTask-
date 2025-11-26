import { FaChartBar, FaCalendarAlt, FaCheckCircle,FaClipboardList } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import useTaskInsights from "../hooks/useTaskInsights";

export default function TaskInsightsDashboard() {
    const { summary, upcoming, productivity, loading, error } = useTaskInsights();

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">Error loading insights</p>;

    const cardClass = "flex items-center p-5 rounded-xl shadow-md hover:shadow-xl transition-shadow bg-gradient-to-r  to-gray-50";

    return (
        <div className="space-y-8">
            {/* Top summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className={`${cardClass} border-l-4 border-blue-500`}>
                    <FaChartBar className="w-10 h-10 text-blue-500 mr-5" />
                    <div>
                        <p className=" uppercase text-xs font-medium">Total Tasks</p>
                        <p className="text-2xl font-bold">{summary?.Total || 0}</p>
                    </div>
                </div>

                <div className={`${cardClass} border-l-4 border-green-500`}>
                    <FaCheckCircle className="w-10 h-10 text-green-500 mr-5" />
                    <div>
                        <p className=" uppercase text-xs font-medium">Completed</p>
                        <p className="text-2xl font-bold">{summary?.Completed || 0}</p>
                    </div>
                </div>

                <div className={`${cardClass} border-l-4 border-red-500`}>
                    <FaCalendarAlt className="w-10 h-10 text-red-500 mr-5" />
                    <div>
                        <p className=" uppercase text-xs font-medium">Overdue</p>
                        <p className="text-2xl font-bold">{summary?.Overdue || 0}</p>
                    </div>
                </div>
                <div className={`${cardClass} border-l-4 border-yellow-500`}>
                    <FaClipboardList className="w-10 h-10 text-yellow-500 mr-5" />
                    <div>
                        <p className=" uppercase text-xs font-medium">To Do</p>
                        <p className="text-2xl font-bold">{summary?.ToDo || 0}</p>
                    </div>
                </div>
            </div>

            {/* Productivity chart */}
            <div className="p-6 rounded-xl shadow-md ">
                <h2 className="text-lg font-semibold mb-4">Weekly Productivity</h2>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={productivity}>
                        <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <YAxis allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#f9fafb", borderRadius: "8px", border: "none" }}
                        />
                        <Bar dataKey="completed" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Upcoming tasks */}
            <div className={`${cardClass} border-l-4 border-yellow-500`}>
                <FaCalendarAlt className="w-10 h-10 text-yellow-500 mr-5" />
                <div>
                    <p className=" uppercase text-xs font-medium">Upcoming Tasks</p>
                    <p className="text-2xl font-bold">
                        {Array.isArray(upcoming) ? upcoming.length : upcoming?.data?.length || 0}
                    </p>
                    {upcoming && !upcoming.data && (
                        <p className="text-sm text-gray-500 mt-1">{upcoming.message}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
