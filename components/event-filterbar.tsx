'use client'

import { useState } from "react"
import SearchBar from "./search-bar"

export default function EventFilterBar() {
    const [paid, setPaid] = useState(false)
    const [timeFilter, setTimeFilter] = useState("today")

    return (
        <aside className="w-64 shrink-0 border-r border-border p-4 flex flex-col gap-6">
            <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                Filter Events
            </h2>
            <SearchBar onQueryChange={(e) => undefined} />

            <div className="flex flex-col gap-2">
                <label htmlFor="distance" className="text-sm font-medium text-foreground">
                    Vegalengd (km)
                </label>
                <input
                    id="distance"
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    defaultValue={10}
                    className="w-full accent-primary"
                />
                <span className="text-xs text-muted-foreground">Upp að 100km</span>
            </div>

            <div className="flex items-center justify-between">
                <label htmlFor="paid" className="text-sm font-medium text-foreground">
                    Komugjald?
                </label>
                <input
                    id="paid"
                    type="checkbox"
                    checked={paid}
                    onChange={(e) => setPaid(e.target.checked)}
                    className="accent-primary w-4 h-4"
                />
            </div>

            {paid && (
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                        Verð bil
                    </label>
                    <div className="flex gap-2 items-center">
                        <input
                            type="number"
                            placeholder="Min"
                            className="w-20 p-1 border border-border rounded bg-background text-foreground"
                        />
                        <span>-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            className="w-20 p-1 border border-border rounded bg-background text-foreground"
                        />
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-foreground">When</span>
                <div className="flex flex-col gap-1">
                    {[
                        { id: "today", label: "Í dag" },
                        { id: "tomorrow", label: "Á morgun" },
                        { id: "this-week", label: "Þessi vika" },
                        { id: "this-month", label: "Þessi mánuður" },
                        { id: "anytime", label: "Allt" },
                    ].map((opt) => (
                        <label
                            key={opt.id}
                            className="flex items-center gap-2 text-sm text-foreground cursor-pointer"
                        >
                            <input
                                type="radio"
                                name="timeFilter"
                                value={opt.id}
                                checked={timeFilter === opt.id}
                                onChange={(e) => setTimeFilter(e.target.value)}
                                className="accent-primary"
                            />
                            {opt.label}
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between">
                <label htmlFor="ongoing" className="text-sm font-medium text-foreground">
                    Í gangi
                </label>
                <input
                    id="ongoing"
                    type="checkbox"
                    className="accent-primary w-4 h-4"
                />
            </div>
        </aside>
    )
}
