import { useEffect, useState } from "react";
import { api } from "../../services/api";

interface Document {
  id: string;
  title: string;
  status: "UPLOADED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get("/documents");

        // 🔒 SAFE RESPONSE HANDLING
        const data = response.data;

        if (Array.isArray(data)) {
          setDocuments(data);
        } else if (Array.isArray(data.documents)) {
          setDocuments(data.documents);
        } else if (Array.isArray(data.data)) {
          setDocuments(data.data);
        } else {
          setDocuments([]);
        }

      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
          "Failed to load documents"
        );
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  if (loading) {
    return (
      <div className="text-sm opacity-60">
        Loading documents...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Documents
        </h2>
        <p className="text-sm opacity-60 mt-1">
          Manage and track your uploaded documents
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-neutral-800 text-left">
            <tr>
              <th className="px-6 py-3 font-medium">Title</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Created</th>
            </tr>
          </thead>

          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center opacity-60">
                  No documents found
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-t border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
                >
                  <td className="px-6 py-4">{doc.title}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="px-6 py-4">
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

function StatusBadge({
  status,
}: {
  status: "UPLOADED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
}) {
  const base = "px-3 py-1 text-xs rounded-full font-medium";

  switch (status) {
    case "APPROVED":
      return (
        <span className={`${base} bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300`}>
          Approved
        </span>
      );

    case "UNDER_REVIEW":
      return (
        <span className={`${base} bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300`}>
          Under Review
        </span>
      );

    case "REJECTED":
      return (
        <span className={`${base} bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300`}>
          Rejected
        </span>
      );

    default:
      return (
        <span className={`${base} bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300`}>
          Uploaded
        </span>
      );
  }
}