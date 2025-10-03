import React from "react";
import {
  CalendarDays,
  Users,
  Clock,
  Building2,
  ArrowRightCircle,
} from "lucide-react";

const statusStyles = {
  approved: "bg-emerald-500/20 text-emerald-900 border-emerald-400/40",
  accepted: "bg-emerald-500/20 text-emerald-900 border-emerald-400/40",
  published: "bg-emerald-500/20 text-emerald-900 border-emerald-400/40",
  pending: "bg-yellow-500/20 text-yellow-900 border-yellow-400/40",
  review: "bg-yellow-500/20 text-yellow-900 border-yellow-400/40",
  declined: "bg-red-500/20 text-red-900 border-red-400/40",
  rejected: "bg-red-500/20 text-red-900 border-red-400/40",
};

const formatStatus = (status) => {
  if (!status) {
    return { label: "Pending", classes: statusStyles.pending };
  }
  const normalized = status.toLowerCase();
  const base = statusStyles[normalized] || statusStyles.pending;
  const label = status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return { label, classes: base };
};

const formatDate = (timestamp) => {
  if (!timestamp) return "Updated recently";
  try {
    return new Date(timestamp).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch (error) {
    return "Updated recently";
  }
};

export function HoverEffect({ items = [] }) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <div className="grid w-full gap-6 grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
      {items.map((item, index) => {
        const key = item?.id || index;
        const { label: statusLabel, classes: statusClasses } = formatStatus(item?.status);
        const convenorText = item?.convenors && item.convenors.length > 0
          ? item.convenors.join(", ")
          : "TBA";

        return (
          <div
            key={key}
            onClick={item?.onClick}
            className="group relative flex h-full min-w-[320px] cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/40 bg-white/90 p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_50px_-12px_rgba(255,152,0,0.45)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-orange/10 via-transparent to-accent-yellow/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-accent-orange/30 to-accent-yellow/30 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-70" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-orange">
                <Building2 className="h-3.5 w-3.5" />
                {item?.association || "Association"}
              </span>
              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusClasses}`}>
                {statusLabel}
              </span>
            </div>

            <div className="relative z-10 mt-5 space-y-3">
              <h3 className="text-2xl font-bold text-gray-900">{item?.title}</h3>
              {item?.tagline && (
                <p className="text-sm font-medium text-accent-orange/90">{item.tagline}</p>
              )}
              {item?.about && (
                <p className="text-sm text-gray-600">
                  {item.about.length > 140 ? `${item.about.slice(0, 140)}…` : item.about}
                </p>
              )}
            </div>

            <div className="relative z-10 mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2 rounded-2xl bg-gray-50 px-3 py-2">
                  <CalendarDays className="h-4 w-4 text-accent-orange" />
                  <span className="font-medium text-gray-700">Schedule:</span>
                  <span className="truncate">{item?.dayInfo || "TBA"}</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-gray-50 px-3 py-2">
                  <Users className="h-4 w-4 text-accent-orange" />
                  <span className="font-medium text-gray-700">Convenors:</span>
                  <span className="truncate">{convenorText}</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-gray-50 px-3 py-2">
                  <Clock className="h-4 w-4 text-accent-orange" />
                  <span className="font-medium text-gray-700">Last updated:</span>
                  <span className="truncate">{formatDate(item?.updatedAt)}</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-8 flex items-center justify-between">
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  item?.onClick?.();
                }}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-orange to-accent-yellow px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                View details
                <ArrowRightCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}