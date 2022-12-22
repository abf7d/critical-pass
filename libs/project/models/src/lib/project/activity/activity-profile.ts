export interface ActivityProfile {
    id: number;
    sortOrder?: number;
    name?: string;
    duration?: number;
    depends_on: string; // Comma delimited string of ints
    finish?: string; // Date in format m/d/yyyy like 6/17/2013
    planned_completion_date?: string; // Date in format m/d/yyyy like 6/17/2013
    planned_earned_value?: number; // Int
    start_date?: string; // Date in format m/d/yyyy like 6/17/2013
    planned_completion_date_dt: Date | null;
    finish_dt: Date | null;
    start_date_dt: Date | null;
    minEST: number;
    minESDate: Date | null;
}
