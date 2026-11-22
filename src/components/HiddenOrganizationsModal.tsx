import React, { useState, useEffect } from 'react';
import { X, EyeOff, RotateCcw, Search, ArrowRight, Layers } from 'lucide-react';
import { OrganizationSummary } from '../types';

interface HiddenOrganizationsModalProps {
  hiddenOrgs: OrganizationSummary[];
  onClose: () => void;
  onRestoreOrg: (org: OrganizationSummary) => void;
  onRestoreAll: () => void;
  onSelectOrg: (org: OrganizationSummary) => void;
}

export const HiddenOrganizationsModal: React.FC<HiddenOrganizationsModalProps> = ({
  hiddenOrgs,
  onClose,
  onRestoreOrg,
  onRestoreAll,
  onSelectOrg,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const filteredHiddenOrgs = hiddenOrgs.filter((org) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchName = org.name.toLowerCase().includes(q);
    const matchCategory = org.category.toLowerCase().includes(q);
    const matchTech = org.technologies.some((t) => t.toLowerCase().includes(q));
    return matchName || matchCategory || matchTech;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hidden-orgs-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 flex h-full max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted border border-border">
              <EyeOff className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h2 id="hidden-orgs-title" className="text-lg font-bold text-foreground">
                Hidden Organizations
              </h2>
              <p className="text-xs text-muted-foreground">
                {hiddenOrgs.length} organization{hiddenOrgs.length !== 1 ? 's' : ''} blacklisted from discovery results
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hiddenOrgs.length > 0 && (
              <button
                type="button"
                onClick={onRestoreAll}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/50 hover:bg-muted transition-colors cursor-pointer"
                title="Restore all hidden organizations to results"
                aria-label="Restore all hidden organizations"
              >
                <RotateCcw className="h-3.5 w-3.5 text-primary" />
                <span>Restore All</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search bar inside modal if there are hidden orgs */}
        {hiddenOrgs.length > 3 && (
          <div className="border-b border-border/60 bg-card px-5 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search hidden organizations by name, category, or tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted/50 py-1.5 pl-9 pr-14 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-muted-foreground hover:text-foreground px-1 py-0.5 rounded"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {hiddenOrgs.length > 0 ? (
            filteredHiddenOrgs.length > 0 ? (
              <div className="grid gap-3">
                {filteredHiddenOrgs.map((org) => (
                  <div
                    key={org.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/20 hover:border-border/80 transition-colors group"
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <div
                        className="h-11 w-11 rounded-xl border border-border p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-sm"
                        style={{ backgroundColor: org.image_background_color || '#ffffff' }}
                      >
                        {org.image_url ? (
                          <img
                            src={org.image_url}
                            alt={org.name}
                            className="h-full w-full object-contain pointer-events-none"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="font-bold text-xs">{org.name.slice(0, 2).toUpperCase()}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3
                            onClick={() => {
                              onClose();
                              onSelectOrg(org);
                            }}
                            className="font-bold text-sm text-foreground hover:text-primary transition-colors cursor-pointer truncate"
                            title={org.name}
                          >
                            {org.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{org.category}</span>
                          <span>•</span>
                          <span className="font-mono text-emerald-500 font-medium">
                            {org.years_count}/11 Years
                          </span>
                          <span>•</span>
                          <span className="font-mono font-medium">{org.total_projects} projects</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectOrg(org);
                        }}
                        className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                        title="View organization details"
                      >
                        <span>Details</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onRestoreOrg(org)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all cursor-pointer shadow-xs"
                        title={`Restore ${org.name} to search results`}
                        aria-label={`Restore ${org.name}`}
                      >
                        <RotateCcw className="h-3 w-3 text-primary" />
                        <span>Restore</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Layers className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                <h3 className="text-sm font-semibold text-foreground">
                  No hidden organizations match "{searchQuery}"
                </h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1">
                  Try a different search term or clear the filter.
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-16 text-muted-foreground select-none">
              <EyeOff className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <h3 className="text-base font-semibold text-foreground">No hidden organizations</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 leading-relaxed">
                Organizations you hide from search or category results will appear here. You can restore them at any time to include them in discovery again.
              </p>
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="border-t border-border/60 bg-muted/20 px-5 py-3 text-[11px] text-muted-foreground flex items-center justify-between">
          <span>
            Hidden organizations are securely saved in your browser's local storage.
          </span>
          {hiddenOrgs.length > 0 && (
            <span className="font-mono text-foreground font-medium">
              {hiddenOrgs.length} blacklisted
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
