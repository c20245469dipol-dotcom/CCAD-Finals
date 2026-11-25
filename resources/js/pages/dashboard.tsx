import type { SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    Bell,
    BriefcaseBusiness,
    CheckCircle2,
    ChevronDown,
    CircleAlert,
    Clock3,
    LayoutGrid,
    Plus,
    Ticket,
    UserCog,
    Users,
    Wrench,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { label: 'Dashboard', active: true, icon: LayoutGrid },
    { label: 'My Tickets', icon: Ticket },
    { label: 'Employees', icon: Users },
    { label: 'Departments', icon: BriefcaseBusiness },
    { label: 'Categories', icon: Wrench },
    { label: 'Technicians', icon: UserCog },
];

type TicketFilter = 'All' | 'Open' | 'Resolved' | 'High Priority';
type DashboardTicket = {
    id: number;
    employeeId?: number;
    categoryId?: number;
    technicianId?: number | null;
    category: string;
    employee?: string;
    technician?: string | null;
    description?: string;
    resolutionNotes?: string | null;
    priority: string;
    status: string;
    createdAt: string | null;
};
type TicketFormData = {
    employee_id: string;
    technician_id: string;
    category_id: string;
    priority_level: string;
    ticket_description: string;
    ticket_status: string;
};
type UpdateTicketFormData = {
    technician_id: string;
    priority_level: string;
    ticket_status: string;
    resolution_notes: string;
};
type DashboardPageProps = SharedData & {
    ticketStats: {
        total: number;
        open: number;
        resolved: number;
        highPriority: number;
    };
    recentTickets: DashboardTicket[];
    allTickets: DashboardTicket[];
    employees: { id: number; name: string; department: string | null }[];
    categories: { id: number; name: string }[];
    technicians: { id: number; name: string }[];
};

const priorityStyles: Record<string, string> = {
    High: 'bg-rose-100 text-rose-700',
    Medium: 'bg-amber-100 text-amber-700',
    Low: 'bg-emerald-100 text-emerald-700',
};

const statusStyles: Record<string, string> = {
    Open: 'bg-sky-100 text-sky-700',
    Resolved: 'bg-emerald-100 text-emerald-700',
    'In Progress': 'bg-amber-100 text-amber-700',
    Closed: 'bg-slate-100 text-slate-700',
};

