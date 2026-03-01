import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { FileText, CheckCircle, Clock, XCircle } from "lucide-react";

interface Summary {
  total: number;
  uploaded: number;
  underReview: number;
  approved: number;
  rejected: number;
  recentDocuments: {
    id: string;
    title: string;
    status: string;
    createdAt: string;
  }[];
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get("/dashboard/summary");
        setSummary(response.data.data); // matches successResponse format
      } catch (err) {
        console.error("Failed to load summary");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <div className="opacity-60">Loading dashboard...</div>;
  }

  if (!summary) {
    return <div className="text-red-500">Failed to load dashboard.</div>;
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h2>
        <p className="text-sm opacity-60 mt-1">
          Real-time document activity summary
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

        <StatCard
          title="Total"
          value={summary.total}
          icon={<FileText size={18} />}
        />

        <StatCard
          title="Uploaded"
          value={summary.uploaded}
          icon={<FileText size={18} />}
        />

        <StatCard
          title="Under Review"
          value={summary.underReview}
          icon={<Clock size={18} />}
        />

        <StatCard
          title="Approved"
          value={summary.approved}
          icon={<CheckCircle size={18} />}
        />

        <StatCard
          title="Rejected"
          value={summary.rejected}
          icon={<XCircle size={18} />}
        />

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
            {summary.recentDocuments.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-6 opacity-60 text-center">
                  No recent documents
                </td>
              </tr>
            ) : (
              summary.recentDocuments.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-t border-gray-200 dark:border-neutral-800"
                >
                  <td className="py-3">{doc.title}</td>
                  <td>
                    <StatusBadge status={doc.status} />
                  </td>
                  <td>
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
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
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between">
        <span className="text-sm opacity-70">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold mt-4">
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const base = "px-3 py-1 text-xs rounded-full font-medium";

  if (status === "APPROVED")
    return (
      <span className={`${base} bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300`}>
        Approved
      </span>
    );

  if (status === "UNDER_REVIEW")
    return (
      <span className={`${base} bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300`}>
        Under Review
      </span>
    );

  if (status === "REJECTED")
    return (
      <span className={`${base} bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300`}>
        Rejected
      </span>
    );

  return (
    <span className={`${base} bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300`}>
      Uploaded
    </span>
  );
}