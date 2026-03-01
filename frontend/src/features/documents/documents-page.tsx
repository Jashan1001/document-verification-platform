import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { UploadCloud } from "lucide-react";
import { useRef } from "react";
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
  const [showModal, setShowModal] = useState(false);

  const fetchDocuments = async () => {
    try {
      const response = await api.get("/documents");

      // ✅ Backend returns: { success, message, data }
      const docs = response.data.data;

      setDocuments(docs || []);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to load documents"
      );
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  if (loading) return <div className="opacity-60">Loading documents...</div>;

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
          <p className="text-sm opacity-60 mt-1">
            Upload and manage documents
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-90 transition"
        >
          Upload Document
        </button>
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
                <td colSpan={3} className="text-center py-8 opacity-60">
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

      {showModal && (
        <UploadModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            setLoading(true);
            fetchDocuments();
          }}
        />
      )}
    </div>
  );
}

function UploadModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!file || !title) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      setLoading(true);
      await api.post("/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSuccess();
    } catch {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl w-full max-w-md space-y-6 shadow-2xl border border-gray-200 dark:border-neutral-800">

        <h3 className="text-xl font-semibold">
          Upload Document
        </h3>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Document Title"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-transparent outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* File Upload Box */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-black dark:hover:border-white transition"
        >
          <UploadCloud size={32} className="mb-3 opacity-70" />

          {file ? (
            <p className="text-sm font-medium">
              {file.name}
            </p>
          ) : (
            <>
              <p className="text-sm font-medium">
                Click to upload file
              </p>
              <p className="text-xs opacity-60 mt-1">
                PDF, JPG, PNG supported
              </p>
            </>
          )}

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="text-sm opacity-60 hover:opacity-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const base = "px-3 py-1 rounded-full text-xs font-medium";

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