export default function Dashboard() {
    const { auth, ticketStats, recentTickets, allTickets, employees, categories, technicians } = usePage<DashboardPageProps>().props;
    const user = auth.user;
    const initials = user.name
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    const [activePage, setActivePage] = useState<(typeof navItems)[number]['label']>('Dashboard');
    const [ticketFilter, setTicketFilter] = useState<TicketFilter>('All');
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [addTicketOpen, setAddTicketOpen] = useState(false);
    const ticketForm = useForm<TicketFormData>({
        employee_id: '',
        technician_id: '',
        category_id: '',
        priority_level: 'Medium',
        ticket_description: '',
        ticket_status: 'Open',
    });
    const updateForm = useForm<UpdateTicketFormData>({
        technician_id: '',
        priority_level: 'Medium',
        ticket_status: 'Open',
        resolution_notes: '',
    });
    const visibleTickets = allTickets.filter((ticket) => {
        if (ticketFilter === 'Open') return ticket.status === 'Open';
        if (ticketFilter === 'Resolved') return ticket.status === 'Resolved';
        if (ticketFilter === 'High Priority') return ticket.priority === 'High';
        return true;
    });
    const selectedTicket = allTickets.find((ticket) => ticket.id === selectedTicketId);
    const openTicket = (ticket: DashboardTicket) => {
        updateForm.setData({
            technician_id: ticket.technicianId?.toString() ?? '',
            priority_level: ticket.priority,
            ticket_status: ticket.status,
            resolution_notes: ticket.resolutionNotes ?? '',
        });
        setSelectedTicketId(ticket.id);
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex min-h-screen bg-[#ebf3ff] text-slate-800">
                <aside className="flex w-[260px] flex-col bg-[#233b77] px-6 py-7 text-white shadow-[0_0_35px_rgba(35,59,119,0.18)]">
                    <button type="button" onClick={() => setActivePage('Dashboard')} className="mb-8 flex items-center gap-3 px-2 text-left">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-2xl shadow-inner shadow-white/10">
                            <Bell className="h-6 w-6" />
                        </div>
                        <div className="text-2xl font-bold">IT Helpdesk</div>
                    </button>

                    <nav className="space-y-2">
                        {navItems.map(({ label, icon: Icon }) => (
                            <button
                                key={label}
                                type="button"
                                onClick={() => {
                                    setActivePage(label);
                                    setSelectedTicketId(null);
                                }}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-base font-medium transition ${
                                    activePage === label
                                        ? 'bg-[#4b78d8] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
                                        : 'text-slate-200 hover:bg-white/5'
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{label}</span>
                            </button>
                        ))}
                    </nav>

                </aside>

                <main className="flex-1 p-6 md:p-8">
                    <div className="mx-auto max-w-6xl">
                        <header className="mb-6 flex items-center justify-end">
                            <div className="relative">
                                <button
                                    type="button"
                                    aria-expanded={profileMenuOpen}
                                    onClick={() => setProfileMenuOpen((open) => !open)}
                                    className="flex items-center gap-3 rounded-full border border-white/60 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm hover:bg-white"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dce8ff] text-sm font-bold text-[#23408d]">
                                        {initials}
                                    </div>
                                    <span className="text-lg font-medium text-slate-800">{user.name}</span>
                                    <ChevronDown className="h-4 w-4 text-slate-500" />
                                </button>
                                {profileMenuOpen && (
                                    <div className="absolute right-0 z-10 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                                        <Link
                                            href="/settings/profile"
                                            className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                        >
                                            Profile settings
                                        </Link>
                                        <Link
                                            href="/settings/appearance"
                                            className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                        >
                                            Appearance
                                        </Link>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                        >
                                            Logout
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </header>

                        {activePage === 'Dashboard' ? (
                            <>
                                <section className="mb-8 rounded-[28px] bg-[#dfeaf7] p-6 shadow-[0_18px_30px_rgba(69,109,173,0.10)]">
                                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                        <div>
                                            <h1 className="text-4xl font-bold tracking-tight text-slate-800">
                                                Welcome back, {user.name.split(/\s+/)[0]}!
                                            </h1>
                                            <p className="mt-3 text-2xl text-slate-600">Here&apos;s a quick overview of your IT support tickets.</p>
                                        </div>

                                        <div className="relative flex h-36 w-full items-center justify-center lg:w-[270px]">
                                            <div className="absolute top-5 left-6 h-20 w-20 rounded-full bg-[#b7c9ee]/80 blur-2xl" />
                                            <div className="absolute top-12 right-0 h-20 w-20 rounded-full bg-[#dfe9fb] blur-2xl" />
                                            <div className="relative flex h-28 w-40 items-center justify-center rounded-[24px] border-[8px] border-[#3b5ea7] bg-[#cfe0ff] shadow-[0_16px_30px_rgba(59,94,167,0.18)]">
                                                <div className="absolute top-2 left-4 h-3 w-3 rounded-full bg-white/70" />
                                                <div className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-[#3b5ea7]/60" />
                                                <div className="absolute bottom-3 left-1/2 h-2 w-16 -translate-x-1/2 rounded-full bg-[#4b6fb7]" />
                                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f7f9ff] text-[#2d4d8f] shadow-inner">
                                                    <Wrench className="h-5 w-5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActivePage('My Tickets');
                                            setTicketFilter('All');
                                        }}
                                        className="rounded-[22px] border border-[#dfe9fd] bg-[#f4f7ff] p-5 text-left shadow-sm transition hover:bg-[#eaf0ff] hover:shadow-md"
                                    >
                                        <div className="mb-4 flex items-center gap-3">
                                            <div className="rounded-xl bg-[#dfe8ff] p-3 text-[#2f4d93]">
                                                <Ticket className="h-7 w-7" />
                                            </div>
                                            <span className="text-5xl font-semibold text-slate-800">{ticketStats.total}</span>
                                        </div>
                                        <div className="text-xl font-medium text-slate-600">Total Tickets</div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActivePage('My Tickets');
                                            setTicketFilter('Open');
                                        }}
                                        className="rounded-[22px] border border-[#dfe9fd] bg-[#f4f7ff] p-5 text-left shadow-sm transition hover:bg-[#eaf0ff] hover:shadow-md"
                                    >
                                        <div className="mb-4 flex items-center gap-3">
                                            <div className="rounded-xl bg-[#dfe8ff] p-3 text-[#2f4d93]">
                                                <Clock3 className="h-7 w-7" />
                                            </div>
                                            <span className="text-5xl font-semibold text-slate-800">{ticketStats.open}</span>
                                        </div>
                                        <div className="text-xl font-medium text-slate-600">Open</div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActivePage('My Tickets');
                                            setTicketFilter('Resolved');
                                        }}
                                        className="rounded-[22px] border border-[#dfe9fd] bg-[#f4f7ff] p-5 text-left shadow-sm transition hover:bg-[#eaf0ff] hover:shadow-md"
                                    >
                                        <div className="mb-4 flex items-center gap-3">
                                            <div className="rounded-xl bg-[#dff5e9] p-3 text-[#1d7d58]">
                                                <CheckCircle2 className="h-7 w-7" />
                                            </div>
                                            <span className="text-5xl font-semibold text-slate-800">{ticketStats.resolved}</span>
                                        </div>
                                        <div className="text-xl font-medium text-slate-600">Resolved</div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActivePage('My Tickets');
                                            setTicketFilter('High Priority');
                                        }}
                                        className="rounded-[22px] border border-[#dfe9fd] bg-[#f4f7ff] p-5 text-left shadow-sm transition hover:bg-[#eaf0ff] hover:shadow-md"
                                    >
                                        <div className="mb-4 flex items-center gap-3">
                                            <div className="rounded-xl bg-[#ffe2df] p-3 text-[#c64242]">
                                                <CircleAlert className="h-7 w-7" />
                                            </div>
                                            <span className="text-5xl font-semibold text-slate-800">{ticketStats.highPriority}</span>
                                        </div>
                                        <div className="text-xl font-medium text-slate-600">High Priority</div>
                                    </button>
                                </section>

                                <section className="rounded-[26px] border border-[#dbe4f4] bg-white/80 p-5 shadow-[0_14px_28px_rgba(80,109,160,0.08)] backdrop-blur-sm">
                                    <div className="mb-5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-lg bg-[#eef4ff] p-2 text-[#2d4d8f]">
                                                <Ticket className="h-5 w-5" />
                                            </div>
                                            <h2 className="text-3xl font-bold text-slate-800">Recent Tickets</h2>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setActivePage('My Tickets');
                                                setTicketFilter('All');
                                            }}
                                            className="text-lg font-medium text-[#2a4d92] hover:underline"
                                        >
                                            View All →
                                        </button>
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
                                                {recentTickets.map((ticket) => (
                                                    <tr
                                                        key={ticket.id}
                                                        role="button"
                                                        tabIndex={0}
                                                        onClick={() => {
                                                            setActivePage('My Tickets');
                                                            openTicket(ticket);
                                                        }}
                                                        onKeyDown={(event) => {
                                                            if (event.key === 'Enter' || event.key === ' ') {
                                                                event.preventDefault();
                                                                setActivePage('My Tickets');
                                                                openTicket(ticket);
                                                            }
                                                        }}
                                                        className="cursor-pointer bg-white hover:bg-[#f9fbff]"
                                                    >
                                                        <td className="px-4 py-4 font-medium">{ticket.id}</td>
                                                        <td className="px-4 py-4">{ticket.category}</td>
                                                        <td className="px-4 py-4">
                                                            <span
                                                                className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${priorityStyles[ticket.priority]}`}
                                                            >
                                                                {ticket.priority}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <span
                                                                className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[ticket.status]}`}
                                                            >
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
                            </>
                        ) : (
                            <section className="rounded-[26px] border border-[#dbe4f4] bg-white/80 p-6 shadow-[0_14px_28px_rgba(80,109,160,0.08)]">
                                {selectedTicket ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedTicketId(null)}
                                            className="mb-5 text-sm font-medium text-[#2a4d92] hover:underline"
                                        >
                                            ← Back to {activePage}
                                        </button>
                                        <h1 className="text-3xl font-bold text-slate-800">Ticket {selectedTicket.id}</h1>
                                        <p className="mt-3 text-slate-600">{selectedTicket.category}</p>
                                        <div className="mt-4 flex gap-2">
                                            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[selectedTicket.status]}`}>
                                                {selectedTicket.status}
                                            </span>
                                            <span
                                                className={`rounded-full px-3 py-1 text-sm font-semibold ${priorityStyles[selectedTicket.priority]}`}
                                            >
                                                {selectedTicket.priority} Priority
                                            </span>
                                        </div>
                                        <p className="mt-4 text-sm text-slate-500">Created {selectedTicket.createdAt}</p>
                                        <p className="mt-6 whitespace-pre-wrap text-slate-700">{selectedTicket.description}</p>
                                        <dl className="mt-6 grid gap-3 border-t border-slate-200 pt-5 text-sm sm:grid-cols-2">
                                            <div>
                                                <dt className="font-medium text-slate-500">Employee</dt>
                                                <dd className="mt-1 text-slate-800">{selectedTicket.employee}</dd>
                                            </div>
                                            <div>
                                                <dt className="font-medium text-slate-500">Assigned technician</dt>
                                                <dd className="mt-1 text-slate-800">{selectedTicket.technician ?? 'Unassigned'}</dd>
                                            </div>
                                        </dl>
                                        {selectedTicket.resolutionNotes && (
                                            <div className="mt-5 rounded-xl bg-[#f4f7ff] p-4">
                                                <h2 className="text-sm font-semibold text-slate-600">Resolution notes</h2>
                                                <p className="mt-1 whitespace-pre-wrap text-slate-800">{selectedTicket.resolutionNotes}</p>
                                            </div>
                                        )}
                                        {selectedTicket.status === 'Closed' ? (
                                            <p className="mt-6 rounded-xl bg-slate-100 p-4 text-sm text-slate-600">
                                                This ticket is closed and can no longer be edited.
                                            </p>
                                        ) : (
                                            <form
                                                onSubmit={(event) => {
                                                    event.preventDefault();
                                                    updateForm.patch(`/support-tickets/${selectedTicket.id}`, {
                                                        preserveScroll: true,
                                                    });
                                                }}
                                                className="mt-6 space-y-4 border-t border-slate-200 pt-5"
                                            >
                                                <h2 className="text-lg font-semibold text-slate-800">Update ticket</h2>
                                                <div className="grid gap-4 sm:grid-cols-3">
                                                    <label className="block text-sm font-medium text-slate-700">
                                                        Status
                                                        <select
                                                            value={updateForm.data.ticket_status}
                                                            onChange={(event) => updateForm.setData('ticket_status', event.target.value)}
                                                            className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal"
                                                        >
                                                            <option>Open</option>
                                                            <option>In Progress</option>
                                                            <option>Resolved</option>
                                                            <option>Closed</option>
                                                        </select>
                                                        {updateForm.errors.ticket_status && <span className="mt-1 block text-xs text-red-600">{updateForm.errors.ticket_status}</span>}
                                                    </label>
                                                    <label className="block text-sm font-medium text-slate-700">
                                                        Priority
                                                        <select
                                                            value={updateForm.data.priority_level}
                                                            onChange={(event) => updateForm.setData('priority_level', event.target.value)}
                                                            className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal"
                                                        >
                                                            <option>Low</option>
                                                            <option>Medium</option>
                                                            <option>High</option>
                                                        </select>
                                                        {updateForm.errors.priority_level && <span className="mt-1 block text-xs text-red-600">{updateForm.errors.priority_level}</span>}
                                                    </label>
                                                    <label className="block text-sm font-medium text-slate-700">
                                                        Assigned technician
                                                        <select
                                                            value={updateForm.data.technician_id}
                                                            onChange={(event) => updateForm.setData('technician_id', event.target.value)}
                                                            className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal"
                                                        >
                                                            <option value="">Unassigned</option>
                                                            {technicians.map((technician) => <option key={technician.id} value={technician.id}>{technician.name}</option>)}
                                                        </select>
                                                        {updateForm.errors.technician_id && <span className="mt-1 block text-xs text-red-600">{updateForm.errors.technician_id}</span>}
                                                    </label>
                                                </div>
                                                <label className="block text-sm font-medium text-slate-700">
                                                    Resolution notes
                                                    <textarea
                                                        value={updateForm.data.resolution_notes}
                                                        onChange={(event) => updateForm.setData('resolution_notes', event.target.value)}
                                                        rows={3}
                                                        className="mt-1.5 block w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 font-normal"
                                                    />
                                                    {updateForm.errors.resolution_notes && <span className="mt-1 block text-xs text-red-600">{updateForm.errors.resolution_notes}</span>}
                                                </label>
                                                <button
                                                    type="submit"
                                                    disabled={updateForm.processing}
                                                    className="rounded-xl bg-[#3158a5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#27498d] disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {updateForm.processing ? 'Saving…' : 'Save Changes'}
                                                </button>
                                            </form>
                                        )}
                                    </>
                                ) : activePage === 'My Tickets' ? (
                                    <>
                                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <h1 className="text-3xl font-bold text-slate-800">My Tickets</h1>
                                                <p className="mt-1 text-slate-500">Showing {ticketFilter.toLowerCase()} tickets</p>
                                            </div>
                                            {ticketFilter !== 'All' && (
                                                <button
                                                    type="button"
                                                    onClick={() => setTicketFilter('All')}
                                                    className="text-sm font-medium text-[#2a4d92] hover:underline"
                                                >
                                                    Clear filter
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => setAddTicketOpen(true)}
                                                className="inline-flex items-center gap-2 rounded-xl bg-[#3158a5] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#27498d]"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Add Ticket
                                            </button>
                                        </div>
                                        <div className="divide-y divide-[#edf2fb]">
                                            {visibleTickets.map((ticket) => (
                                                <button
                                                    key={ticket.id}
                                                    type="button"
                                                    onClick={() => openTicket(ticket)}
                                                    className="flex w-full items-center justify-between gap-4 px-2 py-4 text-left hover:bg-[#f3f7ff]"
                                                >
                                                    <span>
                                                        <span className="block font-semibold text-slate-800">
                                                            {ticket.id} · {ticket.category}
                                                        </span>
                                                        <span className="mt-1 block text-sm text-slate-500">{ticket.createdAt}</span>
                                                    </span>
                                                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[ticket.status]}`}>
                                                        {ticket.status}
                                                    </span>
                                                </button>
                                            ))}
                                            {visibleTickets.length === 0 && (
                                                <p className="py-8 text-center text-slate-500">No tickets match this filter.</p>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h1 className="text-3xl font-bold text-slate-800">{activePage}</h1>
                                        <div className="mt-6 rounded-xl bg-[#f4f7ff] p-8 text-center">
                                            <p className="font-medium text-slate-700">No {activePage.toLowerCase()} records to display.</p>
                                        </div>
                                    </>
                                )}
                            </section>
                        )}
                    </div>
                </main>
            </div>
            {addTicketOpen && (
                <div className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4">
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="add-ticket-title"
                        className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <h2 id="add-ticket-title" className="text-2xl font-bold text-slate-800">Create support ticket</h2>
                                <p className="mt-1 text-sm text-slate-500">Describe the issue and choose who reported it.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setAddTicketOpen(false)}
                                className="rounded-lg px-3 py-1 text-2xl leading-none text-slate-500 hover:bg-slate-100"
                                aria-label="Close form"
                            >
                                ×
                            </button>
                        </div>
                        {employees.length === 0 || categories.length === 0 ? (
                            <p role="alert" className="mb-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                                Add at least one employee and one issue category before creating a ticket.
                            </p>
                        ) : null}
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                ticketForm.post('/support-tickets', {
                                    preserveScroll: true,
                                    onSuccess: () => {
                                        ticketForm.reset();
                                        setAddTicketOpen(false);
                                    },
                                });
                            }}
                            className="space-y-4"
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block text-sm font-medium text-slate-700">
                                    Employee
                                    <select
                                        value={ticketForm.data.employee_id}
                                        onChange={(event) => ticketForm.setData('employee_id', event.target.value)}
                                        className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal"
                                        required
                                    >
                                        <option value="">Select employee</option>
                                        {employees.map((employee) => (
                                            <option key={employee.id} value={employee.id}>
                                                {employee.name}{employee.department ? ` · ${employee.department}` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    {ticketForm.errors.employee_id && <span className="mt-1 block text-xs text-red-600">{ticketForm.errors.employee_id}</span>}
                                </label>
                                <label className="block text-sm font-medium text-slate-700">
                                    Issue category
                                    <select
                                        value={ticketForm.data.category_id}
                                        onChange={(event) => ticketForm.setData('category_id', event.target.value)}
                                        className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal"
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                                    </select>
                                    {ticketForm.errors.category_id && <span className="mt-1 block text-xs text-red-600">{ticketForm.errors.category_id}</span>}
                                </label>
                                <label className="block text-sm font-medium text-slate-700">
                                    Priority
                                    <select
                                        value={ticketForm.data.priority_level}
                                        onChange={(event) => ticketForm.setData('priority_level', event.target.value)}
                                        className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal"
                                        required
                                    >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                    </select>
                                </label>
                                <label className="block text-sm font-medium text-slate-700">
                                    Assign technician <span className="font-normal text-slate-400">(optional)</span>
                                    <select
                                        value={ticketForm.data.technician_id}
                                        onChange={(event) => ticketForm.setData('technician_id', event.target.value)}
                                        className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal"
                                    >
                                        <option value="">Unassigned</option>
                                        {technicians.map((technician) => <option key={technician.id} value={technician.id}>{technician.name}</option>)}
                                    </select>
                                </label>
                            </div>
                            <label className="block text-sm font-medium text-slate-700">
                                Ticket description
                                <textarea
                                    value={ticketForm.data.ticket_description}
                                    onChange={(event) => ticketForm.setData('ticket_description', event.target.value)}
                                    rows={4}
                                    className="mt-1.5 block w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 font-normal"
                                    required
                                />
                                {ticketForm.errors.ticket_description && <span className="mt-1 block text-xs text-red-600">{ticketForm.errors.ticket_description}</span>}
                            </label>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setAddTicketOpen(false)}
                                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={ticketForm.processing || employees.length === 0 || categories.length === 0}
                                    className="rounded-xl bg-[#3158a5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#27498d] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {ticketForm.processing ? 'Creating…' : 'Create Ticket'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </>
    );
}
