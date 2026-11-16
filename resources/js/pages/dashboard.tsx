import { Head } from '@inertiajs/react';
import {
    Bell,
    BriefcaseBusiness,
    CheckCircle2,
    ChevronDown,
    CircleAlert,
    Clock3,
    Home,
    LayoutGrid,
    LogOut,
    Search,
    Ticket,
    UserCog,
    Users,
    Wrench,
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard', active: true, icon: LayoutGrid },
    { label: 'My Tickets', icon: Ticket },
    { label: 'Employees', icon: Users },
    { label: 'Departments', icon: BriefcaseBusiness },
    { label: 'Categories', icon: Wrench },
    { label: 'Technicians', icon: UserCog },
];

const tickets = [
    { id: '#1007', category: 'Account Access', priority: 'High', status: 'Open', createdAt: 'Sep 10, 2026 09:32 AM' },
    { id: '#1006', category: 'Software Bug', priority: 'Medium', status: 'Resolved', createdAt: 'Sep 10, 2026 08:50 AM' },
    { id: '#1005', category: 'Hardware Issue', priority: 'Low', status: 'In Progress', createdAt: 'Sep 9, 2026 04:20 PM' },
];

const priorityStyles: Record<string, string> = {
    High: 'bg-rose-100 text-rose-700',
    Medium: 'bg-amber-100 text-amber-700',
    Low: 'bg-emerald-100 text-emerald-700',
};

