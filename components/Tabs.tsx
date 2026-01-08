// Tabs Component
// Accessible tab interface for content sections

'use client'

import { useState } from 'react'

interface Tab {
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultIndex?: number
  className?: string
}

export default function Tabs({ tabs, defaultIndex = 0, className = '' }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  
  if (!tabs || tabs.length === 0) return null
  
  return (
    <div className={className}>
      {/* Tab List */}
      <div 
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4"
        role="tablist"
        aria-label="Content tabs"
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`tab whitespace-nowrap ${index === activeIndex ? 'active' : ''}`}
            role="tab"
            aria-selected={index === activeIndex}
            aria-controls={`tabpanel-${index}`}
            id={`tab-${index}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab Panels */}
      {tabs.map((tab, index) => (
        <div
          key={index}
          id={`tabpanel-${index}`}
          role="tabpanel"
          aria-labelledby={`tab-${index}`}
          hidden={index !== activeIndex}
          className="animate-fade-in"
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}
