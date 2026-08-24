import React from 'react';
import { FirmStats } from '@/lib/api';
import { ShieldCheck, Scale, Award, Trophy } from 'lucide-react';

interface StatsSectionProps {
  stats: FirmStats;
}

export function StatsSection({ stats }: StatsSectionProps) {
  const statItems = [
    {
      label: "Total Client Recoveries",
      value: stats.recovered_amount || "$250M+",
      description: "Secured in landmark verdicts & confidential arbitrations",
      icon: Trophy,
    },
    {
      label: "Trial Success Rate",
      value: stats.success_rate || "98.6%",
      description: "Documented across federal & state jurisdictions",
      icon: ShieldCheck,
    },
    {
      label: "Decades of Advocacy",
      value: stats.years_experience || "35+ Years",
      description: "Founded on relentless client dedication",
      icon: Scale,
    },
    {
      label: "Clients Represented",
      value: stats.cases_resolved || "5,200+",
      description: "From corporate boards to injured families",
      icon: Award,
    },
  ];

  return (
    <section className="relative z-10 py-12 bg-[#000000] border-y border-[#003893]/40 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="p-6 rounded-2xl bg-[#00122E] border border-[#003893]/50 relative overflow-hidden group hover:border-[#DC143C] transition-all duration-300 shadow-xl"
              >
                <div className="w-10 h-10 rounded-lg bg-[#001C4A] border border-[#003893] flex items-center justify-center text-white mb-4 group-hover:bg-[#DC143C] group-hover:border-[#003893] transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-serif text-3xl sm:text-4xl font-extrabold text-[#DC143C] tracking-tight mb-1">
                  {item.value}
                </div>
                <div className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                  {item.label}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
