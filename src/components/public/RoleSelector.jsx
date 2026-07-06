import React from 'react';
import { Trash2, Recycle, Sprout, GraduationCap, ShieldCheck } from 'lucide-react';

const roles = [
  { value: 'waste_producer', label: 'Waste Producer', description: 'Report waste, schedule pickups, and earn credits.', icon: Trash2 },
  { value: 'bio_processor', label: 'Bio Processor', description: 'Manage processing operations and inventory.', icon: Recycle },
  { value: 'farmer', label: 'Farmer', description: 'Access the marketplace and sustainability tools.', icon: Sprout },
  { value: 'learner', label: 'Learner', description: 'Join learning tracks and earn certificates.', icon: GraduationCap },
  { value: 'admin', label: 'Administrator', description: 'Manage platform operations and users.', icon: ShieldCheck },
];

export default function RoleSelector({ selectedRole, onSelect, title = 'Choose your role', description = 'Select the role that best describes you.' }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const active = selectedRole === role.value;
          return (
            <button
              key={role.value}
              type="button"
              onClick={() => onSelect(role.value)}
              className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                active ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-card hover:border-primary/40 hover:bg-accent/50'
              }`}
            >
              <div className={`mt-0.5 rounded-full p-2 ${active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{role.label}</p>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