const statusStyles: Record<string, string> = {
    Open: 'bg-sky-100 text-sky-700',
    Resolved: 'bg-emerald-100 text-emerald-700',
    'In Progress': 'bg-amber-100 text-amber-700',
};

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex min-h-screen bg-[#ebf3ff] text-slate-800">
                <aside className="flex w-[260px] flex-col bg-[#233b77] px-6 py-7 text-white shadow-[0_0_35px_rgba(35,59,119,0.18)]">
                    <div className="mb-8 flex items-center gap-3 px-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-2xl shadow-inner shadow-white/10">
                            <Bell className="h-6 w-6" />
                        </div>
                        <div className="text-2xl font-bold">IT Helpdesk</div>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map(({ label, active, icon: Icon }) => (
                            <button
                                key={label}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-base font-medium transition ${
                                    active ? 'bg-[#4b78d8] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]' : 'text-slate-200 hover:bg-white/5'
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="mt-auto pt-6">
                        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-base font-medium text-slate-200 transition hover:bg-white/5">
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>

                <main className="flex-1 p-6 md:p-8">
                    <div className="mx-auto max-w-6xl">
                        <header className="mb-6 flex items-center justify-end">
                            <div className="flex items-center gap-3 rounded-full border border-white/60 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dce8ff] text-sm font-bold text-[#23408d]">MS</div>
                                <span className="text-lg font-medium text-slate-800">Maria Santos</span>
                                <ChevronDown className="h-4 w-4 text-slate-500" />
                            </div>
                        </header>

                        <section className="mb-8 rounded-[28px] bg-[#dfeaf7] p-6 shadow-[0_18px_30px_rgba(69,109,173,0.10)]">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h1 className="text-4xl font-bold tracking-tight text-slate-800">Welcome back, Maria!</h1>
                                    <p className="mt-3 text-2xl text-slate-600">Here&apos;s a quick overview of your IT support tickets.</p>
                                </div>

                                <div className="relative flex h-36 w-full items-center justify-center lg:w-[270px]">
                                    <div className="absolute left-6 top-5 h-20 w-20 rounded-full bg-[#b7c9ee]/80 blur-2xl" />
                                    <div className="absolute right-0 top-12 h-20 w-20 rounded-full bg-[#dfe9fb] blur-2xl" />
                                    <div className="relative flex h-28 w-40 items-center justify-center rounded-[24px] border-[8px] border-[#3b5ea7] bg-[#cfe0ff] shadow-[0_16px_30px_rgba(59,94,167,0.18)]">
                                        <div className="absolute left-4 top-2 h-3 w-3 rounded-full bg-white/70" />
                                        <div className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-[#3b5ea7]/60" />
                                        <div className="absolute bottom-3 left-1/2 h-2 w-16 -translate-x-1/2 rounded-full bg-[#4b6fb7]" />
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f7f9ff] text-[#2d4d8f] shadow-inner">
                                            <Wrench className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-[22px] border border-[#dfe9fd] bg-[#f4f7ff] p-5 shadow-sm">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="rounded-xl bg-[#dfe8ff] p-3 text-[#2f4d93]">
                                        <Ticket className="h-7 w-7" />
                                    </div>
                                    <span className="text-5xl font-semibold text-slate-800">12</span>
                                </div>
                                <div className="text-xl font-medium text-slate-600">Total Tickets</div>
                            </div>

                            <div className="rounded-[22px] border border-[#dfe9fd] bg-[#f4f7ff] p-5 shadow-sm">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="rounded-xl bg-[#dfe8ff] p-3 text-[#2f4d93]">
                                        <Clock3 className="h-7 w-7" />
                                    </div>
                                    <span className="text-5xl font-semibold text-slate-800">5</span>
                                </div>
                                <div className="text-xl font-medium text-slate-600">Open</div>
                            </div>

                            <div className="rounded-[22px] border border-[#dfe9fd] bg-[#f4f7ff] p-5 shadow-sm">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="rounded-xl bg-[#dff5e9] p-3 text-[#1d7d58]">
                                        <CheckCircle2 className="h-7 w-7" />
                                    </div>
                                    <span className="text-5xl font-semibold text-slate-800">6</span>
                                </div>
                                <div className="text-xl font-medium text-slate-600">Resolved</div>
                            </div>

                            <div className="rounded-[22px] border border-[#dfe9fd] bg-[#f4f7ff] p-5 shadow-sm">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="rounded-xl bg-[#ffe2df] p-3 text-[#c64242]">
                                        <CircleAlert className="h-7 w-7" />
                                    </div>
                                    <span className="text-5xl font-semibold text-slate-800">1</span>
                                </div>
                                <div className="text-xl font-medium text-slate-600">High Priority</div>
                            </div>
                        </section>

                        <section className="rounded-[26px] border border-[#dbe4f4] bg-white/80 p-5 shadow-[0_14px_28px_rgba(80,109,160,0.08)] backdrop-blur-sm">
                            <div className="mb-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-[#eef4ff] p-2 text-[#2d4d8f]">
                                        <Ticket className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-800">Recent Tickets</h2>
                                </div>
                                <button className="text-lg font-medium text-[#2a4d92]">View All →</button>
                            </div>

                            <div className="overflow-hidden rounded-xl border border-[#dfe8f5]">
                                <table className="min-w-full divide-y divide-[#dfe8f5] bg-white">
                                    <thead className="bg-[#f5f8ff] text-left text-lg font-semibold text-slate-700">
                                        <tr>
                                            <th className="px-4 py-4">#</th>
                                            <th className="px-4 py-4">Issue Category</th>
                                            <th className="px-4 py-4">Priority</th>
                                            <th className="px-4 py-4">Status</th>
                                            <th className="px-4 py-4">Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#edf2fb] text-base text-slate-700">
                                        {tickets.map((ticket) => (
                                            <tr key={ticket.id} className="bg-white hover:bg-[#f9fbff]">
                                                <td className="px-4 py-4 font-medium">{ticket.id}</td>
                                                <td className="px-4 py-4">{ticket.category}</td>
                                                <td className="px-4 py-4">
                                                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${priorityStyles[ticket.priority]}`}>
                                                        {ticket.priority}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[ticket.status]}`}>
                                                        {ticket.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">{ticket.createdAt}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </>
    );
}
