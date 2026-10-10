import React from 'react';
import { X, Bookmark, Download, FileText, Trash2, ArrowRight } from 'lucide-react';
import { OrganizationSummary } from '../types';

interface ShortlistModalProps {
  bookmarkedOrgs: OrganizationSummary[];
  onClose: () => void;
  onRemoveBookmark: (org: OrganizationSummary) => void;
  onClearAll: () => void;
  onSelectOrg: (org: OrganizationSummary) => void;
}

export const ShortlistModal: React.FC<ShortlistModalProps> = ({
  bookmarkedOrgs,
  onClose,
  onRemoveBookmark,
  onClearAll,
  onSelectOrg,
}) => {
  const exportMarkdown = () => {
    let md = `# My GSoC Target Organizations\n\nGenerated from GSoC Organizations Pro (${new Date().toLocaleDateString()})\n\n`;
    md += `| Organization | Category | Consistency | Total Slots | Website | Ideas Page |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;

    bookmarkedOrgs.forEach((org) => {
      md += `| **${org.name}** | ${org.category} | ${org.years_count}/11 Years | ${org.total_projects} | [Site](${org.url}) | [Ideas](${org.ideas_url || org.url}) |\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-gsoc-shortlist.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    let csv = 'Name,Category,YearsActive,TotalProjects,Website,IdeasURL\n';
    bookmarkedOrgs.forEach((org) => {
      csv += `"${org.name}","${org.category}",${org.years_count},${org.total_projects},"${org.url}","${org.ideas_url || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-gsoc-shortlist.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative z-10 flex h-full max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 p-5">
          <div className="flex items-center gap-2.5">
            <Bookmark className="h-5 w-5 text-amber-500 fill-amber-500" />
            <div>
              <h2 className="text-lg font-bold text-foreground">My Shortlisted Organizations</h2>
              <p className="text-xs text-muted-foreground">
                {bookmarkedOrgs.length} saved target organization{bookmarkedOrgs.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {bookmarkedOrgs.length > 0 && (
              <>
                <button
                  onClick={exportMarkdown}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  title="Export Markdown proposal list"
                >
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  <span>Export .MD</span>
                </button>
                <button
                  onClick={exportCSV}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  title="Export CSV spreadsheet"
                >
                  <Download className="h-3.5 w-3.5 text-emerald-500" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={onClearAll}
                  className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
                  title="Clear all bookmarks"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {bookmarkedOrgs.length > 0 ? (
            <div className="grid gap-3">
              {bookmarkedOrgs.map((org) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/20 hover:border-primary/40 transition-colors group"
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div
                      className="h-11 w-11 rounded-xl border border-border p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-sm"
                      style={{ backgroundColor: org.image_background_color || '#ffffff' }}
                    >
                      {org.image_url ? (
                        <img src={org.image_url} alt={org.name} className="h-full w-full object-contain" />
                      ) : (
                        <span className="font-bold text-xs">{org.name.slice(0, 2)}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        onClick={() => {
                          onClose();
                          onSelectOrg(org);
                        }}
                        className="font-bold text-sm text-foreground hover:text-primary transition-colors cursor-pointer truncate"
                      >
                        {org.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{org.category}</span>
                        <span>•</span>
                        <span className="font-mono text-emerald-500 font-medium">
                          {org.years_count}/11 Years
                        </span>
                        <span>•</span>
                        <span className="font-mono font-medium">{org.total_projects} slots</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectOrg(org);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => onRemoveBookmark(org)}
                      className="text-muted-foreground hover:text-destructive p-1 rounded-md"
                      title="Remove bookmark"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Bookmark className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <h3 className="text-base font-semibold text-foreground">No organizations shortlisted yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                Click the bookmark icon on any organization card to save it here for tracking your proposals.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

