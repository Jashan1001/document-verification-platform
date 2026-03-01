import { FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const chartData = [
  { month: "Jan", verified: 12 },
  { month: "Feb", verified: 18 },
  { month: "Mar", verified: 25 },
  { month: "Apr", verified: 30 },
  { month: "May", verified: 22 },
  { month: "Jun", verified: 35 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h2>
        <p className="text-sm opacity-60 mt-1">
          Summary of document activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Documents"
          value="124"
          icon={<FileText size={20} />}
        />
        <StatCard
          title="Approved"
          value="78"
          icon={<CheckCircle size={20} />}
        />
        <StatCard
          title="Pending"
          value="32"
          icon={<Clock size={20} />}
        />
        <StatCard
          title="Rejected"
          value="14"
          icon={<XCircle size={20} />}
        />
      </div>

      {/* Analytics Chart */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-gray-200 dark:border-neutral-800 shadow-sm transition-colors duration-300">
        <h3 className="text-lg font-semibold mb-4">
          Monthly Verification Trend
        </h3>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="verified"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-gray-200 dark:border-neutral-800 shadow-sm transition-colors duration-300">
        <h3 className="text-lg font-semibold mb-4">
          Recent Documents
        </h3>

        <table className="w-full text-sm">
          <thead className="opacity-60 text-left">
            <tr>
              <th className="pb-3">Title</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-200 dark:border-neutral-800">
              <td className="py-3">Degree Certificate</td>
              <td>
                <StatusBadge status="APPROVED" />
              </td>
              <td>2026-03-01</td>
            </tr>
            <tr className="border-t border-gray-200 dark:border-neutral-800">
              <td className="py-3">ID Verification</td>
              <td>
                <StatusBadge status="PENDING" />
              </td>
              <td>2026-02-25</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between">
        <span className="text-sm opacity-70">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold mt-4">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const base =
    "px-3 py-1 text-xs rounded-full font-medium";

  if (status === "APPROVED")
    return (
      <span
        className={`${base} bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300`}
      >
        Approved
      </span>
    );

  if (status === "PENDING")
    return (
      <span
        className={`${base} bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300`}
      >
        Pending
      </span>
    );

  return (
    <span
      className={`${base} bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300`}
    >
      Rejected
    </span>
  );
}