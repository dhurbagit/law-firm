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
    <section className="py-5 bg-nepal-dark border-top border-bottom border-sakura">
      <div className="container-xl">
        <div className="row g-4">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="col-12 col-sm-6 col-lg-3">
                <div className="sakura-glass-card h-100 p-4 d-flex flex-column justify-content-between">
                  <div>
                    <div 
                      className="d-flex align-items-center justify-content-center rounded-3 bg-nepal-dark border border-sakura text-white mb-3"
                      style={{ width: '42px', height: '42px' }}
                    >
                      <Icon style={{ width: '20px', height: '20px' }} />
                    </div>
                    <div className="font-serif fs-2 fw-bold text-crimson mb-1">
                      {item.value}
                    </div>
                    <div className="text-uppercase fw-bold text-white small mb-2" style={{ letterSpacing: '0.05em' }}>
                      {item.label}
                    </div>
                  </div>
                  <p className="text-white-50 small mb-0 lh-base">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
